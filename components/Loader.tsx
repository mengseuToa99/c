import React from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

export const Loader: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const { progress } = useProgress();
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setFinished(true);
        onFinished();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinished]);

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-64 relative h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
            <motion.div 
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <h1 className="text-2xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-amber-200">
            LUMINA
          </h1>
          <p className="text-xs text-gray-500 mt-2 font-mono">LOADING ASSETS {Math.round(progress)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
