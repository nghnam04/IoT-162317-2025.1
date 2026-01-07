import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Cpu,
  Edit3,
  Check,
  Activity,
  Thermometer,
  Droplets,
  Waves,
  Sun,
  Shield,
  UserPlus,
  Mail,
  UserX,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import deviceService from "../../services/deviceService";
import StatItem from "../../utils/StatItem";
import ToggleSetting from "../../utils/ToggleSetting";

const DeviceDetailModal = ({ deviceId, onClose }) => {
  const queryClient = useQueryClient();
  const [shareUserId, setShareUserId] = useState("");
  const [isEditingAlias, setIsEditingAlias] = useState(false);
  const [tempAlias, setTempAlias] = useState("");
  const [tempAlerts, setTempAlerts] = useState({});

  const { data: res, isLoading } = useQuery({
    queryKey: ["deviceDetail", deviceId],
    queryFn: () => deviceService.getDeviceById(deviceId),
    enabled: !!deviceId,
  });

  const { data: users } = useQuery({
    queryKey: ["deviceUsers", deviceId],
    queryFn: () => deviceService.getDeviceUsers(deviceId),
    enabled: !!deviceId,
  });

  useEffect(() => {
    if (res?.management?.alert_settings) {
      setTempAlerts(res.management.alert_settings);
    }
  }, [res]);

  const shareMutation = useMutation({
    mutationFn: () =>
      deviceService.shareDevice(deviceId, shareUserId, "member"),
    onSuccess: () => {
      queryClient.invalidateQueries(["deviceUsers", deviceId]);
      toast.success("Đã chia sẻ quyền truy cập");
      setShareUserId("");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Lỗi khi chia sẻ"),
  });

  const removeUserMutation = useMutation({
    mutationFn: (userId) =>
      deviceService.removeUserFromDevice(deviceId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["deviceUsers", deviceId]);
      toast.success("Đã thu hồi quyền");
    },
    onError: (err) => toast.error("Lỗi khi thu hồi: " + err.message),
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings) =>
      deviceService.updatePersonalSettings(deviceId, newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries(["deviceDetail", deviceId]);
      queryClient.invalidateQueries(["userDevices"]);
      toast.success("Đã lưu cài đặt");
      setIsEditingAlias(false);
    },
    onError: (err) => toast.error("Lỗi: " + err.message),
  });

  if (isLoading)
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
        <Loader2 className="animate-spin text-white" />
      </div>
    );

  const device = res?.device;
  const mgmt = res?.management;
  const isOwner = mgmt?.role === "owner";

  const handleUpdateSetting = (updates) => {
    const payload = {
      alias_name: mgmt?.alias_name || device?.name,
      notifications: { ...mgmt?.notifications },
      alert_settings: { ...mgmt?.alert_settings },
      ...updates,
    };
    updateSettingsMutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-8 top-8 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="p-10">
          <div className="flex flex-col md:flex-row gap-8 mb-10 border-b pb-10">
            <div className="p-8 bg-emerald-50 rounded-[40px] text-emerald-600">
              <Cpu size={60} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditingAlias ? (
                  <div className="flex gap-2 items-center">
                    <input
                      className="text-2xl font-bold border-b-2 border-emerald-500 outline-none"
                      value={tempAlias}
                      onChange={(e) => setTempAlias(e.target.value)}
                      autoFocus
                    />
                    <button
                      onClick={() =>
                        handleUpdateSetting({ alias_name: tempAlias })
                      }
                      className="p-2 bg-emerald-500 text-white rounded-lg"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {mgmt?.alias_name || device?.name}
                    </h2>
                    <button
                      onClick={() => {
                        setTempAlias(mgmt?.alias_name || device?.name);
                        setIsEditingAlias(true);
                      }}
                      className="p-2 text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                      <Edit3 size={20} />
                    </button>
                  </>
                )}
              </div>
              <p className="text-gray-400 font-mono italic mb-4">
                Hardware ID: {device?.hardware_id}
              </p>
              <div className="flex gap-2">
                <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase">
                  {mgmt?.role}
                </span>
                {device?.automation_configs?.auto_pump?.enabled && (
                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                    Auto Mode ON
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-8">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={16} className="text-emerald-500" /> Ngưỡng
                    cảnh báo
                  </h4>
                  {/* Nút lưu riêng cho Alert Settings */}
                  <button
                    onClick={() =>
                      handleUpdateSetting({ alert_settings: tempAlerts })
                    }
                    disabled={updateSettingsMutation.isPending}
                    className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    {updateSettingsMutation.isPending
                      ? "Đang lưu..."
                      : "Lưu ngưỡng"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StatItem
                    icon={<Thermometer size={18} />}
                    label="Nhiệt tối đa"
                    value={tempAlerts.max_temp}
                    unit="°C"
                    onChange={(v) =>
                      setTempAlerts({ ...tempAlerts, max_temp: Number(v) })
                    }
                  />
                  <StatItem
                    icon={<Thermometer size={18} />}
                    label="Nhiệt tối thiểu"
                    value={tempAlerts.min_temp}
                    unit="°C"
                    onChange={(v) =>
                      setTempAlerts({ ...tempAlerts, min_temp: Number(v) })
                    }
                  />
                  <StatItem
                    icon={<Droplets size={18} />}
                    label="Ẩm tối đa"
                    value={tempAlerts.max_humidity}
                    unit="%"
                    onChange={(v) =>
                      setTempAlerts({ ...tempAlerts, max_humidity: Number(v) })
                    }
                  />
                  <StatItem
                    icon={<Droplets size={18} />}
                    label="Ẩm tối thiểu"
                    value={tempAlerts.min_humidity}
                    unit="%"
                    onChange={(v) =>
                      setTempAlerts({ ...tempAlerts, min_humidity: Number(v) })
                    }
                  />
                  <StatItem
                    icon={<Waves size={18} />}
                    label="Ẩm đất tối thiểu"
                    value={tempAlerts.min_soil_moisture}
                    unit="%"
                    onChange={(v) =>
                      setTempAlerts({
                        ...tempAlerts,
                        min_soil_moisture: Number(v),
                      })
                    }
                  />
                  <StatItem
                    icon={<Sun size={18} />}
                    label="Sáng tối thiểu"
                    value={tempAlerts.min_light}
                    unit="lx"
                    onChange={(v) =>
                      setTempAlerts({ ...tempAlerts, min_light: Number(v) })
                    }
                  />
                </div>
              </section>

              <section className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-emerald-600" /> Settings cá
                  nhân
                </h4>
                <div className="space-y-3">
                  <ToggleSetting
                    label="Thông báo Email"
                    active={mgmt?.notifications?.enable_email}
                    onClick={() =>
                      handleUpdateSetting({
                        notifications: {
                          ...mgmt.notifications,
                          enable_email: !mgmt.notifications.enable_email,
                        },
                      })
                    }
                  />
                  <ToggleSetting
                    label="Thông báo Push"
                    active={mgmt?.notifications?.enable_push}
                    onClick={() =>
                      handleUpdateSetting({
                        notifications: {
                          ...mgmt.notifications,
                          enable_push: !mgmt.notifications.enable_push,
                        },
                      })
                    }
                  />
                </div>
              </section>
            </div>

            <div className="space-y-8">
              {isOwner && (
                <section>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <UserPlus size={16} /> Chia sẻ thiết bị
                  </h4>
                  <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                    <input
                      type="text"
                      placeholder="Nhập User ID..."
                      className="flex-1 p-3 bg-transparent outline-none text-sm"
                      value={shareUserId}
                      onChange={(e) => setShareUserId(e.target.value)}
                    />
                    <button
                      onClick={() => shareMutation.mutate()}
                      disabled={shareMutation.isPending}
                      className="px-6 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                    >
                      {shareMutation.isPending ? "..." : "Thêm"}
                    </button>
                  </div>
                </section>
              )}
              <section>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Mail size={16} /> Thành viên quản trị
                </h4>
                <div className="space-y-2">
                  {users?.map((u) => (
                    <div
                      key={u._id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition-colors hover:bg-white"
                    >
                      <div>
                        <p className="font-bold text-gray-800">
                          {u.full_name || u.email}
                        </p>
                        <p className="text-xs text-emerald-600">{u.email}</p>
                        <p
                          className={`text-[10px] uppercase font-bold mt-1 ${
                            u.role === "owner"
                              ? "text-amber-500"
                              : "text-gray-400"
                          }`}
                        >
                          {u.role}
                        </p>
                      </div>
                      {isOwner && u.role !== "owner" && (
                        <button
                          onClick={() =>
                            window.confirm(`Xóa quyền ${u.email}?`) &&
                            removeUserMutation.mutate(u.user_id)
                          }
                          disabled={removeUserMutation.isPending}
                          className="p-2 text-red-300 hover:text-red-500 rounded-lg"
                        >
                          {removeUserMutation.isPending ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <UserX size={18} />
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailModal;
