import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Settings2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import deviceService from "../services/deviceService";
import PumpWidget from "../components/setting/PumpWidget";
import AutoPump from "../components/setting/AutoPump";

const SettingsPage = () => {
  const queryClient = useQueryClient();
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const { data: devices, isLoading: isLoadingList } = useQuery({
    queryKey: ["userDevices"],
    queryFn: () => deviceService.getDevices(),
  });

  useEffect(() => {
    if (devices?.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(devices[0].device_id || devices[0]._id);
    }
  }, [devices, selectedDeviceId]);

  const selectedDevice = devices?.find(
    (d) => (d.device_id || d._id) === selectedDeviceId
  );

  const { data: monitor } = useQuery({
    queryKey: ["monitor", selectedDeviceId],
    queryFn: () => deviceService.getCurrentMonitor(selectedDeviceId),
    enabled: !!selectedDeviceId,
    refetchInterval: 2000,
  });

  const pumpStatus = monitor?.pump_status || "OFF";

  const configMutation = useMutation({
    mutationFn: (payload) =>
      deviceService.updateAutomation(selectedDeviceId, payload),
    onSuccess: () => {
      toast.success("Cập nhật cấu hình thành công");
      queryClient.invalidateQueries(["userDevices"]);
    },
    onError: () => toast.error("Lỗi khi lưu cấu hình"),
  });

  const handleSaveAutomation = (autoPumpPayload) => {
    configMutation.mutate({ auto_pump: autoPumpPayload });
  };

  if (isLoadingList)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );

  // Guard clause để tránh lỗi khi selectedDevice chưa load xong
  if (!selectedDevice) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2 text-gray-800">
            <Settings2 className="text-emerald-600" /> Cấu hình Thiết bị
          </h1>
          <p className="text-sm text-gray-500 mt-1 pl-9">
            Tùy chỉnh chế độ vận hành và lịch trình tưới tự động
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <select
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
            className="w-full appearance-none bg-emerald-50 border border-emerald-100 text-emerald-800 py-3 px-4 pr-10 rounded-xl font-bold outline-none"
          >
            {devices?.map((d) => (
              <option key={d.device_id || d._id} value={d.device_id || d._id}>
                {d.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <PumpWidget deviceId={selectedDeviceId} pumpStatus={pumpStatus} />

        <AutoPump
          deviceId={selectedDeviceId}
          config={selectedDevice?.automation_configs?.auto_pump}
          pumpStatus={pumpStatus}
          onSave={handleSaveAutomation}
          isUpdating={configMutation.isPending}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
