#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"

LABEL=""
if osascript -e 'tell application "Music" to get player state' 2>/dev/null | grep -q "playing"; then
  TRACK=$(osascript -e 'tell application "Music" to get name of current track' 2>/dev/null)
  ARTIST=$(osascript -e 'tell application "Music" to get artist of current track' 2>/dev/null)
  LABEL="$ARTIST — $TRACK"
elif osascript -e 'tell application "Spotify" to get player state' 2>/dev/null | grep -q "playing"; then
  TRACK=$(osascript -e 'tell application "Spotify" to get name of current track' 2>/dev/null)
  ARTIST=$(osascript -e 'tell application "Spotify" to get artist of current track' 2>/dev/null)
  LABEL="$ARTIST — $TRACK"
fi

[[ ${#LABEL} -gt 40 ]] && LABEL="${LABEL:0:37}..."

sketchybar --set nowplaying label="$LABEL" \
  label.font="$FONT:Regular:$FONT_SIZE" icon.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$COLOR_PINK label.color=$COLOR_PINK
