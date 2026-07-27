#!/usr/bin/env python3
"""
Generate animated GitHub profile banner SVG.
Produces dark.svg and light.svg with dithered portrait, info panel, and
morphing logo animation. All animations use SMIL (native SVG) for
maximum browser compatibility and 60fps performance.
"""

import random
import re
from pathlib import Path

import cairosvg
import io as pyio
import numpy as np
from PIL import Image, ImageFilter
from scipy import spatial

# ── Configuration ──────────────────────────────────────────────────────────

CANVAS_W = 1180
CANVAS_H = 610
PORTRAIT_W = 300
PORTRAIT_H = 340
PANEL_X = int(CANVAS_W * 0.40)
PANEL_W = CANVAS_W - PANEL_X - 40

PALETTE = {
    "portrait_dark": "#A78BFA",
    "portrait_light": "#7C3AED",
    "ui_chrome_dark": "#22D3EE",
    "ui_chrome_light": "#0891B2",
    "accent": "#10B981",
    "bg": "#0A101F",
}

# Phase timing in seconds (total loop = 14.2s)
T_PORTRAIT = 3.0
T_TRANS1 = 1.3
T_FLUTTER = 2.0
T_TRANS2 = 1.3
T_PYTHON = 2.0
T_TRANS3 = 1.3
T_NEXTJS = 2.0
T_TRANS4 = 1.3
LOOP_DUR = 14.2

# Phase boundaries as fractions of loop
P0 = 0.0
P1 = T_PORTRAIT / LOOP_DUR       # 0.211
P2 = (T_PORTRAIT + T_TRANS1) / LOOP_DUR        # 0.303
P3 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER) / LOOP_DUR    # 0.444
P4 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER + T_TRANS2) / LOOP_DUR     # 0.535
P5 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER + T_TRANS2 + T_PYTHON) / LOOP_DUR      # 0.676
P6 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER + T_TRANS2 + T_PYTHON + T_TRANS3) / LOOP_DUR    # 0.768
P7 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER + T_TRANS2 + T_PYTHON + T_TRANS3 + T_NEXTJS) / LOOP_DUR     # 0.908
P8 = 1.0

# ── Floyd-Steinberg dithering ─────────────────────────────────────────────

def floyd_steinberg(gray, threshold=128):
    h, w = gray.shape
    out = np.zeros((h, w), dtype=bool)
    err = np.zeros((h + 2, w + 2), dtype=np.float64)
    for y in range(h):
        cols = range(w) if y % 2 == 0 else range(w - 1, -1, -1)
        for x in cols:
            old = gray[y, x] + err[y + 1, x + 1]
            out[y, x] = old > threshold
            qe = old - (255.0 if out[y, x] else 0.0)
            if y % 2 == 0:
                err[y + 1, x + 2] += qe * 7 / 16
                err[y + 2, x + 1] += qe * 5 / 16
                err[y + 2, x]     += qe * 3 / 16
                err[y + 2, x + 2] += qe * 1 / 16
            else:
                err[y + 1, x]     += qe * 7 / 16
                err[y + 2, x + 1] += qe * 5 / 16
                err[y + 2, x]     += qe * 3 / 16
                err[y + 2, x - 1] += qe * 1 / 16
    return out


# ── Image processing ───────────────────────────────────────────────────────

def process_photo(photo_path):
    img = Image.open(photo_path).convert("RGB")
    w, h = img.size
    crop_h = int(h * 0.22)
    crop_w = int(crop_h * PORTRAIT_W / PORTRAIT_H)
    # Face center at ~(768, 185) in 1536x2048 image
    face_x, face_y = 768, 185
    # Center horizontally, place face at ~1/3 from top of portrait
    left = max(0, face_x - crop_w // 2)
    top = max(0, face_y - int(crop_h * 0.35))  # ~50px above face, more headroom
    right = min(w, left + crop_w)
    bottom = min(h, top + crop_h)
    if right - left < crop_w:
        left = max(0, right - crop_w)
    if bottom - top < crop_h:
        top = max(0, bottom - crop_h)
    cropped = img.crop((left, top, right, bottom)).resize((PORTRAIT_W, PORTRAIT_H), Image.LANCZOS)
    gray = np.array(cropped.convert("L"), dtype=np.float64)
    low, high = np.percentile(gray, [1, 99])
    gray = np.clip((gray - low) / (high - low) * 255, 0, 255)
    blur = np.array(cropped.convert("L").filter(ImageFilter.GaussianBlur(3)), dtype=np.float64)
    gray = np.clip(gray + 1.4 * (gray - blur), 0, 255)
    gray = np.clip(128 + (gray - 128) * 1.3, 0, 255).astype(np.uint8)
    
    # Dark mode: use the original dither (no background segmentation needed)
    # The dither naturally puts dots on darker areas (subject) and skips lighter areas (wall)
    dots = floyd_steinberg(gray.astype(np.float64))
    dots_light = floyd_steinberg((255 - gray).astype(np.float64))
    return dots, dots_light, gray


# ── Logo paths ─────────────────────────────────────────────────────────────

def load_logo_paths():
    logos = []
    for fname in ["flutter.svg", "python.svg", "nextjs.svg"]:
        svg = (Path(__file__).parent / "logos" / fname).read_text()
        m = re.search(r'<path\s+d="([^"]+)"', svg)
        if m:
            logos.append((fname.replace(".svg", ""), m.group(1)))
    return logos


def logo_to_point_cloud(path_d, num_points, scale=1.0):
    render_size = 200
    svg = (f'<svg viewBox="0 0 24 24" width="{render_size}" height="{render_size}">'
           f'<path d="{path_d}" fill="#fff" stroke="#fff" stroke-width="0.5"/></svg>')
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=render_size, output_height=render_size)
    arr = np.array(Image.open(pyio.BytesIO(png)).convert("L"))
    ys, xs = np.where(arr > 128)
    if len(xs) == 0:
        xs, ys = np.random.randint(5, render_size - 5, num_points), np.random.randint(5, render_size - 5, num_points)
    idx = np.random.choice(len(xs), num_points, replace=len(xs) < num_points)
    pts = np.column_stack([xs[idx], ys[idx]]).astype(np.float64) / render_size * scale
    return pts - pts.mean(axis=0)


def optimal_transport(src, dst):
    tree = spatial.KDTree(dst)
    return dst[tree.query(src)[1]]


# ── Info panel ─────────────────────────────────────────────────────────────

def build_info_data():
    return [
        ("Subject", "Arnost Dobrucky"),
        ("Role", "Full-Stack Developer"),
        ("Origin", "Kajal, Slovakia"),
        ("Education", "Self-Taught"),
        ("Status", "Building + Learning + Shipping"),
        ("ToolChain", "VS Code / Git / Android Studio / Figma / Blender / Docker"),
        ("Core.Lang", "Python / JS / TS / Java / Kotlin / PHP"),
        ("Core.Frontend", "Next.js / React Native / Flutter / WebGL"),
        ("Core.Backend", "Express.js / Flask / NodeJS / Filament"),
        ("Core.Database", "MariaDB / MySQL / Postgres / SQLite / Firebase"),
        ("Core.Infra", "Docker / K8s / Nginx / Azure / GCP"),
        ("Grid.Mail", "arnika55@kernelkicks.dev"),
        ("Grid.Portfolio", "coming soon"),
        ("Grid.LinkedIn", "linkedin.com/in/arnost-dobrucky"),
        ("Grid.GitHub", "github.com/Arnost55"),
        ("Grid.Facebook", "—"),
    ]


# ── SVG generators ─────────────────────────────────────────────────────────

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def fmt_kt(*times):
    return ";".join(f"{t:.4f}" for t in times)


def build_portrait_layer(dots, color, dot_size=2.2):
    """Build the portrait dot layer with drift-band SMIL animation.
    Returns SVG string with all portrait dots grouped into 94 drift bands,
    each with an animateTransform for the drift motion."""
    h, w = dots.shape
    coords = [(x, y) for y in range(h) for x in range(w) if dots[y, x]]
    positions = np.array(coords, dtype=np.float64)
    total = len(coords)

    # 94 drift bands with per-dot noise (sigma=4) to break grid artifacts
    n_bands = 94
    noise = np.random.RandomState(42).normal(0, 4.0, positions.shape)
    noisy = positions + noise
    band_idx = np.clip((noisy[:, 0] / w * 0.5 + noisy[:, 1] / h * 0.5) * n_bands, 0, n_bands - 1).astype(int)
    bands = {i: [] for i in range(n_bands)}
    for i, b in enumerate(band_idx):
        bands[b].append(i)

    parts = []
    # Drift toward center (150, 170) during portrait phase, return during transition
    drift_kt = fmt_kt(0, P1 * 0.5, P1, P2)
    drift_splines = "0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"

    for bi in range(n_bands):
        idxs = bands.get(bi, [])
        if not idxs:
            continue
        cx, cy = positions[idxs].mean(axis=0)
        dx = (150 - cx) * 0.42
        dy = (170 - cy) * 0.42
        paths = []
        for idx in idxs:
            x, y = coords[idx]
            paths.append(f"M{x},{y}h1")
        d = "".join(paths)
        parts.append(
            f'<g class="pd">'
            f'<animateTransform attributeName="transform" type="translate" '
            f'values="0,0;{dx:.1f},{dy:.1f};0,0;0,0" '
            f'keyTimes="{drift_kt}" '
            f'dur="{LOOP_DUR}s" repeatCount="indefinite" '
            f'calcMode="spline" keySplines="{drift_splines}"/>'
            f'<path d="{esc(d)}" '
            f'stroke="{color}" stroke-width="{dot_size}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges"/>'
            f'</g>'
        )
    return "".join(parts)


def build_intro_animation(dots, color, dot_size=2.2):
    """Build the intro fade-in animation using SMIL.
    60 interleaved random groups scattered across the whole portrait."""
    h, w = dots.shape
    coords = [(x, y) for y in range(h) for x in range(w) if dots[y, x]]
    indices = list(range(len(coords)))
    random.seed(42)
    random.shuffle(indices)

    n_groups = 60
    size = len(indices) // n_groups
    groups = [indices[i:i+size] for i in range(0, len(indices), size)]

    parts = []
    for gi in range(min(n_groups, len(groups))):
        idxs = groups[gi]
        if not idxs:
            continue
        g = []
        for idx in idxs:
            x, y = coords[idx]
            g.append(f"M{x},{y}h1")
        d = "".join(g)
        stagger = random.randint(0, 1800)
        dur = random.randint(200, 400)
        parts.append(
            f'<path d="{esc(d)}" '
            f'stroke="{color}" stroke-width="{dot_size}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges">'
            f'<animate attributeName="opacity" from="0" to="1" '
            f'begin="{stagger}ms" dur="{dur}ms" fill="freeze"/>'
            f'</path>'
        )
    return "".join(parts)


def build_travellers(color, dot_size=2.2):
    """Build 900 traveller dots that morph between Flutter, Python, and Next.js logos.
    Uses SMIL animate for cx, cy, and opacity with correct phase timing."""
    num = 900

    # Load logos and convert to point clouds
    logos = load_logo_paths()
    logo_pts = []
    for name, path_d in logos:
        pts = logo_to_point_cloud(path_d, num, scale=min(PORTRAIT_W, PORTRAIT_H) * 0.3)
        pts[:, 0] += PORTRAIT_W // 2
        pts[:, 1] += PORTRAIT_H // 2
        logo_pts.append(pts)

    # Random start positions
    np.random.seed(123)
    starts = np.column_stack([
        np.random.randint(5, PORTRAIT_W - 5, num),
        np.random.randint(5, PORTRAIT_H - 5, num),
    ]).astype(np.float64)

    # Optimal transport matching
    matched = [optimal_transport(starts, pts) for pts in logo_pts]

    # Build keyTimes for cx/cy (9 keyTimes, 8 segments)
    # Portrait -> Trans1 -> Flutter -> Trans2 -> Python -> Trans3 -> Next.js -> Trans4 -> Portrait
    cx_kt = fmt_kt(P0, P1, P2, P3, P4, P5, P6, P7, P8)

    # Opacity: hidden during portrait, visible during logo phases, hidden during final transition
    # 0 -> P1: 0 (hidden), P1 -> P1+ε: 1 (fade in), P1+ε -> P7: 1 (visible), P7 -> P7+ε: 0 (fade out)
    fade_in = P1 + 0.001
    fade_out = P7 + 0.001
    op_kt = fmt_kt(P0, P1, fade_in, P7, fade_out, P8)
    op_vals = "0;0;1;1;0;0"

    parts = []
    for i in range(num):
        x0, y0 = starts[i]
        x1, y1 = matched[0][i]
        x2, y2 = matched[1][i]
        x3, y3 = matched[2][i]

        cx_vals = f"{x0:.1f};{x0:.1f};{x1:.1f};{x1:.1f};{x2:.1f};{x2:.1f};{x3:.1f};{x3:.1f};{x0:.1f}"
        cy_vals = f"{y0:.1f};{y0:.1f};{y1:.1f};{y1:.1f};{y2:.1f};{y2:.1f};{y3:.1f};{y3:.1f};{y0:.1f}"

        # 8 splines: hold, ease, hold, ease, hold, ease, hold, ease
        splines = "0 0 1 1;0.4 0 0.6 1;0 0 1 1;0.4 0 0.6 1;0 0 1 1;0.4 0 0.6 1;0 0 1 1;0.4 0 0.6 1"

        parts.append(
            f'<circle cx="{x0:.1f}" cy="{y0:.1f}" r="{dot_size * 0.7}" fill="{color}">'
            f'<animate attributeName="opacity" '
            f'values="{op_vals}" keyTimes="{op_kt}" '
            f'dur="{LOOP_DUR}s" repeatCount="indefinite"/>'
            f'<animate attributeName="cx" '
            f'values="{cx_vals}" keyTimes="{cx_kt}" '
            f'dur="{LOOP_DUR}s" repeatCount="indefinite" '
            f'calcMode="spline" keySplines="{splines}"/>'
            f'<animate attributeName="cy" '
            f'values="{cy_vals}" keyTimes="{cx_kt}" '
            f'dur="{LOOP_DUR}s" repeatCount="indefinite" '
            f'calcMode="spline" keySplines="{splines}"/>'
            f'</circle>'
        )
    return "".join(parts)


def build_info_panel(data, is_dark=True):
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    bg = PALETTE["bg"] if is_dark else "#F0F0F0"
    tc = "#E0E0E0" if is_dark else "#1A1A2E"
    y = 40
    fs = 14
    ls = 23
    parts = []
    parts.append(
        f'<text x="0" y="{y}" font-family="Menlo,Consolas,monospace" '
        f'font-size="13" fill="{chrome}" font-weight="bold">SYSTEM.INFO</text>')
    y += ls + 10
    parts.append(
        f'<rect x="0" y="{y-10}" width="42" height="16" rx="3" '
        f'fill="none" stroke="#FF3B30" stroke-width="1.5"/>'
        f'<text x="21" y="{y+1}" font-family="Menlo,Consolas,monospace" '
        f'font-size="12" fill="#FF3B30" text-anchor="middle" font-weight="bold">LIVE</text>'
        f'<circle cx="50" cy="{y-2}" r="3" fill="#FF3B30">'
        f'<animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite"/>'
        f'</circle>')
    y += ls + 5
    parts.append(
        f'<rect x="0" y="{y-12}" width="160" height="22" rx="11" '
        f'fill="{chrome}" opacity="0.2"/>'
        f'<text x="80" y="{y+3}" font-family="Menlo,Consolas,monospace" '
        f'font-size="14" fill="{chrome}" text-anchor="middle" font-weight="bold">Arnost55</text>')
    y += ls + 15
    parts.append(
        f'<line x1="0" y1="{y}" x2="{PANEL_W}" y2="{y}" '
        f'stroke="{chrome}" stroke-width="0.5" opacity="0.3"/>')
    y += ls
    for label, value in data:
        label_text = f"  {label}"
        value_text = f" {esc(value)}"
        cw = 8.0
        ld = max(0, int((PANEL_W - len(label_text)*cw - len(value_text)*cw - 20) / (cw * 1.5)))
        line = f'{label_text}{" " + "." * ld + " "}{value_text}'
        parts.append(
            f'<text x="0" y="{y}" font-family="Menlo,Consolas,monospace" '
            f'font-size="{fs}" fill="{tc}" '
            f'textLength="{PANEL_W}" lengthAdjust="spacingAndGlyphs">{esc(line)}</text>')
        y += ls
    return "".join(parts)


def build_terminal_border(is_dark=True):
    ch = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    bg = PALETTE["bg"] if is_dark else "#F0F0F0"
    return (
        f'<rect x="0" y="0" width="{CANVAS_W}" height="{CANVAS_H}" '
        f'fill="{bg}" rx="12" stroke="{ch}" stroke-width="2"/>'
        f'<rect x="0" y="0" width="{CANVAS_W}" height="36" '
        f'fill="{ch}" opacity="0.1" rx="12"/>'
        f'<circle cx="12" cy="18" r="6" fill="#FF5F56" opacity="0.8"/>'
        f'<circle cx="32" cy="18" r="6" fill="#FFBD2E" opacity="0.8"/>'
        f'<circle cx="52" cy="18" r="6" fill="#27C93F" opacity="0.8"/>'
        f'<text x="{CANVAS_W//2}" y="24" font-family="Menlo,Consolas,monospace" '
        f'font-size="13" fill="{ch}" text-anchor="middle" opacity="0.8">'
        f'profile.sh --live</text>'
    )


def build_portrait_frame(is_dark=True):
    ch = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    pw = PORTRAIT_W + 20
    ph = PORTRAIT_H + 40
    return (
        f'<rect x="15" y="50" width="{pw}" height="{ph}" '
        f'fill="none" stroke="{ch}" stroke-width="1.5" rx="6"/>'
        f'<text x="{15 + pw//2}" y="{50 + ph - 8}" '
        f'font-family="Menlo,Consolas,monospace" font-size="11" '
        f'fill="{ch}" text-anchor="middle" opacity="0.6">VISUAL.MAP</text>'
    ), 15 + 10, 50 + 15


# ── Main banner generator ──────────────────────────────────────────────────

def generate_banner(dots, is_dark=True):
    ch = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    color = PALETTE["portrait_dark"] if is_dark else PALETTE["portrait_light"]

    px, py = 25, 65  # portrait inner area offset

    # Build all layers
    intro = build_intro_animation(dots, color)
    portrait = build_portrait_layer(dots, color)
    travellers = build_travellers(color)

    frame_svg, fx, fy = build_portrait_frame(is_dark)

    # CSS for portrait fade — visible during portrait phase, hidden during logos
    # Using CSS @keyframes because it's more reliable in <img> contexts than SMIL
    pct_p1 = P1 * 100
    pct_p2 = P2 * 100
    pct_p7 = P7 * 100
    css = (
        f'<style>'
        f'@keyframes pfade {{'
        f'0%{{opacity:1}}{pct_p1:.1f}%{{opacity:1}}'
        f'{pct_p2:.1f}%{{opacity:0}}{pct_p7:.1f}%{{opacity:0}}'
        f'100%{{opacity:1}}'
        f'}}'
        f'.pd{{animation:pfade {LOOP_DUR}s ease-in-out infinite}}'
        f'</style>'
    )

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{CANVAS_W}" height="{CANVAS_H}" '
        f'viewBox="0 0 {CANVAS_W} {CANVAS_H}">\n'
        f'{css}\n'
        f'{build_terminal_border(is_dark)}\n'
        f'{frame_svg}\n'
        f'<g transform="translate({fx},{fy})">\n'
        f'  <clipPath id="pc-{"d" if is_dark else "l"}">\n'
        f'    <rect x="0" y="0" width="{PORTRAIT_W}" height="{PORTRAIT_H}" rx="4"/>\n'
        f'  </clipPath>\n'
        f'  <g clip-path="url(#pc-{"d" if is_dark else "l"})">\n'
        f'    <!-- Intro -->\n{intro}\n'
        f'    <!-- Portrait drift bands -->\n{portrait}\n'
        f'    <!-- Travellers -->\n{travellers}\n'
        f'  </g>\n'
        f'</g>\n'
        f'<g transform="translate({PANEL_X}, 45)">\n'
        f'{build_info_panel(build_info_data(), is_dark)}\n'
        f'</g>\n'
        f'</svg>'
    )
    return svg


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    print("Processing photo...")
    dots, dots_light, gray_img = process_photo("assets/photo.jpg")
    print(f"Dark dots: {dots.sum()}, Light dots: {dots_light.sum()}")
    print("Generating dark.svg...")
    dark_svg = generate_banner(dots, is_dark=True)
    Path("dark.svg").write_text(dark_svg)
    print(f"dark.svg written ({len(dark_svg)} bytes)")
    print("Generating light.svg...")
    light_svg = generate_banner(dots_light, is_dark=False)
    Path("light.svg").write_text(light_svg)
    print(f"light.svg written ({len(light_svg)} bytes)")
    print("Done!")


if __name__ == "__main__":
    main()