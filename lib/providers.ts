import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import type { Provider } from './provider-config';

export type { Provider };

async function callGemini(prompt: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set');
  const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model  = client.getGenerativeModel({
    model: 'gemini-3.5-flash',
    generationConfig: { temperature: 0.4, maxOutputTokens: 2048, responseMimeType: 'application/json' },
  });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function callAnthropic(prompt: string): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY is not set');
  const client  = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model:      'claude-sonnet-4-6',
    max_tokens: 2048,
    messages:   [{ role: 'user', content: prompt }],
  });
  const block = message.content[0];
  if (block.type !== 'text') throw new Error('Unexpected Anthropic response type');
  return block.text;
}

async function callOpenAI(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set');
  const client     = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model:       'gpt-4o',
    max_tokens:  2048,
    temperature: 0.4,
    messages:    [{ role: 'user', content: prompt }],
  });
  return completion.choices[0].message.content ?? '';
}

async function callQwen(prompt: string): Promise<string> {
  if (!process.env.QWEN_API_KEY) throw new Error('QWEN_API_KEY is not set');
  const client     = new OpenAI({
    apiKey:  process.env.QWEN_API_KEY,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  });
  const completion = await client.chat.completions.create({
    model:       'qwen3-max',
    max_tokens:  2048,
    temperature: 0.4,
    messages:    [{ role: 'user', content: prompt }],
  });
  return completion.choices[0].message.content ?? '';
}

export async function generateWithProvider(prompt: string, provider: Provider): Promise<string> {
  switch (provider) {
    case 'gemini':    return callGemini(prompt);
    case 'anthropic': return callAnthropic(prompt);
    case 'openai':    return callOpenAI(prompt);
    case 'qwen':      return callQwen(prompt);
  }
}
