// src/components/dashboard/ScoreHistory.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Award, Calendar } from 'lucide-react';

const ScoreHistory = ({ scores, onEdit }) => {
  // We only care about the last 5 per the PRD
  const displayScores = scores.slice(0, 5);
  
  // Fill empty slots if less than 5 rounds have been played
  const emptySlots = 5 - displayScores.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-primary" />
          Rolling 5 Performance
        </h3>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
          Sliding Window Active
        </span>
      </div>

      <div className="grid gap-3">
        <AnimatePresence mode="popLayout">
          {displayScores.map((score, index) => (
            <motion.div
              key={score.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className="group glass-card p-4 flex items-center justify-between border-white/5 hover:border-brand-primary/20 hover:bg-white/5 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-display font-bold">
                  #{index + 1}
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-white leading-none">
                    {score.score_value} <span className="text-xs text-gray-400 font-sans font-medium uppercase tracking-tighter">Pts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(score.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onEdit(score)}
                className="p-2 rounded-lg bg-white/5 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-brand-primary hover:bg-brand-primary/10 transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          {/* Placeholders for remaining slots */}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="p-4 rounded-2xl border border-dashed border-white/5 bg-transparent flex items-center justify-center text-gray-600 italic text-sm"
            >
              Empty Slot {displayScores.length + i + 1}
            </div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-[10px] text-gray-500 text-center mt-2 px-4 italic">
        *Only your 5 most recent rounds are kept. Submitting a new round replaces your oldest entry automatically.
      </p>
    </div>
  );
};

export default ScoreHistory;
