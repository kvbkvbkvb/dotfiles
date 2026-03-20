#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"

CPU=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d% -f1 | cut -d. -f1)

if [[ "${CPU:-0}" -ge 80 ]]; then CPU_COLOR=$COLOR_RED
elif [[ "${CPU:-0}" -ge 60 ]]; then CPU_COLOR=$COLOR_ORANGE
elif [[ "${CPU:-0}" -ge 30 ]]; then CPU_COLOR=$COLOR_YELLOW
else CPU_COLOR=$COLOR_GREEN
fi

sketchybar --set cpu icon="" label="${CPU:-0}%" \
  label.font="$FONT:Regular:$FONT_SIZE" icon.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$CPU_COLOR label.color=$CPU_COLOR
