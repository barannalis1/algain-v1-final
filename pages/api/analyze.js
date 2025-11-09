const MAX_PROMPT_CHARACTERS = 4000;

function sanitizeArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item);
}

function extractJson(content) {
  if (!content) return null;
  const trimmed = content.trim();
  const codeBlockMatch = trimmed.match(/```json[\s\S]*?```/i);
  const jsonString = codeBlockMatch
    ? codeBlockMatch[0].replace(/```json/i, '').replace(/```$/, '').trim()
    : trimmed;

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function normalizeKeywordHighlights(highlights) {
  if (!Array.isArray(highlights)) return [];
  return highlights
    .map((item) => {
      if (!item) return null;
      if (typeof item === 'string') {
        return { word: item.trim(), weight: 1 };
      }
      if (typeof item === 'object' && typeof item.word === 'string') {
        const word = item.word.trim();
        if (!word) return null;
        const weight = Number(item.weight);
        return {
          word,
          weight: Number.isFinite(weight) && weight > 0 ? Math.round(weight) : 1,
        };
      }
      return null;
    })
    .filter((item) => item && item.word);
}

function buildPrompt({ dreamText, selectedServices, uploadSummary, fallback }) {
  const servicesText = selectedServices?.length ? selectedServices.join(', ') : 'hiçbiri';
  const uploadDetails = [
    uploadSummary?.hasCoffee ? 'kahve fincanı görseli yüklendi' : 'kahve fincanı yok',
    uploadSummary?.hasPalm ? 'el falı görseli yüklendi' : 'el falı görseli yok',
    uploadSummary?.hasTarotUpload ? 'tarot kartı fotoğrafı sağlandı' : `tarot destesi: ${uploadSummary?.tarotDeck || 'DreamOracle'}`,
  ].join(' • ');

  const fallbackText = fallback
    ? `Varsayılan analizden referans alın: mood=${fallback.mood}; etiketler=${fallback.tags.join(', ')}; özet=${fallback.synopsis}.`
    : 'Varsayılan analiz bulunmuyor.';

  const clippedDream = dreamText.length > MAX_PROMPT_CHARACTERS
    ? `${dreamText.slice(0, MAX_PROMPT_CHARACTERS)}...`
    : dreamText;

  return `DreamOracle uzmanı gibi davran. Rüya anlatımı Türkçe: """${clippedDream}""".
Seçilen fal hizmetleri: ${servicesText}.
Yükleme özeti: ${uploadDetails}.
${fallbackText}
Sadece geçerli JSON döndür. JSON alanları: mood (kısa string), tags (en fazla 5 elemanlı dizi, kısa etiketler), synopsis (2-3 cümle), insights (maksimum 4 maddelik dizi), ritual (tek cümle), serviceInsights (isteğe bağlı kısa maddeler), uploadInsights (isteğe bağlı kısa maddeler), keywordHighlights (en fazla 5 elemanlı {"word":"...","weight":2} yapısında liste). Tüm metinleri Türkçe yaz.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { dreamText, selectedServices = [], uploadSummary = {}, fallback = null } = req.body || {};

  if (!dreamText || typeof dreamText !== 'string' || !dreamText.trim()) {
    return res.status(400).json({ error: 'Dream text is required.' });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_APIKEY;
  const baseUrl = process.env.OPENAI_API_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return res.status(200).json({
      source: 'fallback',
      note: 'OPENAI_API_KEY tanımlı olmadığı için yerel analiz döndürüldü.',
      analysis: fallback,
    });
  }

  try {
    const prompt = buildPrompt({ dreamText, selectedServices, uploadSummary, fallback });

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.65,
        max_tokens: 600,
        messages: [
          {
            role: 'system',
            content:
              'DreamOracle platformu için çalışan bir fal ve rüya analisti asistansın. Yanıtta sadece geçerli JSON döndür.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || 'OpenAI isteği başarısız oldu.');
    }

    const completion = await response.json();
    const content = completion?.choices?.[0]?.message?.content;
    const parsed = extractJson(content);

    if (!parsed) {
      throw new Error('OpenAI yanıtı JSON formatında değil.');
    }

    const analysis = {
      mood: typeof parsed.mood === 'string' && parsed.mood.trim() ? parsed.mood.trim() : fallback?.mood,
      tags: sanitizeArray(parsed.tags).slice(0, 5),
      synopsis: typeof parsed.synopsis === 'string' && parsed.synopsis.trim() ? parsed.synopsis.trim() : fallback?.synopsis,
      insights: sanitizeArray(parsed.insights).slice(0, 6),
      ritual: typeof parsed.ritual === 'string' && parsed.ritual.trim() ? parsed.ritual.trim() : fallback?.ritual,
      serviceInsights: sanitizeArray(parsed.serviceInsights).slice(0, 6),
      uploadInsights: sanitizeArray(parsed.uploadInsights).slice(0, 6),
      keywordHighlights: normalizeKeywordHighlights(parsed.keywordHighlights).slice(0, 6),
    };

    return res.status(200).json({
      source: 'openai',
      analysis,
    });
  } catch (error) {
    return res.status(200).json({
      source: 'fallback',
      error: error?.message || 'AI yorum servisi kullanılamıyor.',
      analysis: fallback,
    });
  }
}
