export const command = `python3 -c "
import json, re
from datetime import date

entries = []
today = date.today()

try:
    with open('/Users/kevbee/claude/Projects/Support/customs_list.txt') as f:
        for line in f:
            line = line.strip()
            if not line: continue
            parts = [p.strip() for p in line.split('::')]
            if len(parts) < 3: continue
            flag = parts[0]
            red = flag in ('1', '!')
            if len(parts) >= 4:
                dt_str = parts[1]; name = parts[2]; tattoo = parts[3]
            else:
                dt_str = ''; name = parts[1]; tattoo = parts[2]
            days = None
            if re.match(r'[0-9]{4}-[0-9]{2}-[0-9]{2}', dt_str):
                try:
                    appt = date.fromisoformat(dt_str)
                    days = (appt - today).days
                except: pass
            entries.append({'red': red, 'name': name, 'tattoo': tattoo, 'days': days})
except Exception as e:
    entries = [{'red': True, 'name': 'error', 'tattoo': str(e), 'days': None}]

print(json.dumps(entries, ensure_ascii=False))
"`

export const refreshFrequency = 3600000

export const className = `
  text-transform: uppercase;
  top: 582px; right: 519px; width: 680px; height: 200px; overflow: hidden;
  --bg: #ffffff; --bg2: #f2f2f7; --border: #e5e5ea; --text: #000000; --text2: #6e6e73;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #6B9FFF; --indigo: #7B82FF; --purple: #BB66DD; --pink: #FF4488;
  @media (prefers-color-scheme: dark) {
    --bg: #1c1c1e; --bg2: #2c2c2e; --border: #3a3a3c; --text: #ffffff; --text2: #8e8e93;
  }
`

function Window({ title, children }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden', fontFamily: 'Share Tech Mono, monospace', fontSize: 16, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3px 14px 4px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ color: 'var(--border)', fontSize: 14 }}>─ </span>
        <span style={{ color: 'var(--blue)', fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: '8px 14px 10px', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}

function daysLabel(days) {
  if (days === null || days === undefined) return 'TBD'
  if (days < 0) return `${Math.abs(days)}d past`
  if (days === 0) return 'today'
  return `${days}d`
}

export const render = ({ output }) => {
  let entries = []
  try { entries = JSON.parse(output) } catch(e) {}
  return (
    <Window title="customs">
      {entries.length === 0 ? (
        <div style={{ color: 'var(--text2)' }}>no entries</div>
      ) : (
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 4, fontSize: 14, color: 'var(--teal)' }}>
            <span style={{ width: '35%' }}>name</span>
            <span style={{ flex: 1 }}>subject</span>
            <span style={{ width: 50, textAlign: 'right' }}>appt</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--indigo)', marginBottom: 4 }}>{'\u2500'.repeat(48)}</div>
          {entries.map((e, i) => {
            const nameColor = e.red ? 'var(--red)' : 'var(--blue)'
            const days = e.days
            const daysColor = days === null || days === undefined ? 'var(--text2)' : days <= 7 ? 'var(--red)' : days <= 30 ? 'var(--yellow)' : 'var(--green)'
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', marginBottom: i < entries.length - 1 ? 3 : 0 }}>
                <span style={{ width: '35%', color: nameColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 0 }}>• {e.name}</span>
                <span style={{ flex: 1, color: 'var(--yellow)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{e.tattoo}</span>
                <span style={{ width: 50, textAlign: 'right', color: daysColor, flexShrink: 0 }}>{daysLabel(days)}</span>
              </div>
            )
          })}
        </div>
      )}
    </Window>
  )
}
