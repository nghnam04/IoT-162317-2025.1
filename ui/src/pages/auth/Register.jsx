import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, Mail, User, Lock, Sprout, CheckCircle2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = await register(name, email, username, password);

    if (result?.success) {
      setSuccess(
        "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } else {
      if (result?.status === 403) {
        setError("Tên đăng nhập hoặc email đã được sử dụng");
      } else if (result?.status === 400) {
        setError("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại");
      } else {
        setError(result?.error || "Đăng ký không thành công");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <Sprout size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Đăng ký tài khoản mới
            </h2>
          </div>

          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6 flex items-center gap-3 border border-emerald-100">
              <CheckCircle2 size={20} />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 text-left">
                Họ và tên
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="Hãy nhập đầy đủ họ tên..."
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 text-left">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all"
                  placeholder="Hãy nhập địa chỉ email..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 text-left">
                Username
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
                  placeholder="Tên đăng nhập..."
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1 text-left">
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

            <div className="md:col-span-2 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3"
              >
                {loading ? <LoadingSpinner /> : <UserPlus size={20} />}
                <span>{loading ? "Đang xử lý..." : "Tạo Tài Khoản"}</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-gray-500 text-sm">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-bold hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
