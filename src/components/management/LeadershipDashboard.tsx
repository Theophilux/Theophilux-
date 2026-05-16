import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MessageSquare, 
  Video, 
  Calendar, 
  Plus, 
  Send, 
  Share2, 
  Facebook, 
  Youtube, 
  Twitter, 
  Instagram,
  Clock,
  ChevronRight,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  getDocs,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import Shell from '../layout/Shell';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  createdAt: any;
}

interface Meeting {
  id: string;
  title: string;
  agenda: string;
  date: any;
  status: 'scheduled' | 'active' | 'completed';
}

export default function LeadershipDashboard() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch Meetings
  useEffect(() => {
    const q = query(collection(db, 'meetings'), orderBy('date', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meetingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Meeting[];
      setMeetings(meetingsData);
      
      // Auto-select active meeting if exists
      const active = meetingsData.find(m => m.status === 'active');
      if (active && !activeMeeting) {
        setActiveMeeting(active);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Messages for active meeting
  useEffect(() => {
    if (!activeMeeting) {
      setMessages([]);
      return;
    }

    const q = query(
      collection(db, 'meetingMessages'),
      where('meetingId', '==', activeMeeting.id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [activeMeeting]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeMeeting || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'meetingMessages'), {
        meetingId: activeMeeting.id,
        content: newMessage,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || 'Leader',
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleCreateMeeting = async () => {
    try {
      const meetingData = {
        title: "Leadership Sync - " + new Date().toLocaleDateString(),
        agenda: "Weekly progression and youth outreach planning.",
        date: Timestamp.now(),
        status: 'active',
        organizerId: auth.currentUser?.uid || 'system',
        attendees: [auth.currentUser?.uid || 'system']
      };
      const docRef = await addDoc(collection(db, 'meetings'), meetingData);
      setActiveMeeting({ id: docRef.id, ...meetingData } as Meeting);
    } catch (err) {
      console.error("Error creating meeting:", err);
    }
  };

  const SOCIAL_PLATFORMS = [
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', link: 'https://facebook.com', followers: '2.4k' },
    { name: 'YouTube', icon: Youtube, color: 'bg-red-600', link: 'https://youtube.com', followers: '1.2k' },
    { name: 'Instagram', icon: Instagram, color: 'bg-pink-600', link: 'https://instagram.com', followers: '3.1k' },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500', link: 'https://twitter.com', followers: '800' },
  ];

  return (
    <Shell>
      <div className="space-y-8">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2 flex items-center gap-4">
              Leadership <span className="text-gold">Command</span>
              <ShieldCheck className="text-gold" size={32} />
            </h1>
            <p className="text-white/60">Strategic oversight and real-time collaboration for the Kiomwobo leadership team.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateMeeting}
            className="flex items-center gap-2 px-6 py-3 gold-gradient text-navy font-bold rounded-2xl shadow-lg shadow-gold/20"
          >
            <Plus size={20} />
            New Meeting Session
          </motion.button>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard / Meeting Area */}
          <div className="lg:col-span-2 space-y-8">
            {activeMeeting ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-dark rounded-[40px] overflow-hidden border border-white/5 h-[700px] flex flex-col shadow-2xl"
              >
                {/* Meeting Header */}
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 bg-gold rounded-full" />
                    </div>
                    <div>
                      <h2 className="font-bold text-xl">{activeMeeting.title}</h2>
                      <p className="text-xs text-white/40 flex items-center gap-2 uppercase tracking-widest font-bold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" /> Live Now • {messages.length} Messages
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/60 transition-all"><Share2 size={20} /></button>
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-white/60 transition-all"><MoreVertical size={20} /></button>
                  </div>
                </div>

                {/* Chat Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
                >
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-white/20 gap-4">
                      <MessageSquare size={48} />
                      <p className="font-medium">The meeting floor is open. Start the discussion.</p>
                    </div>
                  )}
                  {messages.map((msg) => {
                    const isMe = msg.senderId === auth.currentUser?.uid;
                    return (
                      <motion.div 
                        key={msg.id}
                        initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[10px] font-bold text-white/40 mb-1 px-2 uppercase tracking-tighter">
                          {msg.senderName} • {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                          isMe 
                            ? 'bg-gold text-navy font-medium rounded-tr-none shadow-lg shadow-gold/10' 
                            : 'bg-white/5 text-white rounded-tl-none border border-white/10'
                        }`}>
                          {msg.content}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-6 bg-navy/50 border-t border-white/5">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-4 bg-white/5 p-2 rounded-3xl border border-white/10 focus-within:border-gold/50 transition-all">
                    <input 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Share your thoughts with the team..."
                      className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-white/20"
                    />
                    <button className="w-12 h-12 rounded-2xl gold-gradient text-navy flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95">
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <div className="glass-dark rounded-[40px] p-12 text-center flex flex-col items-center justify-center space-y-6 border border-white/5 aspect-video">
                <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center relative">
                  <Video size={40} className="text-gold" />
                  <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
                </div>
                <div className="max-w-md">
                  <h2 className="text-2xl font-bold mb-2">No Active Meeting</h2>
                  <p className="text-white/40">Ready to synchronize with your team? Start a new session or browse scheduled upcoming meetings.</p>
                </div>
                <button 
                  onClick={handleCreateMeeting}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all"
                >
                  Create Board Meeting
                </button>
              </div>
            )}

            {/* Recent Discussions / Threads */}
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-bold flex items-center gap-3">
                <MessageSquare className="text-gold" />
                Strategic Archives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meetings.filter(m => m.status !== 'active').map((meeting) => (
                  <div key={meeting.id} className="p-5 glass border-white/5 rounded-3xl group cursor-pointer hover:bg-white/10 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-gold/10 text-gold"><Calendar size={20} /></div>
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                        meeting.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gold/10 text-gold'
                      }`}>
                        {meeting.status}
                      </span>
                    </div>
                    <h4 className="font-bold mb-1 group-hover:text-gold transition-colors">{meeting.title}</h4>
                    <p className="text-xs text-white/40 line-clamp-2">{meeting.agenda}</p>
                  </div>
                ))}
                {meetings.length === 0 && <p className="text-white/20 italic">No archived meetings found.</p>}
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Social Media Integration */}
            <section className="space-y-6">
              <h3 className="text-2xl font-display font-bold flex items-center gap-3">
                <Share2 className="text-gold" />
                Social Media
              </h3>
              <div className="space-y-3">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <motion.a
                    key={platform.name}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 glass border-white/5 rounded-2xl hover:bg-white/10 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-white shadow-lg`}>
                      <platform.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{platform.name}</h4>
                      <p className="text-xs text-white/40">{platform.followers} Subscribers</p>
                    </div>
                    <ChevronRight size={16} className="text-white/20" />
                  </motion.a>
                ))}
              </div>
            </section>

            {/* Leadership Quick Stats */}
            <section className="p-8 glass-dark border border-gold/10 rounded-[40px] space-y-6">
              <h3 className="font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-gold" />
                Council Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Active Councils</span>
                  <span className="font-bold text-gold">4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Pending Approvals</span>
                  <span className="font-bold text-gold">12</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 gold-gradient rounded-full" />
                </div>
                <p className="text-[10px] text-white/40 text-center uppercase tracking-widest font-bold">Outreach Goal Progress</p>
              </div>
            </section>

            {/* Upcoming Leadership Calendar */}
            <section className="p-8 glass border-white/5 rounded-[40px] space-y-6">
              <h3 className="font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold" />
                Executive Calendar
              </h3>
              <div className="space-y-4">
                {[
                  { title: "District Council", time: "Sun, 4:00 PM" },
                  { title: "Budget Review", time: "Mon, 6:30 PM" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-1 h-10 gold-gradient rounded-full" />
                    <div>
                      <p className="text-sm font-bold">{item.title}</p>
                      <p className="text-xs text-white/40">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-all">
                Sync Calendar
              </button>
            </section>
          </div>
        </div>
      </div>
    </Shell>
  );
}
