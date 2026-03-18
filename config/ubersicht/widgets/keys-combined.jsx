import { React } from 'uebersicht';

export const command = `echo ""`;
export const refreshFrequency = false;

export const className = `
  text-transform: uppercase;
  top: 156px; left: 171px; width: 332px; height: auto;
  --bg: #1c1c1e; --bg2: #2c2c2e; --border: #3a3a3c;
  --text: #DDDDDD; --text2: #8e8e93;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #6B9FFF; --indigo: #7B82FF; --purple: #BB66DD; --pink: #FF4488;
`;

function Window({ title, children }) {
  return (
    <div style={{ border: '0px solid var(--border)', background: 'var(--bg)', borderRadius: '0px', overflow: 'hidden', fontFamily: 'Share Tech Mono, monospace', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3px 14px 4px', borderBottom: '0px solid var(--border)', flexShrink: 0 }}>
        <span style={{ color: 'var(--border)', fontSize: 12 }}>─ </span>
        <span style={{ color: 'var(--blue)', fontSize: 12 }}>{title}</span>
      </div>
      <div style={{ padding: '6px 14px 8px', display: 'flex', flexDirection: 'column' }}>{children}</div>
    </div>
  );
}

function Section({ label, children, collapsed: initial = false }) {
  const [collapsed, setCollapsed] = React.useState(initial);
  return (
    <div>
      <div onClick={() => setCollapsed(!collapsed)} style={{ fontSize: 12, color: 'var(--border)', margin: '5px 0 2px', cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ color: 'var(--blue)', fontSize: 9 }}>{collapsed ? '▶' : '▼'}</span>
        {'─ ' + label + ' '}{'─ '.repeat(18)}
      </div>
      {!collapsed && children}
    </div>
  );
}

function Bind({ keys, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, fontSize: 11 }}>
      <span style={{ color: 'var(--orange)', flexShrink: 0 }}>{keys}</span>
      <span style={{ color: 'var(--text)', textAlign: 'right', marginLeft: 8 }}>{action}</span>
    </div>
  );
}

export const render = ({ output }) => (
  <Window title="shortcuts">
    <Section label="focus">
      <Bind keys="opt ←↑↓→"         action="focus w/n/s/e" />
      <Bind keys="opt tab"           action="cycle windows" />
      <Bind keys="ctrl opt W/A/S/D"  action="warp n/w/s/e" />
    </Section>
    <Section label="resize">
      <Bind keys="ctrl opt ←↑↓→"    action="grow" />
      <Bind keys="⇧ ctrl opt ←↑↓→" action="shrink" />
      <Bind keys="opt R"             action="rotate 90°" />
      <Bind keys="opt B"             action="balance" />
      <Bind keys="opt T"             action="float toggle" />
      <Bind keys="opt E"             action="split toggle" />
      <Bind keys="opt ↩"             action="fullscreen" />
    </Section>
    <Section label="spaces">
      <Bind keys="opt 1–5"           action="switch space" />
      <Bind keys="⇧ opt 1–5"        action="move to space" />
      <Bind keys="⇧ opt N"          action="new space" />
      <Bind keys="⇧ opt X"          action="destroy space" />
      <Bind keys="ctrl ⌘ ←→"        action="prev/next display" />
      <Bind keys="⇧ opt R"          action="restart yabai" />
      <Bind keys="ctrl opt R"        action="restart skhd" />
    </Section>
    <Section label="apps">
      <Bind keys="⌘ opt ↩"          action="kitty" />
      <Bind keys="⇧ ⌘ opt ↩"       action="Zed" />
      <Bind keys="⌘ ⇧ 3"           action="screenshot" />
      <Bind keys="⌘ ⇧ 4"           action="screenshot area" />
      <Bind keys="⌘ ⇧ 5"           action="screen record" />
    </Section>
    <Section label="helix">
      <Bind keys="i / esc"           action="insert / normal" />
      <Bind keys="v / V"             action="select / line select" />
      <Bind keys="g g / G"           action="top / bottom" />
      <Bind keys="g d"               action="goto definition" />
      <Bind keys="space f"           action="file picker" />
      <Bind keys="space b"           action="buffer picker" />
      <Bind keys="space r"           action="rename symbol" />
      <Bind keys="ctrl w v/s"       action="split v / h" />
      <Bind keys=": w / : q"        action="save / quit" />
    </Section>
    <Section label="yazi">
      <Bind keys="h / l"             action="parent / enter" />
      <Bind keys="j / k  •  J / K"  action="nav / nav ×5" />
      <Bind keys="a  •  r"          action="create / rename" />
      <Bind keys="y / x / p"        action="copy / cut / paste" />
      <Bind keys="d / D"             action="trash / delete" />
      <Bind keys="s / S"             action="search / contents" />
      <Bind keys="t  •  tab"        action="new tab / next tab" />
      <Bind keys="q"                 action="quit + cd" />
    </Section>
  </Window>
);
