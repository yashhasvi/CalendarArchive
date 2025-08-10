@@ .. @@
 import React, { useState, useEffect } from 'react';
-import { Upload, Plus, Edit, Trash2, Users, FileText, Settings, X } from 'lucide-react';
+import { Upload, Plus, Edit, Trash2, Users, FileText, Settings, X, Eye, TrendingUp, BarChart3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
 import { useAuth } from '../context/AuthContext';
 import { useNavigate } from 'react-router-dom';
 import { supabase } from '../lib/supabase';
+import { motion } from 'framer-motion';
 import Papa from 'papaparse';

@@ .. @@
   const [showEditModal, setShowEditModal] = useState(false);
   const [selectedEvent, setSelectedEvent] = useState(null);
+  const [pendingEvents, setPendingEvents] = useState([]);
+  const [analytics, setAnalytics] = useState({
+    totalEvents: 0,
+    pendingApproval: 0,
+    totalUsers: 0,
+    popularCategories: [],
+    recentActivity: []
+  });
   const [newEvent, setNewEvent] = useState({
@@ .. @@
   // Fetch events from Supabase
   useEffect(() => {
     const fetchEvents = async () => {
-      const { data, error } = await supabase.from('events').select('*');
+      const { data, error } = await supabase
+        .from('events')
+        .select('*')
+        .eq('status', 'approved');
       if (error) console.error('Fetch error:', error);
       else setEvents(data);
     };

+    const fetchPendingEvents = async () => {
+      const { data, error } = await supabase
+        .from('events')
+        .select('*')
+        .eq('status', 'pending');
+      if (error) console.error('Pending events fetch error:', error);
+      else setPendingEvents(data || []);
+    };
+
+    const fetchAnalytics = async () => {
+      try {
+        // Get total events
+        const { count: totalEvents } = await supabase
+          .from('events')
+          .select('*', { count: 'exact', head: true })
+          .eq('status', 'approved');
+
+        // Get pending events count
+        const { count: pendingApproval } = await supabase
+          .from('events')
+          .select('*', { count: 'exact', head: true })
+          .eq('status', 'pending');
+
+        // Get category distribution
+        const { data: categoryData } = await supabase
+          .from('events')
+          .select('category')
+          .eq('status', 'approved');
+
+        const categoryCount = categoryData?.reduce((acc, event) => {
+          acc[event.category] = (acc[event.category] || 0) + 1;
+          return acc;
+        }, {});
+
+        const popularCategories = Object.entries(categoryCount || {})
+          .sort(([,a], [,b]) => b - a)
+          .slice(0, 5)
+          .map(([category, count]) => ({ category, count }));
+
+        setAnalytics({
+          totalEvents: totalEvents || 0,
+          pendingApproval: pendingApproval || 0,
+          totalUsers: 0, // Would need user count from auth
+          popularCategories,
+          recentActivity: []
+        });
+      } catch (error) {
+        console.error('Analytics fetch error:', error);
+      }
+    };

     fetchEvents();
+    fetchPendingEvents();
+    fetchAnalytics();
   }, []);

@@ .. @@
   // Handle add event
   const handleAddSubmit = async (e) => {
     e.preventDefault();
-    const { error } = await supabase.from('events').insert([newEvent]);
+    const eventData = {
+      ...newEvent,
+      status: 'approved',
+      user_id: user.id,
+      created_at: new Date().toISOString()
+    };
+    const { error } = await supabase.from('events').insert([eventData]);
     if (error) console.error('Insert error:', error);
     else {
       const { data } = await supabase.from('events').select('*');
@@ .. @@
     }
   };

+  // Handle approve/reject events
+  const handleApproveEvent = async (eventId) => {
+    const { error } = await supabase
+      .from('events')
+      .update({ status: 'approved' })
+      .eq('id', eventId);
+    
+    if (error) {
+      console.error('Approve error:', error);
+    } else {
+      setPendingEvents(pendingEvents.filter(e => e.id !== eventId));
+      // Refresh approved events
+      const { data } = await supabase.from('events').select('*').eq('status', 'approved');
+      setEvents(data || []);
+    }
+  };
+
+  const handleRejectEvent = async (eventId) => {
+    const { error } = await supabase
+      .from('events')
+      .update({ status: 'rejected' })
+      .eq('id', eventId);
+    
+    if (error) {
+      console.error('Reject error:', error);
+    } else {
+      setPendingEvents(pendingEvents.filter(e => e.id !== eventId));
+    }
+  };
+
   // Handle admin addition (assumes secure backend route)
@@ .. @@
   const tabs = [
+    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
     { id: 'events', label: 'Manage Events', icon: FileText },
+    { id: 'pending', label: 'Pending Approval', icon: Clock },
     { id: 'upload', label: 'Upload CSV', icon: Upload },
     { id: 'admins', label: 'Manage Admins', icon: Users },
     { id: 'settings', label: 'Settings', icon: Settings }
   ];

+  const renderDashboard = () => (
+    <div className="space-y-6">
+      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Dashboard</h3>
+      
+      {/* Stats Cards */}
+      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
+        <motion.div
+          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
+          whileHover={{ scale: 1.02 }}
+        >
+          <div className="flex items-center justify-between">
+            <div>
+              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
+              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalEvents}</p>
+            </div>
+            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
+          </div>
+        </motion.div>
+        
+        <motion.div
+          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
+          whileHover={{ scale: 1.02 }}
+        >
+          <div className="flex items-center justify-between">
+            <div>
+              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approval</p>
+              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.pendingApproval}</p>
+            </div>
+            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
+          </div>
+        </motion.div>
+        
+        <motion.div
+          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
+          whileHover={{ scale: 1.02 }}
+        >
+          <div className="flex items-center justify-between">
+            <div>
+              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
+              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalUsers}</p>
+            </div>
+            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
+          </div>
+        </motion.div>
+        
+        <motion.div
+          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
+          whileHover={{ scale: 1.02 }}
+        >
+          <div className="flex items-center justify-between">
+            <div>
+              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
+              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.popularCategories.length}</p>
+            </div>
+            <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
+          </div>
+        </motion.div>
+      </div>
+
+      {/* Popular Categories */}
+      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
+        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Categories</h4>
+        <div className="space-y-3">
+          {analytics.popularCategories.map((item, index) => (
+            <div key={item.category} className="flex items-center justify-between">
+              <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
+              <div className="flex items-center space-x-2">
+                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
+                  <div 
+                    className="bg-blue-600 h-2 rounded-full" 
+                    style={{ width: `${(item.count / analytics.totalEvents) * 100}%` }}
+                  ></div>
+                </div>
+                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
+              </div>
+            </div>
+          ))}
+        </div>
+      </div>
+    </div>
+  );
+
+  const renderPendingApproval = () => (
+    <div className="space-y-4">
+      <div className="flex items-center justify-between">
+        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pending Approval</h3>
+        <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-sm">
+          {pendingEvents.length} pending
+        </span>
+      </div>
+      
+      {pendingEvents.length === 0 ? (
+        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
+          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
+          <p>No events pending approval</p>
+        </div>
+      ) : (
+        <div className="space-y-4">
+          {pendingEvents.map((event) => (
+            <motion.div
+              key={event.id}
+              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
+              initial={{ opacity: 0, y: 20 }}
+              animate={{ opacity: 1, y: 0 }}
+            >
+              <div className="flex items-start justify-between">
+                <div className="flex-1">
+                  <div className="flex items-center space-x-3 mb-2">
+                    <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-full">
+                      {event.category}
+                    </span>
+                    <span className="text-xs text-gray-500 dark:text-gray-400">
+                      {event.date}
+                    </span>
+                    <span className="text-xs text-gray-500 dark:text-gray-400">
+                      {event.country}
+                    </span>
+                  </div>
+                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
+                    {event.title}
+                  </h4>
+                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
+                    {event.description}
+                  </p>
+                  <p className="text-xs text-gray-500 dark:text-gray-400">
+                    Submitted: {new Date(event.created_at).toLocaleDateString()}
+                  </p>
+                </div>
+                <div className="flex space-x-2 ml-4">
+                  <motion.button
+                    onClick={() => handleApproveEvent(event.id)}
+                    className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
+                    whileHover={{ scale: 1.05 }}
+                    whileTap={{ scale: 0.95 }}
+                  >
+                    <CheckCircle className="h-4 w-4" />
+                    <span>Approve</span>
+                  </motion.button>
+                  <motion.button
+                    onClick={() => handleRejectEvent(event.id)}
+                    className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
+                    whileHover={{ scale: 1.05 }}
+                    whileTap={{ scale: 0.95 }}
+                  >
+                    <X className="h-4 w-4" />
+                    <span>Reject</span>
+                  </motion.button>
+                </div>
+              </div>
+            </motion.div>
+          ))}
+        </div>
+      )}
+    </div>
+  );
+
   const renderEvents = () => (
@@ .. @@
   const renderContent = () => {
     switch (activeTab) {
+      case 'dashboard':
+        return renderDashboard();
       case 'events':
         return renderEvents();
+      case 'pending':
+        return renderPendingApproval();
       case 'upload':
@@ .. @@
       <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
         {tabs.map((tab) => (
-          <button
+          <motion.button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
@@ -568,8 +747,13 @@ const AdminPanel: React.FC = () => {
                 : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
             }`}
+            whileHover={{ scale: 1.02 }}
+            whileTap={{ scale: 0.98 }}
           >
             <tab.icon className="h-4 w-4" />
             <span className="text-sm font-medium">{tab.label}</span>
+            {tab.id === 'pending' && pendingEvents.length > 0 && (
+              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">{pendingEvents.length}</span>
+            )}
-          </button>
+          </motion.button>
         ))}