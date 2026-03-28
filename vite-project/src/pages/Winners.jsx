// src/pages/Winners.jsx
import { useEffect, useState } from 'react';
import { winnerService } from '../services/api';
import { motion } from 'framer-motion';
import { Trophy, Loader2, Calendar } from 'lucide-react';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    winnerService.getWinners()
      .then(res => setWinners(res.winners || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-12 px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <Trophy className="w-16 h-16 text-brand-primary mx-auto mb-4" />
          <h1 className="text-5xl font-display font-bold mb-4">Hall of Champions</h1>
          <p className="text-gray-400">The latest winners from the BirdieFund Monthly Draw.</p>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="w-8 h-8 text-brand-primary animate-spin" /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-sm">
                    <th className="p-6 font-medium">Draw ID</th>
                    <th className="p-6 font-medium">Match Level</th>
                    <th className="p-6 font-medium">Prize</th>
                    <th className="p-6 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((winner, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: idx * 0.05 }}
                      key={winner.id || idx} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-6 text-sm text-gray-500 font-mono">#{winner.draw_id}</td>
                      <td className="p-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent/20 text-brand-primary text-xs font-bold uppercase">
                          MATCH-{winner.match_count}
                        </span>
                      </td>
                      <td className="p-6 font-display text-xl text-white font-semibold">
                        ${Number(winner.prize_amount).toLocaleString()}
                      </td>
                      <td className="p-6">
                        <span className={`text-xs font-bold uppercase tracking-wider ${winner.payment_status === 'paid' ? 'text-green-400' : 'text-gray-400'}`}>
                          {winner.payment_status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {winners.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-500">No winners recorded yet. The jackpot grows!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Winners;
