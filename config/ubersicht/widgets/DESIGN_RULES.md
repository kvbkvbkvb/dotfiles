# Übersicht Widget Design Rules

A reference document for the visual language used across all widgets.

---

## Typography

- **Primary font**: Share Tech Mono (loaded via `userMain.css`)
- **Text transform**: `uppercase` on all terminal widgets
- **Font weight**: normal (400) only
- **Font sizes**: 9-10px decorative, 11-12px labels, 13-14px secondary, 15-16px primary content

---

## Color Palette

### Base Colors
```
Light: --bg:#ffffff  --bg2:#f2f2f7  --border:#e5e5ea  --text:#000000  --text2:#6e6e73
Dark:  --bg:#1c1c1e  --bg2:#2c2c2e  --border:#3a3a3c  --text:#ffffff  --text2:#8e8e93
```

### Semantic Colors (constant across modes)
```
--red:#FF5555  --orange:#FF9838  --yellow:#FFD02A  --green:#6ECD6B
--teal:#5EE0D4  --blue:#3B82F7  --indigo:#7B82FF  --purple:#BB66DD  --pink:#FF4488
```

### Color Usage
| Color | Use |
|-------|-----|
| Red | Critical, high CPU ≥50%, errors |
| Orange | Warnings, medium CPU 20-50% |
| Yellow | Moderate alerts, CPU 5-20% |
| Green | Good/safe, CPU <5%, battery ≥80% |
| Teal | Network RX, rain weather |
| Blue | Primary accent, time, titles |
| Indigo | Section headers, disk labels |
| Purple | Memory, secondary accents |
| Pink | Now-playing, EQ bars (dark) |

---

## Layout

- Widget widths: 340px standard, 680px wide, dynamic for StatBar
- Window border-radius: 8px
- Window header padding: `3px 14px 4px`
- Window content padding: `8px 14px 10px`
- No shadows, no bold text

---

## Data Visualization

- Progress bars: `[█████░░░░░]` — filled `█`, empty `░`
- Sparklines: `▁▂▃▄▅▆▇█` characters, normalized to max
- Dividers: `─` repeated with embedded label

---

## Animations

- Cursor blink (clock): `▌` opacity 1→0→1, 1s step-end infinite
- EQ bars (nowplaying): 10 bars, height 3→14px, 0.70-1.20s ease-in-out, staggered delays

---

## Refresh Frequencies

| Widget | Interval |
|--------|----------|
| System stats | 2000-3000ms |
| Clock | 10000ms |
| Weather | 1,800,000ms (30 min) |
| Word of the day | 3,600,000ms (1 hr) |
| Shortcuts | false (static) |
