import axiosInstance from "../api/axios";

const deviceService = {
  // Tạo device mới: POST /devices
  addDevice: async (hardware_id, name, type) => {
    console.log("[deviceService] Đang tạo thiết bị mới:", {
      hardware_id,
      name,
    });
    const res = await axiosInstance.post("/devices", {
      hardware_id,
      name,
      type,
    });
    return res.data.data || res.data;
  },

  // Lấy danh sách devices của user: GET /devices
  getDevices: async () => {
    console.log("[deviceService] Đang lấy danh sách thiết bị...");
    try {
      const res = await axiosInstance.get("/devices");
      console.log(
        "[deviceService] Danh sách thiết bị nhận được:",
        res.data.data
      );
      return res.data.data || [];
    } catch (error) {
      console.error("[deviceService] Lỗi getDevices:", error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết device: GET /devices/{deviceId}
  getDeviceById: async (deviceId) => {
    console.log(`[deviceService] Đang lấy chi tiết thiết bị: ${deviceId}`);
    const res = await axiosInstance.get(`/devices/${deviceId}`);
    return res.data.data;
  },

  // Xóa device (owner only): DELETE /devices/{deviceId}
  deleteDevice: async (deviceId) => {
    console.log(`[deviceService] Đang xóa thiết bị (Owner): ${deviceId}`);
    const res = await axiosInstance.delete(`/devices/${deviceId}`);
    return res.data;
  },

  // Cập nhật automation configs (owner only): PUT /devices/{deviceId}/automation
  updateAutomation: async (deviceId, automation_configs) => {
    console.log(
      `[deviceService] Cập nhật Automation (Owner) cho ${deviceId}:`,
      automation_configs
    );
    const res = await axiosInstance.put(`/devices/${deviceId}/automation`, {
      automation_configs: automation_configs,
    });
    return res.data;
  },

  // Share device với user khác (owner only): POST /devices/{deviceId}/share
  shareDevice: async (deviceId, userId, role = "member") => {
    console.log(
      `[deviceService] Chia sẻ thiết bị ${deviceId} cho user: ${userId}`
    );
    const res = await axiosInstance.post(`/devices/${deviceId}/share`, {
      user_id: userId,
      role: role,
    });
    return res.data;
  },

  // Xóa user khác khỏi device (owner only): DELETE /devices/{deviceId}/users/{userId}
  removeUserFromDevice: async (deviceId, userId) => {
    console.log(
      `[deviceService] Xóa quyền truy cập của user ${userId} khỏi device ${deviceId}`
    );
    const res = await axiosInstance.delete(
      `/devices/${deviceId}/users/${userId}`
    );
    return res.data;
  },

  // Lấy danh sách user có quyền truy cập device: GET /devices/{deviceId}/users
  getDeviceUsers: async (deviceId) => {
    try {
      const res = await axiosInstance.get(`/devices/${deviceId}/users`);

      console.log(
        `[deviceService] Danh sách user của thiết bị ${deviceId}:`,
        res.data
      );

      return res.data.data || [];
    } catch (error) {
      console.error(`[deviceService] Lỗi khi lấy danh sách user:`, error);
      throw error;
    }
  },

  // Cập nhật setting cá nhân cho device: PUT /devices/{deviceId}/settings
  updatePersonalSettings: async (deviceId, settings) => {
    console.log(`[deviceService] Cập nhật setting cá nhân:`, settings);

    const res = await axiosInstance.put(`/devices/${deviceId}/settings`, {
      ...settings,
    });
    return res.data;
  },
};

export default deviceService;
