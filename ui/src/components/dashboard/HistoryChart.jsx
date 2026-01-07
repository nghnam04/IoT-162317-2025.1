import ChartBlock from "./ChartBlock";

const HistoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        Không có dữ liệu lịch sử
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ChartBlock
        title="Nhiệt độ không khí (°C)"
        data={data}
        dataKey="temperature"
        color="#f59e0b"
        gradientId="tempGradient"
      />

      <ChartBlock
        title="Độ ẩm không khí (%)"
        data={data}
        dataKey="humidity"
        color="#06b6d4"
        gradientId="humidityGradient"
      />

      <ChartBlock
        title="Độ ẩm đất (%)"
        data={data}
        dataKey="soil_moisture"
        color="#10b981"
        gradientId="soilGradient"
      />

      <ChartBlock
        title="Cường độ ánh sáng (Lux)"
        data={data}
        dataKey="light_level"
        color="#eab308"
        gradientId="lightGradient"
      />
    </div>
  );
};

export default HistoryChart;
