export const command = `
  echo "===PROCS===" &&
  ps -axo pid,pcpu,pmem,comm -r 2>/dev/null | tail -n +2 | head -14 &&
  echo "===LOAD===" &&
  sysctl -n vm.loadavg | awk '{print $2, $3, $4}' &&
  echo "===MEM===" &&
  vm_stat | awk '
    /Pages free/        { free  = $3+0 }
    /Pages active/      { act   = $3+0 }
    /Pages inactive/    { inact = $3+0 }
    /Pages wired down/  { wire  = $4+0 }
    /Pages occupied by compressor/ { comp = $5+0 }
    END {
      page = 16384
      total = (free+act+inact+wire+comp)*page
      used  = (act+wire+comp)*page
      printf "%.1f %.1f", used/1073741824, total/1073741824
    }'
`

export const refreshFrequency = 3000

export const className = `
  text-transform: uppercase;
  top: 156px; right: 519px; width: 680px; height: 420px;
  font-family: "Share Tech Mono", monospace;
  --bg: #1c1c1e; --bg2: #2c2c2e; --border: #3a3a3c;
  --text: #DDDDDD; --text2: #8e8e93;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #6B9FFF; --purple: #BB66DD; --pink: #FF4488;
`

function cpuColor(pct) {
  if (pct >= 50) return '#FF5555'
  if (pct >= 20) return '#FF9838'
  if (pct >= 5)  return '#FFD02A'
  return '#6ECD6B'
}

function Bar({ pct, color, width = 60 }) {
  const filled = Math.round((pct / 100) * width)
  const empty  = width - filled
  return (
    <span style={{ color, letterSpacing: '-1px', fontSize: 9 }}>
      {'█'.repeat(filled)}
      <span style={{ color: '#3a3a3c' }}>{'█'.repeat(empty)}</span>
    </span>
  )
}

function Window({ title, children }) {
  return (
    <div style={{ background: 'var(--bg)', overflow: 'hidden', fontFamily: 'Share Tech Mono, monospace', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3px 14px 4px', flexShrink: 0 }}>
        <span style={{ color: 'var(--border)', fontSize: 14 }}>─ </span>
        <span style={{ color: 'var(--blue)', fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: '6px 14px 10px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}

export const render = ({ output }) => {
  if (!output) return <Window title="processes">loading...</Window>
  const sections = output.split(/===\w+===\n?/).filter(Boolean)
  const procsRaw = (sections[0] || '').trim().split('\n')
  const loadRaw  = (sections[1] || '').trim()
  const memRaw   = (sections[2] || '').trim()
  const procs = procsRaw.map(line => {
    const parts = line.trim().split(/\s+/)
    if (parts.length < 4) return null
    const [pid, cpu, mem, ...nameParts] = parts
    const name = nameParts.join(' ').replace(/.*\//, '').slice(0, 28)
    return { pid, cpu: parseFloat(cpu), mem: parseFloat(mem), name }
  }).filter(Boolean)
  const [load1, load5, load15] = loadRaw.split(' ')
  const [memUsed, memTotal] = memRaw.split(' ')
  const memPct = memTotal ? (parseFloat(memUsed) / parseFloat(memTotal)) * 100 : 0
  return (
    <Window title="processes">
      <div style={{ display: 'flex', fontSize: 10, color: 'var(--text2)', marginBottom: 4, paddingBottom: 3, borderBottom: '1px solid var(--border)' }}>
        <span style={{ width: 48 }}>pid</span>
        <span style={{ width: 44 }}>cpu%</span>
        <span style={{ width: 44 }}>mem%</span>
        <span style={{ flex: 1 }}>process</span>
        <span style={{ width: 70 }}>cpu bar</span>
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {procs.map((p, i) => {
          const color = cpuColor(p.cpu)
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', fontSize: 11, marginBottom: 3 }}>
              <span style={{ width: 48, color: 'var(--text2)' }}>{p.pid}</span>
              <span style={{ width: 44, color }}>{p.cpu.toFixed(1)}</span>
              <span style={{ width: 44, color: 'var(--purple)' }}>{p.mem.toFixed(1)}</span>
              <span style={{ flex: 1, color: 'var(--text)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.name}</span>
              <span style={{ width: 70 }}><Bar pct={Math.min(p.cpu, 100)} color={color} width={10} /></span>
            </div>
          )
        })}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 5, marginTop: 4, display: 'flex', gap: 24, fontSize: 11 }}>
        <div>
          <span style={{ color: 'var(--text2)' }}>load  </span>
          <span style={{ color: 'var(--blue)' }}>{load1}</span>
          <span style={{ color: 'var(--text2)' }}> {load5} {load15}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--text2)' }}>mem  </span>
          <span style={{ color: cpuColor(memPct) }}>{memUsed}gb</span>
          <span style={{ color: 'var(--text2)' }}>/ {memTotal}gb</span>
          <Bar pct={memPct} color={cpuColor(memPct)} width={20} />
        </div>
      </div>
    </Window>
  )
}
