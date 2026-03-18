export const command = `python3 -c "
import subprocess, json, os, time
from datetime import datetime
now = datetime.now()
time_str = now.strftime('%I:%M %p').lstrip('0')
date_str = now.strftime('%A, %B %d %Y')
try:
    out = subprocess.check_output(
        ['icalBuddy','-n','-nc','-nrd','-iep','title,datetime','-df','%a %b %d','-tf','%I:%M %p','-b','\u2022 ','-ps','|','eventsToday+2'],
        text=True, stderr=subprocess.DEVNULL
    ).strip()
    events = [l for l in out.split(chr(10)) if l.strip().startswith(chr(8226))][:3]
except:
    events = []
wx = {'temp': 'N/A', 'temp_pct': 0, 'code': '?', 'wind': 'N/A'}
try:
    WX_CACHE = '/tmp/ss_wx.json'
    if os.path.exists(WX_CACHE):
        with open(WX_CACHE) as f:
            wc = json.load(f)
        if time.time() - wc.get('t', 0) < 1800:
            wx = wc.get('wx', wx)
except:
    pass
print(json.dumps({'time': time_str, 'date': date_str, 'events': events, 'wx': wx}, ensure_ascii=False))
"`

export const refreshFrequency = 10000

export const className = `
  text-transform: uppercase;
  top: 156px; right: 171px; width: 340px; height: 260px;
  --bg: #ffffff; --bg2: #f2f2f7; --border: #e5e5ea; --text: #000000; --text2: #6e6e73;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #6B9FFF; --indigo: #7B82FF; --purple: #BB66DD; --pink: #FF4488;
  @media (prefers-color-scheme: dark) {
    --bg: #1c1c1e; --bg2: #2c2c2e; --border: #3a3a3c; --text: #ffffff; --text2: #8e8e93;
  }
`

const cursorCss = `@keyframes dt-blink { 0%,100%{opacity:1} 50%{opacity:0} } .dt-cursor { animation: dt-blink 1s step-end infinite; color: var(--blue); }`

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

function bar(pct, width = 14) {
  const n = Math.max(0, Math.min(width, Math.round((pct / 100) * width)))
  return '[' + '█'.repeat(n) + '░'.repeat(width - n) + ']'
}

const WX_COLOR = { C: 'var(--green)', R: 'var(--teal)', S: 'var(--blue)', St: 'var(--red)', '?': 'var(--text2)' }

export const render = ({ output }) => {
  let time = '--:-- --', date = '---', events = [], wx = {}
  try { const d = JSON.parse(output); time = d.time || time; date = d.date || date; events = d.events || []; wx = d.wx || {} } catch(e) {}
  return (
    <Window title="clock">
      <style>{cursorCss}</style>
      <div style={{ fontSize: 16, color: 'var(--blue)' }}>{time}<span className="dt-cursor">▌</span></div>
      <div style={{ fontSize: 16, color: 'var(--pink)', marginTop: 2 }}>{date}</div>
      <div style={{ fontSize: 14, color: 'var(--border)', margin: '6px 0' }}>─────────────────────────────────</div>
      {events.length === 0 ? (
        <div style={{ fontSize: 16, color: 'var(--purple)' }}>no upcoming events</div>
      ) : (
        events.map((line, i) => {
          const rest = line.replace(/^•\s*/, '')
          const parts = rest.split('|')
          const title = parts[0]?.trim() || rest
          const evtTime = parts[1]?.trim() || ''
          return (
            <div key={i} style={{ marginBottom: i < events.length - 1 ? 4 : 0 }}>
              <div style={{ fontSize: 16, color: 'var(--yellow)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>• {title}</div>
              {evtTime && <div style={{ fontSize: 16, color: 'var(--green)', marginLeft: 10 }}>{evtTime}</div>}
            </div>
          )
        })
      )}
      <div style={{ fontSize: 14, color: 'var(--border)', margin: '6px 0' }}>─────────────────────────────────</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
        <span style={{ fontSize: 16, color: 'var(--orange)' }}>{wx.temp || 'N/A'}</span>
        <span style={{ fontSize: 14, color: WX_COLOR[wx.code] || 'var(--text2)' }}>({wx.code || '?'})</span>
      </div>
      <div style={{ fontSize: 14, color: 'var(--purple)', marginBottom: 3 }}>{bar(wx.temp_pct || 0)}</div>
      <div style={{ fontSize: 14, color: 'var(--text2)' }}>wind  <span style={{ color: 'var(--text)' }}>{wx.wind || 'N/A'}</span></div>
    </Window>
  )
}
