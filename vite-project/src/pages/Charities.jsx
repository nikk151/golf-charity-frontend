// src/pages/Charities.jsx
import { useEffect, useState } from 'react';
import { charityService } from '../services/api';
import { motion } from 'framer-motion';
import { Heart, Globe, Loader2 } from 'lucide-react';

const Charities = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    charityService.getCharities()
      .then(res => setCharities(res.charities || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-12 px-4 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Heart className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-5xl font-display font-bold mb-4">Our Partners in Change</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Every time you play, you contribute to a better world. Here are the global initiatives currently supported by the BirdieFund Collective.</p>
        </div>

        {loading ? (
          <div className="flex justify-center"><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: idx * 0.1 }}
                key={charity.id} 
                className="glass-card p-8 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-3">{charity.name}</h3>
                <p className="text-gray-400 leading-relaxed mb-6 flex-grow">{charity.description || 'Dedicated to creating positive global impact through sustainable initiatives.'}</p>
                <button className="w-full py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors">
                  Learn More
                </button>
              </motion.div>
            ))}
            {charities.length === 0 && (
              <p className="text-gray-500 text-center col-span-full">No active charity partners found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Charities;
