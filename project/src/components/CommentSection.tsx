import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Comment {
  id: string;
  event_id: string;
  user_id: string;
  text: string;
  timestamp: string;
}

interface CommentSectionProps {
  eventId: string;
  userId?: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ eventId, userId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('event_id', eventId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        setComments(data || []);
      }
      setLoading(false);
    };

    fetchComments();
  }, [eventId]);

  const handleSubmitComment = async () => {
    if (!userId) {
      alert('Please log in to post comments.');
      return;
    }
    if (!newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    const { error } = await supabase
      .from('comments')
      .insert({ event_id: eventId, user_id: userId, text: newComment });

    if (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment.');
    } else {
      setComments([...comments, { id: '', event_id: eventId, user_id: userId, text: newComment, timestamp: new Date().toISOString() }]);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center text-ink-600 dark:text-ink-400">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-ink-600 dark:text-ink-400">No comments yet. Be the first to discuss!</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id || index}
                className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-sm text-ink-600 dark:text-ink-400">
                  <span className="font-medium text-ink-900 dark:text-white">User {comment.user_id.slice(0, 8)}:</span> {comment.text}
                </p>
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  {new Date(comment.timestamp).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      {userId && (
        <div className="flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-ink-900 dark:text-white"
          />
          <motion.button
            onClick={handleSubmitComment}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;