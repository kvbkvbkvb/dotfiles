#!/bin/bash
source "$HOME/.config/sketchybar/config.sh"

POINTS=$(curl -sf "https://api.weather.gov/points/44.9778,-93.2650" 2>/dev/null)
FORECAST_URL=$(echo "$POINTS" | python3 -c "import sys,json; print(json.load(sys.stdin)['properties']['forecastHourly'])" 2>/dev/null)

if [[ -n "$FORECAST_URL" ]]; then
  FORECAST=$(curl -sf "$FORECAST_URL" 2>/dev/null)
  TEMP=$(echo "$FORECAST" | python3 -c "
import sys, json
d = json.load(sys.stdin)['properties']['periods'][0]
print(str(d['temperature']) + '°' + d['temperatureUnit'])
" 2>/dev/null)
  SHORT=$(echo "$FORECAST" | python3 -c "
import sys, json
f = json.load(sys.stdin)['properties']['periods'][0]['shortForecast'].lower()
print('St' if any(w in f for w in ['thunder','storm']) else 'S' if any(w in f for w in ['snow','flurr','wintry','sleet','ice']) else 'R' if any(w in f for w in ['rain','shower','drizzle']) else 'C')
" 2>/dev/null)
fi

sketchybar --set weather icon="" label="${TEMP:-N/A} (${SHORT:-?})" \
  label.font="$FONT:Regular:$FONT_SIZE" icon.font="$FONT:Regular:$FONT_SIZE" \
  icon.color=$COLOR_TEAL label.color=$COLOR_ORANGE
