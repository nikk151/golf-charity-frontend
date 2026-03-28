// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-8 py-5 flex justify-between items-center glass-card border-none rounded-none rounded-b-[2rem]"
      >
        <Link to="/" className="flex items-center gap-2 z-50">
          <div className="w-8 h-8 rounded-full bg-brand-primary" />
          <span className="text-2xl font-display font-bold text-white tracking-tighter">
            The Collective.
          </span>
        </Link>

        {/* Desktop View */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
          <Link to="/charities" className="hover:text-brand-primary transition-colors">Charities</Link>
          <Link to="/leaderboard" className="hover:text-brand-primary transition-colors">Leaderboard</Link>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 hover:text-brand-primary transition-colors">
                  <Shield className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link 
                to="/dashboard" 
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-display text-white"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-display text-white">
                Sign In
              </Link>
              <Link to="/auth" className="px-6 py-2.5 rounded-full bg-brand-primary hover:bg-brand-primary/90 text-brand-dark transition-all font-display font-semibold shadow-[0_0_20px_rgba(214,176,82,0.3)] hover:shadow-[0_0_30px_rgba(214,176,82,0.5)] hover:-translate-y-0.5">
                Join Members
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden z-50 p-2 text-white hover:text-brand-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-brand-surface/95 backdrop-blur-3xl flex flex-col justify-center items-center gap-8 md:hidden"
          >
            <Link to="/charities" onClick={() => setIsOpen(false)} className="text-2xl font-display text-gray-300 hover:text-brand-primary transition-colors">Charities</Link>
            <Link to="/leaderboard" onClick={() => setIsOpen(false)} className="text-2xl font-display text-gray-300 hover:text-brand-primary transition-colors">Leaderboard</Link>
            
            <div className="flex flex-col gap-4 mt-8 w-64">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsOpen(false)}
                      className="w-full text-center flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-display text-lg text-white"
                    >
                      <Shield className="w-5 h-5" /> Admin Panel
                    </Link>
                  )}
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-brand-primary text-brand-dark font-display font-semibold text-lg"
                  >
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-center flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-display text-lg"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/auth" 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-display text-lg text-white"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/auth" 
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center px-6 py-4 rounded-2xl bg-brand-primary text-brand-dark font-display font-semibold text-lg"
                  >
                    Join Members
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
