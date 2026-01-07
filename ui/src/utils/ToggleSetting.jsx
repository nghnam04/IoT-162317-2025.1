const ToggleSetting = ({ label, active, onClick }) => (
  <div className="flex justify-between items-center p-4 bg-white rounded-2xl border border-gray-100">
    <span className="text-sm font-semibold text-gray-700">{label}</span>
    <button
      onClick={onClick}
      className={`w-12 h-6 rounded-full transition-all relative ${
        active ? "bg-emerald-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${
          active ? "left-7" : "left-1"
        }`}
      />
    </button>
  </div>
);

export default ToggleSetting;
