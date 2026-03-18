#!/usr/bin/env bash
# switch-theme.sh — swap sketchybar color theme and reload bar
set -euo pipefail

DOTFILES_DIR="$(cd "$(dirname "$0")" && pwd)"
THEMES_DIR="$DOTFILES_DIR/themes"
COLORS_DEST="$DOTFILES_DIR/config/sketchybar/sketchybar/colors.lua"

if [[ $# -ge 1 ]]; then
  THEME="$1"
else
  available=($(ls "$THEMES_DIR"))
  if command -v fzf &>/dev/null; then
    THEME=$(printf '%s\n' "${available[@]}" | fzf --prompt="Theme: " --height=10 --border)
  else
    echo "Available themes:"
    for i in "${!available[@]}"; do
      echo "  $((i+1))) ${available[$i]}"
    done
    printf "Choose (1-${#available[@]}): "
    read -r choice
    THEME="${available[$((choice-1))]}"
  fi
fi

THEME_FILE="$THEMES_DIR/$THEME/colors.lua"
if [[ ! -f "$THEME_FILE" ]]; then
  echo "Error: theme '$THEME' not found at $THEME_FILE" >&2
  echo "Available themes: $(ls "$THEMES_DIR" | tr '\n' ' ')" >&2
  exit 1
fi

cp "$COLORS_DEST" "$COLORS_DEST.bak"
cp "$THEME_FILE" "$COLORS_DEST"
echo "Applied theme: $THEME"

if pgrep -x sketchybar &>/dev/null; then
  sketchybar --reload
  echo "Sketchybar reloaded."
else
  echo "Sketchybar is not running — theme will apply on next start."
fi
