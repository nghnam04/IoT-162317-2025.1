import { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { User, LogOut, ChevronDown } from "lucide-react";

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-8 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-700">
                  {user?.full_name || "Người dùng"}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {user?.role || "User"}
                </p>
              </div>

              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border-2 border-emerald-50">
                <User size={20} />
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-50 mb-2">
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm truncate">{user?.email}</p>
                </div>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-2"
                >
                  <User size={16} /> Thông tin cá nhân
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut size={16} /> Đăng xuất
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Nội dung trang */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
