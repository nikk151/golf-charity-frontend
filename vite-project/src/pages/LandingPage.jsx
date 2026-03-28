// src/pages/LandingPage.jsx
import { motion } from 'framer-motion';
import HeroScene from '../components/3d/HeroScene';
import Navbar from '../components/layout/Navbar';

const LandingPage = () => {
  return (
    <main className="relative min-h-screen bg-brand-dark overflow-hidden flex flex-col">
      <Navbar />
      
      {/* 3D Background */}
      <HeroScene />

      {/* Main Content Overlay */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto pt-20 drop-shadow-2xl">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
           className="inline-block px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/5 text-brand-primary text-sm font-medium tracking-wide mb-8"
        >
          Exclusive Philanthropy
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 text-white"
        >
          Excellence & <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-yellow-200">
             Impact.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed"
        >
          Not just a game. A legacy defined by every swing. 
          Join an invite-only circle transforming sport into tangible global change.
        </motion.p>
      </div>

      {/* Fade out the bottom into pure black */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-brand-dark to-transparent z-10 pointer-events-none" />
    </main>
  );
};

export default LandingPage;
