// Demo setup: the app calls Gemini directly. The key comes from .env.local, is never committed,
// but IS bundled into the app, so a real release must move this call behind a server.
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const MODEL = 'gemini-3.5-flash-lite';
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';

export const hasGemini = () => !!API_KEY;

export async function generateJSON({ system, input, schema, timeoutMs = 12000 }) {
  if (!API_KEY) throw new Error('no-key');
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY, 'Api-Revision': '2026-05-20' },
      body: JSON.stringify({
        model: MODEL, input, system_instruction: system,
        response_format: { type: 'text', mime_type: 'application/json', schema },
      }),
    });
    if (!res.ok) throw new Error(`gemini-${res.status}`);
    const data = await res.json();
    const text = data.steps?.filter(s => s.type === 'model_output')
      .flatMap(s => s.content || []).filter(p => p.type === 'text').map(p => p.text).join('');
    if (!text) throw new Error('gemini-empty');
    return JSON.parse(text);
  } finally {
    clearTimeout(timer);
  }
}
