import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Send, 
  MessageSquare, 
  Layout, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  FileText,
  Tag,
  Plus
} from 'lucide-react';
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import Shell from '../layout/Shell';

interface Category {
  id: string;
  title: string;
}

export default function CreateThread() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const q = query(collection(db, 'forumCategories'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      setCategories(cats);
      if (cats.length > 0) setCategoryId(cats[0].id);
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId || !auth.currentUser) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Get user name for metadata
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      const authorName = userDoc.exists() ? userDoc.data().fullName : 'Anonymous Member';

      const threadRef = await addDoc(collection(db, 'forumThreads'), {
        title,
        content,
        categoryId,
        authorId: auth.currentUser.uid,
        authorName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastPostAt: serverTimestamp(),
        postCount: 0,
        isSticky: false,
        isLocked: false
      });

      navigate(`/forum/thread/${threadRef.id}`);
    } catch (err: any) {
      console.error("Error creating thread:", err);
      setError("Failed to create discussion. please check your permissions.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex items-center gap-6">
          <Link to="/forum" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:bg-gold/10 transition-all">
            <ChevronLeft size={24} />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-[3px] mb-2">
              <Plus size={14} /> NEW DISCUSSION
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Start a <span className="text-gold">Conversation</span>
            </h1>
          </div>
        </header>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="glass rounded-[48px] border-gold/10 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 md:col-span-1">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 px-2">
                  <Tag size={14} className="text-gold" /> Category
                </label>
                <div className="relative">
                  <select 
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold/50 transition-all font-medium appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-navy">{cat.title}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                    <ChevronLeft size={16} className="-rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 px-2">
                  <FileText size={14} className="text-gold" /> Thread Title
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="What's on your mind? (e.g. Tips for the next Camporee)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 outline-none focus:border-gold/50 transition-all font-medium text-lg lg:text-xl shadow-inner placeholder:text-white/10"
                />
              </div>

              <div className="space-y-4 md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 px-2">
                  <MessageSquare size={14} className="text-gold" /> Discussion Content
                </label>
                <textarea 
                  required
                  rows={8}
                  placeholder="Provide details for your discussion..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 outline-none focus:border-gold/50 transition-all font-medium resize-none shadow-inner"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-white/30">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <p className="text-xs max-w-[240px]">By posting, you agree to follow the forum guidelines and treat everyone with respect.</p>
              </div>
              
              <button 
                disabled={isSubmitting || !title.trim() || !content.trim()}
                type="submit"
                className="w-full md:w-auto h-18 px-12 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-gold/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Send size={20} /> Create Discussion
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
