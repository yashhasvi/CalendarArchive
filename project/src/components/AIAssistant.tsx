import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Lightbulb, FileText, HelpCircle, Quote, Sparkles, ChevronDown, ChevronUp, StopCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  country: string;
}

interface AIAssistantProps {
  events: Event[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ events }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'ai'; message: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const abortController = useRef<AbortController | null>(null);

  const suggestedPrompts = [
    { icon: FileText, label: 'Write Essay', prompt: 'Write a detailed essay about these calendar events', color: 'from-blue-500 to-blue-600' },
    { icon: HelpCircle, label: 'Create MCQs', prompt: 'Create multiple choice questions about these calendar events', color: 'from-purple-500 to-purple-600' },
    { icon: Quote, label: 'Generate Quotes', prompt: 'Generate inspiring quotes related to these calendar events', color: 'from-sage-500 to-sage-600' },
    { icon: Lightbulb, label: 'Explain Simply', prompt: 'Explain these calendar events in simple terms for a 12-year-old', color: 'from-coral-500 to-coral-600' },
    { icon: Sparkles, label: 'Fun Facts', prompt: 'Share interesting and fun facts about these calendar events', color: 'from-yellow-500 to-yellow-600' }
  ];

  const typewriterEffect = (text: string, callback: () => void) => {
    let i = 0;
    setTypingText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setTypingText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        callback();
      }
    }, 30);
  };

  const handleStop = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setIsLoading(false);
    setTypingText('');
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setConversation(prev => [...prev, { type: 'user', message: prompt }]);
    abortController.current = new AbortController();

    // Wrap prompt with calendar context
    const filteredPrompt = `You are a calendar assistant. Only answer questions about calendar events, dates, and schedules. If a question is unrelated, say "Sorry, I only handle calendar-related questions." \n\nUser: ${prompt}`;

    try {
      // Simulate AI response with typewriter effect
      setTimeout(() => {
        if (abortController.current?.signal.aborted) return;
        const aiResponse = generateAIResponse(filteredPrompt, events);
        typewriterEffect(aiResponse, () => {
          setConversation(prev => [...prev, { type: 'ai', message: aiResponse }]);
          setIsLoading(false);
          setCustomPrompt('');
          setTypingText('');
        });
      }, 1000);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Silently handle abort
      }
      setConversation(prev => [...prev, { type: 'ai', message: 'An error occurred while generating the response.' }]);
      setIsLoading(false);
      setTypingText('');
    }
  };

  const generateAIResponse = (prompt: string, events: Event[]): string => {
    // Check if prompt is calendar-related
    const isCalendarRelated = prompt.toLowerCase().includes('event') ||
                             prompt.toLowerCase().includes('date') ||
                             prompt.toLowerCase().includes('schedule') ||
                             prompt.toLowerCase().includes('calendar') ||
                             prompt.toLowerCase().includes('day') ||
                             prompt.toLowerCase().includes('month') ||
                             prompt.toLowerCase().includes('year');

    if (!isCalendarRelated) {
      return 'Sorry, I only handle calendar-related questions.';
    }

    const eventTitles = events.map(e => e.title).join(', ');
    
    if (prompt.toLowerCase().includes('essay')) {
      return `Here's a comprehensive essay about the calendar events:\n\n**Historical Significance**\n\nThe events of this day - ${eventTitles} - represent pivotal moments that shaped our world. These events demonstrate the complex interplay of political, social, and cultural forces that drive historical change.\n\n**Analysis**\n\nEach event carries unique significance in its historical context, contributing to broader patterns of human development and social evolution. The interconnected nature of these events reveals how local actions can have global consequences.\n\n**Conclusion**\n\nUnderstanding these calendar events helps us appreciate the complexity of human civilization and the importance of learning from our past to build a better future.`;
    }
    
    if (prompt.toLowerCase().includes('mcq')) {
      return `Here are some multiple choice questions about today's calendar events:\n\n**Question 1:** Which of the following events occurred on this date?\nA) ${events[0]?.title || 'Historical Event A'}\nB) Modern Event B\nC) Future Event C\nD) Fictional Event D\n\n**Answer: A**\n\n**Question 2:** What category best describes the main event?\nA) Political\nB) Cultural\nC) Scientific\nD) Economic\n\n**Answer: ${events[0]?.category || 'A'}**\n\nThese questions test comprehension of key historical facts and their significance.`;
    }
    
    if (prompt.toLowerCase().includes('quote')) {
      return `Here are some inspiring quotes related to today's calendar events:\n\n💫 "History is not just about dates and facts, but about the human stories that shape our world."\n\n🌟 "Every significant event in history began with someone brave enough to take the first step."\n\n✨ "The past is a teacher, the present is a gift, and the future is what we make of both."\n\n🎯 "Understanding history helps us navigate the complexities of our modern world with wisdom and perspective."`;
    }
    
    if (prompt.toLowerCase().includes('simple') || prompt.toLowerCase().includes('12-year-old')) {
      return `Let me explain today's calendar events in simple terms:\n\n🌟 **What happened?**\n${events.map(e => `• ${e.title}`).join('\n')}\n\n🤔 **Why was it important?**\nThese events changed how people lived, thought, or organized their societies. Think of it like when something big happens at your school that changes how everyone does things from then on.\n\n🌍 **How did it affect people?**\nJust like how a new rule at school affects all students, these historical events affected many people's lives and continue to influence us today.\n\n📚 **What can we learn?**\nHistory teaches us that people have always faced challenges and found ways to solve them, just like we do today!`;
    }
    
    return `Here are some fascinating insights about today's calendar events:\n\n🎯 **Key Insights:**\n${events.map(e => `• ${e.title} - This ${e.category.toLowerCase()} event in ${e.country} had lasting impacts on society`).join('\n')}\n\n🌟 **Interesting Connections:**\nThese events show how different aspects of human civilization - politics, culture, science, and society - are all interconnected and influence each other.\n\n💡 **Modern Relevance:**\nUnderstanding these calendar events helps us better comprehend current world affairs and make informed decisions about our future.`;
  };

  return (
    <motion.div 
      className="w-full md:w-1/2 h-[50vh] glass-card dark:glass-card-dark rounded-2xl overflow-auto soft-shadow dark:soft-shadow-dark"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Bot className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h3 className="font-display font-semibold text-ink-900 dark:text-white">AI Calendar Assistant</h3>
            <p className="text-sm text-ink-600 dark:text-ink-400">Ask about calendar events, dates, or schedules</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-ink-400" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/20 overflow-hidden"
          >
            {/* Suggested Prompts */}
            <div className="p-4 border-b border-white/20">
              <h4 className="text-sm font-medium text-ink-900 dark:text-white mb-3">Suggested Actions:</h4>
              <div className="grid grid-cols-1 gap-2">
                {suggestedPrompts.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handlePromptSubmit(suggestion.prompt)}
                    className={`flex items-center space-x-3 p-3 text-left rounded-xl bg-gradient-to-r ${suggestion.color} text-white hover:shadow-lg transition-all duration-300 group`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <suggestion.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{suggestion.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Conversation */}
            <AnimatePresence>
              {conversation.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-h-64 overflow-y-auto p-4 space-y-3 border-b border-white/20"
                >
                  {conversation.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'glass-card dark:glass-card-dark text-ink-900 dark:text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{message.message}</p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Animation */}
                  {typingText && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="glass-card dark:glass-card-dark px-4 py-3 rounded-2xl max-w-xs">
                        <p className="text-sm whitespace-pre-line text-ink-900 dark:text-white typewriter">
                          {typingText}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Loading Animation */}
                  {isLoading && !typingText && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex justify-start"
                    >
                      <div className="glass-card dark:glass-card-dark px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ 
                                duration: 0.6, 
                                repeat: Infinity, 
                                delay: i * 0.2 
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom Prompt Input */}
            <div className="p-4 flex space-x-3">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ask about calendar events, dates, or schedules..."
                className="flex-1 px-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400"
                onKeyPress={(e) => e.key === 'Enter' && handlePromptSubmit(customPrompt)}
              />
              <motion.button
                onClick={() => handlePromptSubmit(customPrompt)}
                disabled={!customPrompt.trim() || isLoading}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="h-4 w-4" />
              </motion.button>
              {isLoading && (
                <motion.button
                  onClick={handleStop}
                  className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <StopCircle className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIAssistant;