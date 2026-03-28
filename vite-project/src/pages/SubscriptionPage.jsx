// src/pages/SubscriptionPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Loader2, CreditCard, Sparkles } from 'lucide-react';
import { charityService, subscriptionService } from '../services/api';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [plan, setPlan] = useState('monthly'); // 'monthly' or 'yearly'
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch the Charities from Supabase
  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await charityService.getCharities();
        setCharities(response.charities || []);
      } catch (err) {
        console.error(err);
        setError('Could not load charities.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharities();
  }, []);

  // 2. Handle Stripe Checkout Trigger
  const handleCheckout = async () => {
    if (!selectedCharity) {
      setError('Please select a charity first.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Tell backend to build a secure Stripe URL
      const response = await subscriptionService.createCheckoutSession(selectedCharity.id, plan);
      
      // Redirect the entire browser to Stripe!
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start checkout process.');
      setIsProcessing(false);
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
    <div className="min-h-screen bg-brand-dark pt-24 pb-12 px-4 relative overflow-x-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10 max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
           <Heart className="w-12 h-12 text-brand-primary mx-auto mb-4" />
           <h1 className="text-4xl font-display font-bold text-white mb-4">Complete your Application</h1>
           <p className="text-gray-400 max-w-xl mx-auto">Select the charity you are playing for, and choose your membership tier to activate your account.</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-8 text-center">
              {error}
            </div>
        )}

        {/* Step 1: Charity Selection */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-xl font-display text-white mb-6">1. Select Your Charity Pool</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {charities.map((charity) => (
              <div 
                key={charity.id}
                onClick={() => setSelectedCharity(charity)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedCharity?.id === charity.id 
                    ? 'border-brand-primary bg-brand-primary/10' 
                    : 'border-white/10 bg-white/5 hover:border-brand-primary/50'
                }`}
              >
                <h3 className="text-lg font-display text-white mb-1">{charity.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{charity.description || 'Supporting a great cause.'}</p>
              </div>
            ))}
          </div>
          {charities.length === 0 && <p className="text-gray-500 text-sm">No charities found in the database.</p>}
        </div>

        {/* Step 2: Tier Selection */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-xl font-display text-white mb-6">2. Select Membership Tier</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Monthly Card */}
            <div 
                onClick={() => setPlan('monthly')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  plan === 'monthly' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-white/5 opacity-70'
                }`}
            >
               <h3 className="text-2xl font-display text-white mb-1">Monthly</h3>
               <p className="text-brand-primary font-bold text-3xl mb-4">$99<span className="text-sm text-gray-400 font-normal">/mo</span></p>
               <ul className="text-sm text-gray-400 space-y-2">
                 <li>• Access to standard draws</li>
                 <li>• Real-time leaderboard</li>
               </ul>
            </div>

            {/* Yearly Card */}
            <div 
                onClick={() => setPlan('yearly')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all relative ${
                  plan === 'yearly' ? 'border-brand-primary bg-brand-primary/10' : 'border-white/10 bg-white/5 opacity-70'
                }`}
            >
               <div className="absolute -top-3 right-4 bg-brand-primary text-brand-dark text-xs font-bold px-3 py-1 rounded-full flex gap-1 items-center">
                 <Sparkles className="w-3 h-3" /> Best Value
               </div>
               <h3 className="text-2xl font-display text-white mb-1">Annually</h3>
               <p className="text-brand-primary font-bold text-3xl mb-4">$999<span className="text-sm text-gray-400 font-normal">/yr</span></p>
               <ul className="text-sm text-gray-400 space-y-2">
                 <li>• Save $198 annually</li>
                 <li>• Priority draw multiplier (soon)</li>
               </ul>
            </div>

          </div>
        </div>

        {/* Step 3: Checkout Button */}
        <div className="text-center">
           <button 
             onClick={handleCheckout}
             disabled={isProcessing || !selectedCharity}
             className="w-full max-w-sm mx-auto flex items-center justify-center gap-3 py-4 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-brand-dark font-display font-bold shadow-[0_0_20px_rgba(214,176,82,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <CreditCard className="w-5 h-5" /> Proceed to Secure Checkout
                </>
             )}
           </button>
           <p className="text-gray-500 text-xs mt-4">Payments securely processed by Stripe.</p>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPage;

