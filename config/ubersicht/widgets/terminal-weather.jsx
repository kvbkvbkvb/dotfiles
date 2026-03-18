export const command = `python3 -c "
import urllib.request, json
try:
    with urllib.request.urlopen('https://api.weather.gov/points/44.9778,-93.2650') as r:
        points = json.load(r)
    with urllib.request.urlopen(points['properties']['forecastHourly']) as r:
        forecast = json.load(r)
    p = forecast['properties']['periods'][0]
    temp = str(p['temperature']) + chr(176) + p['temperatureUnit']
    tempF = p['temperature']
    short = p['shortForecast'].lower()
    ws = p.get('windSpeed', '')
    wd = p.get('windDirection', '')
    if any(w in short for w in ['thunder','storm']): code='St'
    elif any(w in short for w in ['snow','flurr','wintry','sleet','ice']): code='S'
    elif any(w in short for w in ['rain','shower','drizzle']): code='R'
    else: code='C'
    print(json.dumps({'temp':temp,'tempF':tempF,'code':code,'windSpeed':ws,'windDirection':wd}, ensure_ascii=False))
except:
    print(json.dumps({'temp':'N/A','tempF':32,'code':'?','windSpeed':'N/A','windDirection':''}))
"`

export const refreshFrequency = 1800000

export const className = `
  text-transform: uppercase;
  top: 372px; right: 171px; width: 340px; height: 0px;
  --bg: #ffffff; --bg2: #f2f2f7; --border: #e5e5ea; --text: #000000; --text2: #6e6e73;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #6B9FFF; --indigo: #7B82FF; --purple: #BB66DD; --pink: #FF4488;
  @media (prefers-color-scheme: dark) {
    --bg: #1c1c1e; --bg2: #2c2c2e; --border: #3a3a3c; --text: #ffffff; --text2: #8e8e93;
  }
`

function bar(pct, width = 14) {
  const n = Math.max(0, Math.min(width, Math.round((pct / 100) * width)))
  return '[' + '█'.repeat(n) + '░'.repeat(width - n) + ']'
}

function Window({ title, children }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden', fontFamily: 'Share Tech Mono, monospace', fontSize: 16, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3px 14px 4px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ color: 'var(--border)', fontSize: 14 }}>─ </span>
        <span style={{ color: 'var(--blue)', fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: '10px 14px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>{children}</div>
    </div>
  )
}

const CODE_COLOR = { C: 'var(--green)', R: 'var(--teal)', S: 'var(--blue)', St: 'var(--red)', '?': 'var(--text2)' }

export const render = ({ output }) => {
  let temp = 'N/A', tempF = 32, code = '?', windSpeed = 'N/A', windDirection = ''
  try { const d = JSON.parse(output); temp = d.temp || temp; tempF = typeof d.tempF === 'number' ? d.tempF : tempF; code = d.code || code; windSpeed = d.windSpeed || windSpeed; windDirection = d.windDirection || windDirection } catch(e) {}
  const tempPct = ((tempF + 20) / 130) * 100
  return (
    <Window title="weather">
      <div style={{ fontSize: 16, marginBottom: 8 }}>
        <span style={{ color: 'var(--orange)' }}>{temp}</span>{'  '}
        <span style={{ color: CODE_COLOR[code] || 'var(--text2)' }}>({code})</span>
      </div>
      <div style={{ fontSize: 16, marginBottom: 8 }}>
        <span style={{ color: 'var(--blue)' }}>temp  </span>
        <span style={{ color: 'var(--purple)' }}>{bar(tempPct)}</span>
      </div>
      <div style={{ fontSize: 13 }}>
        <span style={{ color: 'var(--teal)' }}>wind  </span>
        <span style={{ color: 'var(--orange)' }}>{windSpeed}{windDirection ? ' ' + windDirection : ''}</span>
      </div>
    </Window>
  )
}
