import { motion } from 'framer-motion';

const PrizePoolVis = () => {
  const tiers = [
    { label: 'Jackpot', match: '5 Numbers', percentage: 40, color: 'from-brand-primary to-yellow-600' },
    { label: 'High Roller', match: '4 Numbers', percentage: 35, color: 'from-brand-accent to-emerald-600' },
    { label: 'Circle Share', match: '3 Numbers', percentage: 25, color: 'from-gray-600 to-gray-400' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl">
      {tiers.map((tier, idx) => (
        <motion.div
          key={tier.label}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: idx * 0.15 }}
          className="relative group"
        >
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="text-sm font-display font-medium text-brand-primary uppercase tracking-widest">{tier.label}</span>
              <h4 className="text-xl font-bold flex items-center gap-2">
                Match {tier.match}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-3xl font-display font-black text-white">{tier.percentage}%</span>
              <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Pool Allocation</p>
            </div>
          </div>
          
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${tier.percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5 + idx * 0.1, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${tier.color} rounded-full relative`}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </motion.div>
          </div>
        </motion.div>
      ))}
      <p className="text-xs text-center text-gray-500 mt-4 italic">
        * Jackpot rolls over to the next month if no 5-number match is recorded.
      </p>
    </div>
  );
};

export default PrizePoolVis;
