import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings, Cpu, Sprout, Menu, X } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: "/", name: "Bảng điều khiển", icon: LayoutDashboard },
    { path: "/devices", name: "Thiết bị của tôi", icon: Cpu },
    { path: "/settings", name: "Cấu hình tưới", icon: Settings },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-500 text-white rounded-xl shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm transition-transform duration-300 ease-in-out transform 
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header Sidebar */}
        <div className="p-4 mt-12 lg:mt-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-100">
              <Sprout size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800 tracking-tight leading-none">
                Smart <span className="text-emerald-500">Agriculture</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                IoT Management System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-emerald-500 text-white font-bold shadow-md shadow-emerald-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-emerald-600"
                }`
              }
            >
              <item.icon
                size={20}
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-[15px]">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-6">
          <div className="py-4 px-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <p className="text-[10px] font-bold text-gray-500 uppercase">
                Hệ thống hoạt động
              </p>
            </div>
            <p className="text-[12px]">
              &copy; {new Date().getFullYear()}{" "}
              <span className="text-black-500 font-medium">
                Smart Agriculture
              </span>
              <br />
              <span className="text-gray-400">2025.1 - 162317 - Group 12</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
