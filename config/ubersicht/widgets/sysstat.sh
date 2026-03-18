#!/usr/bin/env python3
import subprocess, re, json, os, time

result = {}

# CPU
try:
    top_out = subprocess.check_output(['top', '-l', '1', '-n', '0'], text=True, stderr=subprocess.DEVNULL)
    m = re.search(r'CPU usage:\s+([\d.]+)%\s+user,\s+([\d.]+)%\s+sys', top_out)
    cpu_pct = int(float(m.group(1)) + float(m.group(2))) if m else 0
except:
    cpu_pct = 0
result['cpu_pct'] = cpu_pct
result['cpu'] = f'{cpu_pct}%'

# MEMORY
try:
    mem_total = int(subprocess.check_output(['sysctl', '-n', 'hw.memsize'], text=True).strip())
    vm_out = subprocess.check_output(['vm_stat'], text=True)
    v = {k.strip(): int(n) for k, n in re.findall(r'(.+?):\s+(\d+)', vm_out)}
    ps = 4096
    mem_used = (v.get('Pages active', 0) + v.get('Pages wired down', 0) + v.get('Pages occupied by compressor', 0)) * ps
    mem_pct = int(mem_used / mem_total * 100)
    mem_gb = mem_used / 1073741824
    mem_total_gb = mem_total / 1073741824
    result['mem_pct'] = mem_pct
    result['mem'] = f'{mem_gb:.1f}/{mem_total_gb:.0f}GB'
except:
    result['mem_pct'] = 0
    result['mem'] = '?'

# SWAP
try:
    sw = subprocess.check_output(['sysctl', 'vm.swapusage'], text=True)
    su = re.search(r'used = ([\d.]+)M', sw)
    st = re.search(r'total = ([\d.]+)M', sw)
    if su and st:
        swap_used = float(su.group(1))
        swap_total = float(st.group(1))
        swap_pct = int(swap_used / swap_total * 100) if swap_total > 0 else 0
        result['swap_pct'] = swap_pct
        result['swap'] = f'{swap_used:.0f}/{swap_total:.0f}MB'
    else:
        result['swap_pct'] = 0
        result['swap'] = '0MB'
except:
    result['swap_pct'] = 0
    result['swap'] = '?'

# DISKS
def fmt_kb(kb):
    gb = kb / 1048576
    if gb >= 1: return f'{gb:.0f}G'
    return f'{kb/1024:.0f}M'

disks = []
try:
    df_out = subprocess.check_output(['df', '-Pk'], text=True)
    for line in df_out.strip().split('\n')[1:]:
        parts = line.split()
        if len(parts) < 6: continue
        try:
            mount = parts[5]
            size_kb = int(parts[1])
            used_kb = int(parts[2])
            avail_kb = int(parts[3])
            pct = int(parts[4].replace('%', ''))
        except (ValueError, IndexError):
            continue
        if mount != '/' and not mount.startswith('/Volumes/'): continue
        if mount.startswith('/Volumes/') and (size_kb < 512000 or pct == 100): continue
        label = '/' if mount == '/' else mount.replace('/Volumes/', '')
        disks.append({'label': label, 'used': fmt_kb(used_kb), 'avail': fmt_kb(avail_kb), 'pct': pct})
except:
    pass
result['disks'] = disks[:4]

# NETWORK
HIST_LEN = 20
tmp = '/tmp/ss_net.json'
try:
    lines = subprocess.check_output(['netstat', '-ib'], text=True).split('\n')
    bi = bo = 0
    for line in lines:
        p = line.split()
        if len(p) >= 10 and p[0] == 'en0' and '<Link' in p[2]:
            bi = int(p[6])
            bo = int(p[9])
            break
    now = time.time()
    if os.path.exists(tmp):
        with open(tmp) as f:
            prev = json.load(f)
        dt = now - prev['t']
        rx = max(0, (bi - prev['bi']) / dt) if dt > 0.5 else 0
        tx = max(0, (bo - prev['bo']) / dt) if dt > 0.5 else 0
        rx_hist = (prev.get('rx_hist', []) + [rx])[-HIST_LEN:]
        tx_hist = (prev.get('tx_hist', []) + [tx])[-HIST_LEN:]
    else:
        rx = tx = 0
        rx_hist = [0] * HIST_LEN
        tx_hist = [0] * HIST_LEN
    with open(tmp, 'w') as f:
        json.dump({'t': now, 'bi': bi, 'bo': bo, 'rx_hist': rx_hist, 'tx_hist': tx_hist}, f)
    def fmt_rate(b):
        if b < 1024: return f'{b:.0f}B/s'
        if b < 1048576: return f'{b/1024:.1f}KB/s'
        return f'{b/1048576:.1f}MB/s'
    result['net_rx'] = fmt_rate(rx)
    result['net_tx'] = fmt_rate(tx)
    result['net_rx_hist'] = rx_hist
    result['net_tx_hist'] = tx_hist
except:
    result['net_rx'] = '?'
    result['net_tx'] = '?'
    result['net_rx_hist'] = [0] * HIST_LEN
    result['net_tx_hist'] = [0] * HIST_LEN

# WIFI
try:
    ssid_out = subprocess.check_output(['networksetup', '-getairportnetwork', 'en0'], text=True, stderr=subprocess.DEVNULL).strip()
    ssid = ssid_out.replace('Current Wi-Fi Network: ', '') if 'Current Wi-Fi Network:' in ssid_out else ''
except:
    ssid = ''
try:
    ip = subprocess.check_output(['ipconfig', 'getifaddr', 'en0'], text=True, stderr=subprocess.DEVNULL).strip()
except:
    ip = ''
if not ip:
    try:
        ip = subprocess.check_output(['ipconfig', 'getifaddr', 'en1'], text=True, stderr=subprocess.DEVNULL).strip()
    except:
        ip = ''
result['wifi'] = ssid or ('ethernet' if ip else 'offline')
result['ip'] = ip

# TAILSCALE
try:
    ts_ip = subprocess.check_output(['/opt/homebrew/bin/tailscale', 'ip', '-4'], text=True, stderr=subprocess.DEVNULL).strip()
    result['ts_ip'] = ts_ip
    result['ts'] = 'connected'
except:
    result['ts'] = 'offline'
    result['ts_ip'] = ''

# BLUETOOTH
BT_CACHE = '/tmp/ss_bt.json'
BT_TTL = 30
try:
    bt_data = None
    if os.path.exists(BT_CACHE):
        with open(BT_CACHE) as f:
            bt_cache = json.load(f)
        if time.time() - bt_cache.get('t', 0) < BT_TTL:
            bt_data = bt_cache.get('devices', [])
    if bt_data is None:
        bt_out = subprocess.check_output(['system_profiler', 'SPBluetoothDataType'], text=True, stderr=subprocess.DEVNULL)
        bt_devices = []
        bt_cur = None
        known = ('Battery Level', 'Connected', 'State', 'Address', 'Minor Type',
                 'Firmware Version', 'Transport', 'Vendor ID', 'Product ID',
                 'Services', 'Not Connected', 'Devices')
        for line in bt_out.split('\n'):
            s = line.strip()
            if re.match(r'^[A-Za-z0-9\(\)\'\'\- ]+:$', s) and not any(s.startswith(k) for k in known):
                bt_cur = {'name': s.rstrip(':'), 'left': None, 'right': None, 'case': None}
                bt_devices.append(bt_cur)
                continue
            if bt_cur is None: continue
            m = re.match(r'Left Battery Level: (\d+)%', s)
            if m: bt_cur['left'] = int(m.group(1)); continue
            m = re.match(r'Right Battery Level: (\d+)%', s)
            if m: bt_cur['right'] = int(m.group(1)); continue
            m = re.match(r'Case Battery Level: (\d+)%', s)
            if m: bt_cur['case'] = int(m.group(1)); continue
        bt_data = [d for d in bt_devices if any(v is not None for v in (d['left'], d['right'], d['case']))]
        with open(BT_CACHE, 'w') as f:
            json.dump({'t': time.time(), 'devices': bt_data}, f)
    result['bt'] = bt_data
except:
    result['bt'] = []

# WEATHER
WX_CACHE = '/tmp/ss_wx.json'
WX_TTL = 1800
try:
    import urllib.request
    wx = None
    if os.path.exists(WX_CACHE):
        with open(WX_CACHE) as f:
            wc = json.load(f)
        if time.time() - wc.get('t', 0) < WX_TTL:
            wx = wc.get('wx')
    if wx is None:
        with urllib.request.urlopen('https://api.weather.gov/points/44.9778,-93.2650', timeout=5) as r:
            pts = json.load(r)
        with urllib.request.urlopen(pts['properties']['forecastHourly'], timeout=5) as r:
            fc = json.load(r)
        p = fc['properties']['periods'][0]
        tempF = p['temperature']
        short = p['shortForecast'].lower()
        if any(w in short for w in ['thunder', 'storm']): code = 'St'
        elif any(w in short for w in ['snow', 'flurr', 'wintry', 'sleet', 'ice']): code = 'S'
        elif any(w in short for w in ['rain', 'shower', 'drizzle']): code = 'R'
        else: code = 'C'
        wx = {
            'temp': str(tempF) + '\u00b0' + p['temperatureUnit'],
            'tempF': tempF,
            'temp_pct': int(max(0, min(100, (tempF + 20) / 130 * 100))),
            'code': code,
            'wind': p.get('windSpeed', '') + (' ' + p.get('windDirection', '') if p.get('windDirection') else ''),
        }
        with open(WX_CACHE, 'w') as f:
            json.dump({'t': time.time(), 'wx': wx}, f)
    result['wx'] = wx
except:
    result['wx'] = {'temp': 'N/A', 'tempF': 32, 'temp_pct': 0, 'code': '?', 'wind': 'N/A'}

print(json.dumps(result))
