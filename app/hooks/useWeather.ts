"use client";
import { useState, useEffect, useCallback } from "react";
import type { City, Period, HourlyMetric, DailyMetric, HourlyData, DailyData } from "types/weather";
import { ChartDataItem } from "types/chart";

export function useWeather() {
  const [city, setCity] = useState<City>("東京");
  const [period, setPeriod] = useState<Period>("48h");
  const [hourlyMetric, setHourlyMetric] = useState<HourlyMetric>("temperature");
  const [dailyMetric, setDailyMetric] = useState<DailyMetric>("temp_max");

  const [hourlyData, setHourlyData] = useState<HourlyData | null>(null);
  const [dailyData, setDailyData] = useState<DailyData | null>(null);  
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<string | null>(null);

  const cities: Record<City, { lat:number; lon:number }> = {
    東京: { lat: 35.6895, lon: 139.6917 },
    大阪: { lat: 34.6937, lon: 135.5023 },
    札幌: { lat: 43.0642, lon: 141.3469 },
    福岡: { lat: 33.5902, lon: 130.4017 },
    那覇: { lat: 26.2124, lon: 127.6809 }
  }

  //callbackで関数のメモ化[city,priod]が変わったときだけ新しい関数を作る
  const fetchWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { lat, lon } = cities[city];
    const url =
        period === "48h"
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
  },[city,period]);

  useEffect(() => {
    fetchWeather();
  },[fetchWeather]);

  //表示用データと単位を計算
  const data: ChartDataItem[] = 
    period === "48h" && hourlyData
      ? hourlyData.time.slice(0,48).map((t,i) => ({
        time: t,
        value:
          hourlyMetric === "temperature"
            ? hourlyData.temperature_2m[i]
            : hourlyMetric === "apparent"
              ? hourlyData.apparent_temperature[i]
              : hourlyMetric === "rain"
                ? hourlyData.precipitation[i]
                : hourlyData.wind_speed_10m[i],
        }))
      : period === "7d" && dailyData
        ? dailyData.time.map((t,i) => ({
          time: t,
          value: 
            dailyMetric === "temp_max"
              ? dailyData.temperature_2m_max[i]
              : dailyData.temperature_2m_min[i],
        }))
        : [];

  const unitMapHourly: Record<HourlyMetric, string> = {
    temperature: "℃",
    apparent: "℃",
    rain: "mm",
    wind: "m/s",
  };

  const unitMapDaily: Record<DailyMetric, string> = {
    temp_max: "℃",
    temp_min: "℃",
  };

  const unit =
    period === "48h"
        ? unitMapHourly[hourlyMetric]
        : unitMapDaily[dailyMetric];

  return {
    city,
    setCity,
    period,
    setPeriod,
    hourlyMetric,
    setHourlyMetric,
    dailyMetric,
    setDailyMetric,
    data,
    unit,
    loading,
    error,
    refetch: fetchWeather,
  };
}
