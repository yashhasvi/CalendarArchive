@@ .. @@
 import React, { useEffect, useState } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
-import { ChevronLeft, ChevronRight, Sparkles, ChevronDown } from 'lucide-react';
+import { ChevronLeft, ChevronRight, Sparkles, ChevronDown, Plus, Upload, Search } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
+import { useAuth } from '../context/AuthContext';
 import { fetchEvents } from '../lib/fetchEvents';
+import AddEventModal from './AddEventModal';
+import BulkImportModal from './BulkImportModal';
+import ViewToggle from './ViewToggle';
+import EventFilters from './EventFilters';
+import TodayHighlight from './TodayHighlight';

 interface Event {
@@ .. @@
 const Calendar: React.FC = () => {
   const [currentDate, setCurrentDate] = useState(new Date());
   const [events, setEvents] = useState<Event[]>([]);
+  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
   const [loading, setLoading] = useState(true);
+  const [searchQuery, setSearchQuery] = useState('');
+  const [currentView, setCurrentView] = useState<'calendar' | 'list' | 'timeline'>('calendar');
+  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
+  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
+  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
+  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
+  const [showAddModal, setShowAddModal] = useState(false);
+  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
   const navigate = useNavigate();
+  const { user } = useAuth();

@@ .. @@
   // Fetch events from Supabase
   useEffect(() => {
     const loadEvents = async () => {
       setLoading(true);
       const data = await fetchEvents();
-      console.log('Fetched events:', data); // Debug: Inspect event data
       setEvents(data);
+      setFilteredEvents(data);
       setLoading(false);
     };
     loadEvents();
   }, []);

+  // Filter events based on search and filters
+  useEffect(() => {
+    let filtered = events;
+
+    // Search filter
+    if (searchQuery) {
+      filtered = filtered.filter(event =>
+        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
+        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
+        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
+        event.country.toLowerCase().includes(searchQuery.toLowerCase())
+      );
+    }
+
+    // Category filter
+    if (selectedCategories.length > 0) {
+      filtered = filtered.filter(event =>
+        selectedCategories.includes(event.category)
+      );
+    }
+
+    // Country filter
+    if (selectedCountries.length > 0) {
+      filtered = filtered.filter(event =>
+        selectedCountries.includes(event.country)
+      );
+    }
+
+    setFilteredEvents(filtered);
+  }, [events, searchQuery, selectedCategories, selectedCountries, showFavoritesOnly]);
+
+  const availableCategories = [...new Set(events.map(e => e.category))].filter(Boolean);
+  const availableCountries = [...new Set(events.map(e => e.country))].filter(Boolean);
+
   const navigateMonth = (direction: 'prev' | 'next') => {
@@ .. @@
   const getEventsForDate = (day: number) => {
     const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
-    return events.filter((e) => {
+    return filteredEvents.filter((e) => {
       if (!e.date || typeof e.date !== 'string') {
-        console.warn(`Invalid or missing date for event:`, e);
         return false;
       }
       // Normalize event date to YYYY-MM-DD
@@ -95,7 +149,7 @@ const Calendar: React.FC = () => {
         // Try parsing as ISO date
         const parsedDate = new Date(e.date);
         if (isNaN(parsedDate.getTime())) {
-          console.warn(`Invalid date format for event:`, e);
           return false;
         }
         eventDate = parsedDate.toISOString().split('T')[0];
       } catch (error) {
-        console.warn(`Error parsing date for event:`, e, error);
         return false;
       }
       return eventDate === dateStr;
@@ .. @@
   const handleDateClick = (day: number) => {
     const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
     navigate(`/date/${dateStr}`);
   };

+  const handleEventAdded = () => {
+    // Refresh events after adding
+    const loadEvents = async () => {
+      const data = await fetchEvents();
+      setEvents(data);
+      setFilteredEvents(data);
+    };
+    loadEvents();
+  };
+
   const renderCalendarDays = () => {
@@ .. @@
       transition={{ duration: 0.6 }}
     >
+      {/* Today Highlight */}
+      <motion.div
+        className="mb-8"
+        initial={{ opacity: 0, y: -20 }}
+        animate={{ opacity: 1, y: 0 }}
+        transition={{ delay: 0.1 }}
+      >
+        <TodayHighlight />
+      </motion.div>
+
       {/* Calendar Header */}
       <motion.div
-        className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0"
+        className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 space-y-4 lg:space-y-0"
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
       >
-        <div className="flex items-center space-x-4">
+        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
           <motion.h1
             className="text-4xl font-display font-bold text-ink-900 dark:text-white mb-2"
             initial={{ opacity: 0, x: -20 }}
@@ -183,6 +251,7 @@ const Calendar: React.FC = () => {
             </select>
             <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-600 dark:text-ink-400 pointer-events-none" />
           </motion.div>
+
+          {/* Search Bar */}
+          <motion.div
+            className="relative flex-1 max-w-md"
+            initial={{ opacity: 0, scale: 0.9 }}
+            animate={{ opacity: 1, scale: 1 }}
+            transition={{ delay: 0.5 }}
+          >
+            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-400" />
+            <input
+              type="text"
+              value={searchQuery}
+              onChange={(e) => setSearchQuery(e.target.value)}
+              placeholder="Search events..."
+              className="w-full pl-12 pr-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400"
+            />
+          </motion.div>
         </div>
-        <motion.p
-          className="text-ink-600 dark:text-ink-400 md:hidden"
-          initial={{ opacity: 0, x: -20 }}
-          animate={{ opacity: 1, x: 0 }}
-          transition={{ delay: 0.4 }}
-        >
-          Explore historical events and learn with AI-powered insights
-        </motion.p>

-        <motion.div
-          className="flex items-center space-x-3"
+        <div className="flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-3">
+          {/* View Toggle */}
+          <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
+
+          {/* Filters */}
+          <EventFilters
+            selectedCategories={selectedCategories}
+            selectedCountries={selectedCountries}
+            showFavoritesOnly={showFavoritesOnly}
+            onCategoryChange={setSelectedCategories}
+            onCountryChange={setSelectedCountries}
+            onFavoritesToggle={setShowFavoritesOnly}
+            availableCategories={availableCategories}
+            availableCountries={availableCountries}
+            isOpen={isFiltersOpen}
+            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
+          />
+
+          {/* Add Event Button */}
+          {user && (
+            <motion.button
+              onClick={() => setShowAddModal(true)}
+              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sage-500 to-sage-600 text-white rounded-2xl hover:from-sage-600 hover:to-sage-700 transition-all duration-300 shadow-lg hover:shadow-xl"
+              whileHover={{ scale: 1.05 }}
+              whileTap={{ scale: 0.95 }}
+            >
+              <Plus className="h-4 w-4" />
+              <span className="hidden sm:inline">Add Event</span>
+            </motion.button>
+          )}
+
+          {/* Bulk Import Button (Admin only) */}
+          {user?.role === 'admin' && (
+            <motion.button
+              onClick={() => setShowBulkImportModal(true)}
+              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
+              whileHover={{ scale: 1.05 }}
+              whileTap={{ scale: 0.95 }}
+            >
+              <Upload className="h-4 w-4" />
+              <span className="hidden sm:inline">Bulk Import</span>
+            </motion.button>
+          )}
+
+          {/* Navigation Controls */}
+          <div className="flex items-center space-x-3">
+            <motion.button
+              onClick={() => navigateMonth('prev')}
+              className="p-3 glass-card dark:glass-card-dark rounded-2xl hover:shadow-lg transition-all duration-300"
+              whileHover={{ scale: 1.05, x: -2 }}
+              whileTap={{ scale: 0.95 }}
+            >
+              <ChevronLeft className="h-5 w-5 text-ink-600 dark:text-ink-400" />
+            </motion.button>
+
+            <motion.button
+              onClick={() => setCurrentDate(new Date())}
+              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
+              whileHover={{ scale: 1.05 }}
+              whileTap={{ scale: 0.95 }}
+            >
+              Today
+            </motion.button>
+
+            <motion.button
+              onClick={() => navigateMonth('next')}
+              className="p-3 glass-card dark:glass-card-dark rounded-2xl hover:shadow-lg transition-all duration-300"
+              whileHover={{ scale: 1.05, x: 2 }}
+              whileTap={{ scale: 0.95 }}
+            >
+              <ChevronRight className="h-5 w-5 text-ink-600 dark:text-ink-400" />
+            </motion.button>
+          </div>
+        </div>
+      </motion.div>
+
+      {/* Results Summary */}
+      {(searchQuery || selectedCategories.length > 0 || selectedCountries.length > 0) && (
+        <motion.div
+          className="mb-6 flex items-center justify-between glass-card dark:glass-card-dark rounded-2xl p-4"
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
-          transition={{ delay: 0.5 }}
+          transition={{ delay: 0.3 }}
         >
-          <motion.button
-            onClick={() => navigateMonth('prev')}
-            className="p-3 glass-card dark:glass-card-dark rounded-2xl hover:shadow-lg transition-all duration-300"
-            whileHover={{ scale: 1.05, x: -2 }}
-            whileTap={{ scale: 0.95 }}
-          >
-            <ChevronLeft className="h-5 w-5 text-ink-600 dark:text-ink-400" />
-          </motion.button>
-
-          <motion.button
-            onClick={() => setCurrentDate(new Date())}
-            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
-            whileHover={{ scale: 1.05 }}
-            whileTap={{ scale: 0.95 }}
-          >
-            Today
-          </motion.button>
-
-          <motion.button
-            onClick={() => navigateMonth('next')}
-            className="p-3 glass-card dark:glass-card-dark rounded-2xl hover:shadow-lg transition-all duration-300"
-            whileHover={{ scale: 1.05, x: 2 }}
-            whileTap={{ scale: 0.95 }}
-          >
-            <ChevronRight className="h-5 w-5 text-ink-600 dark:text-ink-400" />
-          </motion.button>
-        </motion.div>
+          <div>
+            <p className="text-sm text-ink-600 dark:text-ink-400">
+              Showing {filteredEvents.length} of {events.length} events
+              {searchQuery && ` for "${searchQuery}"`}
+            </p>
+            {(selectedCategories.length > 0 || selectedCountries.length > 0) && (
+              <div className="flex flex-wrap gap-2 mt-2">
+                {selectedCategories.map(category => (
+                  <span key={category} className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
+                    {category}
+                  </span>
+                ))}
+                {selectedCountries.map(country => (
+                  <span key={country} className="text-xs px-2 py-1 bg-sage-100 dark:bg-sage-900/20 text-sage-600 dark:text-sage-400 rounded-full">
+                    {country}
+                  </span>
+                ))}
+              </div>
+            )}
+          </div>
+          <motion.button
+            onClick={() => {
+              setSearchQuery('');
+              setSelectedCategories([]);
+              setSelectedCountries([]);
+              setShowFavoritesOnly(false);
+            }}
+            className="text-sm text-coral-600 dark:text-coral-400 hover:text-coral-700 dark:hover:text-coral-300 font-medium"
+            whileHover={{ scale: 1.05 }}
+            whileTap={{ scale: 0.95 }}
+          >
+            Clear Filters
+          </motion.button>
+        </motion.div>
+      )}
+
+      {/* Calendar Grid - Only show in calendar view */}
+      {currentView === 'calendar' && (
+        <motion.div
+          className="glass-card dark:glass-card-dark rounded-3xl soft-shadow dark:soft-shadow-dark overflow-hidden"
+          initial={{ opacity: 0, scale: 0.95 }}
+          animate={{ opacity: 1, scale: 1 }}
+          transition={{ delay: 0.3, duration: 0.5 }}
+        >
+          {/* Weekday Headers */}
+          <div className="grid grid-cols-7 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700">
+            {weekdays.map((day, index) => (
+              <motion.div
+                key={day}
+                className="p-4 text-center text-sm font-medium text-ink-700 dark:text-ink-300 border-r border-white/20 last:border-r-0"
+                initial={{ opacity: 0, y: -10 }}
+                animate={{ opacity: 1, y: 0 }}
+                transition={{ delay: index * 0.05 + 0.4 }}
+              >
+                {day}
+              </motion.div>
+            ))}
+          </div>
+
+          {/* Calendar Days */}
+          <div className="grid grid-cols-7 gap-2 p-4 bg-gradient-to-br from-earth-50 to-stone-100 dark:from-slate-900 dark:to-slate-800">
+            {loading ? (
+              <div className="col-span-7 text-center text-ink-600 dark:text-ink-400 py-8">
+                Loading events...
+              </div>
+            ) : (
+              renderCalendarDays()
+            )}
+          </div>
+        </motion.div>
+      )}
+
+      {/* List View */}
+      {currentView === 'list' && (
+        <motion.div
+          className="space-y-4"
+          initial={{ opacity: 0, y: 20 }}
+          animate={{ opacity: 1, y: 0 }}
+          transition={{ delay: 0.3 }}
+        >
+          {filteredEvents.length === 0 ? (
+            <div className="text-center py-12 text-ink-600 dark:text-ink-400">
+              No events found matching your criteria.
+            </div>
+          ) : (
+            filteredEvents.map((event, index) => (
+              <motion.div
+                key={event.id}
+                className="glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark hover:shadow-lg transition-all duration-300 cursor-pointer"
+                initial={{ opacity: 0, y: 20 }}
+                animate={{ opacity: 1, y: 0 }}
+                transition={{ delay: index * 0.05 }}
+                whileHover={{ scale: 1.02 }}
+                onClick={() => navigate(`/date/${event.date}`)}
+              >
+                <div className="flex items-start justify-between">
+                  <div className="flex-1">
+                    <div className="flex items-center space-x-3 mb-2">
+                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
+                        {event.category}
+                      </span>
+                      <span className="text-xs text-ink-500 dark:text-ink-400">
+                        {new Date(event.date).toLocaleDateString()}
+                      </span>
+                      <span className="text-xs text-ink-500 dark:text-ink-400">
+                        {event.country}
+                      </span>
+                    </div>
+                    <h3 className="text-lg font-display font-semibold text-ink-900 dark:text-white mb-2">
+                      {event.title}
+                    </h3>
+                    <p className="text-ink-600 dark:text-ink-400 line-clamp-2">
+                      {event.description}
+                    </p>
+                  </div>
+                </div>
+              </motion.div>
+            ))
+          )}
+        </motion.div>
+      )}
+
+      {/* Timeline View */}
+      {currentView === 'timeline' && (
+        <motion.div
+          className="relative"
+          initial={{ opacity: 0, y: 20 }}
+          animate={{ opacity: 1, y: 0 }}
+          transition={{ delay: 0.3 }}
+        >
+          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-blue-600"></div>
+          <div className="space-y-8">
+            {filteredEvents
+              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
+              .map((event, index) => (
+                <motion.div
+                  key={event.id}
+                  className="relative flex items-start space-x-6"
+                  initial={{ opacity: 0, x: -20 }}
+                  animate={{ opacity: 1, x: 0 }}
+                  transition={{ delay: index * 0.05 }}
+                >
+                  <div className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg"></div>
+                  <motion.div
+                    className="flex-1 glass-card dark:glass-card-dark rounded-2xl p-6 soft-shadow dark:soft-shadow-dark hover:shadow-lg transition-all duration-300 cursor-pointer"
+                    whileHover={{ scale: 1.02, x: 4 }}
+                    onClick={() => navigate(`/date/${event.date}`)}
+                  >
+                    <div className="flex items-center space-x-3 mb-2">
+                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
+                        {new Date(event.date).toLocaleDateString()}
+                      </span>
+                      <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full">
+                        {event.category}
+                      </span>
+                      <span className="text-xs text-ink-500 dark:text-ink-400">
+                        {event.country}
+                      </span>
+                    </div>
+                    <h3 className="text-lg font-display font-semibold text-ink-900 dark:text-white mb-2">
+                      {event.title}
+                    </h3>
+                    <p className="text-ink-600 dark:text-ink-400">
+                      {event.description}
+                    </p>
+                  </motion.div>
+                </motion.div>
+              ))}
+          </div>
+        </motion.div>
       )}

-      {/* Calendar Grid */}
-      <motion.div
-        className="glass-card dark:glass-card-dark rounded-3xl soft-shadow dark:soft-shadow-dark overflow-hidden"
-        initial={{ opacity: 0, scale: 0.95 }}
-        animate={{ opacity: 1, scale: 1 }}
-        transition={{ delay: 0.3, duration: 0.5 }}
-      >
-        {/* Weekday Headers */}
-        <div className="grid grid-cols-7 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700">
-          {weekdays.map((day, index) => (
-            <motion.div
-              key={day}
-              className="p-4 text-center text-sm font-medium text-ink-700 dark:text-ink-300 border-r border-white/20 last:border-r-0"
-              initial={{ opacity: 0, y: -10 }}
-              animate={{ opacity: 1, y: 0 }}
-              transition={{ delay: index * 0.05 + 0.4 }}
-            >
-              {day}
-            </motion.div>
-          ))}
-        </div>
-
-        {/* Calendar Days */}
-        <div className="grid grid-cols-7 gap-2 p-4 bg-gradient-to-br from-earth-50 to-stone-100 dark:from-slate-900 dark:to-slate-800">
-          {loading ? (
-            <div className="col-span-7 text-center text-ink-600 dark:text-ink-400 py-8">
-              Loading events...
-            </div>
-          ) : (
-            renderCalendarDays()
-          )}
-        </div>
-      </motion.div>
-
       {/* Legend */}
       <motion.div
@@ .. @@
           </div>
         </div>
       </motion.div>
+
+      {/* Modals */}
+      <AddEventModal
+        isOpen={showAddModal}
+        onClose={() => setShowAddModal(false)}
+        onEventAdded={handleEventAdded}
+      />
+      
+      <BulkImportModal
+        isOpen={showBulkImportModal}
+        onClose={() => setShowBulkImportModal(false)}
+        onImportComplete={handleEventAdded}
+      />
     </motion.div>
   );
 };