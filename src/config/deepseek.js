export const PROVIDERS = [
  {
    name: 'Groq',
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  },
  {
    name: 'OpenRouter',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['google/gemma-4-31b-it:free', 'nvidia/nemotron-3-nano-30b-a3b:free'],
    headers: {
      'HTTP-Referer': 'https://kavishkadulshan.dev',
      'X-Title': 'Kavishka Dulshan Portfolio',
    },
  },
];
