#!/usr/bin/env python3
"""
Generate GitHub stats SVG cards using the GitHub API.
Outputs static SVG files that get committed to the repo.
Larger, readable cards with proper spacing.
"""

import os
from datetime import datetime
from pathlib import Path

import requests
import numpy as np

# ── Config ──────────────────────────────────────────────────────────────────

USERNAME = "Arnost55"
OUTPUT_DIR = Path("stats")

PALETTE_DARK = {
    "bg": "#0A101F",
    "title": "#22D3EE",
    "text": "#E0E0E0",
    "icon": "#A78BFA",
    "border": "#22D3EE",
    "accent": "#10B981",
}

PALETTE_LIGHT = {
    "bg": "#F0F0F0",
    "title": "#0891B2",
    "text": "#1A1A2E",
    "icon": "#7C3AED",
    "border": "#0891B2",
    "accent": "#10B981",
}

# Bigger card dimensions
CARD_W = 500
CARD_H = 280

# ── API ─────────────────────────────────────────────────────────────────────

HEADERS = {"Accept": "application/vnd.github.v3+json"}
token = os.environ.get("GH_PAT")
if token:
    HEADERS["Authorization"] = f"Bearer {token}"


def gh_get(path):
    url = f"https://api.github.com{path}"
    r = requests.get(url, headers=HEADERS, timeout=15)
    r.raise_for_status()
    return r.json()


def get_user_stats():
    user = gh_get(f"/users/{USERNAME}")
    repos = gh_get(f"/users/{USERNAME}/repos?per_page=100&sort=pushed")
    total_stars = sum(r.get("stargazers_count", 0) for r in repos)
    total_forks = sum(r.get("forks_count", 0) for r in repos)
    lang_bytes = {}
    for repo in repos:
        try:
            langs = gh_get(f"/repos/{USERNAME}/{repo['name']}/languages")
            for lang, size in langs.items():
                lang_bytes[lang] = lang_bytes.get(lang, 0) + size
        except Exception:
            pass
    total_bytes = sum(lang_bytes.values())
    sorted_langs = sorted(lang_bytes.items(), key=lambda x: -x[1])
    return {
        "public_repos": user.get("public_repos", 0),
        "followers": user.get("followers", 0),
        "following": user.get("following", 0),
        "total_stars": total_stars,
        "total_forks": total_forks,
        "languages": sorted_langs,
        "total_bytes": total_bytes or 1,
    }


# ── SVG generation ──────────────────────────────────────────────────────────

def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def generate_stats_card(stats, palette, dark=True):
    p = palette
    w, h = CARD_W, CARD_H
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
        f'<rect x="0.5" y="0.5" width="{w-1}" height="{h-1}" rx="10" '
        f'fill="{p["bg"]}" stroke="{p["border"]}" stroke-width="1.5"/>\n'
        f'<text x="25" y="40" font-family="Segoe UI,sans-serif" font-size="22" '
        f'font-weight="700" fill="{p["title"]}">GitHub Stats</text>\n'
        f'<line x1="25" y1="55" x2="{w-25}" y2="55" stroke="{p["border"]}" stroke-width="0.5" opacity="0.3"/>\n'
        # Stats in 2 columns
        f'<g transform="translate(35, 85)">\n'
        f'  <text font-family="Segoe UI,sans-serif" font-size="18" fill="{p["icon"]}">Repos:</text>\n'
        f'  <text x="180" font-family="Segoe UI,sans-serif" font-size="18" fill="{p["text"]}" font-weight="600">{stats["public_repos"]}</text>\n'
        f'</g>\n'
        f'<g transform="translate(35, 120)">\n'
        f'  <text font-family="Segoe UI,sans-serif" font-size="18" fill="{p["icon"]}">Stars:</text>\n'
        f'  <text x="180" font-family="Segoe UI,sans-serif" font-size="18" fill="{p["text"]}" font-weight="600">{stats["total_stars"]}</text>\n'
        f'</g>\n'
        f'<g transform="translate(35, 155)">\n'
        f'  <text font-family="Segoe UI,sans-serif" font-size="18" fill="{p["icon"]}">Forks:</text>\n'
        f'  <text x="180" font-family="Segoe UI,sans-serif" font-size="18" fill="{p["text"]}" font-weight="600">{stats["total_forks"]}</text>\n'
        f'</g>\n'
        f'<g transform="translate(280, 85)">\n'
        f'  <text font-family="Segoe UI,sans-serif" font-size="18" fill="{p["icon"]}">Followers:</text>\n'
        f'  <text x="180" font-family="Segoe UI,sans-serif" font-size="18" fill="{p["text"]}" font-weight="600">{stats["followers"]}</text>\n'
        f'</g>\n'
        f'<g transform="translate(280, 120)">\n'
        f'  <text font-family="Segoe UI,sans-serif" font-size="18" fill="{p["icon"]}">Following:</text>\n'
        f'  <text x="180" font-family="Segoe UI,sans-serif" font-size="18" fill="{p["text"]}" font-weight="600">{stats["following"]}</text>\n'
        f'</g>\n'
        f'<text x="{w-25}" y="{h-15}" font-family="Segoe UI,sans-serif" font-size="11" '
        f'fill="{p["border"]}" text-anchor="end" opacity="0.5">Updated {datetime.now().strftime("%Y-%m-%d")}</text>\n'
        f'</svg>'
    )
    return svg


def generate_langs_card(stats, palette, dark=True):
    p = palette
    w, h = CARD_W, CARD_H
    top_langs = stats["languages"][:10]
    total = stats["total_bytes"]
    lang_colors = ["#22D3EE", "#A78BFA", "#10B981", "#F59E0B", "#EF4444",
                   "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#6366F1"]
    bars = []
    y = 80
    for i, (lang, size) in enumerate(top_langs):
        pct = size / total * 100
        bar_w = max(pct * 3.0, 15)
        color = lang_colors[i % len(lang_colors)]
        bars.append(
            f'<g transform="translate(25, {y})">\n'
            f'  <text font-family="Segoe UI,sans-serif" font-size="16" fill="{p["text"]}">{esc(lang)}</text>\n'
            f'  <rect x="200" y="-4" width="250" height="18" rx="4" '
            f'fill="{p["bg"]}" stroke="{p["border"]}" stroke-width="0.5" opacity="0.3"/>\n'
            f'  <rect x="200" y="-4" width="{bar_w}" height="18" rx="4" fill="{color}"/>\n'
            f'  <text x="465" font-family="Segoe UI,sans-serif" font-size="15" '
            f'fill="{p["text"]}" text-anchor="end">{pct:.1f}%</text>\n'
            f'</g>'
        )
        y += 28
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
        f'<rect x="0.5" y="0.5" width="{w-1}" height="{h-1}" rx="10" '
        f'fill="{p["bg"]}" stroke="{p["border"]}" stroke-width="1.5"/>\n'
        f'<text x="25" y="40" font-family="Segoe UI,sans-serif" font-size="22" '
        f'font-weight="700" fill="{p["title"]}">Top Languages</text>\n'
        f'<line x1="25" y1="55" x2="{w-25}" y2="55" stroke="{p["border"]}" stroke-width="0.5" opacity="0.3"/>\n'
        f'{"".join(bars)}\n'
        f'<text x="{w-25}" y="{h-15}" font-family="Segoe UI,sans-serif" font-size="11" '
        f'fill="{p["border"]}" text-anchor="end" opacity="0.5">Updated {datetime.now().strftime("%Y-%m-%d")}</text>\n'
        f'</svg>'
    )
    return svg


def generate_streak_card(stats, palette, dark=True):
    p = palette
    w, h = CARD_W, CARD_H
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
        f'<rect x="0.5" y="0.5" width="{w-1}" height="{h-1}" rx="10" '
        f'fill="{p["bg"]}" stroke="{p["border"]}" stroke-width="1.5"/>\n'
        f'<text x="{w//2}" y="40" font-family="Segoe UI,sans-serif" font-size="22" '
        f'font-weight="700" fill="{p["title"]}" text-anchor="middle">Contribution Overview</text>\n'
        f'<line x1="25" y1="55" x2="{w-25}" y2="55" stroke="{p["border"]}" stroke-width="0.5" opacity="0.3"/>\n'
        # 3 columns
        f'<g transform="translate({w//6}, 130)">\n'
        f'  <text font-family="Segoe UI,sans-serif" font-size="40" font-weight="800" '
        f'fill="{p["accent"]}" text-anchor="middle">{stats["public_repos"]}</text>\n'
        f'  <text y="28" font-family="Segoe UI,sans-serif" font-size="16" '
        f'fill="{p["icon"]}" text-anchor="middle">Repositories</text>\n'
        f'</g>\n'
        f'<g transform="translate({w//2}, 130)">\n'
        f'  <text font-family="Segoe UI,sans-serif" font-size="40" font-weight="800" '
        f'fill="{p["accent"]}" text-anchor="middle">{stats["total_stars"]}</text>\n'
        f'  <text y="28" font-family="Segoe UI,sans-serif" font-size="16" '
        f'fill="{p["icon"]}" text-anchor="middle">Stars Earned</text>\n'
        f'</g>\n'
        f'<g transform="translate({w*5//6}, 130)">\n'
        f'  <text font-family="Segoe UI,sans-serif" font-size="40" font-weight="800" '
        f'fill="{p["accent"]}" text-anchor="middle">{stats["followers"]}</text>\n'
        f'  <text y="28" font-family="Segoe UI,sans-serif" font-size="16" '
        f'fill="{p["icon"]}" text-anchor="middle">Followers</text>\n'
        f'</g>\n'
        f'<text x="{w-25}" y="{h-15}" font-family="Segoe UI,sans-serif" font-size="11" '
        f'fill="{p["border"]}" text-anchor="end" opacity="0.5">Updated {datetime.now().strftime("%Y-%m-%d")}</text>\n'
        f'</svg>'
    )
    return svg


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    print(f"Fetching stats for {USERNAME}...")
    stats = get_user_stats()
    print(f"  Repos: {stats['public_repos']}, Stars: {stats['total_stars']}, Forks: {stats['total_forks']}")
    print(f"  Languages: {len(stats['languages'])} detected")
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for dark, palette in [(True, PALETTE_DARK), (False, PALETTE_LIGHT)]:
        suffix = "dark" if dark else "light"
        for name, func in [("stats", generate_stats_card), ("top-langs", generate_langs_card), ("streak", generate_streak_card)]:
            svg = func(stats, palette, dark)
            path = OUTPUT_DIR / f"{name}-{suffix}.svg"
            path.write_text(svg)
            print(f"  Written {path} ({len(svg)} bytes)")
    print("Done!")


if __name__ == "__main__":
    main()