const DEFAULT_TIMEOUT_MS = Number(process.env.REPLICATE_POLL_TIMEOUT_MS) || 240000;
const DEFAULT_INTERVAL_MS = Number(process.env.REPLICATE_POLL_INTERVAL_MS) || 4000;

async function sleep(duration) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}

function buildVideoPrompt({ mood, tags, synopsis, scenes, keywordHighlights, selectedServices }) {
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

  return `DreamOracle markası için 16:9 sinematik bir animasyon video oluştur.
${moodText} ${tagText} ${highlightText}
${servicesText}
${synopsisText}
Sahneleri sırayla uygula: ${sceneText}
Neon ışıklar, parçacık alanları, yumuşak kamera geçişleri ve kozmik partiküller kullan. Markayı dreamoracle.space logosu ile bitir.`;
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

  const { mood, tags, synopsis, scenes, keywordHighlights, selectedServices } = req.body || {};

  try {
    const prompt = buildVideoPrompt({ mood, tags, synopsis, scenes, keywordHighlights, selectedServices });

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
          aspect_ratio: '16:9',
          negative_prompt: 'deformed, glitch, kötü kalite, yazı blokları, watermark, durağan sahne',
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
