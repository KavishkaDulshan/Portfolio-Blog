import { useState, useRef, useCallback } from 'react';
import { PROVIDERS } from '../config/deepseek';

function truncateBody(text, maxLen = 6000) {
  if (!text || text.length <= maxLen) return text || '';
  return text.slice(0, maxLen) + '\n\n[content truncated]';
}

function buildSystemPrompt({ title, excerpt, body, type }) {
  const context = truncateBody(body);
  return (
    `You are a helpful assistant on Kavishka Dulshan's portfolio website. ` +
    `Help readers understand this ${type}.\n\n` +
    `Title: ${title || ''}\n` +
    `Excerpt: ${excerpt || ''}\n` +
    `Content:\n${context}\n\n` +
    `Answer concisely based only on the above context. ` +
    `If asked something outside this content, say so politely.`
  );
}

const SUGGESTIONS_BLOG = [
  'Summarize this article',
  'What are the key takeaways?',
  'Explain the main concepts simply',
  'What problem does this address?',
];

const SUGGESTIONS_PROJECT = [
  'Summarize this project',
  'What technologies were used?',
  'How does this project work?',
  'What problem does this solve?',
];

function parseRateLimitSeconds(errBody) {
  try {
    const parsed = JSON.parse(errBody);
    return parsed?.error?.metadata?.retry_after_seconds || 0;
  } catch {
    return 0;
  }
}

async function tryModel(provider, model, payload) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${provider.apiKey}`,
    ...(provider.headers || {}),
  };

  const res = await fetch(`${provider.baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ ...payload, model }),
  });

  if (res.ok) {
    const data = await res.json();
    return { success: true, content: data.choices?.[0]?.message?.content || '' };
  }

  const errBody = await res.text();
  const retrySec = parseRateLimitSeconds(errBody);

  if (res.status === 429 && retrySec > 0) {
    return { success: false, rateLimited: true, retryAfter: retrySec };
  }

  return { success: false, fatal: true, status: res.status };
}

export default function useChat({ title, excerpt, body, type }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const suggested = type === 'project' ? SUGGESTIONS_PROJECT : SUGGESTIONS_BLOG;
  const systemPrompt = useRef(buildSystemPrompt({ title, excerpt, body, type }));

  const hasAnyKey = PROVIDERS.some((p) => p.apiKey);

  const sendMessage = useCallback(async (text) => {
    const message = text || input;
    if (!message.trim() || isLoading) return;

    if (!hasAnyKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: message.trim() },
        { role: 'assistant', content: 'No API key configured. Set VITE_GROQ_API_KEY in your .env file.' },
      ]);
      setInput('');
      return;
    }

    const userMsg = { role: 'user', content: message.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const payload = {
        messages: [
          { role: 'system', content: systemPrompt.current },
          ...history,
          userMsg,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      };

      let lastRateLimited = 0;
      let reply = null;

      for (const provider of PROVIDERS) {
        if (!provider.apiKey) continue;
        for (const model of provider.models) {
          const result = await tryModel(provider, model, payload);
          if (result.success) {
            reply = result.content;
            break;
          }
          if (result.rateLimited) {
            lastRateLimited = Math.max(lastRateLimited, result.retryAfter);
          }
        }
        if (reply) break;
      }

      if (reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      } else if (lastRateLimited > 0) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `All models are busy. Retry in ${Math.ceil(lastRateLimited)}s.` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'All models unavailable. Please try again later.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again later.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, hasAnyKey]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    isOpen,
    toggleChat,
    sendMessage,
    clearChat,
    suggested,
  };
}
