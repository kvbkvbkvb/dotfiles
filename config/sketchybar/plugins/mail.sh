#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"

UNREAD=$(osascript -e 'tell application "Mail" to get unread count of inbox' 2>/dev/null)

if [[ "$UNREAD" -gt 0 ]]; then ICON=""; MAIL_COLOR=$COLOR_RED
else ICON=""; UNREAD=0; MAIL_COLOR=$COLOR_BLUE
fi

sketchybar --set mail icon="$ICON" label="$UNREAD" \
  label.font="$FONT:Regular:$FONT_SIZE" icon.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$MAIL_COLOR label.color=$MAIL_COLOR
