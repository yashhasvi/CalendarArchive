import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  country: string;
}

const TodayHighlight: React.FC = () => {
  const [todayEvents, setTodayEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayEvents = async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('date', today)
        .eq('status', 'approved')
        .limit(3);

      if (error) {
        console.error('Error fetching today events:', error);
      } else {
        setTodayEvents(data || []);
      }
      setLoading(false);
    };

    fetchTodayEvents();
  }, []);

  const handleViewAll = () => {
    const today = new Date().toISOString().split('T')[0];
    navigate(`/date/${today}`);
  };

  if (loading) {
    return (
      <motion.div
        className="glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (todayEvents.length === 0) {
    return (
      <motion.div
        className="glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Calendar className="h-12 w-12 text-ink-400 mx-auto mb-4" />
        <h3 className="text-lg font-display font-semibold text-ink-900 dark:text-white mb-2">
          No Events Today
        </h3>
        <p className="text-ink-600 dark:text-ink-400">
          No historical events are recorded for today.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-display font-semibold text-ink-900 dark:text-white">
              Today in History
            </h3>
            <p className="text-sm text-ink-600 dark:text-ink-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <motion.button
          onClick={handleViewAll}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
          whileHover={{ scale: 1.05, x: 4 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>View All</span>
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {todayEvents.map((event, index) => (
          <motion.div
            key={event.id}
            className="p-4 glass-card dark:glass-card-dark rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            whileHover={{ scale: 1.02, x: 4 }}
            onClick={handleViewAll}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Clock className="h-4 w-4 text-ink-400 mt-1" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-ink-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {event.title}
                </h4>
                <p className="text-sm text-ink-600 dark:text-ink-400 mt-1 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
                    {event.category}
                  </span>
                  <span className="text-xs text-ink-500 dark:text-ink-400">
                    {event.country}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TodayHighlight;