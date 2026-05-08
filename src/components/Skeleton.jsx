import { useTheme } from '../context/ThemeContext';

export function SkeletonCard() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl p-5 ${
        isDark ? 'bg-dark-800/60 border border-white/[0.06]' : 'bg-white border border-gray-200'
      }`}
    >
      <div className={`h-3 w-20 rounded-full mb-3 ${isDark ? 'skeleton' : 'skeleton-light'}`} />
      <div className={`h-7 w-28 rounded-lg mb-2 ${isDark ? 'skeleton' : 'skeleton-light'}`} />
      <div className={`h-3 w-16 rounded-full ${isDark ? 'skeleton' : 'skeleton-light'}`} />
    </div>
  );
}

export function SkeletonNewsCard() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl overflow-hidden ${
        isDark ? 'bg-dark-800/60 border border-white/[0.06]' : 'bg-white border border-gray-200'
      }`}
    >
      <div className={`h-48 w-full ${isDark ? 'skeleton' : 'skeleton-light'}`} />
      <div className="p-5 space-y-3">
        <div className={`h-3 w-16 rounded-full ${isDark ? 'skeleton' : 'skeleton-light'}`} />
        <div className={`h-5 w-full rounded-lg ${isDark ? 'skeleton' : 'skeleton-light'}`} />
        <div className={`h-5 w-3/4 rounded-lg ${isDark ? 'skeleton' : 'skeleton-light'}`} />
        <div className={`h-3 w-full rounded-full ${isDark ? 'skeleton' : 'skeleton-light'}`} />
        <div className={`h-3 w-2/3 rounded-full ${isDark ? 'skeleton' : 'skeleton-light'}`} />
        <div className="flex justify-between pt-2">
          <div className={`h-3 w-20 rounded-full ${isDark ? 'skeleton' : 'skeleton-light'}`} />
          <div className={`h-8 w-24 rounded-lg ${isDark ? 'skeleton' : 'skeleton-light'}`} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonMap() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl h-[500px] ${
        isDark ? 'bg-dark-800/60 border border-white/[0.06]' : 'bg-white border border-gray-200'
      }`}
    >
      <div className={`h-full w-full rounded-2xl ${isDark ? 'skeleton' : 'skeleton-light'}`} />
    </div>
  );
}

export function SkeletonChart() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl p-5 h-80 ${
        isDark ? 'bg-dark-800/60 border border-white/[0.06]' : 'bg-white border border-gray-200'
      }`}
    >
      <div className={`h-4 w-32 rounded-full mb-6 ${isDark ? 'skeleton' : 'skeleton-light'}`} />
      <div className={`h-full w-full rounded-xl ${isDark ? 'skeleton' : 'skeleton-light'}`} />
    </div>
  );
}
