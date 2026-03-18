#!/usr/bin/env sh

YABAI=/opt/homebrew/bin/yabai

WIN_COUNT=$($YABAI -m query --windows --space 2>/dev/null \
  | /usr/bin/python3 -c "import sys,json; print(len([w for w in json.load(sys.stdin) if not w.get('is-floating',False)]))" 2>/dev/null)

[ -z "$WIN_COUNT" ] && exit 0

if [ "$WIN_COUNT" -le 1 ]; then
  PADS=$($YABAI -m query --displays --display 2>/dev/null \
    | /usr/bin/python3 -c "
import sys, json
d = json.load(sys.stdin)
w = d['frame']['w']
h = d['frame']['h']
print(int(w * 0.10), int((h - 50) * 0.10))
" 2>/dev/null)
  PAD_H=$(echo "$PADS" | cut -d' ' -f1)
  PAD_V=$(echo "$PADS" | cut -d' ' -f2)
  $YABAI -m config left_padding   "${PAD_H:-12}"
  $YABAI -m config right_padding  "${PAD_H:-12}"
  $YABAI -m config top_padding    "${PAD_V:-12}"
  $YABAI -m config bottom_padding "${PAD_V:-12}"
else
  $YABAI -m config left_padding   12
  $YABAI -m config right_padding  12
  $YABAI -m config top_padding    12
  $YABAI -m config bottom_padding 12
fi
