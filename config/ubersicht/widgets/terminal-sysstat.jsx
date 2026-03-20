export const command = `python3 "$HOME/Library/Application Support/Übersicht/widgets/sysstat.sh"`

export const refreshFrequency = 2000

// Layout grid: outer padding 171px left/right, top boundary ~156px, bottom boundary ~1006px.
// Keep all widget bounds within these margins — do not extend past the southern edge.
export const className = `
  text-transform: uppercase;
  top: 422px; right: 171px; width: 340px; height: 580px;
  --bg: #ffffff; --bg2: #f2f2f7; --border: #e5e5ea; --text: #000000; --text2: #6e6e73;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #3B82F7; --indigo: #7B82FF; --purple: #BB66DD; --pink: #FF4488;
  @media (prefers-color-scheme: dark) {
    --bg: #1c1c1e; --bg2: #2c2c2e; --border: #3a3a3c; --text: #ffffff; --text2: #8e8e93;
  }
`

function bar(pct, width) {
  width = width || 12
  const n = Math.max(0, Math.min(width, Math.round((pct / 100) * width)))
  return '[' + '█'.repeat(n) + '░'.repeat(width - n) + ']'
}
function spark(values) {
  const blocks = '▁▂▃▄▅▆▇█'
  if (!values || !values.length) return ''
  const mx = Math.max.apply(null, values.concat([1]))
  return values.map(v => blocks[Math.min(7, Math.floor(v / mx * 7))]).join('')
}
function btColor(pct) {
  if (pct >= 80) return 'var(--green)'
  if (pct >= 30) return 'var(--yellow)'
  return 'var(--red)'
}
function Window({ title, children }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden', fontFamily: 'Share Tech Mono, monospace', fontSize: 16, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3px 14px 4px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ color: 'var(--border)', fontSize: 14 }}>─ </span>
        <span style={{ color: 'var(--blue)', fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: '8px 14px 10px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>{children}</div>
    </div>
  )
}
function Row({ label, labelColor, barStr, barColor, value, valueColor }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 7, fontSize: 15, gap: 6 }}>
      <span style={{ color: labelColor || 'var(--text2)', minWidth: 38 }}>{label}</span>
      {barStr && <span style={{ color: barColor || 'var(--text2)' }}>{barStr}</span>}
      <span style={{ color: valueColor || 'var(--text)' }}>{value}</span>
    </div>
  )
}
function Sep({ label }) {
  return <div style={{ fontSize: 12, color: 'var(--indigo)', margin: '10px 0 6px' }}>{'\u2500 ' + label + ' '}{'\u2500'.repeat(20)}</div>
}

export const render = ({ output }) => {
  let d = {}
  try { d = JSON.parse(output) } catch(e) {}
  const cpuPct = d.cpu_pct || 0
  const memPct = d.mem_pct || 0
  const swapPct = d.swap_pct || 0
  const disks = d.disks || []
  const rxHist = d.net_rx_hist || []
  const txHist = d.net_tx_hist || []
  const tsColor = d.ts === 'connected' ? 'var(--green)' : 'var(--text2)'
  const btDevices = d.bt || []
  return (
    <Window title="sysstat">
      <Row label="cpu"  labelColor="var(--red)"    barStr={bar(cpuPct)}  barColor="var(--red)"    value={d.cpu  || '?'} />
      <Row label="mem"  labelColor="var(--purple)"  barStr={bar(memPct)}  barColor="var(--purple)" value={d.mem  || '?'} />
      <Row label="swap" labelColor="var(--orange)"  barStr={bar(swapPct)} barColor="var(--orange)" value={d.swap || '?'} />
      <Row label="load" labelColor="var(--teal)"   value={d.load || '?'} />
      <Row label="up"   labelColor="var(--teal)"   value={d.uptime || '?'} />
      <Sep label="disk" />
      {disks.length === 0
        ? <div style={{ fontSize: 14, color: 'var(--text2)' }}>no volumes</div>
        : disks.map((disk, i) => {
            const diskColor = disk.pct > 85 ? 'var(--red)' : disk.pct > 65 ? 'var(--yellow)' : 'var(--indigo)'
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', marginBottom: 3, fontSize: 15, gap: 6 }}>
                <span style={{ color: 'var(--text2)', minWidth: 38, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{disk.label}</span>
                <span style={{ color: diskColor }}>{bar(disk.pct)}</span>
                <span style={{ color: 'var(--yellow)' }}>{disk.used}</span>
                <span style={{ color: 'var(--orange)', fontSize: 14 }}>({disk.pct}%)</span>
              </div>
            )
          })
      }
      <Sep label="net" />
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 6, fontSize: 15, gap: 6 }}>
        <span style={{ color: 'var(--teal)', minWidth: 38 }}>↓</span>
        <span style={{ color: 'var(--teal)', fontSize: 12, letterSpacing: '-0.5px' }}>{spark(rxHist)}</span>
        <span style={{ color: 'var(--teal)' }}>{d.net_rx || '?'}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8, fontSize: 15, gap: 6 }}>
        <span style={{ color: 'var(--green)', minWidth: 38 }}>↑</span>
        <span style={{ color: 'var(--green)', fontSize: 12, letterSpacing: '-0.5px' }}>{spark(txHist)}</span>
        <span style={{ color: 'var(--green)' }}>{d.net_tx || '?'}</span>
      </div>
      <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 9 }}>
        <span style={{ color: 'var(--blue)' }}>{d.wifi || '?'}</span>
        {d.ip ? <span style={{ color: 'var(--yellow)' }}>{'  '}{d.ip}</span> : null}
      </div>
      {d.pub_ip ? <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 9 }}>
        <span style={{ color: 'var(--text2)' }}>ext </span>
        <span style={{ color: 'var(--yellow)' }}>{d.pub_ip}</span>
      </div> : null}
      <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 9 }}>
        <span style={{ color: tsColor }}>ts  </span>
        {d.ts === 'connected'
          ? <span><span style={{ color: 'var(--green)' }}>●  </span>{d.ts_ip}</span>
          : <span style={{ color: 'var(--text2)' }}>○  offline</span>
        }
      </div>
      <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 9 }}>
        <span style={{ color: 'var(--blue)' }}>srv </span>
        {d.server_up === true
          ? <span><span style={{ color: 'var(--green)' }}>●  </span><span style={{ color: 'var(--green)' }}>up</span></span>
          : d.server_up === false
          ? <span><span style={{ color: 'var(--red)' }}>●  </span><span style={{ color: 'var(--red)' }}>down</span></span>
          : <span style={{ color: 'var(--text2)' }}>○  unknown</span>
        }
      </div>
      {btDevices.length > 0 && (
        <div>
          <Sep label="bt" />
          {btDevices.map((dev, di) => {
            const rows = [
              dev.left  != null && { label: 'L',    pct: dev.left },
              dev.right != null && { label: 'R',    pct: dev.right },
              dev.case  != null && { label: 'case', pct: dev.case },
            ].filter(Boolean)
            return (
              <div key={di} style={{ marginBottom: di < btDevices.length - 1 ? 6 : 0 }}>
                <div style={{ fontSize: 13, color: 'var(--purple)', marginBottom: 2 }}>• {dev.name}</div>
                {rows.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', marginBottom: i < rows.length - 1 ? 3 : 0 }}>
                    <span style={{ width: 36, color: 'var(--text2)', fontSize: 13 }}>{r.label}</span>
                    <span style={{ color: btColor(r.pct), fontSize: 13 }}>{bar(r.pct, 10)}</span>
                    <span style={{ marginLeft: 8, color: btColor(r.pct), fontSize: 13 }}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </Window>
  )
}
