import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Download, Volume2, Search, Filter, Languages, ChevronRight, Bookmark } from 'lucide-react';
import Shell from '../layout/Shell';

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
  { id: 'eg', label: 'Ekegusii', flag: '🦁' }
];

const LESSONS = [
  { id: 1, title: 'The Fruit of the Spirit', date: 'Quarter 2, Week 7', author: 'Dr. John Doe', summary: 'Exploring the transformative power of love, joy, and peace in the Christian life.' },
  { id: 2, title: 'The Great Controversy', date: 'Quarter 2, Week 8', author: 'Elena G. White', summary: 'Understanding the cosmic battle between good and evil and our role in it.' },
  { id: 3, title: 'Sabbath: A Day of Delight', date: 'Quarter 2, Week 9', author: 'Pr. Samuel Mogash', summary: 'Rediscovering the true meaning of the fourth commandment in a busy world.' },
];

export default function SDALessons() {
  const [lang, setLang] = useState('en');
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  return (
    <Shell>
      <div className="space-y-12 pb-20">
        {/* Editorial Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2 text-gold font-bold uppercase tracking-[4px] mb-4 text-xs"
            >
              <Book size={14} /> SDA WORLDWIDE LESSONS
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[0.9] tracking-tighter">
              Divine <span className="italic text-white/40">Knowledge</span> <br />
              <span className="text-gold">Sabbath School</span>
            </h1>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 glass backdrop-blur-xl">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  lang === l.id ? 'bg-gold text-navy shadow-lg' : 'text-white/40 hover:text-white'
                }`}
              >
                <span>{l.flag}</span>
                <span className="text-sm tracking-wide uppercase">{l.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Featured Lesson Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="group relative h-[500px] rounded-[48px] overflow-hidden cursor-pointer"
            >
              <img 
                src="https://images.unsplash.com/photo-1504052434139-a835b0d00851?auto=format&fit=crop&q=80&w=1200" 
                alt="Bible" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-10 md:p-14 space-y-6">
                <div className="flex gap-4">
                  <span className="px-4 py-1 rounded-full bg-gold/20 backdrop-blur-md border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest">Featured</span>
                  <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/60 text-xs font-bold uppercase tracking-widest">Audio Available</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">Living the Word: <br /> Practical Christian Growth</h2>
                <div className="flex items-center gap-8">
                  <button className="h-14 px-10 bg-gold text-navy font-bold rounded-2xl hover:bg-gold-glow transition-all flex items-center gap-2">
                    Start Reading <ChevronRight size={20} />
                  </button>
                  <button className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all">
                    <Volume2 size={24} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <aside className="space-y-6 flex flex-col justify-between">
            <div className="glass p-8 rounded-[40px] border-white/5 space-y-6 h-full">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-bold text-gold">Latest Quizzes</h3>
                <Bookmark className="text-gold/40" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-4 rounded-3xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 cursor-pointer">
                    <p className="text-xs text-gold/60 font-bold uppercase tracking-widest mb-1">Week {i}</p>
                    <p className="font-bold text-white/90">Test your knowledge on Spiritual Gifts</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-4 rounded-2xl border border-gold/20 text-gold font-bold text-sm hover:bg-gold hover:text-navy transition-all">
                View All Quizzes
              </button>
            </div>
          </aside>
        </section>

        {/* Lessons List Grid */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display font-bold italic">Archive <span className="text-white/20">/ Explorations</span></h2>
            <div className="flex gap-4">
               <button className="p-3 rounded-2xl glass hover:bg-white/10"><Filter size={20} className="text-gold" /></button>
               <button className="p-3 rounded-2xl glass hover:bg-white/10"><Search size={20} className="text-gold" /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LESSONS.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-premium space-y-6"
              >
                <div className="h-48 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  <img src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600&i=${i}`} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-gold/60 tracking-widest uppercase">
                    <span>{lesson.date}</span>
                    <span>{lesson.author}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white">{lesson.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed line-clamp-2">{lesson.summary}</p>
                  <div className="pt-4 flex items-center justify-between">
                    <button className="text-gold font-bold text-sm tracking-widest uppercase hover:underline flex items-center gap-1">
                      Read More <ChevronRight size={14} />
                    </button>
                    <button className="text-white/40 hover:text-white transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
