import axiosInstance from "../api/axios";

const authService = {
  login: async (identifier, password) => {
    const response = await axiosInstance.post("/auth/login", {
      identifier,
      password,
    });
    return response.data;
  },

  register: async (name, email, username, password) => {
    return axiosInstance.post("/auth/register", {
      full_name: name,
      username,
      email,
      password,
    });
  },

  getMe: async () => {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  },

  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  },
};

export default authService;
