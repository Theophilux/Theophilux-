import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Send, 
  Clock, 
  User, 
  ShieldCheck, 
  MoreVertical, 
  Trash2, 
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  deleteDoc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import Shell from '../layout/Shell';

interface Thread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  categoryId: string;
  createdAt: any;
  isLocked: boolean;
  avatarColor?: string;
}

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
  avatarColor?: string;
}

export default function ThreadView() {
  const { threadId } = useParams<{ threadId: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!threadId) return;

    // Fetch Thread Details
    const fetchThread = async () => {
      const docRef = doc(db, 'forumThreads', threadId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setThread({ id: snapshot.id, ...snapshot.data() } as Thread);
      } else {
        navigate('/forum');
      }
    };

    fetchThread();

    // Fetch Posts (Replies)
    const postsQuery = query(
      collection(db, 'forumPosts'),
      where('threadId', '==', threadId),
      orderBy('createdAt', 'asc')
    );

    const unsubPosts = onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[]);
      setLoading(false);
    });

    // Fetch current user role for moderation
    const fetchRole = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setCurrentUserRole(userDoc.data().role);
        }
      }
    };
    fetchRole();

    return () => unsubPosts();
  }, [threadId]);

  const handleSubmitPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !threadId || !auth.currentUser || !thread || thread.isLocked) return;

    setIsSubmitting(true);
    try {
      // Add Post
      await addDoc(collection(db, 'forumPosts'), {
        content: newPost,
        threadId,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || 'Anonymous Member',
        createdAt: serverTimestamp(),
      });

      // Update Thread stats
      await updateDoc(doc(db, 'forumThreads', threadId), {
        postCount: increment(1),
        lastPostAt: serverTimestamp()
      });

      setNewPost('');
    } catch (err) {
      console.error("Error posting reply:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this reply?")) return;
    try {
      await deleteDoc(doc(db, 'forumPosts', postId));
      // Decrement post count
      if (threadId) {
        await updateDoc(doc(db, 'forumThreads', threadId), {
          postCount: increment(-1)
        });
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const isModerator = currentUserRole === 'Admin' || currentUserRole === 'District Leader' || currentUserRole === 'Youth Leader';

  if (loading && !thread) {
    return (
      <Shell>
        <div className="h-[60vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-gold animate-spin" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link to="/forum" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-gold hover:bg-gold/10 transition-all">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-gold text-[10px] font-bold uppercase tracking-[3px] mb-2">
                <MessageSquare size={14} /> DISCUSSION THREAD
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                {thread?.title}
              </h1>
            </div>
          </div>
          {thread?.isLocked && (
            <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 self-start">
              <AlertCircle size={14} /> Locked
            </div>
          )}
        </header>

        <div className="space-y-6">
          {/* Main Thread Content */}
          <motion.article 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-[40px] border-gold/10 overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center font-bold text-navy text-lg">
                  {thread?.authorName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold flex items-center gap-2">
                    {thread?.authorName}
                    <ShieldCheck size={14} className="text-gold" title="Moderator" />
                  </h4>
                  <p className="text-xs text-white/40 flex items-center gap-2">
                    <Clock size={12} /> {thread?.createdAt?.toDate?.().toLocaleString() || 'Recent'}
                  </p>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 text-lg leading-relaxed whitespace-pre-wrap">
                  {thread?.content}
                </p>
              </div>
            </div>
          </motion.article>

          {/* Replies Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[4px] text-white/20 px-8">Replies ({posts.length})</h3>
            <AnimatePresence>
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass p-8 rounded-[32px] border-white/5"
                >
                  <div className="flex justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white/60">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm">{post.authorName}</h5>
                        <p className="text-[10px] text-white/30 flex items-center gap-1">
                          <Clock size={10} /> {post.createdAt?.toDate?.().toLocaleString() || 'Just now'}
                        </p>
                      </div>
                    </div>
                    {(auth.currentUser?.uid === post.authorId || isModerator) && (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Reply Form */}
          {!thread?.isLocked ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass p-8 rounded-[40px] border-gold/10"
            >
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                    <Send size={16} />
                  </div>
                  <h4 className="font-bold text-lg uppercase tracking-tight">Post a <span className="text-gold">Reply</span></h4>
                </div>
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts, scriptures, or encouragement..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] p-6 outline-none focus:border-gold/50 transition-all font-medium resize-none shadow-inner"
                />
                <div className="flex items-center justify-between gap-6">
                  <p className="text-[10px] text-white/30 italic max-w-xs">
                    Please keep your comments respectful and christ-centered.
                  </p>
                  <button 
                    disabled={isSubmitting || !newPost.trim()}
                    type="submit"
                    className="h-16 px-10 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center gap-3 shadow-lg shadow-gold/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Send size={18} /> Post Reply
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <div className="p-12 text-center glass rounded-[40px] border-red-500/10">
              <AlertCircle className="w-12 h-12 text-red-500/20 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white/40">This discussion is locked</h4>
              <p className="text-xs text-white/20 mt-1">Further replies are disabled by moderators.</p>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
