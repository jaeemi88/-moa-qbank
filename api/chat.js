export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const { prompt } = body;
  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'prompt required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return new Response(JSON.stringify({ error: err?.error?.message || 'Anthropic API error', status: res.status }), {
        status: res.status, headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await res.json();
    const text = data?.content?.[0]?.text || '';
    return new Response(JSON.stringify({ text }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message || 'Server error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
