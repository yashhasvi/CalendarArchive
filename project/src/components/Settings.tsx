import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2, 
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    eventReminders: true,
    aiSuggestions: false
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'data', label: 'Data & Storage', icon: Download }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (setting: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log('Saving profile:', formData);
  };

  const handleSaveNotifications = () => {
    // Save notifications logic here
    console.log('Saving notifications:', notifications);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <User className="h-10 w-10 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-display font-semibold text-ink-900 dark:text-white">
            {user?.name || 'User'}
          </h3>
          <p className="text-ink-600 dark:text-ink-400">{user?.email}</p>
          <span className="inline-block px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mt-2">
            {user?.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white"
              placeholder="Enter your location"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      <motion.button
        onClick={handleSaveProfile}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className="h-4 w-4" />
        <span>Save Changes</span>
      </motion.button>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-semibold text-ink-900 dark:text-white">
        Notification Preferences
      </h3>
      
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
          { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive browser push notifications' },
          { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Get a weekly summary of events' },
          { key: 'eventReminders', label: 'Event Reminders', description: 'Reminders for bookmarked events' },
          { key: 'aiSuggestions', label: 'AI Suggestions', description: 'Personalized learning suggestions' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-4 glass-card dark:glass-card-dark rounded-2xl">
            <div>
              <h4 className="font-medium text-ink-900 dark:text-white">{setting.label}</h4>
              <p className="text-sm text-ink-600 dark:text-ink-400">{setting.description}</p>
            </div>
            <motion.button
              onClick={() => handleNotificationChange(setting.key, !notifications[setting.key as keyof typeof notifications])}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                notifications[setting.key as keyof typeof notifications] 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                  : 'bg-stone-300 dark:bg-stone-600'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{
                  x: notifications[setting.key as keyof typeof notifications] ? 24 : 4
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        ))}
      </div>

      <motion.button
        onClick={handleSaveNotifications}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Save className="h-4 w-4" />
        <span>Save Preferences</span>
      </motion.button>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-semibold text-ink-900 dark:text-white">
        Change Password
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Current Password
          </label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              className="w-full pl-12 pr-12 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            New Password
          </label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white"
              placeholder="Enter new password"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white"
              placeholder="Confirm new password"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-coral-50 dark:bg-coral-900/20 border border-coral-200 dark:border-coral-800 rounded-2xl">
        <h4 className="font-medium text-coral-700 dark:text-coral-300 mb-2">Delete Account</h4>
        <p className="text-sm text-coral-600 dark:text-coral-400 mb-4">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        <motion.button
          className="bg-coral-500 text-white px-4 py-2 rounded-xl hover:bg-coral-600 transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete Account</span>
        </motion.button>
      </div>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-semibold text-ink-900 dark:text-white">
        Theme Preferences
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          onClick={() => theme === 'dark' && toggleTheme()}
          className={`p-6 glass-card dark:glass-card-dark rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
            theme === 'light' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent hover:border-white/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-full h-20 bg-gradient-to-br from-earth-50 to-stone-100 rounded-xl mb-4 border border-stone-200"></div>
          <h4 className="font-medium text-ink-900 dark:text-white">Light Mode</h4>
          <p className="text-sm text-ink-600 dark:text-ink-400">Clean and bright interface</p>
        </motion.div>

        <motion.div
          onClick={() => theme === 'light' && toggleTheme()}
          className={`p-6 glass-card dark:glass-card-dark rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
            theme === 'dark' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent hover:border-white/30'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-full h-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl mb-4 border border-slate-700"></div>
          <h4 className="font-medium text-ink-900 dark:text-white">Dark Mode</h4>
          <p className="text-sm text-ink-600 dark:text-ink-400">Easy on the eyes</p>
        </motion.div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'appearance':
        return renderAppearanceTab();
      case 'language':
        return <div className="text-center py-12 text-ink-500 dark:text-ink-400">Language settings coming soon...</div>;
      case 'data':
        return <div className="text-center py-12 text-ink-500 dark:text-ink-400">Data management coming soon...</div>;
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-ink-900 dark:text-white mb-2">Settings</h1>
        <p className="text-ink-600 dark:text-ink-400">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card dark:glass-card-dark rounded-2xl p-4 soft-shadow dark:soft-shadow-dark">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-ink-700 dark:text-ink-300 hover:bg-white/20'
                  }`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;