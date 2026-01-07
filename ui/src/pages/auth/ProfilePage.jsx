import { useContext } from "react";
import { User, Mail, Shield, Calendar, CreditCard } from "lucide-react";
import dayjs from "dayjs";
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  console.log("User object:", user);
  console.log("user.created_at:", user?.created_at);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>

        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
            <div className="w-24full h-24 bg-white rounded-2xl p-1 shadow-md">
              <div className="w- h-full bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <User size={40} />
              </div>
            </div>
          </div>

          <div className="space-y-1 mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              {user.full_name}
            </h1>
            <p className="text-gray-500 text-sm">@{user.username}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Mail className="text-gray-400" size={20} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Email
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Shield className="text-gray-400" size={20} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Vai trò
                </p>
                <p className="text-sm font-medium text-emerald-600 capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <CreditCard className="text-gray-400" size={20} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  ID
                </p>
                <p className="text-sm font-medium text-gray-700">{user.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">
                  Ngày tạo tài khoản
                </p>
                <p className="text-sm font-medium text-gray-700">
                  {user?.created_at
                    ? dayjs(String(user.created_at)).format("DD/MM/YYYY")
                    : "Chưa có dữ liệu"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
