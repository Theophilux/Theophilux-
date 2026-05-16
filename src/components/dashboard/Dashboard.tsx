import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  Calendar, 
  MessageSquare, 
  ChevronRight, 
  TrendingUp,
  Heart,
  Clock,
  Sparkles,
  Bell,
  BookUser
} from 'lucide-react';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Shell from '../layout/Shell';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [memberCount, setMemberCount] = useState<number | string>('...');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const snapshot = await getDocs(query(collection(db, 'members'), limit(1000)));
        setMemberCount(snapshot.size);
      } catch (err) {
        console.error("Error fetching member count:", err);
        setMemberCount('1,280+');
      }
    };
    fetchStats();
  }, []);

  const STATS = [
    { label: 'Platform Members', value: memberCount, change: '+12%', icon: BookUser, color: 'text-gold' },
    { label: 'Youths', value: '1,284', change: '+5%', icon: Users, color: 'text-blue-400' },
    { label: 'Pathfinders', value: '456', change: '+5%', icon: ShieldCheck, color: 'text-blue-400' },
    { label: 'Prayer Network', value: '1,500', change: '+24%', icon: Heart, color: 'text-emerald-400' },
  ];

  const UPCOMING_EVENTS = [
    { title: 'Pathfinder Drill Session', date: 'Tomorrow, 2:00 PM', location: 'Church Grounds', category: 'Drill' },
    { title: 'Youth Sabbath Social', date: 'Sat, 1:30 PM', location: 'Main Hall', category: 'Social' },
    { title: 'Regional Camporee Prep', date: 'Sunday, 10:00 AM', location: 'Zoom', category: 'General' },
  ];

  return (
    <Shell>
      <div className="space-y-10">
        {/* Welcome Section */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Shalom, <span className="text-gold">Theophilux</span>
            </h1>
            <p className="text-white/60 text-lg">May your spiritual journey be blessed today.</p>
          </div>
          <div className="flex items-center gap-3 bg-gold/10 border border-gold/20 p-4 rounded-3xl">
            <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shadow-lg shadow-gold/20">
              <Clock className="w-6 h-6 text-navy" />
            </div>
            <div>
              <p className="text-xs text-gold uppercase font-bold tracking-widest">Next Sabbath</p>
              <p className="font-display font-medium">6 Days : 14 Hours</p>
            </div>
          </div>
        </section>

        {/* Verse of the Day Widget */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[40px] p-8 md:p-12 glass border-gold/10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <Sparkles className="w-10 h-10 text-gold mb-6" />
            <p className="text-2xl md:text-3xl font-serif italic text-white/90 leading-relaxed mb-8">
              "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future."
            </p>
            <div className="flex flex-col items-center">
              <span className="text-gold font-display font-bold tracking-widest text-sm uppercase">Jeremiah 29:11</span>
              <div className="mt-4 h-1 w-12 gold-gradient rounded-full" />
            </div>
          </div>
        </motion.section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold leading-none bg-emerald-400/10 px-2 py-1 rounded-full">
                  <TrendingUp size={12} />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-white/60 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-display font-bold tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Middle Section: Events & Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <section className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Calendar className="text-gold" />
                Upcoming Events
              </h2>
              <button className="text-gold text-sm font-bold flex items-center gap-1 hover:underline">
                View Calendar <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              {UPCOMING_EVENTS.map((event, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-6 p-5 glass border-white/5 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gold/10 border border-gold/20 min-w-[70px]">
                    <span className="text-gold font-bold text-lg leading-none">12</span>
                    <span className="text-gold/60 text-[10px] font-bold uppercase tracking-widest mt-1">MAY</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-white group-hover:text-gold transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {event.date}</span>
                      <span className="flex items-center gap-1.5 font-medium text-gold/60"># {event.category}</span>
                    </div>
                  </div>
                  <button className="p-3 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Recent Media Highlights */}
            <div className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                  <Sparkles className="text-gold" />
                  Recent Media
                </h2>
                <button className="text-gold text-sm font-bold flex items-center gap-1 hover:underline">
                  Open Gallery <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((id) => (
                  <motion.div 
                    key={id}
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative group cursor-pointer"
                  >
                    <img 
                      src={`https://images.unsplash.com/photo-${1500000000000 + id * 1000000}?auto=format&fit=crop&q=80&w=300`} 
                      alt="Moment" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Sparkles size={20} className="text-gold" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Actions / Activity */}
          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold flex items-center gap-3">
              <TrendingUp className="text-gold" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-6 glass border-white/5 rounded-[32px] hover:bg-gold hover:text-navy transition-all group gap-3">
                <Heart className="w-8 h-8 text-gold group-hover:text-navy" />
                <span className="text-sm font-bold font-display">Prayer Request</span>
              </button>
              <button 
                onClick={() => navigate('/members')}
                className="flex flex-col items-center justify-center p-6 glass border-white/5 rounded-[32px] hover:bg-gold hover:text-navy transition-all group gap-3"
              >
                <Users className="w-8 h-8 text-gold group-hover:text-navy" />
                <span className="text-sm font-bold font-display">Manage Directory</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 glass border-white/5 rounded-[32px] hover:bg-gold hover:text-navy transition-all group gap-3">
                <Calendar className="w-8 h-8 text-gold group-hover:text-navy" />
                <span className="text-sm font-bold font-display">Log Attendance</span>
              </button>
              <button className="flex flex-col items-center justify-center p-6 glass border-white/5 rounded-[32px] hover:bg-gold hover:text-navy transition-all group gap-3">
                <ShieldCheck className="w-8 h-8 text-gold group-hover:text-navy" />
                <span className="text-sm font-bold font-display">Pathfinder Drills</span>
              </button>
            </div>

            {/* Announcements */}
            <div className="p-6 glass border-gold/20 bg-gold/5 rounded-[32px] space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold" />
                Announcements
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-gold">EMERGENCY</p>
                  <p className="text-sm mt-1">Evening choir practice cancelled due to weather.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                   <p className="text-xs font-bold text-emerald-400">REMINDER</p>
                   <p className="text-sm mt-1">Camporee registration closes in 2 days.</p>
                </div>
              </div>
            </div>

            {/* Prayer Wall Preview */}
            <div className="p-6 glass border-pink-500/20 bg-pink-500/5 rounded-[32px] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  Prayer Wall
                </h3>
                <span className="text-[10px] bg-pink-400 text-white px-2 py-0.5 rounded-full font-bold">12 NEW</span>
              </div>
              <p className="text-sm italic text-white/50 leading-relaxed">
                "Please pray for the upcoming Regional Camporee, for safety and spiritual growth..."
              </p>
              <button className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all">
                Open Wall
              </button>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
