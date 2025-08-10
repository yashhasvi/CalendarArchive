@@ .. @@
 import React, { useState, useEffect } from 'react';
 import { motion, AnimatePresence } from 'framer-motion';
 import { useParams, useNavigate } from 'react-router-dom';
-import { ArrowLeft, Calendar, Tag, BookOpen, MessageSquare, Bookmark, Star, Sparkles, X } from 'lucide-react';
+import { ArrowLeft, Calendar, Tag, BookOpen, MessageSquare, Bookmark, Star, Sparkles, X, Edit, Trash2, Share2 } from 'lucide-react';
 import ReactStars from 'react-stars';
 import { Tooltip } from 'react-tooltip';
 import { useAuth } from '../context/AuthContext';
@@ -10,6 +10,8 @@ import MiniCalendar from './MiniCalendar';
 import FloatingAI from './FloatingAI';
 import CommentSection from './CommentSection';
 import SkeletonLoader from './SkeletonLoader';
+import SocialShare from './SocialShare';
+import { useToast } from './ui/Toaster';
 import { supabase } from '../lib/supabase';

@@ .. @@
 const DateDetailView: React.FC = () => {
   const { date } = useParams<{ date: string }>();
   const navigate = useNavigate();
   const { user } = useAuth();
+  const { addToast } = useToast();
   const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
@@ .. @@
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

+  // Handle delete event (admin only)
+  const handleDeleteEvent = async (eventId: string) => {
+    if (!user || user.role !== 'admin') return;
+    
+    if (window.confirm('Are you sure you want to delete this event?')) {
+      const { error } = await supabase
+        .from('events')
+        .delete()
+        .eq('id', eventId);
+
+      if (error) {
+        addToast({
+          title: 'Error',
+          description: 'Failed to delete event',
+          type: 'error'
+        });
+      } else {
+        addToast({
+          title: 'Success',
+          description: 'Event deleted successfully',
+          type: 'success'
+        });
+        setEvents(events.filter(e => e.id !== eventId));
+      }
+    }
+  };
+
   // Fetch events, bookmarks, and ratings
@@ .. @@
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
+                          
+                          {/* Social Share */}
+                          <SocialShare event={event} />
+                          
+                          {/* Admin Actions */}
+                          {user?.role === 'admin' && (
+                            <div className="flex items-center space-x-2">
+                              <motion.button
+                                onClick={() => navigate(`/admin/edit-event/${event.id}`)}
+                                className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
+                                whileHover={{ scale: 1.1 }}
+                                whileTap={{ scale: 0.9 }}
+                                data-tooltip-id={`edit-${event.id}`}
+                                data-tooltip-content="Edit event"
+                              >
+                                <Edit className="h-4 w-4" />
+                              </motion.button>
+                              <motion.button
+                                onClick={() => handleDeleteEvent(event.id)}
+                                className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
+                                whileHover={{ scale: 1.1 }}
+                                whileTap={{ scale: 0.9 }}
+                                data-tooltip-id={`delete-${event.id}`}
+                                data-tooltip-content="Delete event"
+                              >
+                                <Trash2 className="h-4 w-4" />
+                              </motion.button>
+                            </div>
+                          )}
+                          
                           {user && (
                             <motion.div
                               className="flex items-center space-x-2"
@@ .. @@
                     <Tooltip id={`bookmark-${event.id}`} />
                     <Tooltip id={`discuss-${event.id}`} />
                     <Tooltip id={`rate-${event.id}`} />
+                    <Tooltip id={`edit-${event.id}`} />
+                    <Tooltip id={`delete-${event.id}`} />
                   </motion.div>
                 ))}
               </AnimatePresence>