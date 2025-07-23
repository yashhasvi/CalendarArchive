import React, { useState, useRef, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, StopCircle } from 'lucide-react';

const OllamaChat: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [reply, setReply] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const abortController = useRef<AbortController | null>(null);

  const askGemma = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReply('');
    abortController.current = new AbortController();

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma:2b-q4_0',
          prompt: input,
          stream: true,
        }),
        signal: abortController.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to read response stream');
      }

      let accumulatedResponse = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              accumulatedResponse += parsed.response;
              setReply(accumulatedResponse);
            }
          } catch (err) {
            console.error('Error parsing chunk:', err);
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return; // Silently handle abort
      }
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="w-full md:w-1/2 h-[50vh] glass-card dark:glass-card-dark rounded-2xl overflow-auto soft-shadow dark:soft-shadow-dark mx-auto"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-4">
        <h2 className="font-display font-semibold text-ink-900 dark:text-white">Talk to Gemma (Ollama)</h2>
        <form onSubmit={askGemma} className="flex gap-3 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Gemma about calendar events, dates, or schedules..."
            className="flex-1 px-4 py-3 glass-card dark:glass-card-dark rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-ink-900 dark:text-white placeholder-ink-400"
            required
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="h-4 w-4" />
          </motion.button>
          {loading && (
            <motion.button
              onClick={handleStop}
              className="px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <StopCircle className="h-4 w-4" />
            </motion.button>
          )}
        </form>

        {error && (
          <div className="text-red-500 mb-4">❌ {error}</div>
        )}
        {reply && (
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl">
            <strong className="text-ink-900 dark:text-white">Gemma:</strong>
            <p className="text-ink-900 dark:text-white whitespace-pre-line">{reply}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OllamaChat;