import { motion, AnimatePresence } from "framer-motion";

const StatCard = ({ title, value, unit, icon: Icon, colorClass }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100"
    >
      <div
        className={`inline-flex p-3 rounded-2xl ${colorClass} text-white mb-4 shadow-inner`}
      >
        <Icon size={24} />
      </div>
      <p className="text-gray-500 text-sm font-bold opacity-70 uppercase tracking-wider">
        {title}
      </p>

      <div className="flex items-baseline gap-1 mt-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-medium text-gray-700"
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="text-gray-400 font-medium">{unit}</span>
      </div>
    </motion.div>
  );
};

export default StatCard;
