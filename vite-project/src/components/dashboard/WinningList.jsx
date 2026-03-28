// src/components/dashboard/WinningList.jsx
import { CheckCircle, Clock, AlertCircle, Upload, FileText, Trophy, Activity } from 'lucide-react';

const WinningList = ({ winnings, onUploadProof }) => {
  if (!winnings || winnings.length === 0) {
    return (
      <div className="glass-card p-12 text-center border-dashed border-white/5 bg-transparent">
        <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
        <h3 className="text-xl font-display text-white mb-1">No Winnings Yet</h3>
        <p className="text-gray-500 text-sm">Once you top the leaderboard in a draw, your prize will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {winnings.map((win) => (
        <div key={win.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/5 hover:border-brand-primary/20 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-display font-bold text-lg leading-tight">
                  ${parseFloat(win.prize_won || 0).toLocaleString()} 
                </span>
                <span className="text-[10px] uppercase font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                   Take Home
                </span>
              </div>
              <p className="text-gray-500 text-xs">Draw Date: {new Date(win.draws?.draw_date || win.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-3">
             <StatusBadge status={win.verification_status} />
             
             {win.verification_status === 'pending' && (
               <button 
                 onClick={() => onUploadProof(win)}
                 className="flex items-center gap-2 text-xs font-bold text-brand-primary hover:text-white transition-colors group"
               >
                 <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                 Upload Scorecard Proof
               </button>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const configs = {
    pending: { icon: Clock, text: 'Awaiting Proof', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
    under_review: { icon: Activity, text: 'Under Review', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    verified: { icon: CheckCircle, text: 'Verified', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
    rejected: { icon: AlertCircle, text: 'Rejected', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </div>
  );
};

export default WinningList;
