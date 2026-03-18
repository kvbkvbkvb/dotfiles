#!/usr/bin/env bash
# install.sh — bootstrap a brand new Mac from this dotfiles repo
# Usage: git clone <repo> ~/dotfiles && cd ~/dotfiles && ./install.sh
set -euo pipefail

DOTFILES="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$DOTFILES/config"

echo "╔═══════════════════════════════════════╗"
echo "║       kevbee dotfiles installer       ║"
echo "╚═══════════════════════════════════════╝"
echo ""

echo "==> Checking Xcode CLI tools..."
if ! xcode-select -p &>/dev/null; then
  echo "    Installing Xcode CLI tools..."
  xcode-select --install
  echo "    Follow the prompt, then re-run this script."
  exit 0
fi
echo "    OK"

echo ""
echo "==> Homebrew..."
if ! command -v brew &>/dev/null; then
  echo "    Installing Homebrew..."
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null || true
fi
echo "    OK"

echo ""
echo "==> Installing packages from Brewfile..."
if [[ -f "$DOTFILES/Brewfile" ]]; then
  brew bundle --file "$DOTFILES/Brewfile"
else
  echo "    [warn] No Brewfile found — skipping package install"
fi

make_link() {
  local dest="$1"
  local src="$2"

  if [[ ! -e "$dest" ]]; then
    echo "    [skip] $dest does not exist in dotfiles — skipping"
    return
  fi

  if [[ -L "$src" ]]; then
    echo "    [exists] $src already linked"
    return
  fi

  if [[ -e "$src" ]]; then
    echo "    [backup] $src → ${src}.bak"
    mv "$src" "${src}.bak"
  fi

  mkdir -p "$(dirname "$src")"
  ln -sf "$dest" "$src"
  echo "    [link] $src → $dest"
}

echo ""
echo "==> Linking configs..."

make_link "$CONFIG/yabai"       "$HOME/.config/yabai"
make_link "$CONFIG/skhd"        "$HOME/.config/skhd"
make_link "$CONFIG/sketchybar"  "$HOME/.config/sketchybar"

UBER_DEST="$HOME/Library/Application Support/Übersicht/widgets"
UBER_SRC="$CONFIG/ubersicht/widgets"
if [[ -d "$UBER_SRC" ]]; then
  mkdir -p "$HOME/Library/Application Support/Übersicht"
  if [[ -L "$UBER_DEST" ]]; then
    echo "    [exists] Übersicht widgets already linked"
  elif [[ -d "$UBER_DEST" ]]; then
    mv "$UBER_DEST" "${UBER_DEST}.bak"
    ln -sf "$UBER_SRC" "$UBER_DEST"
    echo "    [link] Übersicht widgets"
  else
    ln -sf "$UBER_SRC" "$UBER_DEST"
    echo "    [link] Übersicht widgets"
  fi
fi

echo ""
echo "==> Starting services..."

if command -v yabai &>/dev/null; then
  yabai --start-service 2>/dev/null && echo "    yabai started" || echo "    [warn] yabai start failed (may need SIP config)"
fi

if command -v skhd &>/dev/null; then
  skhd --start-service 2>/dev/null && echo "    skhd started" || echo "    [warn] skhd start failed"
fi

if command -v sketchybar &>/dev/null; then
  brew services start sketchybar 2>/dev/null && echo "    sketchybar started" || echo "    [warn] sketchybar start failed"
fi

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║              All done!                ║"
echo "╚═══════════════════════════════════════╝"
echo ""
echo "Manual steps:"
echo "  1. Install Übersicht from the Mac App Store"
echo "  2. Grant yabai Accessibility + Screen Recording permissions in System Settings"
echo "  3. Grant skhd Accessibility permissions"
echo "  4. If yabai SIP is required: csrutil enable --without debug --without fs"
echo ""
echo "Switch themes: ./switch-theme.sh [default|nord|gruvbox|catppuccin-latte]"
