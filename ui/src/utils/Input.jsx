const Input = ({ label, value, onChange }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-400 uppercase ml-2">
      {label}
    </label>
    <input
      type="text"
      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
export default Input;
