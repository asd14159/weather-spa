import type {
    City,
    Period,
    HourlyMetricBase,
    HourlyMetricDetail,
    DailyMetric,
} from "types/weather"

type Props = {
    city: City;
    period: Period;
    hourlyMetricBase: HourlyMetricBase;
    hourlyMetricDetail: HourlyMetricDetail[];
    dailyMetric: DailyMetric[];
    onCityChange: (city: City) => void;
    onPeriodChange: (period: Period) => void;

    onHourlyMetricBaseChange: (metric: HourlyMetricBase) => void;
    onHourlyMetricDetailChange: (metric: HourlyMetricDetail[]) => void;

    onDailyMetricChange: (metric: DailyMetric[]) => void;
}

export function WeatherControls({
    city,
    period,
    hourlyMetricBase,
    hourlyMetricDetail,
    dailyMetric,
    onCityChange,
    onPeriodChange,
    onHourlyMetricBaseChange,
    onHourlyMetricDetailChange,
    onDailyMetricChange,
}: Props) {
    return (
        <div>
            <label htmlFor="city">都市：</label>
            <select
                id="city"
                value={city}
                onChange={(e) => onCityChange(e.target.value as City)}
            >
                <option value="東京">東京</option>
                <option value="大阪">大阪</option>
                <option value="札幌">札幌</option>
                <option value="福岡">福岡</option>
                <option value="那覇">那覇</option>
            </select>

        <br />

            <label>期間：</label>
            <select
                id="period"
                value={period}
                onChange={(e) => onPeriodChange(e.target.value as Period)}
            >
                <option value="48h">48時間</option>
                <option value="7d">7日</option>
            </select>

            <br />

        {period === "48h" && (
            <>
                <label htmlFor="hourlyBase">指標：</label>
                <select 
                    id="hourlyBase"
                    value={hourlyMetricBase}
                    onChange={(e) => 
                        onHourlyMetricBaseChange(e.target.value as HourlyMetricBase)
                    }
                >
                    <option value="temperature">気温</option>
                    <option value="rain">降水量</option>
                    <option value="wind">風速</option>
                </select>

                {hourlyMetricBase === "temperature" && (
                    <div>
                        <label>
                            <input 
                                type="checkbox"
                                checked={hourlyMetricDetail.includes("temperature")}
                                onChange={(e) => {
                                    const next: HourlyMetricDetail[] = e.target.checked
                                        ? [...hourlyMetricDetail, "temperature"]
                                        : hourlyMetricDetail.filter((v) => v !== "temperature")
                                
                                    onHourlyMetricDetailChange(
                                        next.length === 0 ? ["temperature"] : next
                                    );
                                }}
                            />
                            気温
                        </label>

                        <label>
                            <input 
                                type="checkbox"
                                checked={hourlyMetricDetail.includes("apparent")}
                                onChange={(e) => {
                                    const next: HourlyMetricDetail[] = e.target.checked
                                        ? [...hourlyMetricDetail, "apparent"]
                                        : hourlyMetricDetail.filter((v) => v !== "apparent")
                                
                                    onHourlyMetricDetailChange(
                                        next.length === 0 ? ["apparent"] : next
                                    );
                                }}
                            />
                            体感温度
                        </label>
                    </div>
                )}
            </>
        )}

        {period === "7d" && (
            <div>
                <span>指標：</span>
                
                    <label>
                        <input  
                            type="checkbox"
                            checked={dailyMetric.includes("temp_max")}
                            onChange={(e) => {
                                const next: DailyMetric[] = e.target.checked
                                    ? [...dailyMetric, "temp_max"]
                                    : dailyMetric.filter((v) => v !== "temp_max");
                                
                                onDailyMetricChange(
                                    next.length === 0 ? ["temp_max"] : next
                                );
                            }}
                        />
                        最高気温
                    </label>

                    <label>
                        <input  
                            type="checkbox"
                            checked={dailyMetric.includes("temp_min")}
                            onChange={(e) => {
                                const next: DailyMetric[] = e.target.checked
                                    ? [...dailyMetric, "temp_min"]
                                    : dailyMetric.filter((v) => v !== "temp_min");
                                    
                                onDailyMetricChange(
                                    next.length === 0 ? ["temp_min"] : next
                                );
                            }}
                        />
                        最低気温
                    </label>
                </div>
            )}
        </div>
    );
}