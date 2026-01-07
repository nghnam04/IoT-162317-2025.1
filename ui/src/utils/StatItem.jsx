const StatItem = ({ icon, label, value, unit, onChange }) => (
  <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
    <div className="flex items-center gap-2 text-gray-400 mb-1">
      {icon} <span className="text-[10px] font-bold uppercase">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <input
        type="number"
        className="w-full text-xl font-bold text-gray-800 outline-none bg-transparent"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="text-xs font-bold text-gray-400">{unit}</span>
    </div>
  </div>
);
export default StatItem;
