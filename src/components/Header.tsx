@@ .. @@
 import React, { useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
-import { Calendar, Search, User, Sun, Moon, LogOut, Settings as SettingsIcon, Menu, X } from 'lucide-react';
+import { Calendar, Search, User, Sun, Moon, LogOut, Settings as SettingsIcon, Menu, X, Bell } from 'lucide-react';
 import { useAuth } from '../context/AuthContext';
 import { useTheme } from '../context/ThemeContext';
 import { useNavigate } from 'react-router-dom';
 import AuthModal from './AuthModal';
+import NotificationCenter from './NotificationCenter';

@@ .. @@
             {/* Desktop Controls */}
             <div className="hidden md:flex items-center space-x-3">
+              {/* Notifications */}
+              {user && <NotificationCenter />}
+              
               {/* Theme Toggle */}