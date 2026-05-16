import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Search, 
  Calendar, 
  QrCode, 
  Users, 
  FileText,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';
import Shell from '../layout/Shell';

const ATTENDANCE_LOGS = [
  { id: 1, event: 'General Sabbath Service', date: 'May 12, 2026', total: 420, absentees: 15, growth: '+5%', status: 'Reported' },
  { id: 2, event: 'Youth Social Evening', date: 'May 10, 2026', total: 156, absentees: 2, growth: '+12%', status: 'Generated' },
  { id: 3, event: 'Pathfinder Drill Session', date: 'May 08, 2026', total: 84, absentees: 5, growth: '-2%', status: 'In Review' },
  { id: 4, event: 'District Executive Meeting', date: 'May 05, 2026', total: 22, absentees: 0, growth: '0%', status: 'Reported' },
];

export default function AttendanceTracker() {
  return (
    <Shell>
      <div className="space-y-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-gold font-bold text-xs uppercase tracking-[4px] mb-4">
              <BarChart3 size={16} /> ATTENDANCE ANALYTICS & SCANNING
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter">
              Presence <span className="text-gold">Analytics</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <button className="h-16 px-10 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center gap-3 shadow-lg shadow-gold/20 transition-all">
              <QrCode size={24} /> New QR Check-in
            </button>
            <button className="h-16 px-8 glass border-white/10 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-all">
              <FileText size={20} /> Generate Report
            </button>
          </div>
        </header>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 glass rounded-[40px] p-10 border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold">Growth Trends</h2>
                <p className="text-sm text-white/40">Weekly attendance synchronization across all districts.</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl">
                 <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest bg-gold text-navy rounded-lg">Weekly</button>
                 <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">Monthly</button>
              </div>
            </div>

            {/* Mock Chart Visualization */}
            <div className="h-64 flex items-end justify-between gap-2 px-4 pb-4 border-b border-white/10 relative">
               {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                 <motion.div 
                   key={i}
                   initial={{ height: 0 }}
                   animate={{ height: `${h}%` }}
                   transition={{ delay: i * 0.1, duration: 1 }}
                   className="flex-1 rounded-t-xl bg-gradient-to-t from-gold/40 to-gold relative group"
                 >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-navy text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                     {h * 10} Members
                   </div>
                 </motion.div>
               ))}
               <div className="absolute bottom-[-24px] w-full flex justify-between px-2 text-[10px] font-bold text-white/20 tracking-widest uppercase">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            {[
              { label: 'Weekly Average', value: '482', change: '+8%', icon: Users },
              { label: 'Loyalty Score', value: '94%', change: '+2%', icon: TrendingUp },
              { label: 'District Rank', value: '#1', change: 'Top', icon: CheckCircle2 },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-premium h-fit"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-gold/10 border border-gold/20 text-gold">
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded-full uppercase tracking-widest">{stat.change}</span>
                </div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-display font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Logs Section */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-display font-bold italic">Attendance <span className="text-white/20">Archive</span></h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="text" 
                  placeholder="Filter logs..." 
                  className="h-12 pl-12 pr-6 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-gold/50 transition-all font-medium min-w-[250px] text-sm"
                />
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
             {ATTENDANCE_LOGS.map((log) => (
               <motion.div 
                 key={log.id}
                 whileHover={{ x: 10 }}
                 className="glass p-6 rounded-3xl border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all group cursor-pointer"
               >
                 <div className="flex items-center gap-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-gold/10 group-hover:border-gold/20 transition-all">
                      <Calendar className="text-gold" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-white group-hover:text-gold transition-colors">{log.event}</h4>
                      <p className="text-sm text-white/40">{log.date}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-12">
                   <div className="text-center">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Present</p>
                     <p className="font-display font-bold">{log.total}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Absentees</p>
                     <p className="font-display font-bold text-red-400">{log.absentees}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Trend</p>
                     <p className={`font-display font-bold ${log.growth.startsWith('+') ? 'text-emerald-400' : 'text-white/40'}`}>{log.growth}</p>
                   </div>
                   <div className="hidden md:block h-10 w-[1px] bg-white/10" />
                   <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                       log.status === 'Reported' ? 'border-emerald-400/20 text-emerald-400' : 'border-gold/20 text-gold'
                     }`}>{log.status}</span>
                     <button className="p-2 text-white/20 hover:text-white"><Download size={18} /></button>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>

        {/* QR Scanner Overlay Concept */}
        <section className="relative h-64 rounded-[40px] overflow-hidden group cursor-pointer">
           <img src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover grayscale opacity-20" />
           <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-700" />
           <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
             <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/40 flex items-center justify-center">
               <QrCode size={32} className="text-gold" />
             </div>
             <div>
                <h3 className="text-2xl font-display font-bold">Launch Check-in Scanner</h3>
                <p className="text-white/40 text-sm max-w-sm mx-auto">Instant member verification using personal QR IDs with offline sync capabilities.</p>
             </div>
           </div>
        </section>
      </div>
    </Shell>
  );
}
