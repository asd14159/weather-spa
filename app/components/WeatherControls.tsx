import type {
    City,
    Period,
    HourlyMetric,
    DailyMetric,
} from "types/weather"

type Props = {
    city: City;
    period: Period;
    hourlyMetric: HourlyMetric;
    dailyMetric: DailyMetric;
    onCityChange: (city: City) => void;
    onPeriodChange: (period: Period) => void;
    onHourlyMetricChange: (metric: HourlyMetric) => void;
    onDailyMetricChange: (metric: DailyMetric) => void;
}

export function WeatherControls({
    city,
    period,
    hourlyMetric,
    dailyMetric,
    onCityChange,
    onPeriodChange,
    onHourlyMetricChange,
    onDailyMetricChange,
}: Props) {
    return (
        <>
        <label>
            都市:
            <select
                value={city}
                onChange={(e) => onCityChange(e.target.value as City)}
            >
                <option value="東京">東京</option>
                <option value="大阪">大阪</option>
                <option value="札幌">札幌</option>
                <option value="福岡">福岡</option>
                <option value="那覇">那覇</option>
            </select>
        </label>

        <br />

        <label>
            期間：
            <select value={period}
                onChange={(e) => onPeriodChange(e.target.value as Period)}
        >
                <option value="48h">48時間</option>
                <option value="7d">7日</option>
            </select>
        </label>

        <br />

        {period === "48h" && (
            <label>
            指標：
            <select value={hourlyMetric}
            onChange={(e) => 
                onHourlyMetricChange(e.target.value as HourlyMetric)
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
                onDailyMetricChange(e.target.value as DailyMetric)
            }
            >
                <option value="temp_max">最高気温</option>
                <option value="temp_min">最低気温</option>
            </select>
            </label>
        )}
        </>
    );
}