import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Thermometer,
  Droplets,
  Sun,
  Sprout,
  Loader2,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import HistoryChart from "../components/dashboard/HistoryChart";

import deviceService from "../services/deviceService";
import monitoringService from "../services/monitoringService";

const Dashboard = () => {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  // Lấy danh sách thiết bị
  const {
    data: devices,
    isLoading: isLoadingDevices,
    error: devicesError,
  } = useQuery({
    queryKey: ["userDevices"],
    queryFn: () => deviceService.getDevices(),
  });

  // Lấy dữ liệu Realtime
  const { data: currentResponse } = useQuery({
    queryKey: ["monitorCurrent", selectedDeviceId],
    queryFn: () => monitoringService.getCurrentData(selectedDeviceId),
    enabled: !!selectedDeviceId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  // Lấy dữ liệu lịch sử
  const { data: historyResponse } = useQuery({
    queryKey: ["monitorHistory", selectedDeviceId],
    queryFn: async () => {
      const to = new Date().toISOString();
      const from = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();
      return await monitoringService.getHistory(selectedDeviceId, from, to);
    },
    enabled: !!selectedDeviceId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  const rawHistory = useMemo(
    () => (Array.isArray(historyResponse) ? historyResponse : []),
    [historyResponse]
  );

  // Record mới nhất
  const latestRecord = useMemo(() => {
    if (!rawHistory.length) return null;
    return [...rawHistory].sort(
      (a, b) =>
        new Date(b.timestamp || b.createdAt) -
        new Date(a.timestamp || a.createdAt)
    )[0];
  }, [rawHistory]);

  // Record cuối cùng có dữ liệu khác null
  const lastValidRecord = useMemo(() => {
    for (let i = 0; i < rawHistory.length; i++) {
      const r = rawHistory[i];
      if (
        r &&
        (r.temperature != null ||
          r.humidity != null ||
          r.soil_moisture != null ||
          r.light_level != null)
      ) {
        return r;
      }
    }
    return null;
  }, [rawHistory]);

  const isSensorOnline = Boolean(currentResponse?.success);

  const statSource = useMemo(() => {
    if (isSensorOnline && latestRecord) return latestRecord;
    return lastValidRecord;
  }, [isSensorOnline, latestRecord, lastValidRecord]);

  // stat card data
  const displayData = useMemo(
    () => ({
      temp: statSource?.temperature ?? "--",
      humidity: statSource?.humidity ?? "--",
      soil_moisture: statSource?.soil_moisture ?? "--",
      light: statSource?.light_level ?? statSource?.light ?? "--",
      pump_status: statSource?.pump_state ?? "OFF",

      status: isSensorOnline
        ? "ONLINE"
        : lastValidRecord
        ? "OFFLINE (Saved)"
        : "OFFLINE",

      lastUpdate:
        statSource?.timestamp || statSource?.createdAt
          ? new Date(
              statSource.timestamp || statSource.createdAt
            ).toLocaleString("vi-VN")
          : "Chưa có dữ liệu",
    }),
    [statSource, isSensorOnline, lastValidRecord]
  );

  const advice = useMemo(() => {
    if (!statSource) return [];
    const tips = [];
    const t = statSource.temperature;
    const h = statSource.humidity;
    const s = statSource.soil_moisture;
    const l = statSource.light_level ?? statSource.light;

    let isStable = true;
    if (t != null) {
      if (t < 18) {
        tips.push("🌡️ Nhiệt độ thấp, nên tăng nhiệt hoặc che chắn cây.");
        isStable = false;
      } else if (t > 35) {
        tips.push("🔥 Nhiệt độ cao, nên giảm nắng hoặc tưới mát.");
        isStable = false;
      }
    }
    if (h != null) {
      if (h < 40) {
        tips.push("💧 Độ ẩm không khí thấp, nên phun sương.");
        isStable = false;
      } else if (h > 80) {
        tips.push("⚠️ Độ ẩm không khí cao, chú ý nấm mốc.");
        isStable = false;
      }
    }
    if (s != null) {
      if (s < 30) {
        tips.push("🚿 Đất khô, nên tưới nước.");
        isStable = false;
      } else if (s > 80) {
        tips.push("🌱 Đất quá ẩm, tránh tưới thêm.");
        isStable = false;
      }
    }
    if (l != null) {
      if (l < 300) {
        tips.push("☀️ Ánh sáng yếu, nên tăng chiếu sáng.");
        isStable = false;
      } else if (l > 1000) {
        tips.push("😎 Ánh sáng quá mạnh, cần che bớt nắng.");
        isStable = false;
      }
    }

    if (isStable && tips.length === 0) {
      tips.push("🌱 Môi trường đang ổn định, cây sinh trưởng tốt.");
    }

    if (t == null && h == null && s == null && l == null) {
      tips.push("ℹ️ Chưa đủ dữ liệu để đánh giá môi trường.");
    }

    return tips;
  }, [statSource]);

  // chart data
  const chartData = useMemo(() => {
    if (!rawHistory.length) return [];

    return [...rawHistory]
      .sort(
        (a, b) =>
          new Date(a.timestamp || a.createdAt) -
          new Date(b.timestamp || b.createdAt)
      )
      .slice(-50)
      .map((item) => ({
        time:
          item?.timestamp || item?.createdAt
            ? new Date(item.timestamp || item.createdAt).toLocaleTimeString(
                "vi-VN",
                { hour: "2-digit", minute: "2-digit", second: "2-digit" } // Thêm giây để thấy biểu đồ chạy realtime
              )
            : "--:--",
        temperature:
          item?.temperature != null ? Number(item.temperature) : null,
        humidity: item?.humidity != null ? Number(item.humidity) : null,
        soil_moisture:
          item?.soil_moisture != null ? Number(item.soil_moisture) : null,
        light_level:
          item?.light_level != null
            ? Number(item.light_level)
            : item?.light != null
            ? Number(item.light)
            : null,
      }));
  }, [rawHistory]);

  if (isLoadingDevices)
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );

  if (devicesError)
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-[2rem] border-2 border-dashed border-red-100">
        <p className="text-red-500 font-medium">Lỗi: {devicesError.message}</p>
      </div>
    );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Giám sát Hệ thống
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="relative inline-block">
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="pl-3 pr-10 py-2 bg-emerald-600 border-none rounded-xl text-sm font-bold text-white shadow-lg appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
              >
                <option value="" disabled>
                  --- Chọn thiết bị ---
                </option>
                {devices?.map((d) => (
                  <option
                    key={d.device_id}
                    value={d.device_id}
                    className="text-gray-800 bg-white"
                  >
                    {d.name} ({d.device_id})
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </div>
      </div>

      {!selectedDeviceId ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-[2rem] border-2 border-dashed border-emerald-100">
          <LayoutDashboard size={64} className="text-emerald-100 mb-4" />
          <p className="text-gray-400 font-medium">
            Vui lòng chọn một thiết bị để bắt đầu
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Nhiệt độ"
              value={displayData.temp}
              unit="°C"
              icon={Thermometer}
              colorClass="bg-orange-500"
            />
            <StatCard
              title="Độ ẩm khí"
              value={displayData.humidity}
              unit="%"
              icon={Droplets}
              colorClass="bg-blue-500"
            />
            <StatCard
              title="Độ ẩm đất"
              value={displayData.soil_moisture}
              unit="%"
              icon={Sprout}
              colorClass="bg-emerald-500"
            />
            <StatCard
              title="Ánh sáng"
              value={displayData.light}
              unit="Lux"
              icon={Sun}
              colorClass="bg-yellow-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
              <HistoryChart
                data={chartData}
                title="Biểu đồ lịch sử trực tuyến"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900 rounded-[2rem] p-6 text-white">
                <p className="text-xl font-black text-emerald-400">
                  {chartData.length} bản ghi gần nhất
                </p>
                <p className="text-xs text-gray-400">
                  Cập nhật: {displayData.lastUpdate}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow">
                <h3 className="font-semibold mb-2">🧠 Khuyến nghị</h3>
                <ul className="space-y-1 text-sm">
                  {advice.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
