import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Globe, FileText, Image, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from './ui/Toaster';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onEventAdded }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    country: '',
    description: '',
    image_url: '',
    is_personal: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Political', 'Cultural', 'Scientific', 'Historical', 
    'Social', 'Economic', 'Holiday', 'Personal', 'Religious'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast({
        title: 'Authentication Required',
        description: 'Please sign in to add events',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        user_id: user.id,
        status: user.role === 'admin' ? 'approved' : 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('events')
        .insert([eventData]);

      if (error) throw error;

      addToast({
        title: 'Event Added Successfully',
        description: user.role === 'admin' 
          ? 'Event has been published immediately' 
          : 'Event submitted for review',
        type: 'success'
      });

      onEventAdded();
      onClose();
      setFormData({
        title: '',
        date: '',
        category: '',
        country: '',
        description: '',
        image_url: '',
        is_personal: false
      });
    } catch (error: any) {
      addToast({
        title: 'Error Adding Event',
        description: error.message || 'Failed to add event',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-card dark:glass-card-dark rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto soft-shadow dark:soft-shadow-dark"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-ink-900 dark:text-white">
                Add New Event
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-5 w-5 text-ink-500" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Event Title *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400"
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white appearance-none"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                    Country/Region *
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400"
                      placeholder="e.g., USA, Global, Europe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                  Image URL (Optional)
                </label>
                <div className="relative">
                  <Image className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => handleInputChange('image_url', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400 resize-none"
                  placeholder="Describe the event in detail..."
                  required
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_personal"
                  checked={formData.is_personal}
                  onChange={(e) => handleInputChange('is_personal', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="is_personal" className="text-sm text-ink-700 dark:text-ink-300">
                  This is a personal event (only visible to you)
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{isSubmitting ? 'Adding...' : 'Add Event'}</span>
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddEventModal;