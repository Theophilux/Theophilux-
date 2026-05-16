import { motion } from 'motion/react';
import { 
  User, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  Database, 
  Smartphone,
  ChevronRight,
  LogOut,
  Camera,
  Lock,
  Eye,
  Trash2,
  Sparkles
} from 'lucide-react';
import Shell from '../layout/Shell';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'Profile Information', icon: User, description: 'Manage your personal details and photo.' },
      { id: 'security', label: 'Security & Password', icon: Shield, description: 'Update your login PIN and biometrics.' },
      { id: 'sessions', label: 'Active Sessions', icon: Smartphone, description: 'Manage devices logged into your account.' },
    ]
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure sabbath and prayer alerts.' },
      { id: 'theme', label: 'Appearance', icon: Moon, description: 'Switch between light, dark, and holy gold.' },
      { id: 'language', label: 'Language', icon: Globe, description: 'English, Swahili, and local dialects.' },
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'storage', label: 'Storage & Cache', icon: Database, description: 'Clear offline lessons and media cache.' },
      { id: 'ai', label: 'AI Assistance', icon: Sparkles, description: 'Customize AI bible and devotional tools.' },
    ]
  }
];

export default function Settings() {
  return (
    <Shell>
      <div className="space-y-10 max-w-5xl mx-auto">
        {/* Header */}
        <section className="flex items-center justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Super <span className="text-gold">Settings</span>
            </h1>
            <p className="text-white/60 text-lg">Personalize your spiritual platform experience.</p>
          </div>
          <div className="relative group">
            <div className="w-24 h-24 rounded-[32px] bg-gold/20 border border-gold/40 flex items-center justify-center overflow-hidden">
               <span className="text-2xl font-bold text-gold">TM</span>
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                 <Camera size={24} className="text-white" />
               </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gold flex items-center justify-center text-navy shadow-lg shadow-gold/20 border-2 border-navy">
              <Sparkles size={14} />
            </div>
          </div>
        </section>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {SETTINGS_SECTIONS.map((section, idx) => (
              <motion.section 
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gold/40 ml-2">{section.title}</h2>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <button 
                      key={item.id}
                      className="w-full flex items-center gap-5 p-5 glass border-white/5 rounded-[32px] hover:bg-white/10 transition-all text-left group"
                    >
                      <div className="p-4 rounded-2xl bg-white/5 text-gold group-hover:bg-gold group-hover:text-navy transition-all">
                        <item.icon size={22} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg">{item.label}</h4>
                        <p className="text-sm text-white/40">{item.description}</p>
                      </div>
                      <ChevronRight size={20} className="text-white/20 group-hover:text-gold transition-colors mr-2" />
                    </button>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Sidebar Info */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="card-premium p-8 space-y-6 text-center">
              <Shield className="w-16 h-16 text-gold mx-auto mb-2" />
              <h3 className="text-xl font-display font-bold">Privacy Center</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Your spiritual data is encrypted end-to-end. We never share your records with third parties.
              </p>
              <button className="w-full py-4 rounded-2xl border border-white/10 hover:border-gold/50 text-gold text-sm font-bold transition-all">
                Download Data Report
              </button>
            </div>

            <div className="rounded-[40px] p-8 bg-red-500/10 border border-red-500/20 space-y-4">
               <h4 className="font-bold text-red-400 flex items-center gap-2">
                 <Trash2 size={16} /> Danger Zone
               </h4>
               <p className="text-xs text-red-400/60 leading-relaxed uppercase tracking-wider font-bold">
                 Permanently delete your account and all associated spiritual history. This cannot be undone.
               </p>
               <button className="text-xs font-bold text-red-400 hover:underline">
                 Delete My Account
               </button>
            </div>
            
            <button className="w-full py-6 rounded-[32px] bg-white/5 flex items-center justify-center gap-3 text-white/60 hover:text-white transition-all font-bold group">
              <LogOut size={20} />
              Sign Out
            </button>
          </aside>
        </div>

        {/* Footer Info */}
        <section className="text-center pt-10 border-t border-white/5">
          <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
            Kiomwobo Youths Platform • Version 3.4.0-Holy
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
             <a href="#" className="text-xs text-gold/40 hover:text-gold">Privacy Policy</a>
             <a href="#" className="text-xs text-gold/40 hover:text-gold">Terms of Service</a>
             <a href="#" className="text-xs text-gold/40 hover:text-gold">Support Center</a>
          </div>
        </section>
      </div>
    </Shell>
  );
}
