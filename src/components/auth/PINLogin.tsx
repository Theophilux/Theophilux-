import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Church, User, ChevronRight, Delete, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

export default function PINLogin({ onLogin }: { onLogin?: () => void }) {
  const [step, setStep] = useState<'welcome' | 'info' | 'pin'>('welcome');
  const [fullName, setFullName] = useState('');
  const [churchCode, setChurchCode] = useState('');
  const [pin, setPin] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setStep('info');
    } catch (err) {
      console.error(err);
      setError('Google Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !churchCode) return;
    
    setLoading(true);
    setError('');
    
    try {
      const q = query(
        collection(db, 'users'), 
        where('fullName', '==', fullName),
        where('churchCode', '==', churchCode)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setIsNewUser(true);
      } else {
        setIsNewUser(false);
      }
      setStep('pin');
    } catch (err) {
      setError('Connection failed. Please sign in with Google first.');
    } finally {
      setLoading(false);
    }
  };

  const handlePINSubmit = async () => {
    if (pin.length < 4) return;
    
    setLoading(true);
    setError('');
    
    try {
      const currentUid = auth.currentUser?.uid;
      if (!currentUid) {
        setStep('welcome');
        throw new Error('No active session. Please sign in again.');
      }

      if (isNewUser) {
        // Create new profile mapped to current UID
        await setDoc(doc(db, 'users', currentUid), {
          fullName,
          churchCode,
          pin, // In production, hash this!
          role: 'Member',
          userId: currentUid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        // Find existing record
        const q = query(
          collection(db, 'users'), 
          where('fullName', '==', fullName),
          where('churchCode', '==', churchCode),
          where('pin', '==', pin)
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Invalid PIN');
          setLoading(false);
          setPin('');
          return;
        }

        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();
        
        // If the UID is different, "verify" the session
        // Note: For simplicity in this demo, we allow multiple UIDs to map to same profile if PIN is correct
        // In a real app we'd handle UID migration better
      }
      
      localStorage.setItem('kiomwobo_verified', 'true');
      if (onLogin) onLogin();
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const addDigit = (digit: string) => {
    if (pin.length < 6) setPin(prev => prev + digit);
  };

  const removeDigit = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Atmosphere Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-flex p-4 rounded-3xl bg-white/5 border border-gold/20 mb-6"
          >
            <Lock className="w-8 h-8 text-gold" />
          </motion.div>
          <h2 className="text-3xl font-display font-bold text-holy-white">
            {step === 'welcome' ? 'Identity Verification' : 
             step === 'info' ? 'Profile Setup' : 
             (isNewUser ? 'Secure PIN' : 'Enter PIN')}
          </h2>
          <p className="text-white/60 mt-2">Access the Kiomwobo Youths network</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'welcome' ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="p-6 glass rounded-[32px] border-white/5 space-y-4">
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold text-center">Cloud Authentication</p>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-16 bg-white text-navy font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gold transition-all disabled:opacity-50"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-navy border-t-transparent animate-spin rounded-full" /> : <LogIn size={20} />}
                  Sign In with Google
                </button>
              </div>
              
              <div className="text-center">
                <p className="text-white/20 text-[10px] uppercase tracking-widest leading-relaxed">
                  Authentication is required to access <br /> church directory and forums
                </p>
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </motion.div>
          ) : step === 'info' ? (
            <motion.form
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleInfoSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium"
                  required
                />
              </div>
              <div className="relative">
                <Church className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold/50" />
                <input
                  type="text"
                  placeholder="Church Code"
                  value={churchCode}
                  onChange={(e) => setChurchCode(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium"
                  required
                />
              </div>

              {error && <p className="text-red-400 text-sm py-2 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gold hover:bg-gold-glow text-navy font-bold rounded-2xl flex items-center justify-center gap-2 group transition-all"
              >
                {loading ? 'Verifying...' : 'Set PIN Details'}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              <div className="flex gap-4 mb-10">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 border-gold/40 transition-all duration-300 ${
                      pin.length > i ? 'bg-gold border-gold scale-110 shadow-[0_0_10px_#D4AF37]' : ''
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    onClick={() => addDigit(n.toString())}
                    className="w-16 h-16 rounded-full glass hover:bg-white/20 text-2xl font-display font-medium flex items-center justify-center transition-all active:scale-95"
                  >
                    {n}
                  </button>
                ))}
                <button 
                  onClick={() => setStep('info')}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => addDigit('0')}
                  className="w-16 h-16 rounded-full glass hover:bg-white/20 text-2xl font-display font-medium flex items-center justify-center transition-all active:scale-95"
                >
                  0
                </button>
                <button
                  onClick={removeDigit}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>

              {error && <p className="text-red-400 text-sm mt-6">{error}</p>}

              <button
                onClick={handlePINSubmit}
                disabled={loading || pin.length < 4}
                className="mt-10 w-full h-14 bg-holy-white text-navy font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gold hover:text-navy transition-all disabled:opacity-50"
              >
                {loading ? 'One moment...' : (isNewUser ? 'Complete Activation' : 'Access Platform')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
