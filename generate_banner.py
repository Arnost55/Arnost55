#!/usr/bin/env python3
"""
Generate animated GitHub profile banner SVG.
Approach: portrait dots animate away during logo phases (animateTransform),
logos are separate static paths cross-faded with CSS. 
Based on the working technique from arifhaxn's profile.
"""

import random
import re
from pathlib import Path

import cairosvg
import io as pyio
import numpy as np
from PIL import Image, ImageFilter
from scipy import spatial

# ── Config ─────────────────────────────────────────────────────────────────

CANVAS_W = 1180
CANVAS_H = 610
PORTRAIT_W = 300
PORTRAIT_H = 340
PANEL_X = int(CANVAS_W * 0.40)
PANEL_W = CANVAS_W - PANEL_X - 40
DOT_SIZE = 2.0
DITHER_THRESHOLD = 140
N_CLUSTERS = 100  # number of dot clusters (animateTransform groups)

PALETTE = {
    "portrait_dark": "#A78BFA",
    "portrait_light": "#7C3AED",
    "ui_chrome_dark": "#22D3EE",
    "ui_chrome_light": "#0891B2",
    "accent": "#10B981",
    "bg": "#0A101F",
    "bg_light": "#F0F0F0",
}

# Phase timing
T_PORTRAIT = 3.0
T_TRANS1 = 1.3
T_FLUTTER = 2.0
T_TRANS2 = 1.3
T_PYTHON = 2.0
T_TRANS3 = 1.3
T_NEXTJS = 2.0
T_TRANS4 = 1.3
LOOP = 14.2

P1 = T_PORTRAIT / LOOP         # 0.211
P2 = (T_PORTRAIT + T_TRANS1) / LOOP        # 0.303
P3 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER) / LOOP      # 0.444
P4 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER + T_TRANS2) / LOOP       # 0.535
P5 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER + T_TRANS2 + T_PYTHON) / LOOP        # 0.676
P6 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER + T_TRANS2 + T_PYTHON + T_TRANS3) / LOOP      # 0.768
P7 = (T_PORTRAIT + T_TRANS1 + T_FLUTTER + T_TRANS2 + T_PYTHON + T_TRANS3 + T_NEXTJS) / LOOP       # 0.908
P8 = 1.0

# KeyTimes for the 9-keyframe pattern (matching arifhaxn's approach)
KT = f"0.000;{P1:.3f};{P2:.3f};{P3:.3f};{P4:.3f};{P5:.3f};{P6:.3f};{P7:.3f};1.000"

# ── Dithering ─────────────────────────────────────────────────────────────

def floyd_steinberg(gray, threshold=DITHER_THRESHOLD):
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
    face_x, face_y = 495, 300
    left = max(0, face_x - crop_w // 2)
    top = max(0, face_y - 50)
    right = min(w, left + crop_w)
    bottom = min(h, top + crop_h)
    if right - left < crop_w: left = max(0, right - crop_w)
    if bottom - top < crop_h: top = max(0, bottom - crop_h)
    cropped = img.crop((left, top, right, bottom)).resize((PORTRAIT_W, PORTRAIT_H), Image.LANCZOS)
    gray = np.array(cropped.convert("L"), dtype=np.float64)
    low, high = np.percentile(gray, [1, 99])
    gray = np.clip((gray - low) / (high - low) * 255, 0, 255)
    blur = np.array(cropped.convert("L").filter(ImageFilter.GaussianBlur(3)), dtype=np.float64)
    gray = np.clip(gray + 1.4 * (gray - blur), 0, 255)
    gray = np.clip(128 + (gray - 128) * 1.3, 0, 255).astype(np.uint8)
    dots = floyd_steinberg(gray.astype(np.float64))
    dots_light = floyd_steinberg((255 - gray).astype(np.float64))
    return dots, dots_light, gray


# ── Logos ──────────────────────────────────────────────────────────────────

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


def points_to_path(pts):
    """Convert array of (x,y) points to SVG path string (horizontal runs)."""
    by_y = {}
    for x, y in pts:
        yi = int(round(y))
        if yi not in by_y:
            by_y[yi] = []
        by_y[yi].append(int(round(x)))
    parts = []
    for y in sorted(by_y.keys()):
        xs = sorted(set(by_y[y]))
        runs = []
        start = xs[0]
        end = xs[0]
        for x in xs[1:]:
            if x == end + 1:
                end = x
            else:
                runs.append((start, end))
                start = x
                end = x
        runs.append((start, end))
        for s, e in runs:
            if s == e:
                parts.append(f"M{s},{y}h1")
            else:
                parts.append(f"M{s},{y}h{e-s+1}")
    return "".join(parts)


# ── Info panel data ────────────────────────────────────────────────────────

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


def build_portrait_clusters(dots, color):
    """Build portrait dots as ~100 clusters, each with animateTransform.
    During logo phases, clusters scatter away from center. 
    During portrait phase, they return to form the face."""
    h, w = dots.shape
    coords = [(x, y) for y in range(h) for x in range(w) if dots[y, x]]
    positions = np.array(coords, dtype=np.float64)
    total = len(coords)
    
    np.random.seed(42)
    noise = np.random.RandomState(42).normal(0, 3.0, positions.shape)
    noisy = positions + noise
    cluster_idx = np.clip((noisy[:, 0] / w * 0.5 + noisy[:, 1] / h * 0.5) * N_CLUSTERS, 0, N_CLUSTERS - 1).astype(int)
    clusters = {i: [] for i in range(N_CLUSTERS)}
    for i, c in enumerate(cluster_idx):
        clusters[c].append(i)
    
    parts = []
    for ci in range(N_CLUSTERS):
        idxs = clusters.get(ci, [])
        if not idxs:
            continue
        # Compute cluster center
        cx, cy = positions[idxs].mean(axis=0)
        # Random scatter direction for logo phases
        scatter_angle = np.random.RandomState(ci + 100).uniform(0, 2 * np.pi)
        scatter_dist = np.random.RandomState(ci + 200).uniform(80, 200)
        dx = np.cos(scatter_angle) * scatter_dist
        dy = np.sin(scatter_angle) * scatter_dist
        
        pts = [(coords[idx][0], coords[idx][1]) for idx in idxs]
        d = points_to_path(pts)
        
        # SMIL animateTransform: 9 keyframes
        # 0:0 0 (portrait), 1:0 0, 2-7:dx dy (scatter), 8:0 0 (return)
        val_str = f"0 0;0 0;{dx:.1f} {dy:.1f};{dx:.1f} {dy:.1f};{dx:.1f} {dy:.1f};{dx:.1f} {dy:.1f};{dx:.1f} {dy:.1f};{dx:.1f} {dy:.1f};0 0"
        
        parts.append(
            f'<g>'
            f'<animateTransform attributeName="transform" type="translate" '
            f'values="{val_str}" '
            f'keyTimes="{KT}" '
            f'dur="{LOOP}s" repeatCount="indefinite" '
            f'calcMode="spline" '
            f'keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0 0 1 1;0 0 1 1;0 0 1 1;0 0 1 1;0.4 0 0.6 1;0.4 0 0.6 1"/>'
            f'<path d="{esc(d)}" '
            f'stroke="{color}" stroke-width="{DOT_SIZE}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges"/>'
            f'</g>'
        )
    return "".join(parts)


def build_logo_paths(color):
    """Build 3 static logo paths (Flutter, Python, Next.js) as SVG paths.
    Cross-faded via CSS keyframes."""
    logos = load_logo_paths()
    logo_pts = []
    for name, path_d in logos:
        pts = logo_to_point_cloud(path_d, 400, scale=min(PORTRAIT_W, PORTRAIT_H) * 0.3)
        pts[:, 0] += PORTRAIT_W // 2
        pts[:, 1] += PORTRAIT_H // 2
        logo_pts.append(pts)
    
    r = DOT_SIZE * 0.7
    parts = []
    for i, pts in enumerate(logo_pts):
        d = points_to_path([(int(round(x)), int(round(y))) for x, y in pts])
        parts.append(
            f'<path d="{esc(d)}" class="l{i}" '
            f'stroke="{color}" stroke-width="{r}" fill="none" '
            f'stroke-linecap="round" shape-rendering="crispEdges"/>'
        )
    return "".join(parts)


def build_intro_animation(dots, color):
    """Simple intro fade-in."""
    h, w = dots.shape
    coords = [(x, y) for y in range(h) for x in range(w) if dots[y, x]]
    indices = list(range(len(coords)))
    random.seed(42)
    random.shuffle(indices)
    n_groups = 30
    size = len(indices) // n_groups
    groups = [indices[i:i+size] for i in range(0, len(indices), size)]
    parts = []
    for gi in range(min(n_groups, len(groups))):
        idxs = groups[gi]
        if not idxs:
            continue
        pts = [(coords[idx][0], coords[idx][1]) for idx in idxs]
        d = points_to_path(pts)
        stagger = random.randint(0, 1500)
        dur = random.randint(200, 400)
        parts.append(
            f'<path d="{esc(d)}" class="ig{gi}" '
            f'stroke="{color}" stroke-width="{DOT_SIZE}" '
            f'stroke-linecap="square" fill="none" '
            f'shape-rendering="crispEdges" '
            f'style="opacity:0;animation:introIn{gi} {dur}ms {stagger}ms forwards"/>'
        )
    return "".join(parts)


def build_info_panel(data, is_dark=True):
    ch = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    tc = "#E0E0E0" if is_dark else "#1A1A2E"
    y = 40
    fs = 14
    ls = 23
    parts = []
    parts.append(
        f'<text x="0" y="{y}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'font-size="13" fill="{ch}" font-weight="bold">SYSTEM.INFO</text>')
    y += ls + 10
    parts.append(
        f'<rect x="0" y="{y-10}" width="42" height="16" rx="3" '
        f'fill="none" stroke="#FF3B30" stroke-width="1.5"/>'
        f'<text x="21" y="{y+1}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'font-size="12" fill="#FF3B30" text-anchor="middle" font-weight="bold">LIVE</text>'
        f'<circle cx="50" cy="{y-2}" r="3" fill="#FF3B30">'
        f'<animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite"/>'
        f'</circle>')
    y += ls + 5
    parts.append(
        f'<rect x="0" y="{y-12}" width="160" height="22" rx="11" '
        f'fill="{ch}" opacity="0.2"/>'
        f'<text x="80" y="{y+3}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'font-size="14" fill="{ch}" text-anchor="middle" font-weight="bold">Arnost55</text>')
    y += ls + 15
    parts.append(
        f'<line x1="0" y1="{y}" x2="{PANEL_W}" y2="{y}" '
        f'stroke="{ch}" stroke-width="0.5" opacity="0.3"/>')
    y += ls
    for label, value in data:
        lt = f"  {label}"
        vt = f" {esc(value)}"
        ld = max(0, int((PANEL_W - len(lt)*8 - len(vt)*8 - 20) / 12))
        line = f'{lt}{" " + "." * ld + " "}{vt}'
        parts.append(
            f'<text x="0" y="{y}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
            f'font-size="{fs}" fill="{tc}" '
            f'textLength="{PANEL_W}" lengthAdjust="spacingAndGlyphs">{esc(line)}</text>')
        y += ls
    return "".join(parts)


def build_terminal_border(is_dark=True):
    ch = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    bg = PALETTE["bg"] if is_dark else PALETTE["bg_light"]
    return (
        f'<rect x="0" y="0" width="{CANVAS_W}" height="{CANVAS_H}" '
        f'fill="{bg}" rx="12" stroke="{ch}" stroke-width="2"/>'
        f'<rect x="0" y="0" width="{CANVAS_W}" height="36" '
        f'fill="{ch}" opacity="0.1" rx="12"/>'
        f'<circle cx="12" cy="18" r="6" fill="#FF5F56" opacity="0.8"/>'
        f'<circle cx="32" cy="18" r="6" fill="#FFBD2E" opacity="0.8"/>'
        f'<circle cx="52" cy="18" r="6" fill="#27C93F" opacity="0.8"/>'
        f'<text x="{CANVAS_W//2}" y="24" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
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
        f'font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-size="11" '
        f'fill="{ch}" text-anchor="middle" opacity="0.6">VISUAL.MAP</text>'
    ), 15 + 10, 50 + 15


# ── Main banner generator ──────────────────────────────────────────────────

def generate_banner(dots, is_dark=True):
    ch = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    color = PALETTE["portrait_dark"] if is_dark else PALETTE["portrait_light"]
    bg = PALETTE["bg"] if is_dark else PALETTE["bg_light"]
    
    intro = build_intro_animation(dots, color)
    clusters = build_portrait_clusters(dots, color)
    logos = build_logo_paths(color)
    
    frame_svg, fx, fy = build_portrait_frame(is_dark)
    
    # CSS for logo cross-fade and intro
    p1_pct = int(P1 * 100)
    p2_pct = int(P2 * 100)
    p3_pct = int(P3 * 100)
    p4_pct = int(P4 * 100)
    p5_pct = int(P5 * 100)
    p6_pct = int(P6 * 100)
    p7_pct = int(P7 * 100)
    
    # Logo cross-fade: each logo is visible only during its phase
    # l0 = Flutter (visible P2-P3), l1 = Python (P4-P5), l2 = Next.js (P6-P7)
    css = (
        f'<style>'
        f'@keyframes l0f {{'
        f'0%{{opacity:0}}{p1_pct}%{{opacity:0}}'
        f'{p2_pct}%{{opacity:1}}{p3_pct}%{{opacity:1}}'
        f'{p4_pct}%{{opacity:0}}100%{{opacity:0}}'
        f'}}'
        f'@keyframes l1f {{'
        f'0%{{opacity:0}}{p3_pct}%{{opacity:0}}'
        f'{p4_pct}%{{opacity:1}}{p5_pct}%{{opacity:1}}'
        f'{p6_pct}%{{opacity:0}}100%{{opacity:0}}'
        f'}}'
        f'@keyframes l2f {{'
        f'0%{{opacity:0}}{p5_pct}%{{opacity:0}}'
        f'{p6_pct}%{{opacity:1}}{p7_pct}%{{opacity:1}}'
        f'100%{{opacity:0}}'
        f'}}'
        f'.l0{{animation:l0f {LOOP}s ease-in-out infinite}}'
        f'.l1{{animation:l1f {LOOP}s ease-in-out infinite}}'
        f'.l2{{animation:l2f {LOOP}s ease-in-out infinite}}'
        # Intro keyframes
        + "".join(f'@keyframes introIn{gi}{{to{{opacity:1}}}}' for gi in range(30))
        + "".join(f'.ig{gi}{{}}' for gi in range(30))
        + f'</style>'
    )
    
    # Overlay rect: hides portrait during logo phases (SMIL)
    overlay = (
        f'<rect x="0" y="0" width="{PORTRAIT_W}" height="{PORTRAIT_H}" '
        f'fill="{bg}" rx="4">'
        f'<animate attributeName="opacity" '
        f'values="0;0;1;1;0" '
        f'keyTimes="0;{P1:.4f};{P2:.4f};{P7:.4f};{P8:.4f}" '
        f'dur="{LOOP}s" repeatCount="indefinite"/>'
        f'</rect>'
    )
    
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{CANVAS_W}" height="{CANVAS_H}" '
        f'viewBox="0 0 {CANVAS_W} {CANVAS_H}" '
        f'font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'role="img" aria-label="Arnost Dobrucky — profile.sh --live">\n'
        f'{css}\n'
        f'{build_terminal_border(is_dark)}\n'
        f'{frame_svg}\n'
        f'<g transform="translate({fx},{fy})">\n'
        f'  <clipPath id="pc-{"d" if is_dark else "l"}">\n'
        f'    <rect x="0" y="0" width="{PORTRAIT_W}" height="{PORTRAIT_H}" rx="4"/>\n'
        f'  </clipPath>\n'
        f'  <g clip-path="url(#pc-{"d" if is_dark else "l"})">\n'
        f'    <!-- Intro -->\n{intro}\n'
        f'    <!-- Portrait clusters (scatter during logo phases) -->\n{clusters}\n'
        f'    <!-- Overlay (hides portrait during logos) -->\n{overlay}\n'
        f'    <!-- Logos (cross-faded) -->\n{logos}\n'
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