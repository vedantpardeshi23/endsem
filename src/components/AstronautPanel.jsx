import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useISS } from '../context/ISSContext';
import { Users, User } from 'lucide-react';

export default function AstronautPanel() {
  const { isDark } = useTheme();
  const { astronauts, loading } = useISS();

  if (loading) return null;

  const grouped = {};
  astronauts.people?.forEach((person) => {
    const craft = person.craft || 'Unknown';
    if (!grouped[craft]) grouped[craft] = [];
    grouped[craft].push(person.name);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`rounded-2xl p-5 ${
        isDark
          ? 'bg-dark-800/60 border border-white/[0.06]'
          : 'bg-white border border-gray-200/60 shadow-sm'
      } backdrop-blur-sm`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
          <Users size={16} className="text-purple-400" />
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            People in Space
          </h3>
          <p className={`text-xs ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
            {astronauts.number} astronauts currently orbiting
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([craft, names]) => (
          <div key={craft}>
            <p
              className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${
                isDark ? 'text-dark-400' : 'text-gray-400'
              }`}
            >
              {craft}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {names.map((name) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isDark ? 'bg-white/[0.03]' : 'bg-gray-50'
                  }`}
                >
                  <User size={12} className={isDark ? 'text-purple-400' : 'text-purple-500'} />
                  <span className={`text-xs font-medium ${isDark ? 'text-dark-100' : 'text-gray-700'}`}>
                    {name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
