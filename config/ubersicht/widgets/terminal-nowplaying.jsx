export const command = `python3 -c "
import subprocess, json, base64, os
def run(cmd):
    try: return subprocess.check_output(['osascript', '-e', cmd], text=True, stderr=subprocess.DEVNULL).strip()
    except: return ''
track = artist = art = ext = ''
state = run('tell application \\"Music\\" to get player state')
if state in ('playing', 'paused'):
    track = run('tell application \\"Music\\" to get name of current track')
    artist = run('tell application \\"Music\\" to get artist of current track')
    for f in ['tmp.png', 'tmp.jpg']:
        p = os.path.expanduser('~/Library/Scripts/' + f)
        if os.path.exists(p): os.remove(p)
    try:
        subprocess.run(['osascript', os.path.expanduser('~/Library/Scripts/album-art.applescript')], capture_output=True, timeout=5)
    except: pass
    for f, e in [('tmp.png', 'png'), ('tmp.jpg', 'jpg')]:
        p = os.path.expanduser('~/Library/Scripts/' + f)
        if os.path.exists(p):
            with open(p, 'rb') as fh: art = base64.b64encode(fh.read()).decode()
            ext = e; break
else:
    sp = run('tell application \\"Spotify\\" to get player state')
    if sp == 'playing':
        track = run('tell application \\"Spotify\\" to get name of current track')
        artist = run('tell application \\"Spotify\\" to get artist of current track')
print(json.dumps({'track': track, 'artist': artist, 'art': art, 'ext': ext}))
"`

export const refreshFrequency = 10000

// Layout grid: outer padding 171px left/right, top boundary ~156px, bottom boundary ~1006px.
// Keep all widget bounds within these margins — do not extend past the southern edge.
export const className = `
  text-transform: uppercase;
  top: 933px; right: 171px; overflow: hidden; width: 340px; height: 0px;
  --bg: #ffffff; --bg2: #f2f2f7; --border: #e5e5ea; --text: #000000; --text2: #6e6e73;
  --red: #FF5555; --orange: #FF9838; --yellow: #FFD02A; --green: #6ECD6B;
  --teal: #5EE0D4; --blue: #3B82F7; --indigo: #7B82FF; --purple: #BB66DD; --pink: #FF4488;
  @media (prefers-color-scheme: dark) {
    --bg: #1c1c1e; --bg2: #2c2c2e; --border: #3a3a3c; --text: #ffffff; --text2: #8e8e93;
    --eq-color: #FF4488;
  }
`

const eqCss = `
@keyframes np-eq { 0%,100%{height:3px} 50%{height:14px} }
.np-eq { display:inline-flex; align-items:flex-end; gap:3px; height:16px; margin-top:10px; }
.np-eq span { width:4px; border-radius:1px; }
.np-eq span:nth-child(1){background:var(--blue);   animation:np-eq 0.80s ease-in-out infinite 0.00s}
.np-eq span:nth-child(2){background:var(--purple); animation:np-eq 1.10s ease-in-out infinite 0.10s}
.np-eq span:nth-child(3){background:var(--pink);   animation:np-eq 0.70s ease-in-out infinite 0.20s}
.np-eq span:nth-child(4){background:var(--red);    animation:np-eq 1.20s ease-in-out infinite 0.15s}
.np-eq span:nth-child(5){background:var(--orange); animation:np-eq 0.90s ease-in-out infinite 0.05s}
.np-eq span:nth-child(6){background:var(--yellow); animation:np-eq 1.00s ease-in-out infinite 0.25s}
.np-eq span:nth-child(7){background:var(--green);  animation:np-eq 0.85s ease-in-out infinite 0.10s}
.np-eq span:nth-child(8){background:var(--teal);   animation:np-eq 1.15s ease-in-out infinite 0.30s}
.np-eq span:nth-child(9){background:var(--blue);   animation:np-eq 0.75s ease-in-out infinite 0.18s}
.np-eq span:nth-child(10){background:var(--pink);  animation:np-eq 1.05s ease-in-out infinite 0.22s}
`

function Window({ title, children }) {
  return (
    <div style={{ background: 'var(--bg)', fontFamily: 'Share Tech Mono, monospace', fontSize: 16, height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '3px 14px 4px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ color: 'var(--border)', fontSize: 14 }}>─ </span>
        <span style={{ color: 'var(--blue)', fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: '10px 14px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>{children}</div>
    </div>
  )
}

export const render = ({ output }) => {
  let track = '', artist = '', art = '', ext = ''
  try { const d = JSON.parse(output); track = d.track || ''; artist = d.artist || ''; art = d.art || ''; ext = d.ext || 'png' } catch(e) {}
  const playing = track.length > 0
  const mime = ext === 'jpg' ? 'image/jpeg' : 'image/png'
  return (
    <Window title="now playing">
      <style>{eqCss}</style>
      {playing ? (
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          {art ? <img src={`data:${mime};base64,${art}`} style={{ width: 90, height: 90, objectFit: 'cover', flexShrink: 0 }} /> : null}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, color: 'var(--blue)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track}</div>
            <div style={{ fontSize: 16, color: 'var(--pink)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{artist}</div>
            <div className="np-eq"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 16, color: 'var(--purple)' }}>nothing playing</div>
          <div style={{ fontSize: 16, color: 'var(--border)', marginTop: 6 }}>─────────────────────</div>
        </div>
      )}
    </Window>
  )
}
