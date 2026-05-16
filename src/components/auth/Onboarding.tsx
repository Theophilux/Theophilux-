import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Church, Sparkles, BookOpen, Users, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    title: "Welcome to Kiomwobo Youths",
    description: "The first of its kind premium church operating system designed for the futuristic youth.",
    icon: Church,
    color: "from-gold to-gold-glow"
  },
  {
    title: "Pathfinder & Youth Management",
    description: "Track drills, classes, badges and spiritual growth with seamless Apple-quality precision.",
    icon: Sparkles,
    color: "from-blue-500 to-indigo-500"
  },
  {
    title: "Spiritual Growth & Devotionals",
    description: "Access Sabbath school lessons in multiple languages and track your prayer life daily.",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Ask Theophilux Assistant",
    description: "Your AI-powered spiritual guide for Bible questions, Pathfinder advice, and church info.",
    icon: Users,
    color: "from-emerald-500 to-teal-500"
  }
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (current < SLIDES.length - 1) {
      setCurrent(prev => prev + 1);
    } else {
      navigate('/login');
    }
  };

  const Icon = SLIDES[current].icon;

  return (
    <div className="h-screen w-full bg-navy flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="flex flex-col items-center text-center max-w-sm z-10"
        >
          <div className={`p-8 rounded-[40px] bg-gradient-to-br ${SLIDES[current].color} shadow-2xl mb-12`}>
            <Icon className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-3xl font-display font-bold text-holy-white mb-4 tracking-tight">
            {SLIDES[current].title}
          </h1>
          
          <p className="text-white/60 leading-relaxed font-sans mb-12 text-lg">
            {SLIDES[current].description}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mb-12 z-10">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === i ? 'w-8 bg-gold' : 'w-2 bg-white/20'
            }`}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="z-10 group relative flex items-center justify-center w-full max-w-xs h-16 bg-white rounded-3xl overflow-hidden active:scale-95 transition-all"
      >
        <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <span className="relative z-10 text-navy font-bold text-lg flex items-center gap-2">
          {current === SLIDES.length - 1 ? 'Get Started' : 'Next Step'}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </button>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
