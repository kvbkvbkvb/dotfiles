#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"
sketchybar --set clock icon="" label="$(date '+%I:%M %p')" \
  label.font="$FONT:Regular:$FONT_SIZE" icon.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$COLOR_PURPLE label.color=$COLOR_BLUE
