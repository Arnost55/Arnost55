#!/usr/bin/env python3
"""
Generate animated GitHub profile banner SVG.
Produces dark.svg and light.svg with dithered portrait, info panel, and
morphing logo animation.
"""

import random
import re
from pathlib import Path

import cairosvg
import io as pyio
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

# ── Configuration ──────────────────────────────────────────────────────────

CANVAS_W = 1180
CANVAS_H = 610

PORTRAIT_W = 300   # grid width (dots)
PORTRAIT_H = 340   # grid height (dots)

PANEL_X = int(CANVAS_W * 0.40)  # 472
PANEL_W = CANVAS_W - PANEL_X - 40

PALETTE = {
    "portrait_dark": "#A78BFA",
    "portrait_light": "#7C3AED",
    "ui_chrome_dark": "#22D3EE",
    "ui_chrome_light": "#0891B2",
    "accent": "#10B981",
    "bg": "#0A101F",
}

# ── Phase timing (fractions of loop) ──────────────────────────────────────
# One full loop = 14.2s
# Portrait: 0 to 0.211 (3.0s)
# Transition to Flutter: 0.211 to 0.303 (1.3s)
# Flutter: 0.303 to 0.444 (2.0s)
# Transition to Python: 0.444 to 0.535 (1.3s)
# Python: 0.535 to 0.676 (2.0s)
# Transition to Next.js: 0.676 to 0.768 (1.3s)
# Next.js: 0.768 to 0.908 (2.0s)
# Transition back: 0.908 to 1.0 (1.3s)

LOOP_DURATION = 14.2
KT = {
    "portrait_end": 0.211,
    "flutter_start": 0.303,
    "flutter_end": 0.444,
    "python_start": 0.535,
    "python_end": 0.676,
    "nextjs_start": 0.768,
    "nextjs_end": 0.908,
    "loop_end": 1.0,
}

# ── Floyd-Steinberg dithering (serpentine) ─────────────────────────────────

def floyd_steinberg(gray: np.ndarray, threshold=128):
    h, w = gray.shape
    out = np.zeros((h, w), dtype=bool)
    err = np.zeros((h + 2, w + 2), dtype=np.float64)
    for y in range(h):
        cols = range(w) if y % 2 == 0 else range(w - 1, -1, -1)
        for x in cols:
            old = gray[y, x] + err[y + 1, x + 1]
            out[y, x] = old > threshold
            quant_err = old - (255.0 if out[y, x] else 0.0)
            if y % 2 == 0:
                err[y + 1, x + 2] += quant_err * 7 / 16
                err[y + 2, x + 1] += quant_err * 5 / 16
                err[y + 2, x]     += quant_err * 3 / 16
                err[y + 2, x + 2] += quant_err * 1 / 16
            else:
                err[y + 1, x]     += quant_err * 7 / 16
                err[y + 2, x + 1] += quant_err * 5 / 16
                err[y + 2, x]     += quant_err * 3 / 16
                err[y + 2, x - 1] += quant_err * 1 / 16
    return out


# ── Image processing ───────────────────────────────────────────────────────

def process_photo(photo_path: str):
    img = Image.open(photo_path).convert("RGB")
    w, h = img.size
    cx, cy = 0.5, 0.09
    crop_aspect = PORTRAIT_W / PORTRAIT_H
    crop_h = int(h * 0.22)
    crop_w = int(crop_h * crop_aspect)
    left = max(0, int(w * cx) - crop_w // 2)
    top = max(0, int(h * cy) - int(crop_h * 0.25))
    right = min(w, left + crop_w)
    bottom = min(h, top + crop_h)
    if right - left < crop_w:
        left = max(0, right - crop_w)
    if bottom - top < crop_h:
        top = max(0, bottom - crop_h)
    cropped = img.crop((left, top, right, bottom))
    cropped = cropped.resize((PORTRAIT_W, PORTRAIT_H), Image.LANCZOS)
    gray = cropped.convert("L")
    gray_arr = np.array(gray, dtype=np.float64)
    low, high = np.percentile(gray_arr, [1, 99])
    gray_arr = np.clip((gray_arr - low) / (high - low) * 255, 0, 255)
    blur = np.array(gray.filter(ImageFilter.GaussianBlur(radius=3)), dtype=np.float64)
    gray_arr = gray_arr + 1.4 * (gray_arr - blur)
    gray_arr = np.clip(gray_arr, 0, 255)
    gray_arr = np.clip(128 + (gray_arr - 128) * 1.3, 0, 255)
    gray_final = gray_arr.astype(np.uint8)
    dots = floyd_steinberg(gray_final.astype(np.float64))
    dots_light = floyd_steinberg((255 - gray_final).astype(np.float64))
    return dots, dots_light, gray_final


def segment_background(gray_img: np.ndarray) -> np.ndarray:
    bg_threshold = np.percentile(gray_img, 40)
    mask = gray_img < bg_threshold
    mask = ndimage.binary_closing(mask, structure=np.ones((5, 5)), iterations=2)
    mask = ndimage.binary_fill_holes(mask)
    labeled, n = ndimage.label(mask)
    if n > 0:
        sizes = ndimage.sum(mask, labeled, range(1, n + 1))
        mask = labeled == (np.argmax(sizes) + 1)
    return mask


# ── Logo SVG path loading ──────────────────────────────────────────────────

def load_logo_paths():
    logos = []
    logo_dir = Path(__file__).parent / "logos"
    for path_d in ["flutter.svg", "python.svg", "nextjs.svg"]:
        svg = (logo_dir / path_d).read_text()
        m = re.search(r'<path\s+d="([^"]+)"', svg)
        if m:
            logos.append((path_d.replace(".svg", ""), m.group(1)))
    return logos


def logo_to_point_cloud(path_d: str, num_points: int,
                         viewbox_size=24, scale=1.0):
    render_size = 200
    svg_xml = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {viewbox_size} {viewbox_size}" '
        f'width="{render_size}" height="{render_size}">'
        f'<path d="{path_d}" fill="#fff" stroke="#fff" stroke-width="0.5"/>'
        f'</svg>'
    )
    png_bytes = cairosvg.svg2png(bytestring=svg_xml.encode(),
                                 output_width=render_size,
                                 output_height=render_size)
    img = Image.open(pyio.BytesIO(png_bytes)).convert("L")
    arr = np.array(img)
    ys, xs = np.where(arr > 128)
    if len(xs) == 0:
        xs = np.random.randint(5, render_size - 5, num_points)
        ys = np.random.randint(5, render_size - 5, num_points)
    if len(xs) < num_points:
        idx = np.random.choice(len(xs), num_points, replace=True)
    else:
        idx = np.random.choice(len(xs), num_points, replace=False)
    points = np.column_stack([xs[idx], ys[idx]]).astype(np.float64)
    points = points / render_size * scale
    points -= points.mean(axis=0)
    return points


def optimal_transport(src_pts, dst_pts):
    from scipy.spatial import KDTree
    tree = KDTree(dst_pts)
    _, indices = tree.query(src_pts)
    return dst_pts[indices]


# ── Info panel data ────────────────────────────────────────────────────────

def build_info_data():
    return [
        ("Subject",     "Arnost Dobrucky"),
        ("Role",        "Full-Stack Developer"),
        ("Origin",      "Kajal, Slovakia"),
        ("Education",   "Self-Taught"),
        ("Status",      "Building + Learning + Shipping"),
        ("ToolChain",   "VS Code / Git / Android Studio / Figma / Blender / Docker"),
        ("Core.Lang",   "Python / JS / TS / Java / Kotlin / PHP"),
        ("Core.Frontend","Next.js / React Native / Flutter / WebGL"),
        ("Core.Backend", "Express.js / Flask / NodeJS / Filament"),
        ("Core.Database","MariaDB / MySQL / Postgres / SQLite / Firebase"),
        ("Core.Infra",  "Docker / K8s / Nginx / Azure / GCP"),
        ("Grid.Mail",   "arnika55@kernelkicks.dev"),
        ("Grid.Portfolio","coming soon"),
        ("Grid.LinkedIn","linkedin.com/in/arnost-dobrucky"),
        ("Grid.GitHub",  "github.com/Arnost55"),
        ("Grid.Facebook","—"),
    ]


# ── SVG generation ─────────────────────────────────────────────────────────

def escape_xml(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def make_dot_runs_animate(dots: np.ndarray, color="#A78BFA", dot_size=2.2):
    """Create dot paths with CSS-based animation for the portrait and travellers.
    Uses CSS @keyframes for smooth 60fps animation."""
    h, w = dots.shape
    dot_coords = [(x, y) for y in range(h) for x in range(w) if dots[y, x]]
    total_coords = len(dot_coords)
    positions = np.array([(x, y) for x, y in dot_coords], dtype=np.float64)

    # ── CSS keyframes for the animation ──
    # We define CSS @keyframes that the elements reference
    css_parts = []
    svg_parts = []
    
    # ── Intro fade-in ──
    # 60 groups scattered across the portrait, each with a stagger
    indices = list(range(total_coords))
    random.seed(42)
    random.shuffle(indices)
    n_groups = 60
    group_size = total_coords // n_groups
    groups = [indices[i:i+group_size] for i in range(0, total_coords, group_size)]
    
    # CSS for intro - each group has its own animation
    css_parts.append("/* Intro fade-in animation */")
    for gi in range(min(n_groups, 60)):
        stagger = random.randint(0, 1800)  # stagger over 1.8s
        dur = random.randint(200, 400)
        css_parts.append(
            f"@keyframes introIn{gi} {{"
            f"  0% {{ opacity: 0; }}"
            f"  100% {{ opacity: 1; }}"
            f"}}"
            f".intro-g{gi} {{"
            f"  animation: introIn{gi} {dur}ms {stagger}ms forwards;"
            f"  opacity: 0;"
            f"}}"
        )
    
    # Render intro groups
    for gi, group_idxs in enumerate(groups):
        if not group_idxs or gi >= 60:
            continue
        g = []
        for idx in group_idxs:
            x, y = dot_coords[idx]
            g.append(f"M{x},{y}h1")
        path_d = "".join(g)
        svg_parts.append(
            f'<path d="{escape_xml(path_d)}" class="intro-g{gi}" '
            f'stroke="{color}" stroke-width="{dot_size}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges"/>'
        )
    
    # ── Portrait drift bands ──
    # CSS keyframe for drift: subtle translate during portrait phase, return
    n_bands = 94
    noise_sigma = 4.0
    noisy_positions = positions + np.random.RandomState(42).normal(0, noise_sigma, positions.shape)
    band_assignments = np.clip(
        (noisy_positions[:, 0] / w * 0.5 + noisy_positions[:, 1] / h * 0.5) * n_bands,
        0, n_bands - 1
    ).astype(int)
    bands = {i: [] for i in range(n_bands)}
    for idx in range(total_coords):
        bands[band_assignments[idx]].append(idx)
    
    # Logo centroids
    logo_centroids = [(150, 170), (150, 170), (150, 170)]
    
    # CSS keyframes for drift bands
    # Each band drifts during portrait phase and returns
    for band_idx in range(n_bands):
        band_idxs = bands.get(band_idx, [])
        if not band_idxs:
            continue
        dx = (logo_centroids[0][0] - positions[band_idxs, 0].mean()) * 0.42
        dy = (logo_centroids[0][1] - positions[band_idxs, 1].mean()) * 0.42
        pct_kt = KT["portrait_end"]  # 0.211
        ret_kt = KT["flutter_start"]  # 0.303
        # Drift during portrait, return during transition, hold through logos
        css_parts.append(
            f"@keyframes drift{band_idx} {{"
            f"  0% {{ transform: translate(0px,0px); }}"
            f"  {pct_kt * 47:.1f}% {{ transform: translate({dx:.1f}px,{dy:.1f}px); }}"
            f"  {ret_kt * 100:.1f}% {{ transform: translate(0px,0px); }}"
            f"  100% {{ transform: translate(0px,0px); }}"
            f"}}"
            f".drift-b{band_idx} {{"
            f"  animation: drift{band_idx} {LOOP_DURATION}s ease-in-out infinite;"
            f"}}"
        )
    
    # Render portrait drift bands
    for band_idx in range(n_bands):
        band_idxs = bands.get(band_idx, [])
        if not band_idxs:
            continue
        g = []
        for idx in band_idxs:
            x, y = dot_coords[idx]
            g.append(f"M{x},{y}h1")
        path_d = "".join(g)
        svg_parts.append(
            f'<g class="drift-b{band_idx}">'
            f'<path d="{escape_xml(path_d)}" '
            f'stroke="{color}" stroke-width="{dot_size}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges"/>'
            f'</g>'
        )
    
    # ── Travellers: 900 dots morphing between logos ──
    num_travellers = 900
    logos = load_logo_paths()
    logo_clouds = []
    for name, path_d in logos:
        pts = logo_to_point_cloud(path_d, num_travellers, scale=min(PORTRAIT_W, PORTRAIT_H) * 0.3)
        pts[:, 0] += PORTRAIT_W // 2
        pts[:, 1] += PORTRAIT_H // 2
        logo_clouds.append(pts)
    
    np.random.seed(123)
    traveller_positions = np.column_stack([
        np.random.randint(5, PORTRAIT_W - 5, num_travellers),
        np.random.randint(5, PORTRAIT_H - 5, num_travellers),
    ]).astype(np.float64)
    
    matched_logos = []
    for pts in logo_clouds:
        matched = optimal_transport(traveller_positions, pts)
        matched_logos.append(matched)
    
    # Build phase keyframes for each traveller
    # Each traveller moves through: x0(portrait) → x1(Flutter) → x2(Python) → x3(Next.js) → x0
    # Using CSS @keyframes for position and opacity
    # CSS keyframes can't interpolate cx/cy directly, so we use CSS custom properties
    # through transform: translate()
    
    # Actually, CSS animations on individual circle elements with individual keyframes
    # would be prohibitively large. Instead, we use SMIL for the travellers since
    # there are only 900 of them and the browser handles SMIL smoothly.
    # But we fix the timing to be correct.
    
    # Key times for the full loop (as fractions):
    p_end = KT["portrait_end"]      # 0.211
    f_start = KT["flutter_start"]   # 0.303
    f_end = KT["flutter_end"]       # 0.444
    py_start = KT["python_start"]   # 0.535
    py_end = KT["python_end"]       # 0.676
    n_start = KT["nextjs_start"]    # 0.768
    n_end = KT["nextjs_end"]        # 0.908
    
    for i in range(num_travellers):
        x0, y0 = traveller_positions[i]
        x1, y1 = matched_logos[0][i]
        x2, y2 = matched_logos[1][i]
        x3, y3 = matched_logos[2][i]
        
        # cx animation keyTimes and values:
        # 0 → p_end: x0 (portrait, hidden)
        # p_end → f_start: x0 → x1 (transition to Flutter)
        # f_start → f_end: x1 (Flutter hold)
        # f_end → py_start: x1 → x2 (transition to Python)
        # py_start → py_end: x2 (Python hold)
        # py_end → n_start: x2 → x3 (transition to Next.js)
        # n_start → n_end: x3 (Next.js hold)
        # n_end → 1.0: x3 → x0 (transition back)
        
        cx_keytimes = [0, p_end, f_start, f_end, py_start, py_end, n_start, n_end, 1.0]
        cx_values = [x0, x0, x1, x1, x2, x2, x3, x3, x0]
        cy_values = [y0, y0, y1, y1, y2, y2, y3, y3, y0]
        
        # Opacity: hidden during portrait, visible during logo phases, hidden during transition back
        # 0 → p_end: 0 (hidden)
        # p_end → f_start: 0 → 1 (fade in during transition)
        # f_start → n_end: 1 (visible through all logo phases)
        # n_end → 1.0: 1 → 0 (fade out during transition back)
        op_keytimes = [0, p_end, p_end + 0.001, n_end, n_end + 0.001, 1.0]
        op_values = [0, 0, 1, 1, 0, 0]
        
        # Build keyTimes string
        cx_kt_str = ";".join(f"{t:.3f}" for t in cx_keytimes)
        cx_val_str = ";".join(f"{v:.1f}" for v in cx_values)
        cy_val_str = ";".join(f"{v:.1f}" for v in cy_values)
        op_kt_str = ";".join(f"{t:.3f}" for t in op_keytimes)
        op_val_str = ";".join(f"{v}" for v in op_values)
        
        # Spline for smooth transitions
        # Linear between holds, ease-in-out for transitions
        splines = []
        for j in range(len(cx_keytimes) - 1):
            # Check if this segment is a transition (values change) or a hold
            if cx_values[j] != cx_values[j+1] or cy_values[j] != cy_values[j+1]:
                splines.append("0.4 0 0.6 1")  # ease-in-out
            else:
                splines.append("0 0 1 1")  # linear (hold)
        
        smil = (
            f'<circle cx="{x0:.1f}" cy="{y0:.1f}" r="{dot_size * 0.7}" fill="{color}">'
            f'<animate attributeName="opacity" '
            f'values="{op_val_str}" keyTimes="{op_kt_str}" '
            f'dur="{LOOP_DURATION}s" repeatCount="indefinite"/>'
            f'<animate attributeName="cx" '
            f'values="{cx_val_str}" keyTimes="{cx_kt_str}" '
            f'dur="{LOOP_DURATION}s" repeatCount="indefinite" '
            f'calcMode="spline" '
            f'keySplines="{";".join(splines)}"/>'
            f'<animate attributeName="cy" '
            f'values="{cy_val_str}" keyTimes="{cx_kt_str}" '
            f'dur="{LOOP_DURATION}s" repeatCount="indefinite" '
            f'calcMode="spline" '
            f'keySplines="{";".join(splines)}"/>'
            f'</circle>'
        )
        svg_parts.append(smil)
    
    css_block = "<style>\n" + "\n".join(css_parts) + "\n</style>"
    return css_block + "\n" + "\n".join(svg_parts)


# ── Info panel ─────────────────────────────────────────────────────────────

def build_info_panel(data, is_dark=True):
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    bg = PALETTE["bg"] if is_dark else "#F0F0F0"
    text_color = "#E0E0E0" if is_dark else "#1A1A2E"
    lines = []
    y = 40
    font_size = 14
    header_size = 13
    line_spacing = 23
    lines.append(
        f'<text x="0" y="{y}" font-family="Menlo, Consolas, monospace" '
        f'font-size="{header_size}" fill="{chrome}" font-weight="bold">'
        f'SYSTEM.INFO'
        f'</text>'
    )
    y += line_spacing + 10
    lines.append(
        f'<rect x="0" y="{y - 10}" width="42" height="16" rx="3" fill="none" '
        f'stroke="#FF3B30" stroke-width="1.5"/>'
        f'<text x="21" y="{y + 1}" font-family="Menlo, Consolas, monospace" '
        f'font-size="12" fill="#FF3B30" text-anchor="middle" font-weight="bold">LIVE</text>'
    )
    lines.append(
        f'<circle cx="50" cy="{y - 2}" r="3" fill="#FF3B30">'
        f'  <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite"/>'
        f'</circle>'
    )
    y += line_spacing + 5
    lines.append(
        f'<rect x="0" y="{y - 12}" width="160" height="22" rx="11" fill="{chrome}" opacity="0.2"/>'
        f'<text x="80" y="{y + 3}" font-family="Menlo, Consolas, monospace" '
        f'font-size="14" fill="{chrome}" text-anchor="middle" font-weight="bold">'
        f'Arnost55'
        f'</text>'
    )
    y += line_spacing + 15
    lines.append(
        f'<line x1="0" y1="{y}" x2="{PANEL_W}" y2="{y}" '
        f'stroke="{chrome}" stroke-width="0.5" opacity="0.3"/>'
    )
    y += line_spacing
    for label, value in data:
        label_text = f"  {label}"
        value_text = f" {escape_xml(value)}"
        char_w = 8.0
        label_w = len(label_text) * char_w
        value_w = len(value_text) * char_w
        available = PANEL_W - label_w - value_w - 20
        num_dots = max(0, int(available / (char_w * 1.5)))
        dots = " " + "." * num_dots + " "
        full_line = f'{label_text}{dots}{value_text}'
        lines.append(
            f'<text x="0" y="{y}" font-family="Menlo, Consolas, monospace" '
            f'font-size="{font_size}" fill="{text_color}" '
            f'textLength="{PANEL_W}" lengthAdjust="spacingAndGlyphs">'
            f'{escape_xml(full_line)}'
            f'</text>'
        )
        y += line_spacing
    return "".join(lines)


# ── Terminal border ────────────────────────────────────────────────────────

def build_terminal_border(is_dark=True):
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    bg = PALETTE["bg"] if is_dark else "#F0F0F0"
    bits = []
    bits.append(
        f'<rect x="0" y="0" width="{CANVAS_W}" height="{CANVAS_H}" '
        f'fill="{bg}" rx="12" stroke="{chrome}" stroke-width="2"/>'
    )
    bits.append(
        f'<rect x="0" y="0" width="{CANVAS_W}" height="36" '
        f'fill="{chrome}" opacity="0.1" rx="12"/>'
    )
    for bx, col in [(12, "#FF5F56"), (32, "#FFBD2E"), (52, "#27C93F")]:
        bits.append(f'<circle cx="{bx}" cy="18" r="6" fill="{col}" opacity="0.8"/>')
    bits.append(
        f'<text x="{CANVAS_W // 2}" y="24" font-family="Menlo, Consolas, monospace" '
        f'font-size="13" fill="{chrome}" text-anchor="middle" opacity="0.8">'
        f'profile.sh --live'
        f'</text>'
    )
    return "".join(bits)


def build_portrait_frame(is_dark=True):
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    x = 15
    y = 50
    pw = PORTRAIT_W + 20
    ph = PORTRAIT_H + 40
    bits = []
    bits.append(
        f'<rect x="{x}" y="{y}" width="{pw}" height="{ph}" '
        f'fill="none" stroke="{chrome}" stroke-width="1.5" rx="6"/>'
    )
    bits.append(
        f'<text x="{x + pw // 2}" y="{y + ph - 8}" font-family="Menlo, Consolas, monospace" '
        f'font-size="11" fill="{chrome}" text-anchor="middle" opacity="0.6">'
        f'VISUAL.MAP'
        f'</text>'
    )
    return "".join(bits), x + 10, y + 15


# ── Banner generator ───────────────────────────────────────────────────────

def generate_banner(dots, gray_img=None, is_dark=True):
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    color = PALETTE["portrait_dark"] if is_dark else PALETTE["portrait_light"]
    parts = []
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{CANVAS_W}" height="{CANVAS_H}" '
        f'viewBox="0 0 {CANVAS_W} {CANVAS_H}">\n'
    )
    parts.append(build_terminal_border(is_dark))
    frame_svg, px, py = build_portrait_frame(is_dark)
    parts.append(frame_svg)
    if is_dark and gray_img is not None:
        subject_mask = segment_background(gray_img)
        masked_dots = dots & subject_mask
    else:
        masked_dots = dots
    dot_anim = make_dot_runs_animate(masked_dots if is_dark else dots, color=color)
    # Extract CSS and put it in defs
    css_end = dot_anim.find("</style>")
    if css_end > 0:
        css_block = dot_anim[:css_end + 8]
        svg_content = dot_anim[css_end + 8:]
    else:
        css_block = ""
        svg_content = dot_anim
    parts.append(f"<defs>\n{css_block}\n</defs>\n")
    parts.append(
        f'<g transform="translate({px}, {py})">\n'
        f'  <clipPath id="portrait-clip-{"dark" if is_dark else "light"}">\n'
        f'    <rect x="0" y="0" width="{PORTRAIT_W}" height="{PORTRAIT_H}" rx="4"/>\n'
        f'  </clipPath>\n'
        f'  <g clip-path="url(#portrait-clip-{"dark" if is_dark else "light"})">\n'
        f'{svg_content}'
        f'  </g>\n'
        f'</g>\n'
    )
    info_data = build_info_data()
    info_svg = build_info_panel(info_data, is_dark)
    parts.append(
        f'<g transform="translate({PANEL_X}, 45)">\n{info_svg}\n</g>\n'
    )
    parts.append('</svg>')
    return "".join(parts)


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    print("Processing photo...")
    dots, dots_light, gray_img = process_photo("assets/photo.jpg")
    print(f"Dark dots: {dots.sum()}, Light dots: {dots_light.sum()}")
    print("Generating dark.svg...")
    dark_svg = generate_banner(dots, gray_img=gray_img, is_dark=True)
    Path("dark.svg").write_text(dark_svg)
    print(f"dark.svg written ({len(dark_svg)} bytes)")
    print("Generating light.svg...")
    light_svg = generate_banner(dots_light, is_dark=False)
    Path("light.svg").write_text(light_svg)
    print(f"light.svg written ({len(light_svg)} bytes)")
    print("Done!")


if __name__ == "__main__":
    main()