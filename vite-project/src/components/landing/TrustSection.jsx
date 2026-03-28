import { ShieldCheck, Lock, CreditCard, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSection = () => {
  const features = [
    { icon: ShieldCheck, title: 'SSL Secure', desc: 'Industry-standard encryption for all data transmissions.' },
    { icon: Lock, title: 'JWT Auth', desc: 'Secure, stateless authentication for your peace of mind.' },
    { icon: CreditCard, title: 'PCI-Stripe', desc: 'Payments handled by Stripe for maximum security compliance.' },
    { icon: Cpu, title: 'AI Optimized', desc: 'Transparent prize pool algorithms that power global fairness.' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {features.map((feature, idx) => (
        <motion.div
           key={feature.title}
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: idx * 0.15 }}
           className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center group hover:bg-white/10 transition-all"
        >
          <feature.icon className="w-6 h-6 text-brand-primary mb-3 group-hover:scale-110 transition-transform" />
          <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tighter">{feature.title}</h4>
          <p className="text-[10px] text-gray-500 max-w-[120px]">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default TrustSection;
