import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SafeNumber from "../../utils/SafeNumber";

const ChartBlock = ({ title, color, gradientId, dataKey, data }) => {
  const safeData = (data || []).map((d) => ({
    ...d,
    [dataKey]: SafeNumber(d[dataKey]),
  }));

  const hasValidData = safeData.some((d) => d[dataKey] != null);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[300px]">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>

      {!hasValidData ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          <p>Không có dữ liệu lịch sử</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={safeData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f3f4f6"
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={3}
              fill={`url(#${gradientId})`}
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ChartBlock;
