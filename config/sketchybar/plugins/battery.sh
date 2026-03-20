#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"

BATT=$(pmset -g batt | grep -o '[0-9]*%' | head -1 | tr -d '%')
CHARGING=$(pmset -g batt | grep -c 'AC Power')

if [[ "$CHARGING" -gt 0 ]]; then ICON=""; BATT_COLOR=$COLOR_TEAL
elif [[ "$BATT" -gt 80 ]]; then ICON=""; BATT_COLOR=$COLOR_GREEN
elif [[ "$BATT" -gt 60 ]]; then ICON=""; BATT_COLOR=$COLOR_GREEN
elif [[ "$BATT" -gt 40 ]]; then ICON=""; BATT_COLOR=$COLOR_YELLOW
elif [[ "$BATT" -gt 20 ]]; then ICON=""; BATT_COLOR=$COLOR_ORANGE
else ICON=""; BATT_COLOR=$COLOR_RED
fi

sketchybar --set battery icon="$ICON" label="${BATT:-?}%" \
  label.font="$FONT:Regular:$FONT_SIZE" icon.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$BATT_COLOR label.color=$BATT_COLOR
