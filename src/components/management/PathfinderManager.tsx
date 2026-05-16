import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Plus, 
  ChevronRight, 
  Award, 
  Flag, 
  Info,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Shell from '../layout/Shell';

const PATHFINDERS = [
  { id: '1', name: 'James Otieno', class: 'Friend', badges: 12, drills: '85%', uniform: 'Complete' },
  { id: '2', name: 'Sarah Kemunto', class: 'Companion', badges: 15, drills: '92%', uniform: 'Complete' },
  { id: '3', name: 'Daniel Nyanchoka', class: 'Explorer', badges: 8, drills: '78%', uniform: 'Incomplete' },
  { id: '4', name: 'Alice Moraa', class: 'Ranger', badges: 22, drills: '95%', uniform: 'Complete' },
];

export default function PathfinderManager() {
  return (
    <Shell>
      <div className="space-y-10">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-gold font-bold text-xs uppercase tracking-[4px] mb-4">
              <ShieldCheck size={16} /> PATHFINDER UNIT MANAGEMENT
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter">
              The <span className="text-gold">Vanguard</span> <br /> Squadron
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search pathfinders..." 
                className="h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-medium min-w-[300px]"
              />
            </div>
            <button className="h-14 px-8 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-gold/20 transition-all">
              <Plus size={20} /> Add Member
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Classes Active', value: '6', icon: Flag, color: 'text-gold' },
            { label: 'Badge Goal', value: '85%', icon: Award, color: 'text-blue-400' },
            { label: 'Uniform Audit', value: '92%', icon: ShieldCheck, color: 'text-emerald-400' },
            { label: 'Drill Score', value: '4.8', icon: Info, color: 'text-pink-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium flex items-center gap-6"
            >
              <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-display font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Members Table */}
        <div className="glass rounded-[40px] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold">Squad Recognition</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 rounded-xl">All Classes</button>
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all">Uniform Status</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-[10px] uppercase font-bold tracking-[3px]">
                  <th className="px-8 py-6">Pathfinder Member</th>
                  <th className="px-8 py-6">Class Level</th>
                  <th className="px-8 py-6">Badge Achievements</th>
                  <th className="px-8 py-6">Drill Sync</th>
                  <th className="px-8 py-6 text-center">Protocol Status</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PATHFINDERS.map((p, i) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-white/5 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center font-bold text-gold">
                          {p.name.charAt(0)}
                        </div>
                        <span className="font-bold text-white group-hover:text-gold transition-all">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest">
                        {p.class}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Award size={14} className="text-gold" />
                        <span className="font-medium text-white/80">{p.badges} Honors</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-emerald-400 font-bold">{p.drills}</td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center">
                        <div className={`p-1.5 rounded-full ${p.uniform === 'Complete' ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-400/20 text-red-400'}`}>
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all hover:bg-gold hover:text-navy">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Drill Tutorials Promo */}
        <section className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-indigo-900 to-navy p-10 lg:p-14 border border-white/10">
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-10">
             <div className="absolute top-0 right-0 w-96 h-96 bg-white rotate-45 translate-x-1/2 -translate-y-1/2 blur-3xl rounded-full" />
          </div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-gold text-xs font-bold uppercase tracking-widest">
                <Clock size={14} /> New Training Available
              </div>
              <h2 className="text-4xl font-display font-bold leading-tight">Advanced Marching Drills & <br /> Synchronized Protocol</h2>
              <p className="text-white/60 text-lg">Access voice-guided tutorial videos and PDF marching manuals for the next District Camporee.</p>
              <div className="flex gap-4">
                 <button className="h-14 px-10 bg-gold text-navy font-bold rounded-2xl hover:bg-gold-glow transition-all">Watch Tutorials</button>
                 <button className="h-14 px-10 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">Download Manual</button>
              </div>
            </div>
            <motion.div 
               animate={{ rotate: [0, 5, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="w-48 h-48 lg:w-64 lg:h-64 rounded-full glass border-gold/40 flex items-center justify-center p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
            >
               <ShieldCheck className="w-full h-full text-gold stroke-[0.5px]" />
            </motion.div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
