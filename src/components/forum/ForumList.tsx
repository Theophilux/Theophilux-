import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  MessageSquare, 
  Search, 
  Plus, 
  ChevronRight, 
  MessageCircle, 
  Clock,
  Layout,
  Filter,
  Users,
  ShieldAlert
} from 'lucide-react';
import { collection, query, orderBy, onSnapshot, getDocs, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import Shell from '../layout/Shell';
import { Link, useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  title: string;
  description: string;
  slug: string;
  order: number;
}

interface Thread {
  id: string;
  title: string;
  authorName: string;
  categoryId: string;
  createdAt: any;
  lastPostAt: any;
  postCount: number;
  isSticky: boolean;
  isLocked: boolean;
}

export default function ForumList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Categories
    const unsubCats = onSnapshot(
      query(collection(db, 'forumCategories'), orderBy('order', 'asc')),
      (snapshot) => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
        setCategories(cats);
        if (cats.length > 0 && !selectedCategory) {
          setSelectedCategory(cats[0].id);
        }
      }
    );

    return () => unsubCats();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    setLoading(true);
    const threadsQuery = query(
      collection(db, 'forumThreads'),
      where('categoryId', '==', selectedCategory),
      orderBy('lastPostAt', 'desc')
    );

    const unsubThreads = onSnapshot(threadsQuery, (snapshot) => {
      const ts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Thread[];
      setThreads(ts);
      setLoading(false);
    });

    return () => unsubThreads();
  }, [selectedCategory]);

  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Shell>
      <div className="space-y-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-gold font-bold text-xs uppercase tracking-[4px] mb-4">
              <MessageSquare size={16} /> COMMUNITY DISCOURSE
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter">
              Youth <span className="text-gold">Forums</span>
            </h1>
            <p className="text-white/40 mt-4 max-w-lg">Engage in spiritual discussions, share Pathfinder insights, and connect with other youths across the network.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-medium min-w-[300px]"
              />
            </div>
            <button 
              onClick={() => navigate('/forum/new')}
              className="h-14 px-8 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-gold/20 transition-all whitespace-nowrap"
            >
              <Plus size={20} /> New Discussion
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar / Categories */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6 px-2 flex items-center gap-2">
                <Layout size={14} /> Categories
              </h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${
                      selectedCategory === cat.id 
                      ? 'bg-gold text-navy font-bold shadow-lg shadow-gold/20' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{cat.title}</span>
                    <ChevronRight size={16} className={`${selectedCategory === cat.id ? 'text-navy' : 'text-white/20 group-hover:text-gold'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="glass p-6 rounded-[32px] border-white/5">
              <div className="flex items-center gap-3 mb-4 text-gold">
                <ShieldAlert size={18} />
                <h4 className="font-bold">Moderation</h4>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                All discussions must adhere to the church code of conduct. Offensive content will be removed by moderators.
              </p>
            </div>
          </aside>

          {/* Thread List */}
          <main className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-display font-bold">
                  {categories.find(c => c.id === selectedCategory)?.title || 'Threads'}
                </h2>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                  {filteredThreads.length} Threads
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-white/40">
                <span className="flex items-center gap-1"><Filter size={14} /> Sort:</span>
                <select className="bg-transparent outline-none text-white hover:text-gold cursor-pointer transition-colors">
                  <option className="bg-navy">Latest Activity</option>
                  <option className="bg-navy">Newest Threads</option>
                  <option className="bg-navy">Most Replied</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-32 bg-white/5 animate-pulse rounded-[32px]" />
                ))
              ) : filteredThreads.length === 0 ? (
                <div className="p-20 text-center glass rounded-[40px] border-dashed border-white/10">
                  <MessageCircle className="w-16 h-16 text-white/10 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-white/40 uppercase tracking-widest">No discussions yet</h3>
                  <p className="text-white/20 mt-2">Be the first to start a conversation in this category!</p>
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="group"
                  >
                    <Link to={`/forum/thread/${thread.id}`} className="block glass p-8 rounded-[32px] border-white/5 hover:bg-white/[0.08] hover:border-gold/20 transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            {thread.isSticky && (
                              <span className="px-2 py-0.5 bg-gold/10 text-gold text-[9px] font-bold uppercase tracking-widest border border-gold/20 rounded">Sticky</span>
                            )}
                            <h3 className="text-xl font-bold text-white group-hover:text-gold transition-colors">{thread.title}</h3>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                            <span className="flex items-center gap-1.5 font-medium">
                              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                                {thread.authorName.charAt(0)}
                              </div>
                              {thread.authorName}
                            </span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {thread.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}</span>
                            <span className="flex items-center gap-1.5"><MessageCircle size={14} /> {thread.postCount || 0} Replies</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="hidden md:block text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Last Update</p>
                            <p className="text-xs text-white/60 font-medium">{thread.lastPostAt?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'No posts'}</p>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-gold group-hover:bg-gold/10 group-hover:border-gold/20 transition-all">
                            <ChevronRight size={24} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </Shell>
  );
}
