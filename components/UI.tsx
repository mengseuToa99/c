import React from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Share2, RefreshCw, Hand } from 'lucide-react';

export const UI: React.FC = () => {
  const { phase, setPhase } = useStore();

  const handleReset = () => {
    setPhase('OFFERING');
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-between items-center"
      >
        <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-white font-semibold tracking-wider text-xl">Lumina</span>
        </div>
      </motion.header>

      {/* Main Interactions */}
      <AnimatePresence mode="wait">
        
        {/* OFFERING PHASE UI */}
        {phase === 'OFFERING' && (
          <motion.div 
            key="offering"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="self-center text-center mt-auto mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-light text-white mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              A Gift Awaits
            </h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto text-sm md:text-base">
              Focus your thoughts on what you wish to receive. <br/>
              Then, tap the box to open your gift.
            </p>
            <div className="pointer-events-auto inline-block">
               <div className="animate-bounce text-amber-300 text-sm font-mono tracking-widest uppercase opacity-70">
                 Tap Object
               </div>
            </div>
          </motion.div>
        )}

        {/* OPENING PHASE UI (Minimal/Hidden to let animation shine) */}
        {phase === 'OPENING' && (
             <motion.div key="opening" className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="w-[200px] h-[200px] rounded-full bg-white blur-[100px] opacity-20"
                />
             </motion.div>
        )}

        {/* RECEIVED PHASE UI - Tree is visible but no text yet, just instruction */}
        {phase === 'RECEIVED' && (
            <motion.div
                key="received-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-end pb-32 pointer-events-none"
            >
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center gap-2"
                >
                    <Hand className="w-8 h-8 text-amber-200 rotate-12" />
                    <p className="text-amber-100/80 font-light tracking-widest uppercase text-sm">Touch the Light</p>
                </motion.div>
            </motion.div>
        )}

        {/* EXPLODED PHASE UI - Final Message */}
        {phase === 'EXPLODED' && (
          <motion.div 
            key="exploded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-auto"
          >
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 1.5, type: 'spring' }}
               className="text-center px-6"
             >
                <h2 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 mb-6 drop-shadow-lg">
                    Illuminate
                </h2>
                <p className="text-lg text-blue-100 max-w-lg mx-auto mb-10 leading-relaxed">
                    You have unlocked the light within. Let it guide your path and inspire those around you.
                </p>
                
                <div className="flex gap-4 justify-center">
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white backdrop-blur-md transition-all active:scale-95"
                    >
                        <RefreshCw size={18} />
                        <span>Replay</span>
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all active:scale-95">
                        <Share2 size={18} />
                        <span>Share Light</span>
                    </button>
                </div>
             </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};