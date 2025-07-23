import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, FileText, HelpCircle, Quote, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface FloatingAIProps {
  events?: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    country: string;
  }>;
}

const FloatingAI: React.FC<FloatingAIProps> = ({ events = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { 
      icon: FileText, 
      label: 'Write Essay', 
      prompt: 'Write a detailed essay about the historical events',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: HelpCircle, 
      label: 'Create Quiz', 
      prompt: 'Create multiple choice questions about these events',
      color: 'from-purple-500 to-purple-600'
    },
    { 
      icon: Quote, 
      label: 'Generate Quotes', 
      prompt: 'Generate inspiring quotes related to these events',
      color: 'from-sage-500 to-sage-600'
    },
    { 
      icon: Lightbulb, 
      label: 'Explain Simply', 
      prompt: 'Explain these events in simple terms',
      color: 'from-coral-500 to-coral-600'
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const callOllamaAPI = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3', // You can change this to your preferred model
          prompt: `Context: ${events.map(e => `${e.title} - ${e.description}`).join('\n\n')}
          
          User Question: ${prompt}
          
          Please provide a helpful and educational response based on the historical events provided.`,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error('Ollama API request failed');
      }

      const data = await response.json();
      return data.response || 'I apologize, but I couldn\'t generate a response at this time.';
    } catch (error) {
      console.error('Ollama API Error:', error);
      return 'I\'m having trouble connecting to the AI service. Please make sure Ollama is running on your local machine (http://localhost:11434).';
    }
  };

  const handleSendMessage = async (prompt?: string) => {
    const messageText = prompt || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const aiResponse = await callOllamaAPI(messageText);
      
      typewriterEffect(aiResponse, () => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        setTypingText('');
      });
    } catch (error) {
      setIsLoading(false);
      setTypingText('');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bot className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-coral-500 rounded-full animate-pulse"></div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? 60 : 600
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 w-96 glass-card dark:glass-card-dark rounded-2xl shadow-2xl z-50 overflow-hidden"
            style={{ maxHeight: '80vh', minHeight: isMinimized ? '60px' : '400px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-ink-900 dark:text-white text-sm">
                    AI Assistant
                  </h3>
                  <p className="text-xs text-ink-600 dark:text-ink-400">
                    {events.length > 0 ? `${events.length} events loaded` : 'Ready to help'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4 text-ink-500" />
                  ) : (
                    <Minimize2 className="h-4 w-4 text-ink-500" />
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4 text-ink-500" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col h-full"
                >
                  {/* Suggested Prompts */}
                  {messages.length === 0 && (
                    <div className="p-4 border-b border-white/20">
                      <h4 className="text-sm font-medium text-ink-900 dark:text-white mb-3">
                        Quick Actions:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {suggestedPrompts.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSendMessage(suggestion.prompt)}
                            className={`flex items-center space-x-2 p-2 text-left rounded-xl bg-gradient-to-r ${suggestion.color} text-white hover:shadow-md transition-all duration-300 group text-xs`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <suggestion.icon className="h-3 w-3 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">{suggestion.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-80">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                            : 'glass-card dark:glass-card-dark text-ink-900 dark:text-white'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
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
                          <p className="text-sm whitespace-pre-wrap text-ink-900 dark:text-white">
                            {typingText}
                            <span className="animate-pulse">|</span>
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
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-white/20">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about these events..."
                        className="flex-1 px-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400 text-sm"
                        disabled={isLoading}
                      />
                      <motion.button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isLoading}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Send className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingAI;