export const command = `echo ""`
export const refreshFrequency = false
export const className = `
  text-transform: uppercase;
  top: 1019px; left: 171px; width: 340px; height: 0px; overflow: hidden;
  --bg: rgba(44, 46, 52, 0.85); --bg2: #363944; --border: #414550;
  --text: #e2e2e3; --text2: #7f8490;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #6B9FFF; --indigo: #BB66DD; --purple: #BB66DD; --pink: #FF4488;
`
function Window({ title, children }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: '8px', overflow: 'hidden', fontFamily: 'Share Tech Mono, monospace', fontSize: 16, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3px 14px 4px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ color: 'var(--border)', fontSize: 14 }}>─ </span>
        <span style={{ color: 'var(--blue)', fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: '8px 14px 10px', flex: 1, display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  )
}
function Bind({ keys, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
      <span style={{ color: 'var(--orange)', fontFamily: 'Share Tech Mono, monospace' }}>{keys}</span>
      <span style={{ color: 'var(--text)', fontFamily: 'Share Tech Mono, monospace', textAlign: 'right', marginLeft: 8 }}>{action}</span>
    </div>
  )
}
export const render = ({ output }) => (
  <Window title="kitty">
    <Bind keys="⌘ T"       action="new tab" />
    <Bind keys="⌘ W"       action="close tab" />
    <Bind keys="⌘ → ←"    action="next/prev tab" />
    <Bind keys="⌘ ↩"       action="new window" />
    <Bind keys="⌘ D"       action="split right" />
    <Bind keys="⌘ ⇧ D"    action="split top" />
    <Bind keys="ctrl ⌘ F"  action="fullscreen" />
    <Bind keys="⌘ + −"    action="font size" />
    <Bind keys="⌘ K"       action="clear" />
  </Window>
)
