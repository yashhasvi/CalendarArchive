import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, BookOpen, MessageSquare, Bookmark, Star, Sparkles, X } from 'lucide-react';
import ReactStars from 'react-stars';
import { Tooltip } from 'react-tooltip';
import { useAuth } from '../context/AuthContext';
import MiniCalendar from './MiniCalendar';
import FloatingAI from './FloatingAI';
import CommentSection from './CommentSection';
import SkeletonLoader from './SkeletonLoader';
import { supabase } from '../lib/supabase';

interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  category: string;
  country: string;
}

const DateDetailView: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Set<string>>(new Set());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCommentModal, setShowCommentModal] = useState<string | null>(null);
  const [ratings, setRatings] = useState<Map<string, number>>(new Map());
  const [averageRatings, setAverageRatings] = useState<Map<string, number>>(new Map());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch events, bookmarks, and ratings
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Normalize date to YYYY-MM-DD
      let normalizedDate: string;
      try {
        normalizedDate = new Date(date!).toISOString().split('T')[0];
      } catch (err) {
        console.error('Invalid date format:', date, err);
        setError('Invalid date format. Please select a valid date.');
        setLoading(false);
        return;
      }

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('date', normalizedDate);

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
        setError('Failed to load events. Please try again.');
        setEvents([]);
        setLoading(false);
        return;
      }

      setEvents(eventsData || []);

      if (user) {
        // Fetch bookmarks
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks')
          .select('event_id')
          .eq('user_id', user.id);

        if (bookmarksError) {
          console.error('Error fetching bookmarks:', bookmarksError);
        } else {
          setBookmarkedEvents(new Set(bookmarksData.map((b) => b.event_id)));
        }

        // Fetch ratings
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select('event_id, rating')
          .eq('user_id', user.id);

        if (ratingsError) {
          console.error('Error fetching ratings:', ratingsError);
        } else {
          const ratingsMap = new Map(ratingsData.map((r) => [r.event_id, r.rating]));
          setRatings(ratingsMap);
        }

        // Fetch average ratings
        const { data: avgRatingsData, error: avgRatingsError } = await supabase
          .from('ratings')
          .select('event_id, rating')
          .in('event_id', eventsData.map((e) => e.id));

        if (avgRatingsError) {
          console.error('Error fetching average ratings:', avgRatingsError);
        } else {
          const avgMap = new Map<string, number>();
          eventsData.forEach((event) => {
            const eventRatings = avgRatingsData.filter((r) => r.event_id === event.id);
            const avg =
              eventRatings.length > 0
                ? eventRatings.reduce((sum, r) => sum + r.rating, 0) / eventRatings.length
                : 0;
            avgMap.set(event.id, avg);
          });
          setAverageRatings(avgMap);
        }
      }

      setLoading(false);
    };

    if (date) {
      fetchData();
    }
  }, [date, user]);

  // Toggle bookmark
  const toggleBookmark = async (eventId: string) => {
    if (!user) {
      alert('Please log in to bookmark events.');
      return;
    }

    const newBookmarks = new Set(bookmarkedEvents);
    if (newBookmarks.has(eventId)) {
      newBookmarks.delete(eventId);
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('event_id', eventId);
    } else {
      newBookmarks.add(eventId);
      await supabase.from('bookmarks').insert({ user_id: user.id, event_id: eventId });
    }
    setBookmarkedEvents(newBookmarks);
  };

  // Handle rating
  const handleRating = async (eventId: string, rating: number) => {
    if (!user) {
      alert('Please log in to rate events.');
      return;
    }

    const { error } = await supabase
      .from('ratings')
      .upsert({ user_id: user.id, event_id: eventId, rating }, { onConflict: 'user_id,event_id' });

    if (error) {
      console.error('Error saving rating:', error);
      alert('Failed to save rating.');
      return;
    }

    setRatings(new Map(ratings.set(eventId, rating)));

    // Update average rating
    const { data: eventRatings, error: ratingsError } = await supabase
      .from('ratings')
      .select('rating')
      .eq('event_id', eventId);

    if (ratingsError) {
      console.error('Error fetching updated ratings:', ratingsError);
    } else {
      const avg =
        eventRatings.length > 0
          ? eventRatings.reduce((sum, r) => sum + r.rating, 0) / eventRatings.length
          : 0;
      setAverageRatings(new Map(averageRatings.set(eventId, avg)));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Political: 'text-coral-600 bg-coral-50 dark:text-coral-400 dark:bg-coral-900/20 border-coral-200 dark:border-coral-800',
      Cultural: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
      Scientific: 'text-sage-600 bg-sage-50 dark:text-sage-400 dark:bg-sage-900/20 border-sage-200 dark:border-sage-800',
      Historical: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      Social: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      Economic: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    };
    return colors[category as keyof typeof colors] || 'text-ink-600 bg-ink-50 dark:text-ink-400 dark:bg-ink-900/20 border-ink-200 dark:border-ink-800';
  };

  const getCountryIcon = (country: string) => {
    const countryIcons: { [key: string]: string } = {
      USA: '🇺🇸',
      Canada: '🇨🇦',
      UK: '🇬🇧',
      // Add more country flags as needed
    };
    return countryIcons[country] || '🌍';
  };

  return (
    <>
      <motion.button
        className="mobile-sidebar-toggle lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSidebarOpen ? <X className="h-4 w-4" /> : 'Menu'}
      </motion.button>
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Sidebar */}
        <motion.div
          className={`lg:col-span-1 space-y-6 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white transition-colors group"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            data-tooltip-id="back-tooltip"
            data-tooltip-content="Back to Calendar"
          >
            <motion.div whileHover={{ rotate: -90 }} transition={{ duration: 0.2 }}>
              <ArrowLeft className="h-4 w-4" />
            </motion.div>
            <span>Back to Calendar</span>
          </motion.button>
          <Tooltip id="back-tooltip" />

          <motion.div
            className="glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <motion.div
                className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 w-fit"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Calendar className="h-8 w-8 text-white" />
              </motion.div>
              <motion.h2
                className="text-3xl font-display font-bold text-ink-900 dark:text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {date ? new Date(date + 'T00:00:00').getDate() : ''}
              </motion.h2>
              <motion.p
                className="text-ink-600 dark:text-ink-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {date
                  ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : ''}
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MiniCalendar selectedDate={date} onDateSelect={(newDate) => navigate(`/date/${newDate}`)} />
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="lg:col-span-3 space-y-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <motion.h1
              className="text-3xl font-display font-bold text-ink-900 dark:text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Events on{' '}
              {date
                ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : ''}
            </motion.h1>
            <motion.div
              className="flex items-center space-x-2 text-sm text-ink-600 dark:text-ink-400"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Sparkles className="h-4 w-4" />
              <span>{events.length} {events.length === 1 ? 'event' : 'events'} found</span>
            </motion.div>
          </div>

          {error ? (
            <motion.div
              className="text-center text-red-500 dark:text-red-400 p-6 glass-card dark:glass-card-dark rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
              <button
                onClick={() => fetchData()}
                className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </motion.div>
          ) : loading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div
              className="glass-card dark:glass-card-dark rounded-2xl p-12 text-center soft-shadow dark:soft-shadow-dark"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              >
                <BookOpen className="h-16 w-16 text-ink-400 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-display font-semibold text-ink-900 dark:text-white mb-2">
                No events found
              </h3>
              <p className="text-ink-600 dark:text-ink-400">
                No historical events are recorded for this date in our database.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="glass-card dark:glass-card-dark rounded-2xl overflow-hidden soft-shadow dark:soft-shadow-dark hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1 + 0.5,
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.02 }}
                    layout
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <motion.span
                              className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                                event.category || 'Unknown'
                              )}`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.7 }}
                            >
                              <Tag className="h-3 w-3 inline mr-1" />
                              {event.category || 'Unknown'}
                            </motion.span>
                            <div className="flex items-center text-sm text-ink-600 dark:text-ink-400">
                              {getCountryIcon(event.country || 'Unknown')}{' '}
                              {event.country || 'Unknown'}
                            </div>
                          </div>
                          <motion.h3
                            className="text-xl font-display font-semibold text-ink-900 dark:text-white mb-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.8 }}
                          >
                            {event.title || 'Untitled Event'}
                          </motion.h3>
                          <motion.p
                            className="text-ink-600 dark:text-ink-400 leading-relaxed"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.9 }}
                          >
                            {expandedEvent === event.id
                              ? event.description || 'No description available'
                              : `${(event.description || 'No description available').substring(0, 200)}...`}
                          </motion.p>
                          {averageRatings.has(event.id) && (
                            <motion.div
                              className="mt-2 flex items-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.1 + 1.0 }}
                            >
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-ink-600 dark:text-ink-400">
                                Average Rating: {averageRatings.get(event.id)!.toFixed(1)} / 5
                              </span>
                            </motion.div>
                          )}
                        </div>

                        {user && (
                          <motion.button
                            onClick={() => toggleBookmark(event.id)}
                            className={`ml-4 p-3 rounded-2xl transition-all duration-300 ${
                              bookmarkedEvents.has(event.id)
                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                                : 'glass-card dark:glass-card-dark text-ink-600 dark:text-ink-400 hover:shadow-md'
                            }`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 1.0 }}
                            data-tooltip-id={`bookmark-${event.id}`}
                            data-tooltip-content={
                              bookmarkedEvents.has(event.id) ? 'Remove Bookmark' : 'Add Bookmark'
                            }
                          >
                            <Bookmark
                              className={`h-4 w-4 ${bookmarkedEvents.has(event.id) ? 'fill-current' : ''}`}
                            />
                          </motion.button>
                        )}
                      </div>

                      <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 1.1 }}
                      >
                        <motion.button
                          onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {expandedEvent === event.id ? 'Show less' : 'Read more'}
                        </motion.button>

                        <div className="flex items-center space-x-4">
                          <motion.button
                            onClick={() => setShowCommentModal(event.id)}
                            className="flex items-center space-x-2 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white text-sm transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            data-tooltip-id={`discuss-${event.id}`}
                            data-tooltip-content="Discuss this event"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>Discuss</span>
                          </motion.button>
                          {user && (
                            <motion.div
                              className="flex items-center space-x-2"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              data-tooltip-id={`rate-${event.id}`}
                              data-tooltip-content="Rate this event"
                            >
                              <ReactStars
                                count={5}
                                value={ratings.get(event.id) || 0}
                                onChange={(rating) => handleRating(event.id, rating)}
                                size={16}
                                color1="#d1d5db"
                                color2="#f59e0b"
                              />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                    <Tooltip id={`bookmark-${event.id}`} />
                    <Tooltip id={`discuss-${event.id}`} />
                    <Tooltip id={`rate-${event.id}`} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-ink-900 dark:text-white">Discuss Event</h3>
                <motion.button
                  onClick={() => setShowCommentModal(null)}
                  className="text-ink-600 dark:text-ink-400"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </div>
              <CommentSection eventId={showCommentModal} userId={user?.id} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingAI events={events} />
      <Tooltip id="tooltip" />
    </>
  );
};

export default DateDetailView;