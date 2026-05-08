import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot/Chatbot';
import { useTheme } from '../context/ThemeContext';
import { Toaster } from 'react-hot-toast';

export default function RootLayout() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-dark-900 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${
          isDark ? 'bg-indigo-600' : 'bg-indigo-400'
        }`} />
        <div className={`absolute bottom-[10%] -right-[10%] w-[30%] h-[30%] rounded-full blur-[100px] opacity-10 ${
          isDark ? 'bg-cyan-600' : 'bg-cyan-400'
        }`} />
      </div>

      <Navbar />
      
      <main className="flex-1 pt-24 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Outlet />
        </div>
      </main>

      <Footer />
      <Chatbot />
      
      <Toaster
        position="top-right"
        toastOptions={{
          className: isDark ? '!bg-dark-800 !text-white !border !border-white/10' : '',
          duration: 3000,
        }}
      />
    </div>
  );
}
