#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"

SPACES=$(yabai -m query --spaces 2>/dev/null)
[[ -z "$SPACES" ]] && { sketchybar --set spaces label="●"; exit 0; }

DISPLAY=$(echo "$SPACES" | python3 -c "
import sys, json
spaces = json.load(sys.stdin)
out = ['●' if s.get('has-focus') else '○' for s in spaces]
print('  '.join(out))
" 2>/dev/null)

sketchybar --set spaces label="${DISPLAY:-●}" \
  label.font="$FONT:Regular:$FONT_SIZE" icon.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$COLOR_YELLOW label.color=$COLOR_YELLOW
