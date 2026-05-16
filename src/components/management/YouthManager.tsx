import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Plus, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  GraduationCap,
  Briefcase,
  Star,
  User
} from 'lucide-react';
import Shell from '../layout/Shell';

const YOUTHS = [
  { id: '1', name: 'Theophilus Mogaka', role: 'Youth Leader', talent: 'Music & AI', district: 'Central', rank: 'Platinum' },
  { id: '2', name: 'Mercy Nyanduko', role: 'Member', talent: 'Spoken Word', district: 'Central', rank: 'Gold' },
  { id: '3', name: 'Kevin Onchwari', role: 'Deacon', talent: 'Photography', district: 'South', rank: 'Silver' },
  { id: '4', name: 'Faith Kemunto', role: 'Member', talent: 'Art', district: 'West', rank: 'Diamond' },
];

export default function YouthManager() {
  return (
    <Shell>
      <div className="space-y-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-gold font-bold text-xs uppercase tracking-[4px] mb-4">
              <Users size={16} /> YOUTH GENERATION MANAGEMENT
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter">
              Legacy <span className="text-gold">Builders</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search youth members..." 
                className="h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-medium min-w-[300px]"
              />
            </div>
            <button className="h-14 px-8 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-gold/20 transition-all">
              <Plus size={20} /> New Member
            </button>
          </div>
        </header>

        {/* Talent Showcase Header */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Top Talent', value: 'Photography', icon: Star, color: 'text-gold' },
            { label: 'Active Youths', value: '1,284', icon: Users, color: 'text-blue-400' },
            { label: 'Spiritual Streaks', value: '15 Days', icon: Heart, color: 'text-emerald-400' },
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
        </section>

        {/* Grid of Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {YOUTHS.map((youth) => (
            <motion.div
              key={youth.id}
              whileHover={{ y: -10 }}
              className="card-premium h-[420px] relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent z-10" />
              <div className="absolute top-4 right-4 z-20">
                <div className="px-3 py-1 rounded-full bg-gold/20 backdrop-blur-md border border-gold/40 text-gold text-[10px] font-bold uppercase tracking-widest">
                  {youth.rank} Rank
                </div>
              </div>

              <div className="absolute inset-0 z-0 scale-105 group-hover:scale-110 transition-transform duration-700">
                 <img 
                   src={`https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600&member=${youth.id}`} 
                   className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60"
                 />
              </div>

              <div className="absolute bottom-0 left-0 p-8 z-20 w-full space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-2">
                  <User size={32} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-white group-hover:text-gold transition-colors">{youth.name}</h3>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-[2px]">{youth.role}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/30 font-bold uppercase">District</p>
                    <p className="text-sm font-medium flex items-center gap-1.5"><Briefcase size={12} className="text-gold/40" /> {youth.district}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] text-white/30 font-bold uppercase">Talent</p>
                    <p className="text-sm font-medium flex items-center gap-1.5 justify-end">{youth.talent} <Sparkles size={12} className="text-gold/40" /></p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          
          <motion.div 
            whileHover={{ scale: 0.98 }}
            className="border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center p-8 text-center bg-white/2 hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="p-6 rounded-full bg-white/5 border border-white/10 group-hover:border-gold/30 transition-all mb-4">
              <Plus className="w-8 h-8 text-white/20 group-hover:text-gold" />
            </div>
            <p className="font-bold text-white/40 group-hover:text-white">Register New Leader</p>
          </motion.div>
        </div>

        {/* Talent Showcase Section */}
        <section className="glass rounded-[48px] p-10 flex flex-col lg:flex-row items-center gap-12 border-white/5 border-l-gold/20 border-l-4">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-display font-bold">Youth Talent Showcase</h2>
            <p className="text-white/60 text-lg max-w-xl">
              Celebrating the gifts God has given our youth. From music to photography, spoken word to creative arts—every talent builds the kingdom.
            </p>
            <div className="flex gap-4">
               <button className="h-14 px-8 bg-gold text-navy font-bold rounded-2xl hover:bg-gold-glow flex items-center gap-3">
                 <Sparkles size={20} /> Upload My Talent
               </button>
               <button className="h-14 px-8 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                 Browse Gallery
               </button>
            </div>
          </div>
          <div className="flex gap-4 p-4 overflow-hidden mask-fade-right">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-48 h-64 rounded-3xl overflow-hidden grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                <img src={`https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=400&i=${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
