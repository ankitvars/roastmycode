export type Provider = 'gemini' | 'anthropic' | 'openai' | 'qwen';

export const PROVIDER_LABELS: Record<Provider, string> = {
  gemini:    'Gemini 3.5 Flash',
  anthropic: 'Claude Sonnet 4.6',
  openai:    'GPT-4o',
  qwen:      'Qwen 3 Max',
};
