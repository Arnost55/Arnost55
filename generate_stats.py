#!/usr/bin/env python3
"""
Generate GitHub stats SVG cards using the GitHub API.
Outputs static SVG files that get committed to the repo — no Vercel needed.
"""

import json
import os
import sys
from datetime import datetime
from pathlib import Path

import requests

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
    """Fetch user data, repos, and contribution info."""
    user = gh_get(f"/users/{USERNAME}")
    repos = gh_get(f"/users/{USERNAME}/repos?per_page=100&sort=pushed")
    
    # Total stars
    total_stars = sum(r.get("stargazers_count", 0) for r in repos)
    
    # Total forks
    total_forks = sum(r.get("forks_count", 0) for r in repos)
    
    # Total commits across all repos (approximate via GitHub API)
    total_commits = 0
    for repo in repos[:20]:  # Check top 20 repos by push date
        try:
            commits = gh_get(f"/repos/{USERNAME}/{repo['name']}/commits?per_page=1&author={USERNAME}")
            if commits and isinstance(commits, list):
                # GitHub gives us a Link header with total count, but we can't easily get it
                # We'll use a rough estimate
                pass
        except Exception:
            pass
    
    # Language breakdown
    lang_bytes = {}
    for repo in repos:
        try:
            langs = gh_get(f"/repos/{USERNAME}/{repo['name']}/languages")
            for lang, size in langs.items():
                lang_bytes[lang] = lang_bytes.get(lang, 0) + size
        except Exception:
            pass
    
    # Sort by bytes
    total_bytes = sum(lang_bytes.values())
    sorted_langs = sorted(lang_bytes.items(), key=lambda x: -x[1])
    
    return {
        "public_repos": user.get("public_repos", 0),
        "followers": user.get("followers", 0),
        "following": user.get("following", 0),
        "total_stars": total_stars,
        "total_forks": total_forks,
        "created_at": user.get("created_at", ""),
        "languages": sorted_langs,
        "total_bytes": total_bytes,
        "avatar_url": user.get("avatar_url", ""),
    }


# ── SVG generation ──────────────────────────────────────────────────────────

def escape(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def generate_stats_card(stats, palette, dark=True):
    """Generate a GitHub stats SVG card."""
    p = palette
    mode = "dark" if dark else "light"
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <rect x="0.5" y="0.5" width="399" height="199" rx="8" fill="{p['bg']}" stroke="{p['border']}" stroke-width="1"/>
  <text x="20" y="30" font-family="Segoe UI, sans-serif" font-size="18" font-weight="700" fill="{p['title']}">GitHub Stats</text>
  <line x1="20" y1="40" x2="380" y2="40" stroke="{p['border']}" stroke-width="0.5" opacity="0.3"/>
  
  <g transform="translate(20, 65)">
    <text font-family="Segoe UI, sans-serif" font-size="14" fill="{p['icon']}">Repos:</text>
    <text x="160" font-family="Segoe UI, sans-serif" font-size="14" fill="{p['text']}" font-weight="600">{stats['public_repos']}</text>
  </g>
  <g transform="translate(20, 90)">
    <text font-family="Segoe UI, sans-serif" font-size="14" fill="{p['icon']}">Stars:</text>
    <text x="160" font-family="Segoe UI, sans-serif" font-size="14" fill="{p['text']}" font-weight="600">{stats['total_stars']}</text>
  </g>
  <g transform="translate(20, 115)">
    <text font-family="Segoe UI, sans-serif" font-size="14" fill="{p['icon']}">Forks:</text>
    <text x="160" font-family="Segoe UI, sans-serif" font-size="14" fill="{p['text']}" font-weight="600">{stats['total_forks']}</text>
  </g>
  <g transform="translate(20, 140)">
    <text font-family="Segoe UI, sans-serif" font-size="14" fill="{p['icon']}">Followers:</text>
    <text x="160" font-family="Segoe UI, sans-serif" font-size="14" fill="{p['text']}" font-weight="600">{stats['followers']}</text>
  </g>
  <g transform="translate(20, 165)">
    <text font-family="Segoe UI, sans-serif" font-size="14" fill="{p['icon']}">Following:</text>
    <text x="160" font-family="Segoe UI, sans-serif" font-size="14" fill="{p['text']}" font-weight="600">{stats['following']}</text>
  </g>
  
  <text x="380" y="190" font-family="Segoe UI, sans-serif" font-size="9" fill="{p['border']}" text-anchor="end" opacity="0.5">Updated {datetime.now().strftime('%Y-%m-%d')}</text>
</svg>'''
    return svg


def generate_langs_card(stats, palette, dark=True):
    """Generate a top languages SVG card."""
    p = palette
    mode = "dark" if dark else "light"
    
    top_langs = stats["languages"][:8]
    total = stats["total_bytes"] or 1
    
    # Colors for language bars
    lang_colors = ["#22D3EE", "#A78BFA", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"]
    
    bars = []
    y = 65
    for i, (lang, size) in enumerate(top_langs):
        pct = size / total * 100
        bar_w = max(pct * 2.8, 10)
        color = lang_colors[i % len(lang_colors)]
        bars.append(f'''  <g transform="translate(20, {y})">
    <text font-family="Segoe UI, sans-serif" font-size="12" fill="{p['text']}">{escape(lang)}</text>
    <rect x="160" y="-2" width="200" height="12" rx="6" fill="{p['bg']}" stroke="{p['border']}" stroke-width="0.5" opacity="0.3"/>
    <rect x="160" y="-2" width="{bar_w}" height="12" rx="6" fill="{color}"/>
    <text x="370" font-family="Segoe UI, sans-serif" font-size="11" fill="{p['text']}" text-anchor="end">{pct:.1f}%</text>
  </g>''')
        y += 22
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <rect x="0.5" y="0.5" width="399" height="199" rx="8" fill="{p['bg']}" stroke="{p['border']}" stroke-width="1"/>
  <text x="20" y="30" font-family="Segoe UI, sans-serif" font-size="18" font-weight="700" fill="{p['title']}">Top Languages</text>
  <line x1="20" y1="40" x2="380" y2="40" stroke="{p['border']}" stroke-width="0.5" opacity="0.3"/>
  
{chr(10).join(bars)}
  
  <text x="380" y="190" font-family="Segoe UI, sans-serif" font-size="9" fill="{p['border']}" text-anchor="end" opacity="0.5">Updated {datetime.now().strftime('%Y-%m-%d')}</text>
</svg>'''
    return svg


def generate_streak_card(stats, palette, dark=True):
    """Generate a streak-style SVG card using GitHub API data."""
    p = palette
    mode = "dark" if dark else "light"
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <rect x="0.5" y="0.5" width="399" height="199" rx="8" fill="{p['bg']}" stroke="{p['border']}" stroke-width="1"/>
  
  <text x="200" y="35" font-family="Segoe UI, sans-serif" font-size="16" font-weight="700" fill="{p['title']}" text-anchor="middle">Contribution Streak</text>
  <line x1="20" y1="45" x2="380" y2="45" stroke="{p['border']}" stroke-width="0.5" opacity="0.3"/>
  
  <g transform="translate(200, 85)">
    <text font-family="Segoe UI, sans-serif" font-size="36" font-weight="800" fill="{p['accent']}" text-anchor="middle">—</text>
    <text y="20" font-family="Segoe UI, sans-serif" font-size="12" fill="{p['text']}" text-anchor="middle">Total contributions</text>
  </g>
  
  <g transform="translate(80, 140)">
    <text font-family="Segoe UI, sans-serif" font-size="24" font-weight="700" fill="{p['text']}" text-anchor="middle">{stats['public_repos']}</text>
    <text y="18" font-family="Segoe UI, sans-serif" font-size="11" fill="{p['icon']}" text-anchor="middle">Repositories</text>
  </g>
  <g transform="translate(200, 140)">
    <text font-family="Segoe UI, sans-serif" font-size="24" font-weight="700" fill="{p['text']}" text-anchor="middle">{stats['total_stars']}</text>
    <text y="18" font-family="Segoe UI, sans-serif" font-size="11" fill="{p['icon']}" text-anchor="middle">Stars Earned</text>
  </g>
  <g transform="translate(320, 140)">
    <text font-family="Segoe UI, sans-serif" font-size="24" font-weight="700" fill="{p['text']}" text-anchor="middle">{stats['followers']}</text>
    <text y="18" font-family="Segoe UI, sans-serif" font-size="11" fill="{p['icon']}" text-anchor="middle">Followers</text>
  </g>
  
  <text x="380" y="190" font-family="Segoe UI, sans-serif" font-size="9" fill="{p['border']}" text-anchor="end" opacity="0.5">Updated {datetime.now().strftime('%Y-%m-%d')}</text>
</svg>'''
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
        
        cards = [
            ("stats", generate_stats_card),
            ("top-langs", generate_langs_card),
            ("streak", generate_streak_card),
        ]
        
        for name, func in cards:
            svg = func(stats, palette, dark)
            path = OUTPUT_DIR / f"{name}-{suffix}.svg"
            path.write_text(svg)
            print(f"  Written {path} ({len(svg)} bytes)")
    
    print("Done!")


if __name__ == "__main__":
    main()