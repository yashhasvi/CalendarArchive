import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle, Instagram, Twitter } from 'lucide-react';
import {
  WhatsappShareButton,
  TwitterShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon
} from 'react-share';

interface SocialShareProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
  };
}

const SocialShare: React.FC<SocialShareProps> = ({ event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/date/${event.date}`;
  const shareTitle = `${event.title} - Calendar Archive`;
  const shareDescription = event.description.substring(0, 200) + '...';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareButtons = [
    {
      Component: WhatsappShareButton,
      Icon: WhatsappIcon,
      label: 'WhatsApp',
      props: { url: shareUrl, title: shareTitle }
    },
    {
      Component: TwitterShareButton,
      Icon: TwitterIcon,
      label: 'Twitter',
      props: { url: shareUrl, title: shareTitle, hashtags: ['history', 'events', event.category.toLowerCase()] }
    },
    {
      Component: FacebookShareButton,
      Icon: FacebookIcon,
      label: 'Facebook',
      props: { url: shareUrl, quote: shareTitle }
    },
    {
      Component: LinkedinShareButton,
      Icon: LinkedinIcon,
      label: 'LinkedIn',
      props: { url: shareUrl, title: shareTitle, summary: shareDescription }
    }
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 glass-card dark:glass-card-dark rounded-xl hover:shadow-md transition-all duration-300 text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className="h-4 w-4" />
        <span className="text-sm">Share</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full mt-2 right-0 w-64 glass-card dark:glass-card-dark rounded-2xl p-4 soft-shadow dark:soft-shadow-dark z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-ink-900 dark:text-white">Share Event</h4>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Share2 className="h-4 w-4 text-ink-500" />
              </motion.button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {shareButtons.map(({ Component, Icon, label, props }) => (
                <Component key={label} {...props}>
                  <motion.div
                    className="flex items-center space-x-2 p-2 glass-card dark:glass-card-dark rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={20} round />
                    <span className="text-xs font-medium text-ink-700 dark:text-ink-300">
                      {label}
                    </span>
                  </motion.div>
                </Component>
              ))}
            </div>

            {/* Copy Link */}
            <div className="border-t border-white/20 pt-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 glass-card dark:glass-card-dark rounded-xl text-xs text-ink-600 dark:text-ink-400 bg-transparent border-0 focus:outline-none"
                />
                <motion.button
                  onClick={handleCopyLink}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    copied 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                      : 'glass-card dark:glass-card-dark text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </motion.button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-600 dark:text-green-400 mt-2"
                >
                  Link copied to clipboard!
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialShare;