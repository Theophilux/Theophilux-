import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Sparkles, 
  Target, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Heart,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import Shell from '../layout/Shell';

const ATTENDANCE_DATA = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 750 },
];

const SPIRITUAL_GROWTH_DATA = [
  { name: 'Week 1', value: 2400 },
  { name: 'Week 2', value: 1398 },
  { name: 'Week 3', value: 9800 },
  { name: 'Week 4', value: 3908 },
  { name: 'Week 5', value: 4800 },
  { name: 'Week 6', value: 3800 },
  { name: 'Week 7', value: 4300 },
];

const ENGAGEMENT_DATA = [
  { name: 'Youth', value: 450, color: '#D4AF37' },
  { name: 'Pathfinders', value: 300, color: '#3B82F6' },
  { name: 'Leaders', value: 150, color: '#10B981' },
  { name: 'District', value: 200, color: '#EC4899' },
];

const TOP_PERFORMERS = [
  { name: 'Theophilux M.', role: 'Youth Leader', activity: 'High', points: '12,450', avatar: 'TM' },
  { name: 'Sarah J.', role: 'Pathfinder', activity: 'Medium', points: '8,200', avatar: 'SJ' },
  { name: 'David K.', role: 'District Coord', activity: 'High', points: '15,100', avatar: 'DK' },
];

export default function Analytics() {
  return (
    <Shell>
      <div className="space-y-10">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Performance <span className="text-gold">Analytics</span>
            </h1>
            <p className="text-white/60 text-lg">Real-time spiritual engagement and growth metrics.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
            <button className="px-4 py-2 bg-gold text-navy font-bold rounded-xl text-sm transition-all">This Month</button>
            <button className="px-4 py-2 text-white/50 hover:text-white rounded-xl text-sm transition-all font-bold">This Year</button>
          </div>
        </section>

        {/* Global KPIs */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Spiritual Engagement', value: '84%', change: '+12%', icon: Heart, color: 'text-pink-400' },
            { label: 'Active Members', value: '1,280', change: '+5%', icon: Users, color: 'text-gold' },
            { label: 'Event Attendance', value: '92%', change: '+24%', icon: Calendar, color: 'text-emerald-400' },
            { label: 'Drill Efficiency', value: '76%', change: '-2%', icon: ShieldCheck, color: 'text-blue-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-premium p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 rounded-3xl bg-white/5 border border-white/10 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                  {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </div>
              </div>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-display font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Attendance Trends */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass border-white/5 rounded-[40px] p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold flex items-center gap-3">
                <Activity className="text-gold" />
                Attendance Trends
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold text-white/40">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gold" /> Participation</span>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ATTENDANCE_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D223B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#D4AF37" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Engagement Distribution */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass border-white/5 rounded-[40px] p-8"
          >
            <h2 className="text-xl font-display font-bold flex items-center gap-3 mb-8">
              <Target className="text-gold" />
              Member Segments
            </h2>
            <div className="h-[250px] w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ENGAGEMENT_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {ENGAGEMENT_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0D223B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {ENGAGEMENT_DATA.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-bold text-white/60">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Spiritual Growth & Leaders */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Leaders Leaderboard */}
          <section className="glass border-white/5 rounded-[40px] p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold flex items-center gap-3">
                <Sparkles className="text-gold" />
                Spiritual Lead Board
              </h2>
              <button className="text-gold text-sm font-bold hover:underline underline-offset-4">View All</button>
            </div>
            <div className="space-y-4">
              {TOP_PERFORMERS.map((p, i) => (
                <div key={p.name} className="flex items-center gap-4 p-4 rounded-[28px] bg-white/5 border border-white/5 hover:border-gold/20 transition-all group">
                  <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center font-bold text-navy shadow-lg shadow-gold/10">
                    {p.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{p.name}</h4>
                    <p className="text-xs text-white/40">{p.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-display font-bold text-gold">{p.points}</p>
                    <p className="text-[10px] uppercase font-bold text-emerald-400">{p.activity} Activity</p>
                  </div>
                  <ChevronRight size={20} className="text-white/20 group-hover:text-gold transition-colors" />
                </div>
              ))}
            </div>
          </section>

          {/* Growth Insight Container */}
          <section className="rounded-[40px] p-10 bg-gold/10 border border-gold/20 relative overflow-hidden flex flex-col justify-center">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
             <div className="relative z-10 space-y-6">
               <div className="w-16 h-16 rounded-2xl bg-gold text-navy flex items-center justify-center">
                 <Sparkles size={32} />
               </div>
               <div>
                  <h3 className="text-3xl font-display font-bold mb-2">AI Growth Insight</h3>
                  <p className="text-white/70 text-lg leading-relaxed">
                    Based on recent activity, youth engagement in <span className="text-gold font-bold">Prayer Requests</span> has increased by 40% this week. Suggest scheduling a collective youth prayer night to capitalize on this momentum.
                  </p>
               </div>
               <button className="w-full py-4 rounded-2xl bg-gold text-navy font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-gold/20">
                 Generate Full Report
               </button>
             </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
