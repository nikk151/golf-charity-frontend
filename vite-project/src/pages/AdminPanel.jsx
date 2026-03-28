// src/pages/AdminPanel.jsx
import { useState, useEffect } from 'react';
import { adminService, profileService } from '../services/api';
import { motion } from 'framer-motion';
import { Loader2, ShieldAlert, Play, Dna } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    profileService.getProfile()
      .then(res => {
        setProfile(res.profile);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-dark"><Loader2 className="animate-spin text-brand-primary w-8 h-8"/></div>;
  }

  // Double check admin role
  if (profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRunDraw = async (simulate = false) => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = simulate ? await adminService.simulateDraw() : await adminService.runDraw();
      setMessage(`Success! ${res.message || 'Draw completed.'}`);
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-12 px-4 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="container max-w-4xl mx-auto relative z-10">
        
        <div className="flex items-center gap-4 mb-8">
          <ShieldAlert className="w-10 h-10 text-red-500" />
          <h1 className="text-4xl font-display font-bold">Admin Console</h1>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5 text-white">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass-card p-8">
            <h2 className="text-2xl font-display mb-4">Draw Controls</h2>
            <p className="text-gray-400 mb-6">Trigger the algorithmic draw process. This will halt active scores, calculate the prize pool, and pick winners based on weightings.</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleRunDraw(true)} 
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 border border-brand-primary text-brand-primary hover:bg-brand-primary/10 py-3 rounded-xl transition-all"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Dna className="w-5 h-5" />} Simulate Draw (Safe)
              </button>
              
              <button 
                onClick={() => handleRunDraw(false)} 
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />} RUN OFFICIAL DRAW
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
