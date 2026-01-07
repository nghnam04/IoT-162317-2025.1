import axiosInstance from "../api/axios";

const controlService = {
  togglePump: async (deviceId, status) => {
    const url = `/control/device/${deviceId}`;
    const body = {
      pump: status,
    };

    console.log(`[controlService] Gửi lệnh tới API: POST ${url}`, body);

    try {
      const res = await axiosInstance.post(url, body);
      console.log(`[controlService] Server phản hồi thành công:`, res.data);
      return res.data;
    } catch (error) {
      console.error(
        `[controlService] Lỗi khi gọi API điều khiển:`,
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default controlService;
