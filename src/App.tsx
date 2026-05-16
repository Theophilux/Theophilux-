import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './lib/firebase';
import { seedForumCategories } from './lib/seed';
import SplashScreen from './components/auth/SplashScreen';
import PINLogin from './components/auth/PINLogin';
import Onboarding from './components/auth/Onboarding';
import Dashboard from './components/dashboard/Dashboard';
import PrayerRoom from './components/spiritual/PrayerRoom';
import BibleAssistant from './components/spiritual/BibleAssistant';
import PathfinderManager from './components/management/PathfinderManager';
import YouthManager from './components/management/YouthManager';
import AttendanceTracker from './components/management/AttendanceTracker';
import SDALessons from './components/spiritual/SDALessons';
import Gallery from './components/media/Gallery';
import Analytics from './components/management/Analytics';
import LeadershipDashboard from './components/management/LeadershipDashboard';
import MemberDirectory from './components/management/MemberDirectory';
import ForumList from './components/forum/ForumList';
import ThreadView from './components/forum/ThreadView';
import CreateThread from './components/forum/CreateThread';
import Settings from './components/settings/Settings';
import { AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    seedForumCategories();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500); // Cinematic splash duration

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-navy text-gold">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/members" element={user ? <MemberDirectory /> : <Navigate to="/login" replace />} />
          <Route path="/forum" element={user ? <ForumList /> : <Navigate to="/login" replace />} />
          <Route path="/forum/new" element={user ? <CreateThread /> : <Navigate to="/login" replace />} />
          <Route path="/forum/thread/:threadId" element={user ? <ThreadView /> : <Navigate to="/login" replace />} />
          <Route path="/prayer-room" element={user ? <PrayerRoom /> : <Navigate to="/login" replace />} />
          <Route path="/bible-assistant" element={user ? <BibleAssistant /> : <Navigate to="/login" replace />} />
          <Route path="/pathfinders" element={user ? <PathfinderManager /> : <Navigate to="/login" replace />} />
          <Route path="/youths" element={user ? <YouthManager /> : <Navigate to="/login" replace />} />
          <Route path="/attendance" element={user ? <AttendanceTracker /> : <Navigate to="/login" replace />} />
          <Route path="/lessons" element={user ? <SDALessons /> : <Navigate to="/login" replace />} />
          <Route path="/gallery" element={user ? <Gallery /> : <Navigate to="/login" replace />} />
          <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" replace />} />
          <Route path="/leadership" element={user ? <LeadershipDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" replace />} />
          
          {/* Public Routes */}
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <PINLogin />} />
          <Route path="/onboarding" element={user ? <Navigate to="/dashboard" replace /> : <Onboarding />} />
          
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/onboarding"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
