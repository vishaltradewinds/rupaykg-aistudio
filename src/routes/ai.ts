import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';

export const aiRouter = Router();

const DEFAULT_MODEL = 'gemini-4-hydrogen';

function resolveValidGeminiModel(requestedModel?: string): string {
  const m = String(requestedModel || '').trim();
  if (!m) return DEFAULT_MODEL;

  const legacyOrDeprecated = new Set([
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-2.0-flash',
    'gemini-2.0-pro',
    'gemini-2.0-flash-thinking',
    'gemini-3-flash-preview',
    'gemini-3.5-flash',
  ]);
  if (legacyOrDeprecated.has(m)) {
    return DEFAULT_MODEL;
  }
  return m;
}

export function createServerGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'fallback_key' || apiKey.trim().length < 10) {
    const err: any = new Error(
      'Gemini AI is not configured on this server. Add GEMINI_API_KEY in Settings > Secrets to enable live AI generation.'
    );
    err.statusCode = 503;
    err.code = 'GEMINI_NOT_CONFIGURED';
    throw err;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function mapGeminiError(err: any): { status: number; code: string; message: string } {
  if (err?.statusCode === 503 && err?.code === 'GEMINI_NOT_CONFIGURED') {
    return { status: 503, code: err.code, message: err.message };
  }

  const msg = String(err?.message || 'Gemini API request failed.');
  const rawStatus = Number(err?.status || err?.statusCode || 0);

  if (rawStatus === 403 || msg.includes('PERMISSION_DENIED')) {
    return {
      status: 403,
      code: 'GEMINI_PERMISSION_DENIED',
      message: 'Gemini API permission denied. Please verify your API key in Settings > Secrets.',
    };
  }
  if (rawStatus === 400 && msg.includes('API_KEY_INVALID')) {
    return {
      status: 400,
      code: 'GEMINI_API_KEY_INVALID',
      message: 'Configured GEMINI_API_KEY is invalid. Check Settings > Secrets.',
    };
  }
  if (rawStatus === 404 || msg.includes('NOT_FOUND')) {
    return {
      status: 404,
      code: 'GEMINI_MODEL_NOT_FOUND',
      message: `Requested Gemini model is unavailable: ${msg}`,
    };
  }
  if (rawStatus === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('429')) {
    return {
      status: 429,
      code: 'GEMINI_RATE_LIMITED',
      message: 'Gemini API quota or rate limit reached. Please retry shortly or check Settings > Secrets.',
    };
  }
  if (rawStatus === 503 || msg.includes('503')) {
    return {
      status: 503,
      code: 'GEMINI_UPSTREAM_UNAVAILABLE',
      message: 'Gemini service is temporarily busy. Please retry.',
    };
  }

  return {
    status: rawStatus >= 400 && rawStatus < 600 ? rawStatus : 502,
    code: 'GEMINI_UPSTREAM_ERROR',
    message: msg,
  };
}

aiRouter.get('/health', (_req, res) => {
  const configured = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== 'fallback_key' &&
      process.env.GEMINI_API_KEY.trim().length >= 10
  );

  res.status(configured ? 200 : 503).json({
    configured,
    defaultModel: DEFAULT_MODEL,
    status: configured ? 'READY' : 'NOT_CONFIGURED',
    message: configured
      ? 'Server-side Gemini API proxy is configured and active.'
      : 'GEMINI_API_KEY is not configured in server Secrets.',
  });
});

aiRouter.post('/generate', async (req: any, res: any) => {
  try {
    const { model, contents, config } = req.body || {};
    if (!contents) {
      return res.status(400).json({ error: 'contents payload is required.' });
    }

    const client = createServerGeminiClient();
    const modelName = resolveValidGeminiModel(model);

    const maxRetries = 2;
    let lastError: any = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 400;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }

        const response = await client.models.generateContent({
          model: modelName,
          contents,
          config,
        });

        return res.json(response);
      } catch (err: any) {
        lastError = err;
        const status = Number(err?.status || 0);
        const msg = String(err?.message || '');
        const isTransient = status === 429 || status === 503 || msg.includes('429') || msg.includes('503');
        const isDailyLimit =
          msg.includes('limit: 20') || msg.includes('daily') || msg.includes('quota_daily');
        if (isDailyLimit || !isTransient || attempt === maxRetries) {
          break;
        }
      }
    }

    const mapped = mapGeminiError(lastError);
    return res.status(mapped.status).json({ error: mapped.message, code: mapped.code });
  } catch (err: any) {
    const mapped = mapGeminiError(err);
    return res.status(mapped.status).json({ error: mapped.message, code: mapped.code });
  }
});
