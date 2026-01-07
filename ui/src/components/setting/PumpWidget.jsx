import { useState, useEffect } from "react";
import { Droplets, Loader2, Power } from "lucide-react";
import { toast } from "sonner";
import controlService from "../../services/controlService";

const PumpWidget = ({
  deviceId,
  initialStatus,
  isAutoMode,
  onStatusChange,
}) => {
  const [status, setStatus] = useState(initialStatus || "OFF");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialStatus) setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    if (isAutoMode) {
      setStatus("OFF");
    }
  }, [isAutoMode]);

  const handleToggle = async () => {
    if (!deviceId) return toast.error("Không xác định được thiết bị");

    if (isAutoMode)
      return toast.warning(
        "Vui lòng tắt chế độ Tự động trước khi điều khiển tay"
      );

    setLoading(true);
    const nextAction = status === "ON" ? "OFF" : "ON";

    console.log(`[PumpWidget] Người dùng bấm nút: ${status} -> ${nextAction}`);

    try {
      const response = await controlService.togglePump(deviceId, nextAction);

      if (response) {
        setStatus(nextAction); // ✅ GIỮ LOGIC CŨ
        toast.success(`Đã ${nextAction === "ON" ? "BẬT" : "TẮT"} máy bơm`);
        if (onStatusChange) onStatusChange();
      }
    } catch (error) {
      console.error("[PumpWidget] Lỗi xử lý điều khiển:", error);
      toast.error("Lệnh điều khiển thất bại");
    } finally {
      setLoading(false);
    }
  };

  const isOn = status === "ON";

  return (
    <div
      className={`bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 h-full flex flex-col justify-between ${
        isAutoMode ? "opacity-80" : ""
      }`}
    >
      <div>
        <h3 className="font-bold flex items-center gap-2 mb-1 text-gray-700">
          <Droplets size={20} className="text-blue-500" /> Điều khiển bơm
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          {isAutoMode ? "Đang chạy theo cảm biến" : "Chế độ thủ công (Manual)"}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end gap-4">
        <div
          className={`flex items-center gap-4 p-4 rounded-2xl border ${
            isOn
              ? "bg-emerald-50 border-emerald-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div
            className={`p-3 rounded-xl ${
              isOn ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
            } text-white`}
          >
            <Power size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Trạng thái hiện tại
            </p>
            <p
              className={`text-xl font-black ${
                isOn ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              {isOn ? "ĐANG CHẠY" : "ĐANG TẮT"}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading || isAutoMode}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
            isAutoMode
              ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
              : isOn
              ? "bg-red-500 hover:bg-red-600 shadow-red-200"
              : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : isAutoMode ? (
            "AUTO MODE ON"
          ) : isOn ? (
            "TẮT MÁY BƠM"
          ) : (
            "BẬT MÁY BƠM"
          )}
        </button>
      </div>
    </div>
  );
};

export default PumpWidget;
