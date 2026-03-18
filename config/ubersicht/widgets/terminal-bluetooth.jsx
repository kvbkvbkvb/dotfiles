export const command = `python3 -c "
import subprocess, json, re
try:
    out = subprocess.check_output(['system_profiler', 'SPBluetoothDataType'], text=True, stderr=subprocess.DEVNULL)
    devices = []
    current = None
    known = ('Battery Level', 'Connected', 'State', 'Address', 'Minor Type', 'Firmware Version', 'Transport', 'Vendor ID', 'Product ID', 'Services', 'Not Connected', 'Devices')
    for line in out.split('\\n'):
        stripped = line.strip()
        if re.match(r'^[A-Za-z0-9\\(\\)\\\'\\- ]+:$', stripped) and not any(stripped.startswith(k) for k in known):
            current = {'name': stripped.rstrip(':'), 'left': None, 'right': None, 'case': None}
            devices.append(current)
            continue
        if current is None: continue
        m = re.match(r'Left Battery Level: (\\d+)%', stripped)
        if m: current['left'] = int(m.group(1)); continue
        m = re.match(r'Right Battery Level: (\\d+)%', stripped)
        if m: current['right'] = int(m.group(1)); continue
        m = re.match(r'Case Battery Level: (\\d+)%', stripped)
        if m: current['case'] = int(m.group(1)); continue
    devices = [d for d in devices if any(v is not None for v in (d['left'], d['right'], d['case']))]
    print(json.dumps(devices, ensure_ascii=False))
except:
    print(json.dumps([]))
"`

export const refreshFrequency = 30000

export const className = `
  text-transform: uppercase;
  top: 811px; right: 519px; width: 680px; height: 0px; overflow: hidden;
  --bg: #ffffff; --bg2: #f2f2f7; --border: #e5e5ea; --text: #000000; --text2: #6e6e73;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #6B9FFF; --indigo: #7B82FF; --purple: #BB66DD; --pink: #FF4488;
  @media (prefers-color-scheme: dark) {
    --bg: #1c1c1e; --bg2: #2c2c2e; --border: #3a3a3c; --text: #ffffff; --text2: #8e8e93;
  }
`

function bar(pct, width = 10) {
  const n = Math.max(0, Math.min(width, Math.round((pct / 100) * width)))
  return '[' + '█'.repeat(n) + '░'.repeat(width - n) + ']'
}

function batteryColor(pct) {
  if (pct >= 80) return 'var(--green)'
  if (pct >= 30) return 'var(--yellow)'
  return 'var(--red)'
}

function Window({ title, children }) {
  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'Share Tech Mono, monospace', fontSize: 16, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3px 14px 4px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ color: 'var(--border)', fontSize: 14 }}>─ </span>
        <span style={{ color: 'var(--blue)', fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: '8px 14px 10px', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}

export const render = ({ output }) => {
  let devices = []
  try { devices = JSON.parse(output) } catch(e) {}
  return (
    <Window title="bluetooth">
      {devices.length === 0 ? (
        <div style={{ color: 'var(--teal)', fontSize: 13 }}>no bluetooth devices found</div>
      ) : (
        devices.map((dev, di) => {
          const rows = [
            dev.left  != null && { label: 'L', pct: dev.left },
            dev.right != null && { label: 'R', pct: dev.right },
            dev.case  != null && { label: 'case', pct: dev.case },
          ].filter(Boolean)
          return (
            <div key={di} style={{ marginBottom: di < devices.length - 1 ? 8 : 0 }}>
              <div style={{ fontSize: 14, color: 'var(--purple)', marginBottom: 4 }}>• {dev.name}</div>
              {rows.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', marginBottom: i < rows.length - 1 ? 3 : 0 }}>
                  <span style={{ width: 36, color: 'var(--blue)', fontSize: 13 }}>{r.label}</span>
                  <span style={{ color: batteryColor(r.pct), fontSize: 13 }}>{bar(r.pct)}</span>
                  <span style={{ marginLeft: 8, color: batteryColor(r.pct), fontSize: 13 }}>{r.pct}%</span>
                </div>
              ))}
            </div>
          )
        })
      )}
    </Window>
  )
}
