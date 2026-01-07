import { Link } from "react-router-dom";
import { Sprout, Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="relative inline-block mb-8">
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="bg-emerald-100 p-6 rounded-full text-emerald-600 relative z-10"
          >
            <Sprout size={80} strokeWidth={1.5} />
          </motion.div>
          <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-2 rounded-full shadow-lg z-20">
            <AlertTriangle size={24} />
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-9xl font-black text-emerald-100 absolute inset-0 flex items-center justify-center -z-0 select-none">
          404
        </h1>

        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Không Tìm Thấy Trang
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Có vẻ như đường dẫn bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển sang một địa chỉ khác.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-200"
            >
              <Home size={20} />
              Về Trang Chủ
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-xl border border-gray-200 transition-all"
            >
              Quay lại
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center gap-2 opacity-20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
