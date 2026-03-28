// src/pages/SuccessPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="glass-card max-w-lg w-full p-10 text-center relative z-10"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-white mb-4">Welcome to The Collective.</h1>
        <p className="text-gray-400 mb-8 text-lg">Your subscription is active. Every score you log now contributes directly to your selected charity.</p>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-brand-dark font-display font-bold shadow-[0_0_20px_rgba(214,176,82,0.3)] transition-all"
        >
          <Trophy className="w-5 h-5" /> Enter the Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
