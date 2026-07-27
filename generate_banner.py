#!/usr/bin/env python3
"""
Generate animated GitHub profile banner SVG.
Produces dark.svg and light.svg with dithered portrait, info panel, and
morphing logo animation.
"""

import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

# ── Configuration ──────────────────────────────────────────────────────────

CANVAS_W = 1180
CANVAS_H = 610

PORTRAIT_W = 300   # grid width (dots)
PORTRAIT_H = 340   # grid height (dots)

PANEL_X = int(CANVAS_W * 0.40)  # 472 — info panel starts after ~38% portrait + gap
PANEL_W = CANVAS_W - PANEL_X - 40

LOGO_SIZE = 80     # logo rendered size within banner

PALETTE = {
    "portrait_dark": "#A78BFA",
    "portrait_light": "#7C3AED",
    "ui_chrome_dark": "#22D3EE",
    "ui_chrome_light": "#0891B2",
    "accent": "#10B981",
    "bg": "#0A101F",
}

# ── Floyd-Steinberg dithering (serpentine) ─────────────────────────────────

def floyd_steinberg(gray: np.ndarray, threshold=128):
    """Floyd-Steinberg dither on a 2D float array [0,255].
    Serpentine order — every other row sweeps right-to-left.
    Returns boolean array (True = dot visible)."""
    h, w = gray.shape
    out = np.zeros((h, w), dtype=bool)
    err = np.zeros((h + 2, w + 2), dtype=np.float64)

    for y in range(h):
        if y % 2 == 0:
            cols = range(w)
        else:
            cols = range(w - 1, -1, -1)
        for x in cols:
            old = gray[y, x] + err[y + 1, x + 1]
            out[y, x] = old > threshold
            quant_err = old - (255.0 if out[y, x] else 0.0)
            # FS distribution
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
    """Load, crop head+shoulders, process, return (dark_dots, light_dots, gray_img)."""
    img = Image.open(photo_path).convert("RGB")
    w, h = img.size

    # Crop head+shoulders — face center is at ~(0.5, 0.09) → (0.5, 0.13)
    # For 1536x2048: face center [768, 185], top head ~80, shoulders ~330
    cx, cy = 0.5, 0.09  # face center as fraction
    # Crop box: face-centered, slightly wider than portrait ratio to allow resize
    crop_aspect = PORTRAIT_W / PORTRAIT_H  # ~0.882
    crop_h = int(h * 0.22)  # ~450px
    crop_w = int(crop_h * crop_aspect)

    left = max(0, int(w * cx) - crop_w // 2)
    top = max(0, int(h * cy) - int(crop_h * 0.25))  # more headroom above
    right = min(w, left + crop_w)
    bottom = min(h, top + crop_h)
    # Re-center if we hit edges
    if right - left < crop_w:
        left = max(0, right - crop_w)
    if bottom - top < crop_h:
        top = max(0, bottom - crop_h)

    cropped = img.crop((left, top, right, bottom))
    cropped = cropped.resize((PORTRAIT_W, PORTRAIT_H), Image.LANCZOS)

    # Convert to grayscale
    gray = cropped.convert("L")
    gray_arr = np.array(gray, dtype=np.float64)

    # Autocontrast (cutoff=1%)
    low, high = np.percentile(gray_arr, [1, 99])
    gray_arr = np.clip((gray_arr - low) / (high - low) * 255, 0, 255)

    # Unsharp mask
    blur = np.array(gray.filter(ImageFilter.GaussianBlur(radius=3)), dtype=np.float64)
    gray_arr = gray_arr + 1.4 * (gray_arr - blur)
    gray_arr = np.clip(gray_arr, 0, 255)

    # Contrast boost 1.3x
    gray_arr = np.clip(128 + (gray_arr - 128) * 1.3, 0, 255)

    gray_final = gray_arr.astype(np.uint8)

    # ── Dither ──
    dots = floyd_steinberg(gray_final.astype(np.float64))

    # Light mode: dots draw the dark parts of the photo (invert)
    dots_light = floyd_steinberg((255 - gray_final).astype(np.float64))

    return dots, dots_light, gray_final


def segment_background(gray_img: np.ndarray) -> np.ndarray:
    """Simple background segmentation using colour distance threshold.
    For the dark-mode portrait, the background is the lighter wall.
    Returns binary mask: True = subject."""
    # Background is lighter than subject in this photo
    bg_threshold = np.percentile(gray_img, 40)  # assume ~40% is bg
    mask = gray_img < bg_threshold
    # Binary closing + fill holes
    mask = ndimage.binary_closing(mask, structure=np.ones((5, 5)), iterations=2)
    mask = ndimage.binary_fill_holes(mask)
    # Keep only the largest connected component
    labeled, n = ndimage.label(mask)
    if n > 0:
        sizes = ndimage.sum(mask, labeled, range(1, n + 1))
        mask = labeled == (np.argmax(sizes) + 1)
    return mask


# ── Logo SVG path loading ──────────────────────────────────────────────────

def load_logo_paths():
    """Return list of (name, path_d) tuples from logos/*.svg."""
    logos = []
    logo_dir = Path(__file__).parent / "logos"
    for path_d in ["flutter.svg", "python.svg", "nextjs.svg"]:
        svg = (logo_dir / path_d).read_text()
        # Extract d="..." from path tag
        import re
        m = re.search(r'<path\s+d="([^"]+)"', svg)
        if m:
            name = path_d.replace(".svg", "")
            logos.append((name, m.group(1)))
    return logos


def logo_to_point_cloud(path_d: str, num_points: int,
                         viewbox_size=24, scale=1.0):
    """Convert an SVG path to a point cloud by rasterizing with cairosvg and
    sampling points from the rendered shape."""
    import cairosvg
    import io as pyio
    
    # Build a minimal SVG with just this path, filled
    render_size = 200
    svg_xml = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {viewbox_size} {viewbox_size}" '
        f'width="{render_size}" height="{render_size}">'
        f'<path d="{path_d}" fill="#fff" stroke="#fff" stroke-width="0.5"/>'
        f'</svg>'
    )
    
    # Render to PNG bytes
    png_bytes = cairosvg.svg2png(bytestring=svg_xml.encode(),
                                 output_width=render_size,
                                 output_height=render_size)
    
    # Load with PIL
    img = Image.open(pyio.BytesIO(png_bytes)).convert("L")
    arr = np.array(img)
    
    # Sample points from bright areas (filled shape)
    ys, xs = np.where(arr > 128)
    if len(xs) == 0:
        # Fallback
        xs = np.random.randint(5, render_size - 5, num_points)
        ys = np.random.randint(5, render_size - 5, num_points)
    
    # Sample
    if len(xs) < num_points:
        # Repeat
        idx = np.random.choice(len(xs), num_points, replace=True)
    else:
        idx = np.random.choice(len(xs), num_points, replace=False)
    
    points = np.column_stack([xs[idx], ys[idx]]).astype(np.float64)
    
    # Normalize and scale
    points = points / render_size * scale
    
    # Center around 0,0
    points -= points.mean(axis=0)
    
    return points


def optimal_transport(src_pts, dst_pts):
    """Match source points to destination by nearest-neighbor transport."""
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

def make_dot_path(dots: np.ndarray, dot_size=2.2, color="#A78BFA"):
    """Convert boolean dot array to SVG <path> runs with shape-rendering=crispEdges.
    Uses horizontal run-length encoding for compactness."""
    h, w = dots.shape
    lines = []
    for y in range(h):
        x = 0
        while x < w:
            if dots[y, x]:
                start = x
                while x < w and dots[y, x]:
                    x += 1
                lines.append(f"M{start},{y}h{x-start}")
            else:
                x += 1
    path_d = "".join(lines)
    return (f'<path d="{escape_xml(path_d)}" '
            f'stroke="{color}" stroke-width="{dot_size}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges"/>')


def make_dot_runs_animate(dots: np.ndarray, color="#A78BFA", dot_size=2.2,
                          dark_mode=True):
    """Create dot paths with animation groups and travellers.
    Returns SVG string for the portrait layer."""
    h, w = dots.shape
    total_dots = int(np.sum(dots))  # noqa: F841
    
    # Collect dot coordinates
    dot_coords = [(x, y) for y in range(h) for x in range(w) if dots[y, x]]
    
    # ── Intro fade-in (~2s, once) ──
    # 60 interleaved random groups scattered across whole portrait
    indices = list(range(len(dot_coords)))
    random.seed(42)
    random.shuffle(indices)
    n_groups = 60
    group_size = len(indices) // n_groups
    groups = [indices[i:i+group_size] for i in range(0, len(indices), group_size)]
    
    # ── For the loop: portrait phase + logo morph phases ──
    # Logo centroids (in dot space, 300x340)
    logo_centroids = [
        (150, 170),  # Flutter — center of portrait area
        (150, 170),  # Python
        (150, 170),  # Next.js
    ]
    
    # Calculate drift bands (94 groups)
    # The trap: quantizing position into groups recreates a grid.
    # Solution: add per-dot noise (sigma ~4) before grouping.
    n_bands = 94
    noise_sigma = 4.0
    
    total_coords = len(dot_coords)
    positions = np.array([(x, y) for x, y in dot_coords], dtype=np.float64)
    # Add noise to break grid artifacts
    noisy_positions = positions + np.random.RandomState(42).normal(0, noise_sigma, positions.shape)
    
    # Assign to bands based on noisy position
    band_assignments = np.clip(
        (noisy_positions[:, 0] / w * 0.5 + noisy_positions[:, 1] / h * 0.5) * n_bands,
        0, n_bands - 1
    ).astype(int)
    
    # Build bands
    bands = {i: [] for i in range(n_bands)}
    for idx in range(total_coords):
        band_idx = band_assignments[idx]
        bands[band_idx].append(idx)
    
    # Build SVG parts
    parts = []
    
    # ── Intro animation groups ──
    parts.append('<!-- Intro animation: interleaved random groups -->\n')
    for gi, group_idxs in enumerate(groups):
        if not group_idxs:
            continue
        g = []
        for idx in group_idxs:
            x, y = dot_coords[idx]
            g.append(f"M{x},{y}h1")
        path_d = "".join(g)
        delay = gi * (2000 / n_groups)  # ms stagger
        # Scatter across a 2-second window so they shimmer in everywhere at once
        # Each group is scattered across the whole portrait (already shuffled)
        stagger = random.randint(0, 800)
        parts.append(
            f'<path d="{escape_xml(path_d)}" '
            f'stroke="{color}" stroke-width="{dot_size}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges">\n'
            f'  <animate attributeName="opacity" from="0" to="1" '
            f'begin="{stagger}ms" dur="{200 + random.randint(100, 300)}ms" fill="freeze"/>\n'
            f'</path>\n'
        )
    
    # ── Portrait layer (drift bands) ──
    parts.append('<!-- Portrait layer: ~17k dots in ~94 drift bands -->\n')
    # Timeline: portrait 3.0s, then logo morph transitions
    # Loop duration: 3.0 (portrait) + 1.3 + 2.0 + 1.3 + 2.0 + 1.3 + 2.0 = ~12.9s ≈ 14.2s
    # Let's use explicit keyTimes
    portrait_end = 3.0
    t1_end = portrait_end + 1.3  # 4.3
    logo1_end = t1_end + 2.0    # 6.3
    t2_end = logo1_end + 1.3    # 7.6
    logo2_end = t2_end + 2.0    # 9.6
    t3_end = logo2_end + 1.3    # 10.9
    logo3_end = t3_end + 2.0    # 12.9
    loop_end = logo3_end + 1.3  # 14.2
    
    for band_idx in range(n_bands):
        band_idxs = bands.get(band_idx, [])
        if not band_idxs:
            continue
        
        # Drift direction: toward first logo centroid (center) with added noise
        dx = (logo_centroids[0][0] - positions[band_idxs, 0].mean()) * 0.42
        dy = (logo_centroids[0][1] - positions[band_idxs, 1].mean()) * 0.42
        
        # Add small random variation to each dot within the band
        g = []
        for idx in band_idxs:
            x, y = dot_coords[idx]
            g.append(f"M{x},{y}h1")
        path_d = "".join(g)
        
        # Drift animation
        parts.append(
            f'<g>\n'
            f'  <animateTransform attributeName="transform" type="translate" '
            f'values="0,0; {dx:.1f},{dy:.1f}; 0,0; 0,0; {dx:.1f},{dy:.1f}; 0,0" '
            f'keyTimes="0; 0.1; 0.21; 0.5; 0.6; 0.76" '
            f'dur="{loop_end}s" repeatCount="indefinite" '
            f'calcMode="spline" '
            f'keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1; 0.4 0 0.6 1"/>\n'
            f'  <path d="{escape_xml(path_d)}" '
            f'stroke="{color}" stroke-width="{dot_size}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges"/>\n'
            f'</g>\n'
        )
    
    # ── Travellers: ~900 dots that morph between logos ──
    parts.append('<!-- Travellers: ~900 dots morphing between logos -->\n')
    num_travellers = 900
    
    # Logo paths as point clouds
    logos = load_logo_paths()
    logo_clouds = []
    for name, path_d in logos:
        pts = logo_to_point_cloud(path_d, num_travellers, scale=min(PORTRAIT_W, PORTRAIT_H) * 0.3)
        # Center in portrait area
        pts[:, 0] += PORTRAIT_W // 2
        pts[:, 1] += PORTRAIT_H // 2
        logo_clouds.append(pts)
    
    # Traveller start positions (random within portrait area)
    np.random.seed(123)
    traveller_positions = np.column_stack([
        np.random.randint(5, PORTRAIT_W - 5, num_travellers),
        np.random.randint(5, PORTRAIT_H - 5, num_travellers),
    ]).astype(np.float64)
    
    # Optimal transport matching
    matched_logos = []
    for pts in logo_clouds:
        matched = optimal_transport(traveller_positions, pts)
        matched_logos.append(matched)
    
    # Build traveller paths and animations
    for i in range(num_travellers):
        x0, y0 = traveller_positions[i]
        x1, y1 = matched_logos[0][i]
        x2, y2 = matched_logos[1][i]
        x3, y3 = matched_logos[2][i]
        
        # Traveller: opacity 0 during portrait phase, 1 during logo phases
        # keyTimes: 0; 0.21; 0.30; 0.44; 0.54; 0.68; 0.77; 1
        # We need 7 segments for 3 logos with transitions
        # Split the 14.2s into 7 phases:
        # P = portrait (0-21%), T1 (21-30%), L1 (30-44%), T2 (44-54%), L2 (54-68%), T3 (68-77%), L3 (77-100%)
        traveller_d = f"M{x0:.1f},{y0:.1f}"
        
        # Interpolate positions for each phase
        phases = [
            (0, 0, x0, y0),         # Start (portrait phase - hidden)
            (0.21, 0.30, x1, y1),   # Transition to logo 1
            (0.30, 0.44, x1, y1),   # Hold logo 1
            (0.44, 0.54, x2, y2),   # Transition to logo 2
            (0.54, 0.68, x2, y2),   # Hold logo 2
            (0.68, 0.77, x3, y3),   # Transition to logo 3
            (0.77, 1.0, x3, y3),    # Hold logo 3
        ]
        
        parts.append(
            f'<circle cx="{x0:.1f}" cy="{y0:.1f}" r="{dot_size * 0.7}" fill="{color}">\n'
            f'  <animate attributeName="opacity" values="0;0;1;1;1;1;0;0" '
            f'keyTimes="0;0.20;0.21;0.44;0.54;0.76;0.77;1" '
            f'dur="{loop_end}s" repeatCount="indefinite"/>\n'
            f'  <animate attributeName="cx" values="{x0:.1f};{x0:.1f};{x1:.1f};{x1:.1f};{x2:.1f};{x2:.1f};{x3:.1f};{x3:.1f}" '
            f'keyTimes="0;0.20;0.30;0.44;0.54;0.76;0.77;1" '
            f'dur="{loop_end}s" repeatCount="indefinite" '
            f'calcMode="spline" '
            f'keySplines="0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1"/>\n'
            f'  <animate attributeName="cy" values="{y0:.1f};{y0:.1f};{y1:.1f};{y1:.1f};{y2:.1f};{y2:.1f};{y3:.1f};{y3:.1f}" '
            f'keyTimes="0;0.20;0.30;0.44;0.54;0.76;0.77;1" '
            f'dur="{loop_end}s" repeatCount="indefinite" '
            f'calcMode="spline" '
            f'keySplines="0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1; 0 0 1 1; 0.4 0 0.6 1"/>\n'
            f'</circle>\n'
        )
    
    return "".join(parts)


def build_info_panel(data, is_dark=True):
    """Build the SYSTEM.INFO readout panel."""
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    accent = PALETTE["accent"]
    bg = PALETTE["bg"] if is_dark else "#F0F0F0"
    text_color = "#E0E0E0" if is_dark else "#1A1A2E"
    
    lines = []
    y = 40
    font_size = 14
    header_size = 13
    line_spacing = 23
    
    # Header row
    lines.append(
        f'<text x="0" y="{y}" font-family="Menlo, Consolas, monospace" '
        f'font-size="{header_size}" fill="{chrome}" font-weight="bold">'
        f'SYSTEM.INFO'
        f'</text>'
    )
    y += line_spacing + 10
    
    # LIVE badge
    lines.append(
        f'<rect x="0" y="{y - 10}" width="42" height="16" rx="3" fill="none" '
        f'stroke="#FF3B30" stroke-width="1.5"/>'
        f'<text x="21" y="{y + 1}" font-family="Menlo, Consolas, monospace" '
        f'font-size="12" fill="#FF3B30" text-anchor="middle" font-weight="bold">LIVE</text>'
    )
    # Pulsing dot
    lines.append(
        f'<circle cx="50" cy="{y - 2}" r="3" fill="#FF3B30">'
        f'  <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite"/>'
        f'</circle>'
    )
    y += line_spacing + 5
    
    # Coloured pill with handle
    lines.append(
        f'<rect x="0" y="{y - 12}" width="160" height="22" rx="11" fill="{chrome}" opacity="0.2"/>'
        f'<text x="80" y="{y + 3}" font-family="Menlo, Consolas, monospace" '
        f'font-size="14" fill="{chrome}" text-anchor="middle" font-weight="bold">'
        f'Arnost55'
        f'</text>'
    )
    y += line_spacing + 15
    
    # Separator
    lines.append(
        f'<line x1="0" y1="{y}" x2="{PANEL_W}" y2="{y}" '
        f'stroke="{chrome}" stroke-width="0.5" opacity="0.3"/>'
    )
    y += line_spacing
    
    # Data rows
    for label, value in data:
        # Dotted leaders
        label_text = f"  {label}"
        value_text = f" {escape_xml(value)}"
        
        # Calculate leader dots
        # Approx width per char at font-size 14 in monospace
        char_w = 8.0
        label_w = len(label_text) * char_w
        value_w = len(value_text) * char_w
        available = PANEL_W - label_w - value_w - 20
        num_dots = max(0, int(available / (char_w * 1.5)))
        dots = " " + "." * num_dots + " "
        
        full_line = f'{label_text}{dots}{value_text}'
        
        # Lock with textLength
        lines.append(
            f'<text x="0" y="{y}" font-family="Menlo, Consolas, monospace" '
            f'font-size="{font_size}" fill="{text_color}" '
            f'textLength="{PANEL_W}" lengthAdjust="spacingAndGlyphs">'
            f'{escape_xml(full_line)}'
            f'</text>'
        )
        y += line_spacing
    
    return "".join(lines)


def build_terminal_border(is_dark=True):
    """Build the terminal window frame."""
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    bg = PALETTE["bg"] if is_dark else "#F0F0F0"
    
    # Title bar
    bits = []
    bits.append(
        f'<rect x="0" y="0" width="{CANVAS_W}" height="{CANVAS_H}" '
        f'fill="{bg}" rx="12" stroke="{chrome}" stroke-width="2"/>'
    )
    # Title bar
    bits.append(
        f'<rect x="0" y="0" width="{CANVAS_W}" height="36" '
        f'fill="{chrome}" opacity="0.1" rx="12"/>'
    )
    # Window buttons
    for bx, col in [(12, "#FF5F56"), (32, "#FFBD2E"), (52, "#27C93F")]:
        bits.append(
            f'<circle cx="{bx}" cy="18" r="6" fill="{col}" opacity="0.8"/>'
        )
    # Title
    bits.append(
        f'<text x="{CANVAS_W // 2}" y="24" font-family="Menlo, Consolas, monospace" '
        f'font-size="13" fill="{chrome}" text-anchor="middle" opacity="0.8">'
        f'profile.sh --live'
        f'</text>'
    )
    return "".join(bits)


def build_portrait_frame(is_dark=True):
    """Build the VISUAL.MAP frame on the left side."""
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    x = 15
    y = 50
    pw = PORTRAIT_W + 20  # frame inner width
    ph = PORTRAIT_H + 40  # frame inner height (extra space for label)
    
    bits = []
    # Frame
    bits.append(
        f'<rect x="{x}" y="{y}" width="{pw}" height="{ph}" '
        f'fill="none" stroke="{chrome}" stroke-width="1.5" rx="6"/>'
    )
    # Label
    bits.append(
        f'<text x="{x + pw // 2}" y="{y + ph - 8}" font-family="Menlo, Consolas, monospace" '
        f'font-size="11" fill="{chrome}" text-anchor="middle" opacity="0.6">'
        f'VISUAL.MAP'
        f'</text>'
    )
    return "".join(bits), x + 10, y + 15  # inner content area


def generate_banner(dots, gray_img=None, is_dark=True):
    """Generate the full banner SVG."""
    chrome = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    color = PALETTE["portrait_dark"] if is_dark else PALETTE["portrait_light"]
    
    parts = []
    
    # SVG header
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{CANVAS_W}" height="{CANVAS_H}" '
        f'viewBox="0 0 {CANVAS_W} {CANVAS_H}">\n'
        f'<defs>\n'
        f'  <style>\n'
        f'    .text {{ font-family: Menlo, Consolas, monospace; }}\n'
        f'  </style>\n'
        f'</defs>\n'
    )
    
    # Terminal border
    parts.append(build_terminal_border(is_dark))
    
    # Portrait frame
    frame_svg, px, py = build_portrait_frame(is_dark)
    parts.append(frame_svg)
    
    # Portrait dots (masked or not depending on mode)
    if is_dark and gray_img is not None:
        # Segment background so dots only draw the lit subject
        subject_mask = segment_background(gray_img)
        masked_dots = dots & subject_mask
    else:
        masked_dots = dots
    
    # Create dot animations within the portrait frame
    dot_anim = make_dot_runs_animate(
        masked_dots if is_dark else dots,
        color=color,
        dark_mode=is_dark
    )
    
    # Position portrait dots inside the frame with a clipPath
    parts.append(
        f'<g transform="translate({px}, {py})">\n'
        f'  <clipPath id="portrait-clip-{"dark" if is_dark else "light"}">\n'
        f'    <rect x="0" y="0" width="{PORTRAIT_W}" height="{PORTRAIT_H}" rx="4"/>\n'
        f'  </clipPath>\n'
        f'  <g clip-path="url(#portrait-clip-{"dark" if is_dark else "light"})">\n'
        f'{dot_anim}'
        f'  </g>\n'
        f'</g>\n'
    )
    
    # Info panel
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
