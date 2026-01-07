import axiosInstance from "../api/axios";

const monitoringService = {
  getCurrentData: async (deviceId) => {
    if (!deviceId) return null;

    try {
      const res = await axiosInstance.get(`/monitor/${deviceId}/current`);

      console.log(
        `[Service] Response từ /monitor/${deviceId}/current:`,
        res.data
      );

      const sensorData = res.data?.data;

      if (Array.isArray(sensorData)) {
        return sensorData.length > 0 ? sensorData[0] : null;
      }
      return sensorData || null;
    } catch (error) {
      console.error(
        `[Service] Lỗi lấy dữ liệu realtime cho ${deviceId}:`,
        error.message
      );
      return null;
    }
  },

  getHistory: async (deviceId, from, to) => {
    if (!deviceId) return [];

    try {
      const res = await axiosInstance.get(`/monitor/${deviceId}/history`, {
        params: { from, to },
      });

      console.log(
        `[Service] Response từ /monitor/${deviceId}/history:`,
        res.data
      );

      const historyData = res.data?.data;
      return Array.isArray(historyData) ? historyData : [];
    } catch (error) {
      console.error(
        `[Service] Lỗi lấy lịch sử cho ${deviceId}:`,
        error.message
      );
      return [];
    }
  },
};

export default monitoringService;
