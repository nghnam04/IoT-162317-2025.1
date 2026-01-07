import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Cpu, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import deviceService from "../services/deviceService";
import DeviceDetailModal from "../components/device/DeviceDetailModal";
import Input from "../utils/Input";

const getTypeStyles = (type) => {
  const t = type?.toUpperCase();
  if (t?.includes("TEMP") || t?.includes("NHIỆT"))
    return "bg-orange-100 text-orange-600 border-orange-200";
  if (t?.includes("HUMID") || t?.includes("ẨM"))
    return "bg-blue-100 text-blue-600 border-blue-200";
  if (t?.includes("PUMP") || t?.includes("BƠM"))
    return "bg-emerald-100 text-emerald-600 border-emerald-200";
  return "bg-purple-100 text-purple-600 border-purple-200";
};

const DeviceManager = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [formData, setFormData] = useState({
    hardware_id: "",
    name: "",
    type: "",
  });

  const { data: devices, isLoading } = useQuery({
    queryKey: ["userDevices"],
    queryFn: () => deviceService.getDevices(),
  });

  const addMutation = useMutation({
    mutationFn: (data) =>
      deviceService.addDevice(data.hardware_id, data.name, data.type),
    onSuccess: () => {
      queryClient.invalidateQueries(["userDevices"]);
      toast.success("Đã thêm thiết bị mới");
      setIsAddModalOpen(false);
      setFormData({ hardware_id: "", name: "", type: "" });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Lỗi khi thêm"),
  });

  const deleteMutation = useMutation({
    mutationFn: (deviceId) => deviceService.deleteDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries(["userDevices"]);
      toast.success("Đã xóa thiết bị");
    },
    onError: (err) => toast.error("Lỗi khi xóa: " + err.message),
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center p-32 space-y-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-gray-400 font-medium">Đang tải thiết bị...</p>
      </div>
    );

  return (
    <div className="max-w-full px-6 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Quản lý Thiết bị
          </h1>
          <p className="text-gray-500">
            Giám sát và kết nối các điểm nút cảm biến của bạn
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Thêm thiết bị
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {devices?.map((dev) => (
          <div
            key={dev.device_id}
            className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="p-6 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Cpu size={40} />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1 leading-none">
                      {dev.alias_name ? `${dev.alias_name}` : ` ${dev.name}`}
                    </h3>
                    <p className="text-sm font-mono text-gray-400">
                      ID: {dev.device_id}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getTypeStyles(
                      dev.type
                    )}`}
                  >
                    {dev.type || "SENSOR"}
                  </span>
                </div>

                <div className="flex items-center gap-6 py-2">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={16} />
                    <span className="text-sm">
                      {new Date(dev.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      dev.role === "owner"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    Vai trò: {dev.role}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => setSelectedDeviceId(dev.device_id)}
                    className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-all border border-gray-100"
                  >
                    Xem thông tin chi tiết
                  </button>
                  {dev.role === "owner" && (
                    <button
                      onClick={() =>
                        window.confirm(
                          `Xác nhận xóa thiết bị "${dev.name}"?`
                        ) && deleteMutation.mutate(dev.device_id)
                      }
                      className="px-5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Đăng ký thiết bị
            </h2>
            <div className="space-y-4">
              <Input
                label="Hardware ID"
                value={formData.hardware_id}
                onChange={(v) => setFormData({ ...formData, hardware_id: v })}
              />
              <Input
                label="Tên thiết bị"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
              />
              <Input
                label="Loại"
                value={formData.type}
                onChange={(v) => setFormData({ ...formData, type: v })}
              />
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-4 font-bold text-gray-400 uppercase text-xs"
                >
                  Hủy
                </button>
                <button
                  onClick={() => addMutation.mutate(formData)}
                  disabled={addMutation.isPending}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100"
                >
                  {addMutation.isPending ? "Đang lưu..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDeviceId && (
        <DeviceDetailModal
          deviceId={selectedDeviceId}
          onClose={() => setSelectedDeviceId(null)}
        />
      )}
    </div>
  );
};

export default DeviceManager;
