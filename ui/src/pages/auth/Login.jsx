import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sprout, LogIn, Lock, User } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(username, password);

    if (result?.user) {
      const role = result.user.role.name;
      if (role === "admin" || role === "user") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      if (result?.status === 429) {
        setError("Đăng nhập sai quá nhiều lần. Thử lại sau 1 phút");
      } else if (result?.status === 401 || result?.status === 403) {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác");
      } else {
        setError(result?.error || "Không thể kết nối đến máy chủ");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100/50 p-8 border border-emerald-50">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
              <Sprout size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Chào mừng đến với
            </h2>
            <p className="text-gray-500 mt-2">
              Hệ thống quản lý nông nghiệp thông minh
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm font-medium border border-red-100 flex items-center gap-2"
            >
              <div className="w-1 h-1 rounded-full bg-red-600" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Tên đăng nhập / Email
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="Hãy nhập tên đăng nhập / email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : <LogIn size={20} />}
              <span>{loading ? "Đang xác thực..." : "Đăng Nhập"}</span>
            </button>
          </form>

          <div className="mt-8 text-center text-gray-500 text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-emerald-600 font-bold hover:underline"
            >
              Đăng ký thành viên
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
