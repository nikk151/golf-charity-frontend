// src/pages/Dashboard.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, Trophy, Target, Activity, Loader2, X, Plus, 
  LayoutDashboard, Settings, ShieldCheck 
} from 'lucide-react';
import { profileService, scoreService, drawService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ScoreHistory from '../components/dashboard/ScoreHistory';
import WinningList from '../components/dashboard/WinningList';
import ProofUploadModal from '../components/dashboard/ProofUploadModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, subscriptionStatus, logout, updateSubscription } = useAuth();
  
  // --- TABS STATE ---
  const [activeTab, setActiveTab] = useState('overview');
  const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'draws', label: 'Draws', icon: Trophy },
    { id: 'scores', label: 'Scores', icon: Target },
    { id: 'winnings', label: 'Winnings', icon: Activity },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  // --- DATA STATE ---
  const [winnings, setWinnings] = useState(0);
  const [winsList, setWinsList] = useState([]);
  const [latestDraw, setLatestDraw] = useState(null);
  const [selectedWinForProof, setSelectedWinForProof] = useState(null);
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScoreId, setEditingScoreId] = useState(null);
  const [newScore, setNewScore] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreError, setScoreError] = useState('');

    const fetchDashboardData = useCallback(async () => {
    // Individual try-catches ensure one failure doesn't kill the whole dashboard
    
    // 1. Fetch Scores (Priority)
    try {
      const scoresData = await scoreService.getMyScores();
      setScores(scoresData.scores || []);
    } catch (e) { console.error("Scores load failed", e); }

    // 2. Fetch Winnings
    try {
      const winningsData = await profileService.getWinnings();
      setWinnings(winningsData.contributionTotal || 0);
      setWinsList(winningsData.winnings || []);
    } catch (e) { console.error("Winnings load failed", e); }

    // 3. Fetch Subscription
    try {
      const subData = await profileService.getMySubscription();
      updateSubscription(subData.subscription?.status === 'active' ? 'active' : 'inactive');
    } catch (e) { console.error("Subscription load failed", e); }

    // 4. Fetch Latest Draw
    try {
      const drawData = await drawService.getLatestDraw();
      setLatestDraw(drawData.draw || null);
    } catch (e) { console.error("Draw load failed", e); }

    setIsLoading(false);
  }, [updateSubscription]);


  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditScore = (score) => {
    setEditingScoreId(score.id);
    setNewScore(score.score_value);
    setIsModalOpen(true);
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault();
    setScoreError('');
    setIsSubmitting(true);

    try {
      if (editingScoreId) {
        await scoreService.editScore(editingScoreId, newScore);
      } else {
        await scoreService.addScore(newScore);
      }
      setNewScore('');
      setEditingScoreId(null);
      setIsModalOpen(false);
      await fetchDashboardData();
    } catch (err) {
      setScoreError(err.response?.data?.message || 'Failed to submit score.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
         <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  const latestScore = scores.length > 0 ? scores[0] : null;

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-12 px-4 relative overflow-x-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b border-white/10 pb-8 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              Welcome, <span className="text-brand-primary">{user?.full_name || 'Member'}</span>
            </h1>
            <p className="text-gray-400">Your legacy is being written.</p>
          </motion.div>

          <div className="flex items-center gap-3">
            {user?.is_admin && (
              <button 
                onClick={() => navigate('/admin')} 
                className="flex items-center gap-2 text-sm text-brand-primary border border-brand-primary/30 bg-brand-primary/5 px-4 py-2 rounded-full hover:bg-brand-primary hover:text-brand-dark transition-all font-bold"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Console
              </button>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-400 border border-white/10 px-4 py-2 rounded-full hover:text-white hover:bg-white/5 transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10 mb-12 max-w-fit overflow-x-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
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

        {/* --- TAB CONTENT --- */}
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Pending Win Alert */}
              {winsList.some(w => w.verification_status === 'pending') && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 text-amber-500 font-display font-bold">
                     <Trophy className="w-5 h-5" />
                     You have a Win awaiting verification!
                  </div>
                  <button 
                    onClick={() => setActiveTab('winnings')}
                    className="text-amber-500 text-xs font-bold underline uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Verify Now
                  </button>
                </motion.div>
              )}
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Trophy className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Charity Impact</p>
                  <p className="text-3xl font-display text-white">${winnings.toLocaleString()}</p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-brand-primary/20 bg-brand-primary/5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary text-brand-dark flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-brand-primary text-sm font-medium mb-1 uppercase tracking-wider">Latest Score</p>
                  <p className="text-3xl font-display text-white">
                    {latestScore ? (
                      <>{latestScore.score_value} <span className="text-lg text-brand-primary/70 font-sans tracking-normal font-medium">Points</span></>
                    ) : (
                      <span className="text-gray-500 text-xl font-sans font-normal italic">No rounds yet</span>
                    )}
                  </p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-emerald-400">
                      <Activity className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-xs font-medium ${
                      subscriptionStatus === 'active' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    }`}>
                      {subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Collective Status</p>
                  <p className="text-3xl font-display text-white">{subscriptionStatus === 'active' ? 'Active' : 'Inactive'}</p>
                </motion.div>
              </div>

              {/* Action Panel */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                   <Target className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-3xl font-display text-white mb-3">Record a New Round</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto italic">Submit your latest scorecard (1-45 points). Your unique top 5 scores represent your rank in the charity pool.</p>
                <button 
                  onClick={() => {
                    setEditingScoreId(null);
                    setNewScore('');
                    if (subscriptionStatus === 'active') setIsModalOpen(true);
                    else navigate('/subscribe');
                  }} 
                  className="btn-primary flex items-center gap-2 px-10 py-4 rounded-xl bg-brand-primary text-brand-dark font-display font-bold shadow-lg shadow-brand-primary/20"
                >
                  <Plus className="w-5 h-5" /> Log Scorecard
                </button>
              </motion.div>
            </div>
          )}

          {activeTab === 'scores' && (
            <div className="max-w-4xl mx-auto">
               <ScoreHistory scores={scores} onEdit={handleEditScore} />
            </div>
          )}

          {activeTab === 'draws' && (
            <div className="max-w-4xl mx-auto text-center space-y-12 py-8">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-3xl font-display font-bold text-white mb-2">Official Draw Results</h3>
                <p className="text-gray-500 font-medium">
                  Results for {latestDraw ? new Date(latestDraw.draw_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Next Draw Loading...'}
                </p>
              </motion.div>

              {/* The 5 Balls Visual */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                {[latestDraw?.n1, latestDraw?.n2, latestDraw?.n3, latestDraw?.n4, latestDraw?.n5].map((num, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-brand-primary to-emerald-600 flex items-center justify-center text-brand-dark text-3xl md:text-4xl font-display font-bold shadow-2xl shadow-brand-primary/30 border-4 border-white/20 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                    {num || '?'}
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 1 }}
                className="glass-card p-10 max-w-2xl mx-auto border-brand-primary/10 bg-brand-primary/5"
              >
                <div className="flex items-center justify-center gap-3 mb-4 text-brand-primary">
                  <Activity className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Transparency Report</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  These numbers are generated using our verifiable non-custodial engine. 
                  Matches are calculated based on your **Rolling 5 Performance** history. 
                  Prizes are distributed automatically after the verification window.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto pb-10">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Pool</p>
                   <p className="text-white font-display font-bold">${latestDraw?.prize_pool_total?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Matches Required</p>
                   <p className="text-white font-display font-bold">3+</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                   <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Status</p>
                   <p className="text-brand-primary font-display font-bold uppercase text-[10px]">Verified</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'winnings' && (
            <div className="max-w-4xl mx-auto">
               <WinningList 
                 winnings={winsList} 
                 onUploadProof={(win) => setSelectedWinForProof(win)} 
               />
            </div>
          )}



{activeTab === 'settings' && (
  <div className="max-w-2xl mx-auto">
    <div className="glass-card p-8 border-white/5">
      <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
        <Settings className="w-5 h-5 text-brand-primary" />
        Account Information
      </h3>
      
      <div className="space-y-4">
        {/* Email Field */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <span className="text-gray-400 text-sm">Email Address</span>
          <span className="text-white font-medium">{user?.email || 'N/A'}</span>
        </div>

        {/* Subscription Plan */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
          <span className="text-gray-400 text-sm">Subscription Plan</span>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${
              subscriptionStatus === 'active' 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              {subscriptionStatus === 'active' ? 'Premium Collective' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center pt-6 border-t border-white/5">
         <p className="text-[10px] text-gray-500 italic">
           To modify your account details or manage your subscription billing, please contact our support team.
         </p>
      </div>
    </div>
  </div>
)}

        </motion.div>
      </div>

      {/* Pop-up Score Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-brand-dark/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="glass-card w-full max-w-md p-10 relative">
              <button onClick={() => { setIsModalOpen(false); setScoreError(''); }} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
              <div className="text-center mb-8">
                <h3 className="text-3xl font-display text-white font-bold">{editingScoreId ? 'Update Score' : 'New Round'}</h3>
              </div>
              <form onSubmit={handleScoreSubmit} className="flex flex-col gap-6">
                {scoreError && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center">{scoreError}</div>}
                <div className="relative">
                   <input type="number" min="1" max="45" value={newScore} onChange={(e) => setNewScore(e.target.value)} className="w-full bg-brand-surface-light border border-white/10 rounded-2xl py-8 text-center text-6xl text-white font-display focus:border-brand-primary" required />
                   <span className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-600 font-display font-bold italic">PTS</span>
                </div>
                <button disabled={isSubmitting} type="submit" className="w-full py-5 rounded-2xl bg-brand-primary text-brand-dark font-display font-bold text-lg shadow-xl shadow-brand-primary/20">
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (editingScoreId ? 'Save Changes' : 'Confirm Round')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proof Upload Modal */}
      <AnimatePresence>
        {selectedWinForProof && (
          <ProofUploadModal 
            win={selectedWinForProof}
            onClose={() => setSelectedWinForProof(null)}
            onUploadSuccess={() => {
              setSelectedWinForProof(null);
              fetchDashboardData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
