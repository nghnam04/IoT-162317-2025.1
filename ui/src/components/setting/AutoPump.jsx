import React, { useState, useEffect } from "react";
import {
  Activity,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import controlService from "../../services/controlService";

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_LABELS = {
  Mon: "T2",
  Tue: "T3",
  Wed: "T4",
  Thu: "T5",
  Fri: "T6",
  Sat: "T7",
  Sun: "CN",
};

const AutoPump = ({ deviceId, config, pumpStatus, onSave, isUpdating }) => {
  const [localIsAuto, setLocalIsAuto] = useState(false);
  const [moistureThreshold, setMoistureThreshold] = useState(40);
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [schedules, setSchedules] = useState([]);

  const [newTime, setNewTime] = useState("08:00");
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    if (config) {
      setMoistureThreshold(config.threshold_moisture ?? 40);
      setDurationSeconds(config.duration_seconds ?? 30);

      const formattedSchedules = (config.schedules || []).map((s) => {
        if (typeof s.time === "object") {
          const h = String(s.time.hour).padStart(2, "0");
          const m = String(s.time.minute).padStart(2, "0");
          return { ...s, time: `${h}:${m}` };
        }
        return s;
      });
      setSchedules(formattedSchedules);
    }
  }, [config]);

  useEffect(() => {
    setLocalIsAuto(pumpStatus === "AUTO");
  }, [pumpStatus]);

  const handleToggleAuto = async () => {
    const nextState = !localIsAuto;
    setLocalIsAuto(nextState);

    const nextAction = nextState ? "AUTO" : "OFF";
    try {
      await controlService.togglePump(deviceId, nextAction);
      toast.success(
        nextAction === "AUTO" ? "Đã bật Tự động" : "Đã tắt Tự động"
      );
    } catch (err) {
      setLocalIsAuto(!nextState);
      toast.error("Không thể chuyển đổi chế độ");
    }
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addSchedule = () => {
    if (selectedDays.length === 0) return;
    const newSched = { time: newTime, days: [...selectedDays], enabled: true };
    setSchedules([...schedules, newSched]);
    setSelectedDays([]);
  };

  const removeSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const prepareAndSave = () => {
    const cleanSchedules = schedules.map((s) => {
      const [hourStr, minStr] = s.time.split(":");
      return {
        time: {
          hour: Number(hourStr),
          minute: Number(minStr),
        },
        days: s.days,
        enabled: s.enabled ?? true,
      };
    });

    onSave({
      enabled: localIsAuto,
      threshold_moisture: Number(moistureThreshold),
      duration_seconds: Number(durationSeconds),
      schedules: cleanSchedules,
    });
  };

  return (
    <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <div
            className={`p-4 rounded-2xl transition-all duration-300 ${
              localIsAuto
                ? "bg-emerald-500 text-white shadow-lg"
                : "bg-gray-800 text-white shadow-md"
            }`}
          >
            <Activity size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Chế độ Tự động (Auto)
            </h3>
            <p className="text-sm text-gray-500 italic">
              Dựa trên cảm biến & Lịch trình
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          type="button"
          onClick={handleToggleAuto}
          className={`w-16 h-8 rounded-full relative transition-all duration-500 ${
            localIsAuto ? "bg-emerald-500" : "bg-gray-800"
          }`}
        >
          <div
            className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
              localIsAuto ? "left-9" : "left-1"
            }`}
          />
        </button>
      </div>

      <div
        className={`transition-all duration-500 space-y-8 ${
          !localIsAuto
            ? "opacity-30 grayscale pointer-events-none"
            : "opacity-100"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100">
            <div className="flex justify-between mb-4">
              <label className="text-xs font-black text-emerald-700 uppercase">
                Ngưỡng độ ẩm
              </label>
              <span className="text-xl font-black text-emerald-600">
                {moistureThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={moistureThreshold}
              onChange={(e) => setMoistureThreshold(Number(e.target.value))}
              className="w-full h-2 bg-emerald-200 rounded-lg appearance-none accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col justify-center">
            <label className="text-xs font-black text-blue-700 uppercase mb-3">
              Thời gian tưới mỗi lần
            </label>
            <div className="flex items-center gap-3">
              <Clock className="text-blue-400" size={20} />
              <input
                type="number"
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="w-full p-2 text-center font-bold text-blue-600 bg-white border border-blue-200 rounded-xl outline-none"
              />
              <span className="text-sm font-bold text-blue-400 uppercase">
                Giây
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-200">
          <div className="flex items-center gap-2 mb-6 font-bold text-gray-700">
            <Calendar size={20} className="text-emerald-600" /> Lịch trình tưới
            định kỳ
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="p-3 border-2 border-gray-100 rounded-xl font-bold text-gray-700 outline-none focus:border-emerald-500"
              />
              <div className="flex gap-1.5 bg-gray-50 p-1.5 rounded-xl">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${
                      selectedDays.includes(day)
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {DAY_LABELS[day]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={addSchedule}
                className="ml-auto flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-700 transition-all"
              >
                <Plus size={20} /> Thêm lịch
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
            {schedules.length > 0 ? (
              schedules.map((sched, idx) => (
                <div
                  key={idx}
                  className="bg-white px-5 py-4 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-gray-800">
                      {sched.time}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {sched.days.map((d) => (
                        <span
                          key={d}
                          className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-black uppercase"
                        >
                          {DAY_LABELS[d]}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSchedule(idx)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-400 text-sm italic border-2 border-dashed border-gray-200 rounded-3xl">
                Chưa có lịch trình nào được thiết lập
              </div>
            )}
          </div>
        </div>

        <button
          onClick={prepareAndSave}
          disabled={isUpdating}
          className="w-full py-5 bg-gray-900 hover:bg-black text-white rounded-3xl font-black flex justify-center items-center gap-3 shadow-2xl transition-all disabled:opacity-70"
        >
          {isUpdating ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Save size={22} />
          )}
          LƯU CẤU HÌNH
        </button>
      </div>
    </section>
  );
};

export default AutoPump;
