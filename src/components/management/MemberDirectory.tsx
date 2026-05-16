import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Trash2, 
  Edit2,
  X,
  Filter,
  Download,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Shell from '../layout/Shell';

interface Member {
  id: string;
  fullName: string;
  church: string;
  phone: string;
  email: string;
  notes: string;
  role: string;
  createdAt: any;
}

export default function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    church: '',
    phone: '',
    email: '',
    notes: '',
    role: 'Member'
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'members'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Member[];
      setMembers(data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setError("Failed to load members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member?: Member) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        fullName: member.fullName,
        church: member.church,
        phone: member.phone,
        email: member.email || '',
        notes: member.notes || '',
        role: member.role || 'Member'
      });
    } else {
      setEditingId(null);
      setFormData({
        fullName: '',
        church: '',
        phone: '',
        email: '',
        notes: '',
        role: 'Member'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        const docRef = doc(db, 'members', editingId);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'members'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsModalOpen(false);
      fetchMembers();
    } catch (err) {
      console.error("Error saving member:", err);
      setError("Failed to save member details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await deleteDoc(doc(db, 'members', id));
      fetchMembers();
    } catch (err) {
      console.error("Error deleting member:", err);
      setError("Failed to delete member.");
    }
  };

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.church.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery)
  );

  return (
    <Shell>
      <div className="space-y-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-gold font-bold text-xs uppercase tracking-[4px] mb-4">
              <Users size={16} /> MEMBER INFORMATION SYSTEM
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter">
              Church <span className="text-gold">Directory</span>
            </h1>
            <p className="text-white/40 mt-4 max-w-sm">Manage and organize all youth, pathfinders, and general church members in one place.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search by name, church, phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-gold/50 transition-all font-medium min-w-[300px]"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleOpenModal()}
                className="h-14 px-8 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-gold/20 transition-all whitespace-nowrap"
              >
                <Plus size={20} /> Register Member
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <div className="glass rounded-[40px] border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-display font-bold">Registry</h2>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-bold">
                {filteredMembers.length} Results
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-gold bg-gold/10 rounded-xl whitespace-nowrap">All Members</button>
              <button className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all whitespace-nowrap flex items-center gap-2">
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-white/30 text-[10px] uppercase font-bold tracking-[3px]">
                  <th className="px-8 py-6">Member Details</th>
                  <th className="px-8 py-6">Church / District</th>
                  <th className="px-8 py-6">Contact Info</th>
                  <th className="px-8 py-6">Role</th>
                  <th className="px-8 py-6">Notes</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                        <p className="text-white/40 font-bold uppercase tracking-[2px]">Streaming Member Data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <p className="text-white/20 font-bold uppercase tracking-[2px]">No members found in directory</p>
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((member, i) => (
                    <motion.tr 
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-white/5 transition-all"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center font-display font-bold text-gold text-lg border border-gold/20">
                            {member.fullName.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold text-white group-hover:text-gold transition-all text-lg">{member.fullName}</span>
                            <span className="text-white/40 text-xs flex items-center gap-1">
                              ID: {member.id.substring(0, 8)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-white/80">
                          <MapPin size={14} className="text-gold/60" />
                          <span className="font-medium">{member.church}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm">
                            <Phone size={14} /> {member.phone}
                          </div>
                          {member.email && (
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                              <Mail size={14} /> {member.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          member.role === 'Admin' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          member.role === 'District Leader' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          ['Youth Leader', 'Pathfinder Director'].includes(member.role) ? 'bg-gold/20 text-gold border border-gold/30' :
                          'bg-white/5 text-white/60 border border-white/10'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-8 py-6 max-w-[200px]">
                        <p className="text-white/40 text-xs truncate italic">{member.notes || 'No notes added'}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenModal(member)}
                            className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-gold hover:text-navy transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(member.id)}
                            className="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-premium p-10 flex flex-col justify-center gap-6 group">
             <div className="w-16 h-16 rounded-3xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
               <Filter className="text-gold w-8 h-8" />
             </div>
             <div className="space-y-2">
               <h3 className="text-2xl font-display font-bold">Quick Filtering</h3>
               <p className="text-white/60">Easily find members by their church branch, district, or phone number. The directory serves as the core of the Kiomwobo community.</p>
             </div>
          </div>
          <div className="card-premium p-10 bg-navy-light/40 border-gold/20">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center">
                 <AlertCircle className="text-navy" />
               </div>
               <div>
                  <h4 className="font-bold">Next Steps</h4>
                  <p className="text-white/40 text-xs">Recommended actions for the administrator</p>
               </div>
             </div>
             <ul className="space-y-4">
                {[
                  "Complete profile information for new members",
                  "Assign leaders to their respective district units",
                  "Verify contact information for the upcoming camporee",
                  "Schedule a check-in for members with no recent activity"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-navy/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-navy-light border border-white/10 rounded-[48px] overflow-hidden shadow-2xl"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-4xl font-display font-bold text-white">
                      {editingId ? 'Edit' : 'Register'} <span className="text-gold">Member</span>
                    </h2>
                    <p className="text-white/40 text-sm mt-2">Enter the required details to add a new member to the database.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-[20px] px-6 outline-none focus:border-gold/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Church / Branch</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. Central SDA"
                        value={formData.church}
                        onChange={(e) => setFormData({...formData, church: e.target.value})}
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-[20px] px-6 outline-none focus:border-gold/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="e.g. +254..."
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-[20px] px-6 outline-none focus:border-gold/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Email Address (Optional)</label>
                      <input 
                        type="email" 
                        placeholder="e.g. john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-[20px] px-6 outline-none focus:border-gold/50 transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Platform Role</label>
                      <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full h-16 bg-white/5 border border-white/10 rounded-[20px] px-6 outline-none focus:border-gold/50 transition-all font-medium appearance-none"
                      >
                        <option value="Member" className="bg-navy">Member</option>
                        <option value="Youth Leader" className="bg-navy">Youth Leader</option>
                        <option value="Pathfinder Director" className="bg-navy">Pathfinder Director</option>
                        <option value="District Leader" className="bg-navy">District Leader</option>
                        <option value="Admin" className="bg-navy">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-2">Special Notes / Bio</label>
                    <textarea 
                      placeholder="Add any additional context, talents, or notes here..."
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-[24px] p-6 outline-none focus:border-gold/50 transition-all font-medium resize-none"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full h-18 bg-gold hover:bg-gold-glow text-navy font-bold rounded-[24px] shadow-lg shadow-gold/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <FileText size={20} /> {editingId ? 'Update Member Profile' : 'Complete Registration'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
