import { css, run, React } from "uebersicht";
import * as config from "./config.json";

export const refreshFrequency = 10000;

const screenWidth = window.screen.width;
const barWidth = screenWidth - 80;

const options = {
  top: "20px",
  left: screenWidth / 2 - barWidth / 2 + "px",
  width: barWidth + "px",
  timezone: "America/Chicago",
  city: "Minneapolis",
  disk: "/dev/disk3s5",
};

let lastWeatherUpdate = 0;
let weatherFetched = false;

export const command = (dispatch) => {
  run("StatBar.widget/mini-bar-stats.sh " + options.timezone + " " + options.disk).then((output) => {
    const stats = JSON.parse(output);
    dispatch({ type: "UPDATE_STATS", data: stats });
  });

  const now = Date.now();
  if (now - lastWeatherUpdate >= 60000 || !weatherFetched) {
    lastWeatherUpdate = Date.now();
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${options.city}&units=imperial&appid=${config.OPENWEATHERMAP_APIKEY}`)
      .then(r => r.json())
      .then(data => dispatch({ type: "WEATHER_UPDATE", data: { weather: { temp: data.main.temp.toFixed(0), forecast: data.weather[0].main } } }))
      .catch(() => dispatch({ type: "WEATHER_UPDATE", data: { weather: { temp: "...", forecast: "..." } } }));
  }
};

export const className = {
  top: options.top, left: options.left, width: options.width,
  userSelect: "none", backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: "5px", boxSizing: "border-box", borderRadius: "5px",
};

const containerClassName = css({ color: "rgba(255,255,255)", fontFamily: "Share Tech Mono", fontSize: "16px", textAlign: "center" });
const metricStyle = css({ display: "inline-block", padding: "2px 10px", borderRadius: "5px", boxShadow: "0 0 3px rgba(0,0,0,1)" });
const metricsStyle = css({ display: "flex", flexDirection: "row", justifyContent: "center", gap: "10px" });
const verticalSeparator = css({ display: "inline-block", width: "1px", height: "10px", backgroundColor: "#36454F" });
const red = css({ color: "#c86e69" });
const green = css({ color: "#7f8e74" });
const blue = css({ color: "#6e8296" });
const yellow = css({ color: "#c8be82" });

export const initialState = { day: "...", month: "...", dayNum: "...", year: "...", time: "...", ampm: "...", cpuUsage: 0, memoryUsage: 0, disk: 0, ethernet: "N/A", wifi: { ssid: "N/A", ip: "N/A" }, weather: { temp: "...", forecast: "..." } };

export const updateState = (event, previousState) => {
  if (event.error) return { ...previousState, warning: `We got an error: ${event.error}` };
  if (event.type === "UPDATE_STATS") {
    return { ...previousState, day: event.data.date_day, month: event.data.date_month, dayNum: event.data.date_day_num, year: event.data.date_year, time: event.data.date_time, ampm: event.data.date_ampm.toLowerCase(), cpuUsage: parseFloat(event.data.cpu_usage).toFixed(2), memoryUsage: parseFloat(event.data.mem_usage).toFixed(0), disk: event.data.disk_usage, ethernet: event.data.eth_ip, wifi: { ssid: event.data.ssid, ip: event.data.wifi_ip } };
  }
  if (event.type === "WEATHER_UPDATE") {
    weatherFetched = true;
    return { ...previousState, weather: event.data.weather };
  }
  return { ...previousState, warning: false };
};

export const render = ({ warning, day, month, dayNum, year, time, ampm, cpuUsage, memoryUsage, ethernet, wifi, disk, weather }) => {
  if (warning) return <div>{warning}</div>;
  return (
    <div className={containerClassName}>
      <div className={metricsStyle}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
          <div className={metricStyle}><span className={green}>⌚</span> {time} {ampm}</div>
          <div className={metricStyle}><span className={yellow}>🗓</span> {day}, {month} {dayNum} {year}</div>
          <div className={metricStyle}><span className={red}>🌡</span> {weather.temp}&deg;F</div>
          <div className={metricStyle}><span className={blue}>☁</span> {weather.forecast}</div>
          <div className={metricStyle}><span className={blue}>⚙</span> {cpuUsage}%</div>
          <div className={metricStyle}><span className={green}>💾</span> {memoryUsage}%</div>
          <div className={metricStyle}>💾 {disk}%</div>
          <div className={metricStyle}>📡 {wifi.ssid === "" ? "N/A" : <>{wifi.ssid} <div className={verticalSeparator}/> {wifi.ip}</>}</div>
          <div className={metricStyle}><span className={blue}>🔌</span>{ethernet === "" ? " N/A" : <> {ethernet}</>}</div>
        </div>
      </div>
    </div>
  );
};
