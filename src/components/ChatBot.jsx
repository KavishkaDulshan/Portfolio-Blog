import { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend, FiChevronDown } from 'react-icons/fi';
import useChat from '../hooks/useChat';
import LoaderAnimation from './LoaderAnimation';

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}

export default function ChatBot({ title, excerpt, body, type }) {
  const {
    messages, input, setInput, isLoading, isOpen,
    toggleChat, sendMessage, clearChat, suggested,
  } = useChat({ title, excerpt, body, type });

  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-20 left-4 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[560px] h-[60vh] sm:h-[520px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
                  <FiMessageSquare className="text-white" size={14} />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  Ask about this {type}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="text-xs text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-200"
                  title="Clear conversation"
                >
                  Clear
                </button>
                <button
                  onClick={toggleChat}
                  className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FiChevronDown size={18} />
                </button>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto">
              <div className="px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                      <p className="text-sm text-gray-600 text-center">
                        Ask me anything about this {type}!
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {suggested.map((q) => (
                          <button
                            key={q}
                            onClick={() => sendMessage(q)}
                            className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50 transition-colors bg-white"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-[200px] w-full">
                      <LoaderAnimation />
                    </div>
                  </>
                )}

                {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-gray-900 text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 text-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
            </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 shrink-0 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiSend size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleChat}
        className="fixed bottom-6 left-4 z-50 w-12 h-12 rounded-full bg-gray-900 text-white shadow-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
      >
        {isOpen ? <FiX size={20} /> : <FiMessageSquare size={20} />}
      </button>
    </>
  );
}
