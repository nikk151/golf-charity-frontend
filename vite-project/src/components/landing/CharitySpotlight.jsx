import { motion } from 'framer-motion';
import { ExternalLink, Heart } from 'lucide-react';

const CharitySpotlight = () => {
  const charities = [
    { name: 'Pure Water Project', impact: 'Clean water for 50,000+', desc: 'Focused on sustainable filtration systems in remote communities.', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=800' },
    { name: 'Green Horizons', impact: '1.2M Trees Planted', desc: 'Reforestation initiatives to combat carbon footprints across the globe.', image: 'https://images.unsplash.com/photo-1542601906-e78263773ed7?auto=format&fit=crop&q=80&w=800' },
    { name: 'The Ocean Cleanse', impact: '500 Tons Filtered', desc: 'Removing plastic waste from coastal waters and coral reef zones.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {charities.map((charity, idx) => (
        <motion.div
           key={charity.name}
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: idx * 0.2 }}
           className="relative group h-[400px] rounded-3xl overflow-hidden glass-card border-none"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src={charity.image} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt={charity.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/95 via-brand-dark/60 to-transparent" />
          </div>

          {/* Content Foreground */}
          <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end">
            <motion.div 
               className="flex items-center gap-2 text-brand-primary mb-3 bg-brand-primary/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm"
               whileHover={{ scale: 1.05 }}
            >
              <Heart className="w-4 h-4 text-brand-primary" fill="currentColor" />
              <span className="text-xs font-bold uppercase tracking-widest">{charity.impact}</span>
            </motion.div>
            
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
              {charity.name}
            </h3>
            
            <p className="text-gray-300 text-sm font-light mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
              {charity.desc}
            </p>

            <button className="flex items-center gap-2 text-white/50 text-xs font-display hover:text-white group-hover:gap-3 transition-all">
              LEARN MORE <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CharitySpotlight;
