// src/pages/AdminDashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, Heart, ClipboardCheck, Sparkles, 
  CheckCircle, XCircle, Loader2, RefreshCcw,
  LayoutDashboard, PlayCircle, Eye, Activity, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { winnerService, drawService } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [winners, setWinners] = useState([]);
  const [stats, setStats] = useState({ jackpot: 0, totalUsers: 0, totalImpact: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // 'draw' or 'verify-{id}'

  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'verification', label: 'Verification Queue', icon: ClipboardCheck },
    { id: 'draws', label: 'Draw Controls', icon: Sparkles },
  ];

  

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [winnersRes, drawRes] = await Promise.all([
        winnerService.getAllWinners(),
        drawService.getLatestDraw()
      ]);
      
      setWinners(winnersRes.winners || []);
      
      // Calculate basic stats for overview
      const verifiedWinners = (winnersRes.winners || []).filter(w => w.verification_status === 'approved');
      const totalImpact = verifiedWinners.reduce((sum, w) => sum + (parseFloat(w.prize_won) * 0.1 || 0), 0);
      
      setStats({
        jackpot: drawRes.draw?.prize_pool_total || 0,
        totalUsers: 'Calculating...', 
        totalImpact
      });
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVerify = async (winnerId, status) => {
    setActionLoading(`verify-${winnerId}`);
    try {
      await winnerService.verifyWinner(winnerId, status);
      await fetchData(); // Refresh list
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunDraw = async (mode) => {
    if (!window.confirm(`Are you sure you want to run a ${mode} draw now? This will notify winners immediately.`)) return;
    
    setActionLoading('draw');
    try {
      await drawService.runDraw(mode);
      await fetchData();
      alert('Draw completed successfully!');
    } catch (error) {
      alert('Draw failed. Check logs.');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark pb-20 pt-24 px-4 overflow-x-hidden">
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">Admin <span className="text-brand-primary">Command</span></h1>
            <p className="text-gray-400">BirdieFund Platform Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 text-sm text-white/60 border border-white/10 px-4 py-2 rounded-full hover:text-white hover:bg-white/5 transition-all"
            >
              <User className="w-4 h-4" /> Player View
            </button>
            <button onClick={fetchData} className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
               <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 mb-12 max-w-fit overflow-x-auto no-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === item.id 
                  ? 'bg-brand-primary text-brand-dark shadow-lg shadow-brand-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <StatCard title="Current Prize Pool" value={`$${stats.jackpot.toLocaleString()}`} icon={Trophy} color="text-brand-primary" />
               <StatCard title="Charity Impact" value={`$${stats.totalImpact.toLocaleString()}`} icon={Heart} color="text-emerald-400" />
               <StatCard title="Active Members" value={stats.totalUsers} icon={Users} color="text-emerald-400" />
            </div>
          )}

          {activeTab === 'verification' && (
             <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white mb-6">Pending Proof Verification</h3>
                {winners.filter(w => w.verification_status === 'under_review').length === 0 ? (
                  <div className="glass-card p-12 text-center text-gray-500 border-dashed">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-10" />
                    Queue is empty. No pending proofs for recently completed draws.
                  </div>
                ) : (
                  winners.filter(w => w.verification_status === 'under_review').map((win) => (
                    <VerificationRow 
                      key={win.id} 
                      winner={win} 
                      onVerify={handleVerify} 
                      isLoading={actionLoading === `verify-${win.id}`}
                    />
                  ))
                )}
             </div>
          )}

          {activeTab === 'draws' && (
             <div className="max-w-2xl mx-auto space-y-8 py-8">
                <div className="glass-card p-10 border-brand-primary/20 bg-brand-primary/5 text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-50" />
                   <Sparkles className="w-16 h-16 text-brand-primary mx-auto mb-6 hover:scale-110 transition-transform cursor-pointer" />
                   <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-wide">Execute Draw Engine</h3>
                   <p className="text-gray-400 text-sm mb-10 max-w-sm mx-auto leading-relaxed">This will reconcile all active subscription scores, generate random winning numbers, and trigger prize allocation.</p>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        disabled={actionLoading === 'draw'}
                        onClick={() => handleRunDraw('random')}
                        className="btn-primary py-4 rounded-xl flex items-center justify-center gap-2 bg-brand-primary text-brand-dark font-display font-bold shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all"
                      >
                         {actionLoading === 'draw' ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlayCircle className="w-5 h-5" />}
                         Run Random Draw
                      </button>
                      <button 
                        disabled={actionLoading === 'draw'}
                        onClick={() => handleRunDraw('algorithmic')}
                        className="bg-white/5 border border-white/10 text-white hover:bg-white/10 py-4 rounded-xl flex items-center justify-center gap-2 font-display font-bold hover:scale-[1.02] transition-all"
                      >
                         <Activity className="w-5 h-5" />
                         Weight Matchers
                      </button>
                   </div>
                </div>

                <div className="glass-card p-6 border-white/5 bg-transparent">
                   <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Past Draw History</h4>
                   <div className="space-y-3">
                      <div className="h-[1px] bg-white/5 w-full" />
                      <p className="text-xs text-gray-600 italic">No draws recorded this month. Run a draw to populate history.</p>
                   </div>
                </div>
             </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-card p-8 border-white/5 relative overflow-hidden group hover:border-brand-primary/20 transition-all">
    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${color} group-hover:bg-brand-primary/10 transition-all`}>
      <Icon className="w-6 h-6" />
    </div>
    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
    <p className="text-3xl font-display font-bold text-white">{value}</p>
    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-all rotate-12">
       <Icon className="w-32 h-32" />
    </div>
  </div>
);

const VerificationRow = ({ winner, onVerify, isLoading }) => (
  <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/5 hover:border-brand-primary/20 transition-all bg-white/[0.02]">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 rounded-2xl bg-black/40 overflow-hidden relative group border border-white/10 shrink-0">
        {winner.proof_screenshot_url ? (
          <img src={winner.proof_screenshot_url} alt="Proof" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        )}
        <a 
          href={winner.proof_screenshot_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 bg-brand-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-6 h-6 text-brand-dark" />
        </a>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white font-display font-bold text-lg">{winner.profiles?.full_name || 'Anonymous User'}</span>
          <span className="text-[10px] uppercase font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20">
            Pending Approval
          </span>
        </div>
        <div className="flex items-center gap-4">
           <p className="text-white font-display font-bold">${parseFloat(winner.prize_won).toLocaleString()}</p>
           <div className="w-1 h-1 rounded-full bg-white/10" />
           <p className="text-gray-500 text-xs font-medium">{winner.profiles?.email}</p>
           <div className="w-1 h-1 rounded-full bg-white/10" />
           <p className="text-gray-400 text-xs">Matched: {winner.match_count}</p>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <button 
        disabled={isLoading || !winner.proof_screenshot_url}
        onClick={() => onVerify(winner.id, 'approved')}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-emerald-500/10 disabled:hover:text-emerald-400"
      >
        <CheckCircle className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Approve</span>
      </button>
      <button 
        disabled={isLoading}
        onClick={() => onVerify(winner.id, 'rejected')}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-red-500/10 disabled:hover:text-red-500"
      >
        <XCircle className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Reject</span>
      </button>
    </div>
  </div>
);

export default AdminDashboard;
