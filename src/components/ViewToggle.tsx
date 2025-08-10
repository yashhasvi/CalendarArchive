import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, List, Clock } from 'lucide-react';

interface ViewToggleProps {
  currentView: 'calendar' | 'list' | 'timeline';
  onViewChange: (view: 'calendar' | 'list' | 'timeline') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'list', label: 'List', icon: List },
    { id: 'timeline', label: 'Timeline', icon: Clock }
  ];

  return (
    <div className="flex items-center space-x-1 glass-card dark:glass-card-dark rounded-2xl p-1">
      {views.map((view) => (
        <motion.button
          key={view.id}
          onClick={() => onViewChange(view.id as any)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            currentView === view.id
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
              : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-white/20'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <view.icon className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">{view.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ViewToggle;