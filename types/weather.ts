export type City = "東京" | "大阪" | "札幌" | "福岡" | "那覇";
export type Period = "48h" | "7d";
export type HourlyMetricBase = "temperature" | "rain" | "wind";
export type HourlyMetricDetail = "temperature" | "apparent";
export type DailyMetric = "temp_max" | "temp_min";

export type HourlyData = {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    wind_speed_10m: number[];
};

export type DailyData = {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
};

