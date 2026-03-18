#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"

IP=$(ipconfig getifaddr en0 2>/dev/null)
if [[ -n "$IP" ]]; then ICON=""; LABEL="CONNECTED"; WIFI_COLOR=$COLOR_TEAL
else ICON=""; LABEL="Offline"; WIFI_COLOR=$COLOR_RED
fi

sketchybar --set wifi icon="$ICON" label="$LABEL" \
  icon.font="$FONT:Regular:$FONT_SIZE" label.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$WIFI_COLOR label.color=$WIFI_COLOR
