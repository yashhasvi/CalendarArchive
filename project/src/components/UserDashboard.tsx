import React, { useState } from 'react';
import { BookOpen, Bookmark, MessageSquare, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Please sign in to access your dashboard
        </h2>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Calendar
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'ai-chats', label: 'AI Chats', icon: MessageSquare },
    { id: 'progress', label: 'Progress', icon: Trophy }
  ];

  const mockBookmarks = [
    { id: '1', title: 'World War II Victory Day', date: '2024-01-15', category: 'Historical' },
    { id: '2', title: 'Renaissance Art Exhibition', date: '2024-01-20', category: 'Cultural' },
    { id: '3', title: 'Scientific Discovery', date: '2024-01-25', category: 'Scientific' }
  ];

  const mockNotes = [
    { id: '1', date: '2024-01-15', title: 'Victory Day Notes', content: 'Important points about the historical significance...' },
    { id: '2', date: '2024-01-20', title: 'Renaissance Study', content: 'Key artists and their contributions...' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookmarks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <Bookmark className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Notes Created</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Conversations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Days Studied</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'Bookmarked event', title: 'World War II Victory Day', time: '2 hours ago' },
              { action: 'Created note', title: 'Renaissance Study', time: '1 day ago' },
              { action: 'AI conversation', title: 'Essay about Cultural Events', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">{activity.action}: {activity.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Study Streak</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">7</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Days in a row</p>
            <div className="mt-4 flex justify-center space-x-1">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div key={day} className="w-4 h-4 bg-blue-600 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBookmarks = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Bookmarks</h3>
      {mockBookmarks.map((bookmark) => (
        <div key={bookmark.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{bookmark.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{bookmark.date} • {bookmark.category}</p>
            </div>
            <button className="text-yellow-600 dark:text-yellow-400">
              <Bookmark className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Notes</h3>
      {mockNotes.map((note) => (
        <div key={note.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 dark:text-white">{note.title}</h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">{note.date}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{note.content}</p>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'bookmarks':
        return renderBookmarks();
      case 'notes':
        return renderNotes();
      case 'ai-chats':
        return <div className="text-center py-12 text-gray-500 dark:text-gray-400">AI chat history coming soon...</div>;
      case 'progress':
        return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Progress tracking coming soon...</div>;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your learning progress and manage your content</p>
      </div>

      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
};

export default UserDashboard;