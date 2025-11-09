const DEFAULT_TIMEOUT_MS = Number(process.env.REPLICATE_POLL_TIMEOUT_MS) || 240000;
const DEFAULT_INTERVAL_MS = Number(process.env.REPLICATE_POLL_INTERVAL_MS) || 4000;

async function sleep(duration) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

function buildVideoPrompt({
  mood,
  tags,
  synopsis,
  scenes,
  keywordHighlights,
  selectedServices,
  styleGuide = {},
}) {
  const topic = styleGuide.topic || (Array.isArray(tags) && tags[0]) || 'DreamOracle rüyası';
  const primaryName = styleGuide.primaryColorName || 'pastel lavanta';
  const primaryHex = styleGuide.primaryColor || '#c7d2fe';
  const accentName = styleGuide.accentColorName || 'pastel fuşya';
  const accentHex = styleGuide.accentColor || '#f9a8d4';

  const moodText = mood ? `Mood: ${mood}.` : '';
  const tagText = Array.isArray(tags) && tags.length ? `Temalar: ${tags.join(', ')}.` : '';
  const highlightText = Array.isArray(keywordHighlights) && keywordHighlights.length
    ? `Anahtar kelimeler: ${keywordHighlights
        .map((item) => (typeof item === 'string' ? item : item?.word))
        .filter(Boolean)
        .join(', ')}.`
    : '';
  const servicesText = Array.isArray(selectedServices) && selectedServices.length
    ? `Desteklenen fal servisleri: ${selectedServices.join(', ')}.`
    : '';
  const sceneText = Array.isArray(scenes)
    ? scenes
        .map(
          (scene, index) =>
            `${index + 1}. sahne (${scene?.title || 'DreamOracle sahnesi'}): ${scene?.visual || ''} — Anlatım: ${
              scene?.narration || ''
            }`
        )
        .join(' ')
    : '';

  const synopsisText = synopsis ? `Özet: ${synopsis}.` : '';

  const directives = [
    'DreamOracle markası için profesyonel animasyon storyboard videosu üret.',
    'TÜR: 3D toon/cel-shaded, yüksek okunabilirlik.',
    `KONU: ${topic}.`,
    'MODELLEME: Basit low-poly formlar, toon shader, yumuşak ışık.',
    'KAMERA: Dolly-in/out ve yavaş orbit; derin alan bulanıklığı kullanma.',
    'HAREKET: Squash & stretch orta seviyede, fizik abartılı ama kontrollü.',
    `RENK PALETİ: Pastel; ana renk ${primaryName} (${primaryHex}), vurgu ${accentName} (${accentHex}).`,
    'IŞIK: Belirgin rim light, sert gölge yok.',
    'SÜRE: 18 saniye. FPS: 24. ASPECT: 9:16 dikey.',
    'METİN: Büyük başlıklar, çok hafif drop-shadow; tüm metinler Türkçe ve okunaklı.',
    'SES: Neşeli kısa jingle eşlik etsin.',
    moodText,
    tagText,
    highlightText,
    servicesText,
    synopsisText,
    `Sahneleri sırayla uygula: ${sceneText}`,
    'Her sahnede DreamOracle markası, yüklenen görseller ve fal hizmetleri organik şekilde bağlansın.',
    'NEGATİF: fotogerçekçi materyal (metal/deri/insan cildi), noise, filmik lens efektleri, watermark.',
  ]
    .filter(Boolean)
    .join('\n');

  return directives;
}

async function pollReplicate(predictionUrl, token) {
  let elapsed = 0;
  while (elapsed < DEFAULT_TIMEOUT_MS) {
    await sleep(DEFAULT_INTERVAL_MS);
    elapsed += DEFAULT_INTERVAL_MS;

    const statusResponse = await fetch(predictionUrl, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!statusResponse.ok) {
      const errorData = await statusResponse.json().catch(() => null);
      throw new Error(errorData?.error || 'Replicate durum bilgisi alınamadı.');
    }

    const statusData = await statusResponse.json();
    if (!statusData || !statusData.status) {
      throw new Error('Replicate yanıtı beklenmedik formatta.');
    }

    if (statusData.status === 'succeeded') {
      return statusData;
    }
    if (statusData.status === 'failed' || statusData.status === 'canceled') {
      throw new Error(statusData.error || 'Replicate isteği başarısız oldu.');
    }
  }

  throw new Error('Replicate isteği zaman aşımına uğradı.');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const replicateToken = process.env.REPLICATE_API_TOKEN;
  const replicateModel = process.env.REPLICATE_MODEL_VERSION;

  if (!replicateToken || !replicateModel) {
    return res.status(200).json({
      fallback: true,
      reason: 'Replicate ayarları tanımlı değil. REPLICATE_API_TOKEN ve REPLICATE_MODEL_VERSION ekleyin.',
    });
  }

  const {
    mood,
    tags,
    synopsis,
    scenes,
    keywordHighlights,
    selectedServices,
    styleGuide,
  } = req.body || {};

  try {
    const prompt = buildVideoPrompt({
      mood,
      tags,
      synopsis,
      scenes,
      keywordHighlights,
      selectedServices,
      styleGuide,
    });

    const startResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: replicateModel,
        input: {
          prompt,
          aspect_ratio: '9:16',
          negative_prompt: [
            'photorealistic materials',
            'realistic skin',
            'metal reflections',
            'noise',
            'film grain',
            'lens flare',
            'watermark',
            'low detail',
            'static scene',
          ].join(', '),
          guidance_scale: Number(process.env.REPLICATE_GUIDANCE_SCALE) || 12,
        },
      }),
    });

    if (!startResponse.ok) {
      const errorData = await startResponse.json().catch(() => null);
      throw new Error(errorData?.error?.message || 'Replicate isteği başlatılamadı.');
    }

    const startData = await startResponse.json();
    const predictionUrl = startData?.urls?.get || startData?.urls?.self;

    if (!predictionUrl) {
      throw new Error('Replicate tahmini için durum bağlantısı alınamadı.');
    }

    const finalData = await pollReplicate(predictionUrl, replicateToken);

    const output = finalData?.output;
    const downloadUrl = Array.isArray(output)
      ? output.find((item) => typeof item === 'string' && item.startsWith('http'))
      : typeof output === 'string'
      ? output
      : '';

    if (!downloadUrl) {
      throw new Error('Replicate çıktısı bulunamadı.');
    }

    return res.status(200).json({
      provider: 'replicate',
      downloadUrl,
      fileName: `dreamoracle-ai-${Date.now()}.mp4`,
      note: 'Replicate video üretimi tamamlandı.',
    });
  } catch (error) {
    return res.status(200).json({
      fallback: true,
      error: error?.message || 'AI video servisi kullanılamıyor.',
    });
  }
}
