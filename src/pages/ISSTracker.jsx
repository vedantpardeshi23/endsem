import { motion } from 'framer-motion';
import { useISS } from '../context/ISSContext';
import { useTheme } from '../context/ThemeContext';
import ISSMap from '../components/ISSMap';
import StatCard from '../components/StatCard';
import AstronautPanel from '../components/AstronautPanel';
import ErrorState from '../components/ErrorState';
import { SkeletonCard, SkeletonMap } from '../components/Skeleton';
import { 
  Navigation, 
  MapPin, 
  Wind, 
  Clock, 
  RefreshCw, 
  Satellite,
  ChevronRight,
  Info
} from 'lucide-react';
import { formatDateTime } from '../utils/helpers';

export default function ISSTracker() {
  const { 
    position, 
    speed, 
    locationName, 
    astronauts, 
    loading, 
    error, 
    refresh, 
    lastUpdate,
    positionCount,
    isLive
  } = useISS();
  const { isDark } = useTheme();

  if (error) return <div className="py-12"><ErrorState message={error} onRetry={refresh} /></div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-2 text-indigo-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            <Satellite size={14} className="animate-pulse" />
            <span>Mission Control</span>
          </div>
          <h1 className={`text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ISS <span className="gradient-text">Live Tracker</span>
          </h1>
          <p className={`mt-2 text-sm max-w-xl ${isDark ? 'text-dark-300' : 'text-gray-500'}`}>
            Real-time telemetry and orbital positioning of the International Space Station.
            Track its path across {locationName || 'the globe'}.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className={`px-4 py-2 rounded-2xl flex items-center gap-3 ${
            isDark ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'
          }`}>
            <div className="flex flex-col items-end">
              <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>
                Last Signal
              </span>
              <span className={`text-xs font-mono font-medium ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                {lastUpdate ? formatDateTime(lastUpdate) : '--:--:--'}
              </span>
            </div>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] pulse-dot' : 'bg-red-500'}`} />
          </div>
          
          <button
            onClick={refresh}
            className={`p-3 rounded-2xl transition-all duration-300 group ${
              isDark 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading && !position ? (
          [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Current Speed"
              value={`${speed} km/h`}
              subtitle="Orbital Velocity"
              icon={Wind}
              color="blue"
              delay={0.1}
            />
            <StatCard
              label="Latitude"
              value={position?.lat?.toFixed(4) || '0.0000'}
              subtitle="North / South"
              icon={Navigation}
              color="cyan"
              delay={0.2}
            />
            <StatCard
              label="Longitude"
              value={position?.lng?.toFixed(4) || '0.0000'}
              subtitle="East / West"
              icon={MapPin}
              color="purple"
              delay={0.3}
            />
            <StatCard
              label="Tracked Points"
              value={positionCount}
              subtitle="Current Session"
              icon={Clock}
              color="green"
              delay={0.4}
            />
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
               <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                 Live Orbital Path
               </h2>
             </div>
             <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
               isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
             }`}>
               <Info size={12} />
               <span>Auto-updates every 15s</span>
             </div>
          </div>

          {loading && !position ? <SkeletonMap /> : <ISSMap />}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`p-4 rounded-2xl flex items-center justify-between ${
              isDark ? 'bg-white/[0.03] border border-white/5' : 'bg-indigo-50/50 border border-indigo-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <MapPin size={16} className="text-indigo-400" />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-tight ${isDark ? 'text-dark-400' : 'text-gray-400'}`}>
                  Nearest Landmark
                </p>
                <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {locationName}
                </p>
              </div>
            </div>
            <button className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${
              isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
            }`}>
              View Location Details
              <ChevronRight size={12} />
            </button>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
           {/* People in Space */}
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Personnel
                </h2>
              </div>
              <AstronautPanel />
           </div>

           {/* Telemetry Card */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6 }}
             className={`rounded-2xl p-6 relative overflow-hidden ${
               isDark ? 'bg-gradient-to-br from-indigo-600 to-indigo-900' : 'bg-indigo-600'
             } text-white shadow-xl shadow-indigo-500/20`}
           >
             {/* Decorative circles */}
             <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
             <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl" />

             <div className="relative z-10">
                <h3 className="text-xl font-black mb-1">Telemetry Status</h3>
                <p className="text-white/70 text-xs mb-6 uppercase tracking-widest font-bold">Orbital Integrity: 98.4%</p>
                
                <div className="space-y-4">
                   {[
                     { label: 'Altitude', val: '418 km' },
                     { label: 'Inclination', val: '51.64°' },
                     { label: 'Period', val: '92.9 min' }
                   ].map((item) => (
                     <div key={item.label} className="flex items-center justify-between border-b border-white/10 pb-2">
                       <span className="text-xs font-medium text-white/60">{item.label}</span>
                       <span className="text-sm font-bold font-mono">{item.val}</span>
                     </div>
                   ))}
                </div>
                
                <div className="mt-8 flex items-center gap-2">
                   <div className="px-2 py-1 bg-white/10 rounded text-[9px] font-bold tracking-tighter uppercase">STABLE</div>
                   <div className="px-2 py-1 bg-white/10 rounded text-[9px] font-bold tracking-tighter uppercase">SYNCED</div>
                </div>
             </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
