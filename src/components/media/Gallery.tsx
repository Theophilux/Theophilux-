import { motion } from 'motion/react';
import { 
  Image as ImageIcon, 
  Video, 
  Sparkles, 
  Download, 
  Share2, 
  Heart,
  Search,
  Filter
} from 'lucide-react';
import Shell from '../layout/Shell';

const MEDIA_ITEMS = [
  { 
    id: '1', 
    title: 'Pathfinder Camporee 2024', 
    type: 'photo', 
    url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80',
    tags: ['Camporee', 'Youth'],
    likes: 124
  },
  { 
    id: '2', 
    title: 'Worship Night Highlights', 
    type: 'video', 
    url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80',
    tags: ['Worship', 'Music'],
    likes: 89
  },
  { 
    id: '3', 
    title: 'Bible Study Moments', 
    type: 'photo', 
    url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab43?auto=format&fit=crop&q=80',
    tags: ['Bible', 'Growth'],
    likes: 56
  },
  { 
    id: '4', 
    title: 'Community Outreach', 
    type: 'photo', 
    url: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80',
    tags: ['Service', 'Community'],
    likes: 210
  },
  { 
    id: '5', 
    title: 'Youth Choir Practice', 
    type: 'moment', 
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80',
    tags: ['Music', 'Choir'],
    likes: 45
  },
  { 
    id: '6', 
    title: 'Baptismal Class', 
    type: 'photo', 
    url: 'https://images.unsplash.com/photo-1519074063912-ad2fe3f516fc?auto=format&fit=crop&q=80',
    tags: ['Baptism', 'Spiritual'],
    likes: 132
  },
];

export default function Gallery() {
  return (
    <Shell>
      <div className="space-y-10">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              Media <span className="text-gold">Gallery</span>
            </h1>
            <p className="text-white/60 text-lg">Preserving our most precious spiritual moments.</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3 rounded-2xl shadow-lg shadow-gold/20 hover:scale-105 transition-all">
               <ImageIcon size={20} />
               Upload Media
             </button>
          </div>
        </section>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by event, tag or title..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-gold/50 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
            {['All', 'Photos', 'Videos', 'Moments'].map((filter) => (
              <button 
                key={filter}
                className={`whitespace-nowrap px-6 py-3 rounded-xl border text-sm font-bold transition-all ${
                  filter === 'All' 
                    ? 'border-gold bg-gold/10 text-gold' 
                    : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
            <button className="p-3 bg-white/5 rounded-xl border border-white/10 text-white/40">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MEDIA_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-[32px] overflow-hidden border border-white/10 aspect-[4/5] md:aspect-square"
            >
              <img 
                src={item.url} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Type Overlay */}
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  {item.type === 'video' ? <Video size={14} className="text-gold" /> : <ImageIcon size={14} className="text-gold" />}
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold">{item.type}</span>
                </div>
              </div>

              {/* Hover Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-bold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-display font-bold leading-tight">{item.title}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors">
                        <Heart size={18} />
                        <span className="text-sm font-bold">{item.likes}</span>
                      </button>
                      <button className="text-white/60 hover:text-white transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                    <button className="p-2.5 bg-gold text-navy rounded-xl hover:scale-110 transition-all">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute bottom-0 left-0 w-full h-1 gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Media Stats Banner */}
        <section className="rounded-[40px] p-10 bg-navy-light/50 border border-gold/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl gold-gradient flex items-center justify-center shadow-2xl shadow-gold/40">
                <Sparkles className="w-10 h-10 text-navy" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold">Cloud Sync Enabled</h3>
                <p className="text-white/60">All media is automatically backed up and synced across your devices.</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-gold">4.2 GB</p>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Storage Used</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-display font-bold text-gold">1,240</p>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Total Assets</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
