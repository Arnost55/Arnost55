#!/usr/bin/env python3
"""
Generate clean, readable GitHub profile banner SVG.
Terminal-style info card — no animation, no portrait, just readable data.
"""

from pathlib import Path

# ── Config ─────────────────────────────────────────────────────────────────

CANVAS_W = 1180
CANVAS_H = 700
PANEL_X = 15
PANEL_W = CANVAS_W - 60

PALETTE = {
    "ui_chrome_dark": "#22D3EE",
    "ui_chrome_light": "#0891B2",
    "accent": "#10B981",
    "bg": "#0A101F",
    "bg_light": "#F0F0F0",
    "text_dark": "#E0E0E0",
    "text_light": "#1A1A2E",
}

# ── Data ───────────────────────────────────────────────────────────────────

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


# ── SVG generators ─────────────────────────────────────────────────────────

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_info_panel(data, is_dark=True):
    ch = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    tc = PALETTE["text_dark"] if is_dark else PALETTE["text_light"]
    bg = PALETTE["bg"] if is_dark else PALETTE["bg_light"]
    margin = 40
    y = margin
    fs = 20
    ls = 38
    cw = 11.0

    parts = []

    # Header row: SYSTEM.INFO + LIVE badge + handle
    parts.append(
        f'<text x="0" y="{y}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'font-size="22" fill="{ch}" font-weight="bold">SYSTEM.INFO</text>'
        f'<rect x="200" y="{y-18}" width="72" height="26" rx="5" '
        f'fill="none" stroke="#FF3B30" stroke-width="2"/>'
        f'<text x="236" y="{y+1}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'font-size="18" fill="#FF3B30" text-anchor="middle" font-weight="bold">LIVE</text>'
        f'<circle cx="286" cy="{y-5}" r="5" fill="#FF3B30">'
        f'<animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite"/>'
        f'</circle>'
        f'<rect x="320" y="{y-18}" width="200" height="28" rx="14" '
        f'fill="{ch}" opacity="0.15"/>'
        f'<text x="420" y="{y+1}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'font-size="20" fill="{ch}" text-anchor="middle" font-weight="bold">Arnost55</text>'
    )
    y += ls + 15

    # Separator
    parts.append(
        f'<line x1="0" y1="{y}" x2="{PANEL_W}" y2="{y}" '
        f'stroke="{ch}" stroke-width="1" opacity="0.3"/>'
    )
    y += ls

    # Data rows
    for label, value in data:
        lt = f"  {label}"
        vt = f" {esc(value)}"
        label_len = len(lt) * cw
        val_len = len(vt) * cw
        available = PANEL_W - label_len - val_len - 20
        ld = max(3, int(available / (cw * 1.5)))
        line = f'{lt}{" " + "." * ld + " "}{vt}'
        parts.append(
            f'<text x="0" y="{y}" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
            f'font-size="{fs}" fill="{tc}" '
            f'textLength="{PANEL_W}" lengthAdjust="spacingAndGlyphs">{esc(line)}</text>'
        )
        y += ls

    return "".join(parts)


def build_terminal_border(is_dark=True):
    ch = PALETTE["ui_chrome_dark"] if is_dark else PALETTE["ui_chrome_light"]
    bg = PALETTE["bg"] if is_dark else PALETTE["bg_light"]
    return (
        f'<rect x="0" y="0" width="{CANVAS_W}" height="{CANVAS_H}" '
        f'fill="{bg}" rx="14" stroke="{ch}" stroke-width="2.5"/>'
        f'<rect x="0" y="0" width="{CANVAS_W}" height="42" '
        f'fill="{ch}" opacity="0.08" rx="14"/>'
        f'<circle cx="18" cy="21" r="7" fill="#FF5F56" opacity="0.9"/>'
        f'<circle cx="42" cy="21" r="7" fill="#FFBD2E" opacity="0.9"/>'
        f'<circle cx="66" cy="21" r="7" fill="#27C93F" opacity="0.9"/>'
        f'<text x="{CANVAS_W//2}" y="28" font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'font-size="18" fill="{ch}" text-anchor="middle" opacity="0.8">'
        f'profile.sh --live</text>'
    )


# ── Main banner generator ──────────────────────────────────────────────────

def generate_banner(is_dark=True):
    bg = PALETTE["bg"] if is_dark else PALETTE["bg_light"]

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'width="{CANVAS_W}" height="{CANVAS_H}" '
        f'viewBox="0 0 {CANVAS_W} {CANVAS_H}" '
        f'font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" '
        f'role="img" aria-label="Arnost Dobrucky — profile">\n'
        f'{build_terminal_border(is_dark)}\n'
        f'<g transform="translate({PANEL_X}, 25)">\n'
        f'{build_info_panel(build_info_data(), is_dark)}\n'
        f'</g>\n'
        f'</svg>'
    )
    return svg


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    print("Generating dark.svg...")
    dark_svg = generate_banner(is_dark=True)
    Path("dark.svg").write_text(dark_svg)
    print(f"dark.svg written ({len(dark_svg)} bytes)")
    print("Generating light.svg...")
    light_svg = generate_banner(is_dark=False)
    Path("light.svg").write_text(light_svg)
    print(f"light.svg written ({len(light_svg)} bytes)")
    print("Done!")


if __name__ == "__main__":
    main()