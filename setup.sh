#!/usr/bin/env bash
# setup.sh — migrate THIS machine's configs into ~/dotfiles and symlink them back
set -euo pipefail

DOTFILES="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$DOTFILES/config"
BACKUP="$DOTFILES/backup-$(date +%Y%m%d-%H%M%S)"

echo "==> Dotfiles dir: $DOTFILES"

backup_and_link() {
  local src="$1"
  local dest="$2"

  if [[ -L "$src" ]]; then
    echo "    [skip] $src is already a symlink"
    return
  fi

  if [[ -e "$src" ]]; then
    echo "    [backup] $src → $BACKUP/"
    mkdir -p "$BACKUP/$(dirname "${dest#$CONFIG/}")"
    cp -R "$src" "$BACKUP/$(dirname "${dest#$CONFIG/}")" 2>/dev/null || true
    echo "    [copy]  $src → $dest"
    mkdir -p "$(dirname "$dest")"
    cp -R "$src" "$dest"
    rm -rf "$src"
  fi

  echo "    [link]  $src → $dest"
  mkdir -p "$(dirname "$src")"
  ln -sf "$dest" "$src"
}

echo ""
echo "==> Generating Brewfile..."
if command -v brew &>/dev/null; then
  brew bundle dump --force --file "$DOTFILES/Brewfile"
  echo "    Brewfile saved."
else
  echo "    [skip] Homebrew not found"
fi

echo ""
echo "==> yabai"
backup_and_link "$HOME/.config/yabai" "$CONFIG/yabai"

echo ""
echo "==> skhd"
backup_and_link "$HOME/.config/skhd" "$CONFIG/skhd"
if [[ -L "$HOME/.skhdrc" ]]; then
  rm "$HOME/.skhdrc"
  echo "    [removed] stale ~/.skhdrc symlink"
fi

echo ""
echo "==> sketchybar"
backup_and_link "$HOME/.config/sketchybar" "$CONFIG/sketchybar"

echo ""
echo "==> Übersicht widgets"
UBER_SRC="$HOME/Library/Application Support/Übersicht/widgets"
UBER_DEST="$CONFIG/ubersicht/widgets"
backup_and_link "$UBER_SRC" "$UBER_DEST"

echo ""
echo "Done! Your configs are now managed from:"
echo "  $CONFIG"
echo ""
echo "To switch themes: ./switch-theme.sh [theme-name]"
echo "Available themes: $(ls "$DOTFILES/themes" | tr '\n' ' ')"
if [[ -d "$BACKUP" ]]; then
  echo ""
  echo "Originals backed up to: $BACKUP"
fi
