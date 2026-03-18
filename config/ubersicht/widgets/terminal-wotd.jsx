export const command = `python3 -c "
import urllib.request, json, re, html as h
try:
    with urllib.request.urlopen('https://www.merriam-webster.com/wotd/feed/rss2', timeout=10) as r:
        data = r.read().decode('utf-8')
    item = re.search(r'<item>(.*?)</item>', data, re.DOTALL).group(1)
    word = re.search(r'<title><!\\[CDATA\\[(.+?)\\]\\]>', item).group(1)
    desc_raw = re.search(r'<description><!\\[CDATA\\[(.*?)\\]\\]>', item, re.DOTALL).group(1)
    desc = re.sub(r'<[^>]+>', ' ', desc_raw)
    desc = h.unescape(re.sub(r'\\s+', ' ', desc).strip())[:200]
    print(json.dumps({'word': word, 'def': desc}, ensure_ascii=False))
except:
    print(json.dumps({'word': 'N/A', 'def': 'unavailable'}))
"`

export const refreshFrequency = 3600000

export const className = `
  text-transform: uppercase;
  top: 788px; right: 519px; width: 680px; height: 218px; overflow: hidden;
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

export const render = ({ output }) => {
  let word = '…', def = ''
  try { const d = JSON.parse(output); word = d.word; def = d.def } catch(e) {}
  return (
    <Window title="word of the day">
      <div style={{ fontSize: 16, color: 'var(--purple)', marginBottom: 6 }}>{word}</div>
      <div style={{ fontSize: 14, color: 'var(--indigo)', marginBottom: 6 }}>{'\u2500'.repeat(40)}</div>
      <div style={{ fontSize: 15, color: 'var(--blue)', lineHeight: 1.6 }}>{def}</div>
    </Window>
  )
}
