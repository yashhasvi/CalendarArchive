import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchEvents } from '../lib/fetchEvents';

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  category: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate year options (1970 to 2030)
  const yearOptions = Array.from({ length: 2030 - 1970 + 1 }, (_, i) => 1970 + i);

  // Handle year selection
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(new Date(newYear, month, 1));
  };

  // Fetch events from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await fetchEvents();
      console.log('Fetched events:', data); // Debug: Inspect event data
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(month - 1);
    } else {
      newDate.setMonth(month + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => {
      if (!e.date || typeof e.date !== 'string') {
        console.warn(`Invalid or missing date for event:`, e);
        return false;
      }
      // Normalize event date to YYYY-MM-DD
      let eventDate: string;
      try {
        // Try parsing as ISO date
        const parsedDate = new Date(e.date);
        if (isNaN(parsedDate.getTime())) {
          console.warn(`Invalid date format for event:`, e);
          return false;
        }
        eventDate = parsedDate.toISOString().split('T')[0];
      } catch (error) {
        console.warn(`Error parsing date for event:`, e, error);
        return false;
      }
      return eventDate === dateStr;
    });
  };

  const getEventIndicatorColor = (category: string) => {
    const colors = {
      Political: 'bg-coral-500',
      Cultural: 'bg-purple-500',
      Scientific: 'bg-sage-500',
      Historical: 'bg-blue-500',
      Social: 'bg-yellow-500',
      Economic: 'bg-orange-500'
    };
    return colors[category as keyof typeof colors] || 'bg-ink-500';
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    navigate(`/date/${dateStr}`);
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 glass-card dark:glass-card-dark opacity-30 rounded-xl"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

      days.push(
        <motion.div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 p-3 glass-card dark:glass-card-dark rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group ${
            isToday ? 'ring-2 ring-blue-500 glow-effect' : ''
          }`}
          whileHover={{
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: day * 0.01,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <motion.span
              className={`text-sm font-medium ${
                isToday
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-ink-900 dark:text-white'
              }`}
              animate={isToday ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {day}
              {isToday && (
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full pulse-dot"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                />
              )}
            </motion.span>
            <AnimatePresence>
              {events.length > 0 && (
                <motion.span
                  className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-full flex items-center space-x-1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Sparkles className="h-2 w-2" />
                  <span>{events.length}</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col space-y-1">
            <AnimatePresence>
              {events.slice(0, 2).map((event, index) => (
                <motion.div
                  key={index}
                  className={`h-1.5 rounded-full ${getEventIndicatorColor(event.category)} opacity-80 group-hover:opacity-100`}
                  initial={{ width: 0, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                  animate={{ width: '100%', opacity: 0.8 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  whileHover={{ opacity: 1, height: 8 }}
                />
              ))}
            </AnimatePresence>
            {events.length > 2 && (
              <motion.div
                className="text-xs text-ink-500 dark:text-ink-400 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                +{events.length - 2} more
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Calendar Header */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-4">
          <motion.h1
            className="text-4xl font-display font-bold text-ink-900 dark:text-white mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {monthNames[month]}
          </motion.h1>
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <select
              value={year}
              onChange={handleYearChange}
              className="appearance-none glass-card dark:glass-card-dark rounded-2xl px-4 py-2 text-ink-900 dark:text-white bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 pr-10 text-sm font-medium cursor-pointer hover:shadow-lg transition-all duration-300"
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-600 dark:text-ink-400 pointer-events-none" />
          </motion.div>
        </div>
        <motion.p
          className="text-ink-600 dark:text-ink-400 md:hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          Explore historical events and learn with AI-powered insights
        </motion.p>

        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => navigateMonth('prev')}
            className="p-3 glass-card dark:glass-card-dark rounded-2xl hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-5 w-5 text-ink-600 dark:text-ink-400" />
          </motion.button>

          <motion.button
            onClick={() => setCurrentDate(new Date())}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Today
          </motion.button>

          <motion.button
            onClick={() => navigateMonth('next')}
            className="p-3 glass-card dark:glass-card-dark rounded-2xl hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-5 w-5 text-ink-600 dark:text-ink-400" />
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Calendar Grid */}
      <motion.div
        className="glass-card dark:glass-card-dark rounded-3xl soft-shadow dark:soft-shadow-dark overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700">
          {weekdays.map((day, index) => (
            <motion.div
              key={day}
              className="p-4 text-center text-sm font-medium text-ink-700 dark:text-ink-300 border-r border-white/20 last:border-r-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.4 }}
            >
              {day}
            </motion.div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2 p-4 bg-gradient-to-br from-earth-50 to-stone-100 dark:from-slate-900 dark:to-slate-800">
          {loading ? (
            <div className="col-span-7 text-center text-ink-600 dark:text-ink-400 py-8">
              Loading events...
            </div>
          ) : (
            renderCalendarDays()
          )}
        </div>
      </motion.div>

      {/* Legend */}
      <motion.div
        className="mt-8 glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-display font-semibold text-ink-900 dark:text-white mb-4">Event Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Political', color: 'bg-coral-500', textColor: 'text-coral-700 dark:text-coral-300' },
            { name: 'Cultural', color: 'bg-purple-500', textColor: 'text-purple-700 dark:text-purple-300' },
            { name: 'Scientific', color: 'bg-sage-500', textColor: 'text-sage-700 dark:text-sage-300' },
            { name: 'Historical', color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-300' },
            { name: 'Social', color: 'bg-yellow-500', textColor: 'text-yellow-700 dark:text-yellow-300' },
            { name: 'Economic', color: 'bg-orange-500', textColor: 'text-orange-700 dark:text-orange-300' }
          ].map((category, index) => (
            <motion.div
              key={category.name}
              className="flex items-center space-x-3 p-3 glass-card dark:glass-card-dark rounded-xl hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 + 0.7 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className={`w-4 h-4 rounded-full ${category.color} shadow-sm`}
                whileHover={{ scale: 1.2 }}
              />
              <span className={`text-sm font-medium ${category.textColor}`}>{category.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Calendar;