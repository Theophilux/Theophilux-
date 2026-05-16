import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Calendar, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  BookUser
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Leadership', icon: ShieldCheck, path: '/leadership' },
  { label: 'Directory', icon: BookUser, path: '/members' },
  { label: 'Forum', icon: MessageSquare, path: '/forum' },
  { label: 'Youths', icon: Users, path: '/youths' },
  { label: 'Pathfinders', icon: ShieldCheck, path: '/pathfinders' },
  { label: 'Attendance', icon: Calendar, path: '/attendance' },
  { label: 'Analytics', icon: TrendingUp, path: '/analytics' },
  { label: 'Gallery', icon: Sparkles, path: '/gallery' },
  { label: 'SDA Lessons', icon: BookOpen, path: '/lessons' },
  { label: 'Prayer Wall', icon: MessageSquare, path: '/prayer-room' },
  { label: 'AI Assistant', icon: Sparkles, path: '/bible-assistant' },
];

export default function Shell({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-navy text-white flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-navy-light/50 border-r border-white/5 p-6 fixed h-full z-20 overflow-y-auto">
        <div className="flex items-center gap-3 mb-10 px-2 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-navy" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">Kiomwobo</span>
        </div>

        <nav className="flex-1 space-y-1 mb-6">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gold text-navy font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                    : 'hover:bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-navy' : 'text-gold'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-1 flex-shrink-0">
          <Link 
            to="/settings"
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
              location.pathname === '/settings' 
                ? 'bg-gold text-navy font-bold' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className={`w-5 h-5 ${location.pathname === '/settings' ? 'text-navy' : 'text-gold/60'}`} />
            <span>Settings</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 text-red-400 hover:text-red-300 w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen relative">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 glass backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(true)} className="lg:hidden p-2">
              <Menu className="w-6 h-6 text-gold" />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 w-80">
              <Search className="w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/5 transition-all">
              <Bell className="w-5 h-5 text-gold/80" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-navy" />
            </button>
            <div className="h-10 w-10 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center">
              <span className="text-gold font-bold text-xs">TM</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-navy z-50 p-8 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-navy" />
                  </div>
                  <span className="font-display font-bold text-2xl tracking-tight">Kiomwobo</span>
                </div>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>

              <nav className="flex-1 space-y-4">
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                        isActive 
                          ? 'bg-gold text-navy font-bold shadow-lg shadow-gold/20' 
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-lg font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-4 text-red-400 font-medium"
              >
                <LogOut className="w-6 h-6" />
                <span className="text-lg">Sign Out</span>
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
