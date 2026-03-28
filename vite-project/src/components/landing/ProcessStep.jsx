import { motion } from 'framer-motion';

const ProcessStep = ({ number, title, description, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col p-8 glass-card group hover:border-brand-primary/30 transition-all duration-500"
    >
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-primary text-brand-dark flex items-center justify-center rounded-2xl font-display font-bold text-xl shadow-xl shadow-brand-primary/20 z-10 group-hover:scale-110 transition-transform">
        {number}
      </div>
      
      <div className="mb-6 p-4 w-fit rounded-2xl bg-white/5 border border-white/5 text-brand-primary group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-brand-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-gray-400 leading-relaxed font-light">
        {description}
      </p>
    </motion.div>
  );
};

export default ProcessStep;
