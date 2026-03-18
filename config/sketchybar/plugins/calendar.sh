#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"

RAW=$(icalBuddy -n -nc -sd -np -tf "%H:%M" eventsToday)
TYPE=$(echo "$RAW" | grep -v "^today" | grep -v "^--" | grep -v "^\s" | grep -v "^$" | head -1 | sed 's/.*: //' | sed 's/ (.*//' | xargs)
TIME24=$(echo "$RAW" | grep -E '^\s+[0-9]{2}:[0-9]{2} - [0-9]{2}:[0-9]{2}' | head -1 | xargs | cut -d' ' -f1)

TIME="$TIME24"
if [ -n "$TIME24" ]; then
  HOUR=$(echo "$TIME24" | cut -d: -f1)
  MIN=$(echo "$TIME24" | cut -d: -f2)
  SUFFIX="am"
  if [ "$HOUR" -ge 12 ]; then
    SUFFIX="pm"
    [ "$HOUR" -gt 12 ] && HOUR=$(expr $HOUR - 12)
  fi
  [ "$HOUR" -eq 0 ] && HOUR=12
  TIME="${HOUR}:${MIN}${SUFFIX}"
fi

[ -n "$TIME" ] && [ -n "$TYPE" ] && LABEL="$TIME $TYPE" || \
  { [ -n "$TYPE" ] && LABEL="$TYPE" || LABEL="No events"; }

sketchybar --set calendar icon="" label="$LABEL" \
  label.font="$FONT:Regular:$FONT_SIZE" icon.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$COLOR_YELLOW label.color=$COLOR_GREEN
