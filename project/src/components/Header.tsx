import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, User, Sun, Moon, LogOut, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getTodayDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleProfileClick = () => {
    if (user) {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-card dark:glass-card-dark sticky top-0 z-40 soft-shadow dark:soft-shadow-dark"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavigation('/')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl group-hover:shadow-lg transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                <Calendar className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-display font-bold text-ink-900 dark:text-white">
                  Calendar Archive
                </h1>
                <p className="text-sm text-ink-600 dark:text-ink-300">AI-Powered Learning</p>
              </div>
            </motion.div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <motion.div 
                className="relative w-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search events, dates, or topics..."
                  className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400"
                />
              </motion.div>
            </div>

            {/* Desktop Today's Date */}
            <motion.div 
              className="hidden lg:block text-center"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-ink-600 dark:text-ink-400">Today</p>
              <p className="text-sm font-medium text-ink-900 dark:text-white">
                {getTodayDate()}
              </p>
            </motion.div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-3 glass-card dark:glass-card-dark rounded-2xl hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {theme === 'light' ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Profile */}
              <div className="relative">
                <motion.button
                  onClick={handleProfileClick}
                  className="p-3 glass-card dark:glass-card-dark rounded-2xl hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                </motion.button>

                <AnimatePresence>
                  {user && isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 glass-card dark:glass-card-dark rounded-2xl soft-shadow dark:soft-shadow-dark py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/20">
                        <p className="text-sm font-medium text-ink-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-ink-500 dark:text-ink-400">{user.email}</p>
                        <motion.span 
                          className="inline-block px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mt-2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {user.role}
                        </motion.span>
                      </div>
                      <motion.button
                        onClick={() => handleNavigation('/dashboard')}
                        className="w-full text-left px-4 py-3 text-sm text-ink-700 dark:text-ink-300 hover:bg-white/20 flex items-center space-x-3 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <User className="h-4 w-4" />
                        <span>Dashboard</span>
                      </motion.button>
                      <motion.button
                        onClick={() => handleNavigation('/settings')}
                        className="w-full text-left px-4 py-3 text-sm text-ink-700 dark:text-ink-300 hover:bg-white/20 flex items-center space-x-3 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <SettingsIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </motion.button>
                      {user.role === 'admin' && (
                        <motion.button
                          onClick={() => handleNavigation('/admin')}
                          className="w-full text-left px-4 py-3 text-sm text-ink-700 dark:text-ink-300 hover:bg-white/20 flex items-center space-x-3 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <SettingsIcon className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </motion.button>
                      )}
                      <motion.button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-coral-600 dark:text-coral-400 hover:bg-white/20 flex items-center space-x-3 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 glass-card dark:glass-card-dark rounded-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-white/20 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400"
                  />
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center justify-between">
                  <motion.button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 p-3 glass-card dark:glass-card-dark rounded-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {theme === 'light' ? (
                      <Moon className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                    ) : (
                      <Sun className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                    )}
                    <span className="text-sm text-ink-700 dark:text-ink-300">
                      {theme === 'light' ? 'Dark' : 'Light'} Mode
                    </span>
                  </motion.button>

                  <motion.button
                    onClick={handleProfileClick}
                    className="flex items-center space-x-2 p-3 glass-card dark:glass-card-dark rounded-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="h-5 w-5 text-ink-600 dark:text-ink-400" />
                    <span className="text-sm text-ink-700 dark:text-ink-300">
                      {user ? 'Profile' : 'Sign In'}
                    </span>
                  </motion.button>
                </div>

                {/* Mobile User Menu */}
                {user && (
                  <div className="space-y-2 pt-4 border-t border-white/20">
                    <motion.button
                      onClick={() => handleNavigation('/dashboard')}
                      className="w-full text-left p-3 glass-card dark:glass-card-dark rounded-2xl text-sm text-ink-700 dark:text-ink-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Dashboard
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation('/settings')}
                      className="w-full text-left p-3 glass-card dark:glass-card-dark rounded-2xl text-sm text-ink-700 dark:text-ink-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Settings
                    </motion.button>
                    {user.role === 'admin' && (
                      <motion.button
                        onClick={() => handleNavigation('/admin')}
                        className="w-full text-left p-3 glass-card dark:glass-card-dark rounded-2xl text-sm text-ink-700 dark:text-ink-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Admin Panel
                      </motion.button>
                    )}
                    <motion.button
                      onClick={handleLogout}
                      className="w-full text-left p-3 glass-card dark:glass-card-dark rounded-2xl text-sm text-coral-600 dark:text-coral-400"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;