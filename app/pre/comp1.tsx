"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

import { useEffect, useState } from "react";

export default function Page() {

  type City = "東京" | "大阪" | "札幌" | "福岡" | "那覇";
  type Period = "48h" | "7d";
  type HourlyMetric = "temperature" | "apparent" | "rain" | "wind";
  type DailyMetric = "temp_max" | "temp_min";

  type DataPoint = {
    name: string;
    value: number;
  }

  type HourlyData = {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    wind_speed_10m: number[];
  };

  type DailyData = {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };

  const hourlyUnitMap: Record<HourlyMetric,string> = {
    temperature: "℃",
    apparent: "℃",
    rain: "mm",
    wind: "m/s",
  };

  const dailyUnitMap: Record<DailyMetric,string> = {
    temp_max: "℃",
    temp_min: "℃",
  };

  const [city, setCity] = useState<City>("東京");
  // const [metric, setMetric] = useState<Metric>("temperature");
  const [period, setPeriod] = useState<Period>("48h");
  const [hourlyMetric, setHourlyMetric] = useState<HourlyMetric>("temperature");
  const [dailyMetric, setDailyMetric] = useState<DailyMetric>("temp_max");


  const [hourlyData, setHourlyData] = useState<HourlyData | null>(null);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);  
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);

  const cities = {
    東京: { lat: 35.6895, lon: 139.6917 },
    大阪: { lat: 34.6937, lon: 135.5023 },
    札幌: { lat: 43.0642, lon: 141.3469 },
    福岡: { lat: 33.5902, lon: 130.4017 },
    那覇: { lat: 26.2124, lon: 127.6809 }
  }

  const unit = period ==="48h"
    ? hourlyUnitMap[hourlyMetric]
    : dailyUnitMap[dailyMetric];

  useEffect(() => {
    fetchWeather();
  },[city,period]);

  const fetchWeather = async() => {
    setLoading(true);
    setError(null);
    const { lat, lon } = cities[city];
    const url = period === "48h"
      ? `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,precipitation,wind_speed_10m&timezone=auto`
      : `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
      const res = await fetch(url);
      if(!res.ok){
        if(res.status === 429) {
          throw new Error("アクセスが集中しています。しばらくして再試行してください。");
        }
        throw new Error("サーバーエラーが発生しました");
      }
      const json = await res.json();
      if(period === "48h"){
        setHourlyData(json.hourly);
        setDailyData(null);
      } else {
        setDailyData(json.daily);
        setHourlyData(null);
      }
    } catch(e) {
      if(e instanceof Error){
        setError(e.message);
      } else {
        setError("不明なエラーが発生しました")
      }
    } finally {
      setLoading(false);
    }
  };

  let values: number[] = [];

  if(period === "48h" && hourlyData){
    switch(hourlyMetric) {
      case "temperature": 
        values = hourlyData.temperature_2m.slice(0,48);
        break;
      case "apparent": 
        values = hourlyData.apparent_temperature.slice(0,48);
        break;
      case "rain": 
        values = hourlyData.precipitation.slice(0,48);
        break;
      case "wind": 
        values = hourlyData.wind_speed_10m.slice(0,48);
        break;
    }
  }
  if(period === "7d" && dailyData){
    values = dailyMetric === "temp_max" ? dailyData.temperature_2m_max : dailyData.temperature_2m_min;
  }

  const labels = 
    period === "48h" && hourlyData
      ? hourlyData.time.slice(0,48)
      : period === "7d" && dailyData
        ? dailyData.time
        : [];

  const chartData: DataPoint[] = values.map((v,i) => ({
      name: labels[i]
        ? period === "48h"
          ? labels[i].slice(11,16)
          : labels[i].slice(5)
        : "",
      value: v,
  }));

  if (loading) return <p>読み込み中…</p>;

  if(error){
    return (
      <main>
        <h1>Weather SPA</h1>
        <p>{error}</p>
        <button onClick={fetchWeather}>
          再読み込み
        </button>
      </main>
    );
  }

  return (
    <main>
      <h1>Weather SPA</h1>

      <label>
        都市:
        <select value={city}
        onChange={(e) => setCity(e.target.value as City)}
        >
          <option value="東京">東京</option>
          <option value="大阪">大阪</option>
          <option value="札幌">札幌</option>
          <option value="福岡">福岡</option>
          <option value="那覇">那覇</option>
        </select>
      </label>

      <br />

      {period === "48h" && (
        <label>
          指標：
          <select value={hourlyMetric}
          onChange={(e) => 
            setHourlyMetric(e.target.value as HourlyMetric)
          }
          >
            <option value="temperature">気温</option>
            <option value="apparent">体感温度</option>
            <option value="rain">降水量</option>
            <option value="wind">風速</option>
          </select>
        </label>
      )}

      {period === "7d" && (
        <label>
          指標：
          <select value={dailyMetric}
          onChange={(e) => 
            setDailyMetric(e.target.value as DailyMetric)
          }
          >
            <option value="temp_max">最高気温</option>
            <option value="temp_min">最低気温</option>
          </select>
        </label>
      )}

      <br />

      <label>
        期間：
        <select value={period}
        onChange={(e) => 
          setPeriod(e.target.value as Period)
        }
        >
          <option value="48h">48時間</option>
          <option value="7d">7日</option>
        </select>
      </label>

      <hr />

      <p>選択中の都市：{city}</p>
      {period === "48h" && (
        <p>選択中の指標：{hourlyMetric}</p>
      )}
      {period === "7d" && (
        <p>選択中の指標：{dailyMetric}</p>
      )}
      <p>選択中の期間：{period}</p>

      <div>
        <h2>データ表示</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="name"/>
            <YAxis
              label={{
                value: unit,
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value) => 
              typeof value === "number"
                ? `${value}${unit}`
                : value
              }
            />
            <Legend />
            <Line 
              type="monotone"
              dataKey="value"
              name={
                period === "48h"
                  ? hourlyMetric
                  : dailyMetric
              }
              stroke="#8884d8"
              dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        {chartData.map((point,i) => (
          <p key={i}>
            {period === "48h" 
              ? `${labels[i]?.slice(11,16)}: ` 
              : `${labels[i]?.slice(5)}: `}
            {point.value}
            {unit}
          </p>
        ))}
      </div>
    </main>
  );
}
