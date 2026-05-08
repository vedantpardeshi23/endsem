import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useISS } from '../context/ISSContext';
import { useNews } from '../context/NewsContext';
import { useTheme } from '../context/ThemeContext';
import { SkeletonChart } from '../components/Skeleton';
import { Activity, PieChart as PieIcon, TrendingUp, BarChart3, Info } from 'lucide-react';

export default function Analytics() {
  const { speedHistory, loading: issLoading } = useISS();
  const { getDistribution, loading: newsLoading } = useNews();
  const { isDark } = useTheme();

  const pieData = getDistribution();
  const COLORS = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#ec4899', '#f97316'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-xl border ${
          isDark ? 'bg-dark-900/90 border-white/10' : 'bg-white border-gray-200 shadow-xl'
        } backdrop-blur-md`}>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>
            {label}
          </p>
          <p className="text-sm font-bold text-indigo-400">
            {payload[0].value.toLocaleString()} <span className="text-[10px] uppercase">{payload[0].name === 'speed' ? 'km/h' : 'articles'}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2 text-indigo-500 font-bold uppercase tracking-[0.2em] text-[10px]">
          <BarChart3 size={14} />
          <span>Analytics Core</span>
        </div>
        <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Data <span className="gradient-text">Visualizer</span>
        </h1>
        <p className={`mt-2 text-sm max-w-xl ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
          Complex data processing visualized through interactive telemetry charts and content distribution maps.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Speed Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-3xl p-6 ${
            isDark ? 'bg-dark-800/60 border border-white/[0.06]' : 'bg-white border border-gray-200 shadow-sm'
          } backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-indigo-400" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>ISS Velocity Trend</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>Last 30 Signal Samples</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase">
               <Activity size={12} className="animate-pulse" />
               <span>Live Feed</span>
            </div>
          </div>

          <div className="h-80 w-full">
            {issLoading && speedHistory.length === 0 ? (
              <SkeletonChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={speedHistory}>
                  <defs>
                    <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: isDark ? '#5a5a72' : '#94a3b8' }}
                    interval={Math.floor(speedHistory.length / 5)}
                  />
                  <YAxis 
                    hide 
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    name="speed"
                    type="monotone" 
                    dataKey="speed" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorSpeed)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center gap-4`}>
             <div className="flex-1 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500" />
               <span className={`text-[10px] font-bold uppercase tracking-tight ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>Avg Speed: 27,600 km/h</span>
             </div>
             <div className={`flex items-center gap-1.5 text-[10px] ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>
               <Info size={12} />
               <span>Calculated via Haversine Formula</span>
             </div>
          </div>
        </motion.div>

        {/* News Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-3xl p-6 ${
            isDark ? 'bg-dark-800/60 border border-white/[0.06]' : 'bg-white border border-gray-200 shadow-sm'
          } backdrop-blur-sm`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <PieIcon size={20} className="text-cyan-400" />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Intelligence Mix</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>Distribution by Category</p>
              </div>
            </div>
          </div>

          <div className="h-80 w-full flex items-center justify-center">
            {newsLoading ? (
              <SkeletonChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={200}
                    animationDuration={1500}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke={isDark ? '#111118' : '#ffffff'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>{value}</span>}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
             <div className="grid grid-cols-2 gap-4">
                {pieData.slice(0, 4).map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-dark-200' : 'text-gray-600'}`}>{item.name}</span>
                     </div>
                     <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{item.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>
      </div>

      {/* Large Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-3xl p-8 relative overflow-hidden ${
          isDark ? 'bg-white/[0.02] border border-white/5' : 'bg-white border border-gray-200'
        }`}
      >
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x divide-white/5">
           <div className="text-center md:text-left">
              <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>Data Throughput</h4>
              <p className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>1.2 <span className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Gbps</span></p>
              <p className={`mt-2 text-xs ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>Direct satellite downlink bandwidth</p>
           </div>
           <div className="text-center md:text-left md:pl-8">
              <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>Latency</h4>
              <p className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>142 <span className="text-sm font-bold text-cyan-500 uppercase tracking-widest">ms</span></p>
              <p className={`mt-2 text-xs ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>Ground station round-trip delay</p>
           </div>
           <div className="text-center md:text-left md:pl-8">
              <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>AI Processing</h4>
              <p className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>~0.8 <span className="text-sm font-bold text-purple-500 uppercase tracking-widest">sec</span></p>
              <p className={`mt-2 text-xs ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>Mistral-7B inference response time</p>
           </div>
        </div>
        
        {/* Animated background decoration */}
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}
