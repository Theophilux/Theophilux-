import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Send, Sparkles, User, MessageCircle, Share2, Flame } from 'lucide-react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import Shell from '../layout/Shell';

interface Prayer {
  id: string;
  content: string;
  userId: string;
  isAnonymous: boolean;
  reactions: number;
  createdAt: any;
}

export default function PrayerRoom() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [input, setInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'prayerRequests'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prayer[];
      setPrayers(data);
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'prayerRequests'), {
        content: input.trim(),
        userId: auth.currentUser?.uid,
        isAnonymous,
        reactions: 0,
        createdAt: serverTimestamp()
      });
      setInput('');
      setIsAnonymous(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReact = async (id: string) => {
    try {
      await updateDoc(doc(db, 'prayerRequests', id), {
        reactions: increment(1)
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Shell>
      <div className="relative min-h-[calc(100vh-14rem)] rounded-[40px] overflow-hidden p-6 lg:p-12">
        {/* Ambient Worship Background */}
        <div className="absolute inset-0 bg-[#071426] z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60" />
          <motion.div 
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/10 blur-[150px] rounded-full"
          />
        </div>

        {/* Floating Candles / Particles */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                opacity: 0,
                scale: 0.5
              }}
              animate={{ 
                y: [null, '-20vh'],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
                x: [null, (Math.random() - 0.5) * 50 + 'px']
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute"
            >
              <div className="w-2 h-2 bg-gold rounded-full blur-[2px] shadow-[0_0_10px_#D4AF37]" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-20 max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex p-4 rounded-3xl bg-gold/10 border border-gold/20 mb-4"
            >
              <Flame className="w-8 h-8 text-gold animate-pulse" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">The Holy Prayer Wall</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto italic font-serif">
              "For where two or three are gathered together in my name, there am I in the midst of them."
            </p>
          </div>

          {/* Post Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-dark p-8 rounded-[40px] border-white/5"
          >
            <textarea
              placeholder="What can we pray for you today?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-xl md:text-2xl text-white placeholder:text-white/20 resize-none min-h-[120px] font-medium"
            />
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${
                    isAnonymous ? 'bg-gold text-navy font-bold' : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  <User size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">{isAnonymous ? 'Anonymous' : 'Public'}</span>
                </button>
                <div className="flex items-center gap-2 text-gold/40">
                  <Sparkles size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Faith Filled Posting</span>
                </div>
              </div>
              <button
                onClick={handlePost}
                disabled={!input.trim() || loading}
                className="w-full md:w-auto h-14 px-10 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] disabled:opacity-50"
              >
                <Send size={20} />
                Post Prayer
              </button>
            </div>
          </motion.div>

          {/* Prayers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
            <AnimatePresence mode="popLayout">
              {prayers.map((prayer, i) => (
                <motion.div
                  key={prayer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card-premium h-fit border-white/5 relative group"
                >
                  <div className="absolute top-4 right-4 text-[10px] font-bold text-white/20 uppercase tracking-[2px]">
                    {new Date(prayer.createdAt?.seconds * 1000).toLocaleDateString()}
                  </div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <User size={18} className="text-gold/60" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gold">
                        {prayer.isAnonymous ? 'Brother/Sister in Christ' : (prayer as any).fullName || 'Member'}
                      </h4>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Prayer Request</p>
                    </div>
                  </div>
                  <p className="text-lg text-white/90 leading-relaxed font-serif italic mb-6">
                    "{prayer.content}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <button 
                      onClick={() => handleReact(prayer.id)}
                      className="flex items-center gap-2 text-pink-400/60 hover:text-pink-400 transition-all group"
                    >
                      <div className="p-2 rounded-xl bg-pink-400/5 group-hover:bg-pink-400/10 transition-all">
                        <Heart size={16} fill={prayer.reactions > 0 ? "currentColor" : "none"} />
                      </div>
                      <span className="text-xs font-bold">{prayer.reactions} Amen</span>
                    </button>
                    <div className="flex gap-2">
                       <button className="p-2 text-white/20 hover:text-white transition-all">
                        <Share2 size={16} />
                       </button>
                       <button className="p-2 text-white/20 hover:text-white transition-all">
                        <MessageCircle size={16} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Shell>
  );
}
