import { motion } from 'motion/react';
import { Sparkles, Cross } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="h-screen w-full bg-navy flex flex-col items-center justify-center overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1.2 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
          className="absolute -top-1/4 -left-1/4 w-full h-full rounded-full bg-gold/20 blur-[100px]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1.5 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: 1 }}
          className="absolute -bottom-1/4 -right-1/4 w-full h-full rounded-full bg-blue-500/10 blur-[100px]"
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0 
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 5, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="h-1 w-1 bg-gold rounded-full blur-[1px]"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 flex flex-col items-center"
      >
        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.5 
            }}
            className="flex items-center justify-center p-8 rounded-full bg-white/5 backdrop-blur-xl border border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.2)]"
          >
            <Cross className="w-20 h-20 text-gold stroke-[1px] filter drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <Sparkles className="absolute top-0 left-1/2 -translate-x-1/2 text-gold/30 w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>

        <motion.h1 
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.1em" }}
          transition={{ duration: 1.5, delay: 1 }}
          className="text-4xl md:text-6xl font-display font-bold text-holy-white tracking-widest text-center"
        >
          KIOMWOBO <span className="text-gold">YOUTHS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-4 text-gold font-sans font-medium tracking-[0.3em] uppercase text-sm"
        >
          First of its Kind
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-12 flex flex-col items-center"
      >
        <p className="text-xs tracking-widest text-white/60">Created by Theophilux Mogash</p>
        <div className="mt-4 h-[2px] w-48 bg-white/10 overflow-hidden rounded-full">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/3 bg-gold shadow-[0_0_10px_#D4AF37]"
          />
        </div>
      </motion.div>
    </div>
  );
}
