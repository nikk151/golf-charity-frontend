// src/pages/LandingPage.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, GraduationCap, Target } from 'lucide-react';
import HeroScene from '../components/3d/HeroScene';
import ProcessStep from '../components/landing/ProcessStep';
import PrizePoolVis from '../components/landing/PrizePoolVis';
import CharitySpotlight from '../components/landing/CharitySpotlight';
import TrustSection from '../components/landing/TrustSection';

const LandingPage = () => {
  return (
    <main className="relative min-h-screen bg-brand-dark overflow-x-hidden flex flex-col text-white">
      
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative h-screen flex items-center justify-center pt-20 px-6">
        {/* 3D Background Overlay */}
        <HeroScene />
        
        {/* Static Image Fallback / Background Polish */}
        <div 
          className="absolute inset-0 z-[-1] opacity-30 mix-blend-overlay scale-110 pointer-events-none"
          style={{ 
            backgroundImage: `url('/golf_premium_hero_1774702746609.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="inline-block px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-brand-primary text-xs font-bold uppercase tracking-[0.2em] mb-8"
          >
            Exclusive Philanthropy Circle
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-[7rem] font-bold tracking-tighter leading-[0.85] mb-8"
          >
            Excellence & <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-yellow-200 to-brand-primary animate-gradient-x">
               Impact.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light leading-relaxed"
          >
            Not just a game. A legacy defined by every swing. 
            Join an invite-only circle transforming sport into tangible global change.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/auth" className="px-8 py-4 rounded-full bg-brand-primary text-brand-dark font-display font-bold text-lg hover:scale-105 transition-all shadow-[0_0_30px_rgba(214,176,82,0.4)] flex items-center gap-2 group">
              Join Members <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-display hover:bg-white/10 transition-all backdrop-blur-md">
              Discover the Path
            </a>
          </motion.div>
        </div>
        
        {/* Decorative Scroll Hint */}
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1.5, duration: 1 }}
           className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-primary to-transparent" />
        </motion.div>
      </section>


      {/* ── HOW IT WORKS SECTION ─────────────────────────────────────────── */}
      <section id="how-it-works" className="relative py-32 px-6 bg-brand-surface border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-sm font-display font-bold text-brand-primary uppercase tracking-[0.3em] mb-4">The Mechanism</h2>
             <h3 className="text-4xl md:text-5xl font-bold">How the Circle Operates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProcessStep 
              number="01" 
              title="Subscribe" 
              description="Choose a Monthly ($50) or Yearly ($500) plan to power the global prize pool."
              icon={Target}
              delay={0.1}
            />
            <ProcessStep 
              number="02" 
              title="Play & Enter" 
              description="Play your rounds and enter your last 5 golf scores into our performance tracker."
              icon={GraduationCap}
              delay={0.2}
            />
            <ProcessStep 
              number="03" 
              title="Set Impact" 
              description="Direct 10% of your subscription to a charity that matters to you."
              icon={Users}
              delay={0.3}
            />
            <ProcessStep 
              number="04" 
              title="Impact Wins" 
              description="Enter the monthly draw with guaranteed payouts for 3, 4, or 5 number matches."
              icon={Trophy}
              delay={0.4}
            />
          </div>
        </div>
      </section>


      {/* ── PRIZE POOL & CHARITY SECTION ───────────────────────────────────── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
          
          {/* Left: Prize Viz */}
          <div className="lg:w-1/2">
            <h3 className="text-4xl font-bold mb-6">Transparent <br/><span className="text-brand-primary">Prize Allocation.</span></h3>
            <p className="text-gray-400 font-light leading-relaxed mb-10 max-w-lg">
              We believe in radical transparency. Every subscription builds a rolling jackpot that rewards consistent performance and luck in equal measure.
            </p>
            <PrizePoolVis />
          </div>

          {/* Right: Feature Content */}
          <div className="lg:w-1/2 grid grid-cols-1 gap-8">
            <div className="p-8 glass-card">
               <h4 className="text-2xl font-bold mb-3">10%+ Direct Charity</h4>
               <p className="text-sm text-gray-400 leading-relaxed font-light">
                 Unlike other platforms, we don't choose your cause. You select your beneficiary, and at least 10% of every payment flows directly to them, tracked in real-time.
               </p>
            </div>
            <div className="p-8 glass-card border-brand-primary/20">
               <h4 className="text-2xl font-bold mb-3">The Jackpot Engine</h4>
               <p className="text-sm text-gray-400 leading-relaxed font-light">
                 Our proprietary 5-number match system ensures massive payouts. If no user matches all numbers, the 40% jackpot pool rolls over to next month's pot.
               </p>
            </div>
          </div>
        </div>
      </section>


      {/* ── CHARITY SPOTLIGHT ────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-brand-surface-light">
        <div className="max-w-7xl mx-auto">
           <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-sm font-display font-bold text-brand-primary uppercase tracking-[0.3em] mb-4">Spotlight</h2>
                <h3 className="text-4xl font-bold">Our Global Partners</h3>
              </div>
              <Link to="/charities" className="text-brand-primary font-bold hover:underline underline-offset-8">
                 View All Charities
              </Link>
           </div>
           
           <CharitySpotlight />
        </div>
      </section>


      {/* ── TRUST & FOOTER ──────────────────────────────────────────────── */}
      <section className="relative py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          <TrustSection />
          
          <div className="text-center max-w-2xl px-8 py-12 rounded-[3rem] glass-card w-full">
             <h3 className="text-3xl font-bold mb-4">Ready to play for a legacy?</h3>
             <p className="text-gray-400 mb-8 text-sm">Join the circle today and define your impact beyond the green.</p>
             <Link to="/auth" className="inline-block px-10 py-4 rounded-full bg-brand-primary text-brand-dark font-bold text-lg hover:scale-105 transition-all">
                Submit Your Application
             </Link>
          </div>

          <div className="flex flex-col items-center gap-4 text-gray-600 text-[10px] uppercase tracking-widest pb-10">
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p>© 2026 The Collective. All memberships subject to approval.</p>
          </div>
        </div>
      </section>

    </main>
  );
};

export default LandingPage;
