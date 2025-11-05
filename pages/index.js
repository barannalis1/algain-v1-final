import { useEffect, useMemo, useRef, useState } from 'react';

const themeLibrary = [
  {
    id: 'water',
    keywords: ['deniz', 'okyanus', 'nehir', 'yağmur', 'dalga', 'su'],
    tag: 'Su Yolculuğu',
    mood: 'Sakin',
    ritual:
      'Nefesinize odaklanarak güne başlayın ve duş sırasında niyetinizi üç kez tekrar edin.',
    insight:
      'Su sembolleri duyguların arınma isteğini anlatır; gün içinde molalar verip duygularınızı yazın.',
  },
  {
    id: 'flight',
    keywords: ['uçmak', 'kanat', 'gökyüzü', 'bulut', 'rüzgar'],
    tag: 'Özgürlük Arayışı',
    mood: 'Yükselen',
    ritual:
      'Sabah kısa bir esneme serisi yapıp yüksek sesle cesaret afirmasyonları söyleyin.',
    insight:
      'Gökyüzü motifleri yeni başlangıçları destekler; gün içinde ufak bir meydan okumayı programlayın.',
  },
  {
    id: 'mystery',
    keywords: ['gece', 'karanlık', 'labirent', 'orman', 'gölge'],
    tag: 'Gölgelerle Dans',
    mood: 'Derin',
    ritual:
      'Akşam 10 dakikalık meditasyonda karşınıza çıkan sembollerle konuştuğunuzu hayal edin.',
    insight:
      'Gölge temaları içsel sezgiyi güçlendirir; gün sonunda duygu dökümü yapın.',
  },
  {
    id: 'community',
    keywords: ['kalabalık', 'topluluk', 'arkadaş', 'aile', 'sohbet'],
    tag: 'Bağ Kurma Çağrısı',
    mood: 'Sosyal',
    ritual:
      'Güne kahveyle başlayıp şükran mesajı yollayacağınız üç kişiyi belirleyin.',
    insight:
      'Sosyal temalar paylaşımı güçlendirir; fal sonuçlarınızı güvendiğiniz biriyle konuşun.',
  },
  {
    id: 'journey',
    keywords: ['yol', 'köprü', 'tren', 'otoban', 'yolculuk'],
    tag: 'Yeni Rota',
    mood: 'Keşif',
    ritual:
      'Gün planınızı üç bölüme ayırın ve her bölüm için mikro hedef belirleyin.',
    insight:
      'Yolculuk imgeleri ilerleme sinyali verir; bugün yeni bir kaynak keşfedin.',
  },
];

const serviceCoaching = {
  'Rüya Falı': 'Rüya anlatımınızı günlüğe ekleyin ve 7 gün boyunca gelişmeleri not alın.',
  'Kahve Falı': 'Kahve fincanı fotoğrafını yükleyip telve motiflerini analiz sekmesinden inceleyin.',
  'Tarot Falı': 'DreamOracle destesinden üç kart çekin veya kendi fotoğrafınızı yükleyip arketipleri kıyaslayın.',
  'Yıldız Falı': 'Doğum saatinizi ekleyerek astrolojik zamanı bildirim planına entegre edin.',
  'El Falı': 'Avuç içi fotoğrafını yükleyin ve yaşam çizginizi koçluk hedefleriyle eşleştirin.',
  'Astronomi Falı': 'Gökyüzü haritasındaki bilimsel verileri hedef takviminizle eşleştirin.',
  'Yaşam Koçluğu': 'Koçluk modülünde haftalık odağınızı belirleyerek günlük bildirimleri kişiselleştirin.',
};

const pricingTiers = [
  {
    name: 'Kozmik Başlangıç',
    price: '₺0',
    description: 'Metin tabanlı yorumlar ve sınırlı bildirimler.',
    perks: [
      'Günlük tek rüya yorumu',
      'Aylık 3 fal seçimi',
      'Standart yaşam koçluğu önerileri',
    ],
  },
  {
    name: 'DreamOracle Pro',
    price: '₺179/ay',
    description: 'Sesli kayıt, video storyboard ve sınırsız fal modülü.',
    perks: [
      'Sınırsız rüya analizi',
      'Kişiye özel fal kombinasyonları',
      'Video storyboard ve paylaşım araçları',
      'Günlük bildirim planlayıcı',
    ],
  },
  {
    name: 'Galaksi Kulübü',
    price: '₺349/ay',
    description: 'Koçluk seansları ve tam entegrasyon.',
    perks: [
      '1:1 yaşam koçu görüşmesi',
      'Fal ritüeli hatırlatıcıları',
      'Özel DreamOracle tarot destesi',
      'Premium video şablonları',
    ],
  },
];

const notificationPlaybook = {
  Sakin: {
    morning: '07:30 • Şükran nefesi ve DreamOracle su niyeti meditasyonu',
    midday: '13:00 • 10 dakikalık yürüyüş ve his güncellemesi',
    evening: '21:30 • Ilık duş ve rüya günlüğüne üç cümle',
  },
  Yükselen: {
    morning: '06:45 • Cesaret afirmasyonları ve hızlı esneme',
    midday: '12:40 • Yeni fırsat araştırması için 15 dk derin odak',
    evening: '22:15 • Ses kaydını tekrar dinleyip sonraki hamleleri planla',
  },
  Derin: {
    morning: '08:10 • Gölge meditasyonu ve not al',
    midday: '14:20 • Sessiz mola ve duygu taraması',
    evening: '23:00 • Rüya koridoru görselleştirmesi ile uykuya hazırlan',
  },
  Sosyal: {
    morning: '07:50 • İki kişiye niyet mesajı gönder',
    midday: '12:30 • Koçluk odağını ekip arkadaşlarınla paylaş',
    evening: '20:45 • Fal sonuçlarını paylaş ve geri bildirim topla',
  },
  Keşif: {
    morning: '07:10 • Günün ana hedefini yaz',
    midday: '13:30 • Yeni kaynak keşfi için 20 dk araştırma',
    evening: '22:00 • Günün öğrenimlerini DreamOracle günlüğüne ekle',
  },
  Meraklı: {
    morning: '08:00 • Kısa niyet meditasyonu',
    midday: '13:00 • DreamOracle uygulamasında önerilen fal kombinasyonuna göz at',
    evening: '21:30 • Rüyayı detaylandıran bir paragraf yaz',
  },
};

const baseVideoScenes = [
  {
    id: 'intro',
    title: '1. Sahne — Kozmik Uyanış',
    visual: 'DreamOracle logosu kozmik sislerin arasından beliriyor.',
    narration: 'Rüyanızdan yükselen semboller DreamOracle uzayında hayat buluyor.',
  },
  {
    id: 'symbol',
    title: '2. Sahne — Sembol Kapısı',
    visual: 'Ana tema ışıklı bir portalda belirir, yüklenen görseller üzerine yansır.',
    narration: 'Seçtiğiniz fal rehberleri bu sembolü detaylandırıyor.',
  },
  {
    id: 'coaching',
    title: '3. Sahne — Koçluk Akışı',
    visual: 'Günlük bildirimler holografik bir takvim üzerinde beliriyor.',
    narration: 'DreamOracle yaşam koçluğu ritüellerinizi güne yayıyor.',
  },
  {
    id: 'share',
    title: '4. Sahne — Paylaşım Galaksisi',
    visual: 'Video sonunda kişisel paylaşım bağlantısı parıldıyor.',
    narration: 'Rüyanızın hikâyesini dreamoracle.space topluluğuyla paylaşın.',
  },
];

const serviceOptions = [
  { label: 'Rüya Falı', description: 'Metin ve ses kaydınızla AI destekli yorum.' },
  { label: 'Kahve Falı', description: 'Fotoğraf yükleyerek telve desenlerini çözümleyin.' },
  { label: 'Tarot Falı', description: 'DreamOracle destesi veya kendi kart görsellerinizle.' },
  { label: 'Yıldız Falı', description: 'Astrolojik döngülerle rüyanın zamanlamasını eşleştirin.' },
  { label: 'El Falı', description: 'Avuç içi çizgilerinizden yaşam temalarını yakalayın.' },
  { label: 'Astronomi Falı', description: 'Bilimsel gökyüzü verileriyle sezgiyi birleştirin.' },
  { label: 'Yaşam Koçluğu', description: 'Ritüeller, bildirimler ve etkinlik planları.' },
];

function generateShareUrl(mood, tags) {
  const params = new URLSearchParams({
    mood: mood || 'Meraklı',
    tag: tags?.[0] || 'ruya',
  });
  return `https://dreamoracle.space/paylas?${params.toString()}`;
}

export default function Home() {
  const [dreamText, setDreamText] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('idle');
  const [voiceError, setVoiceError] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [transcript, setTranscript] = useState('');
  const [selectedServices, setSelectedServices] = useState(['Rüya Falı', 'Yaşam Koçluğu']);
  const [analysis, setAnalysis] = useState(null);
  const [videoScenes, setVideoScenes] = useState(baseVideoScenes);
  const [shareUrl, setShareUrl] = useState('');
  const [dailyPlan, setDailyPlan] = useState(null);
  const [uploads, setUploads] = useState({
    coffee: null,
    palm: null,
    tarotDeck: 'DreamOracle Destesi',
    tarotUpload: null,
  });

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechRecognitionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (uploads.coffee?.preview) URL.revokeObjectURL(uploads.coffee.preview);
      if (uploads.palm?.preview) URL.revokeObjectURL(uploads.palm.preview);
      if (uploads.tarotUpload?.preview) URL.revokeObjectURL(uploads.tarotUpload.preview);
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [audioUrl, uploads]);

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((item) => item !== service)
        : [...prev, service]
    );
  };

  const attachFile = (type, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setUploads((prev) => {
      if (prev[type]?.preview) URL.revokeObjectURL(prev[type].preview);
      return {
        ...prev,
        [type]: { file, preview },
      };
    });
  };

  const startVoiceCapture = async () => {
    if (voiceStatus === 'recording') return;
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      setVoiceError('Tarayıcı ses kaydı desteği sunmuyor.');
      return;
    }
    try {
      setVoiceError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setVoiceStatus('completed');
      };

      recorder.start();
      setVoiceStatus('recording');

      const Recognition =
        typeof window !== 'undefined' &&
        (window.SpeechRecognition || window.webkitSpeechRecognition);
      if (Recognition) {
        const recognition = new Recognition();
        recognition.lang = 'tr-TR';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          const transcriptValue = Array.from(event.results)
            .map((result) => result[0]?.transcript || '')
            .join(' ');
          setTranscript(transcriptValue);
        };
        recognition.start();
        speechRecognitionRef.current = recognition;
      }
    } catch (error) {
      setVoiceError('Ses kaydı başlatılamadı. Lütfen mikrofon izinlerini kontrol edin.');
      setVoiceStatus('idle');
    }
  };

  const stopVoiceCapture = () => {
    if (voiceStatus !== 'recording') return;
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
    setVoiceStatus('processing');
    if (transcript) {
      setDreamText((prev) => (prev ? `${prev}\n\n${transcript}` : transcript));
    }
  };

  const computeAnalysis = () => {
    const normalized = dreamText.toLowerCase();
    const matchedThemes = themeLibrary.filter((theme) =>
      theme.keywords.some((keyword) => normalized.includes(keyword))
    );
    const primaryTheme = matchedThemes[0];

    const tags = matchedThemes.map((theme) => theme.tag);
    if (uploads.coffee) {
      tags.push('Kahve sembolleri');
    }
    if (uploads.palm) {
      tags.push('Avuç içi bilgeliği');
    }
    if (uploads.tarotUpload) {
      tags.push('Kişisel tarot açılımı');
    }

    const synopsis = (() => {
      if (!dreamText.trim()) {
        return 'Rüya hikâyenizi detaylandırdıkça yapay zekâ sembolleri daha da netleştirecek.';
      }
      const firstSentence = dreamText.trim().split(/(?<=[.!?])\s+/)[0];
      const sanitized = firstSentence?.replace(/[.!?]+$/, '') || 'Rüya';
      return `Anlatımınız "${sanitized}" ifadesiyle başlıyor ve DreamOracle bunu rehberliğe dönüştürüyor.`;
    })();

    const insights = matchedThemes.length
      ? matchedThemes.map((theme) => theme.insight)
      : ['Rüyanız benzersiz semboller içeriyor, DreamOracle sezgisel analizi sizinle birlikte şekillendiriyor.'];

    const ritual = primaryTheme?.ritual ||
      'Uykuya dalmadan önce üç derin nefes alın ve rüyanızın ana duygusunu tekrar edin.';

    const serviceInsights = selectedServices.map((service) => serviceCoaching[service]).filter(Boolean);

    const uploadInsights = [
      uploads.coffee && 'Yüklediğiniz kahve fincanı fotoğrafı telve desenlerinin tespitini hızlandırıyor.',
      uploads.palm && 'El fotoğrafınız yaşam çizgisi ve sezgisel çizgilerinizi koçluk planına taşıyor.',
      uploads.tarotUpload && 'Tarot görselleriniz DreamOracle destesindeki sembollerle eşleştiriliyor.',
    ].filter(Boolean);

    const mood = primaryTheme?.mood || 'Meraklı';

    const result = {
      mood,
      tags: Array.from(new Set(tags.length ? tags : ['Sezgisel keşif'])),
      synopsis,
      insights,
      ritual,
      serviceInsights,
      uploadInsights,
    };

    setAnalysis(result);
    setShareUrl(generateShareUrl(result.mood, result.tags));

    const moodPlan = notificationPlaybook[result.mood] || notificationPlaybook.Meraklı;
    setDailyPlan(moodPlan);

    const personalizedScenes = baseVideoScenes.map((scene) => {
      if (scene.id === 'symbol') {
        return {
          ...scene,
          visual: primaryTheme
            ? `${primaryTheme.tag} teması DreamOracle portalında görselleşiyor.`
            : scene.visual,
          narration: primaryTheme
            ? `${primaryTheme.insight} Seçtiğiniz fal hizmetleri bu sembolü detaylandırıyor.`
            : scene.narration,
        };
      }
      if (scene.id === 'coaching') {
        return {
          ...scene,
          narration: `Yaşam koçluğu modu ${result.mood.toLowerCase()} titreşiminde bildirimler planlıyor.`,
        };
      }
      return scene;
    });
    setVideoScenes(personalizedScenes);
  };

  const tarotDeckOptions = useMemo(
    () => [
      'DreamOracle Destesi',
      'Kozmik Sırlar Destesi',
      'Kullanıcı Tarot Fotoğrafı',
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="max-w-6xl px-4 py-12 mx-auto space-y-16">
        <header className="space-y-6 text-center">
          <p className="inline-flex items-center gap-2 px-4 py-1 text-sm font-semibold rounded-full bg-indigo-500/20 text-indigo-200">
            DreamOracle • dreamoracle.space
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">
            Rüyalarınızı anlatın, DreamOracle yorumlasın, fal rehberliğiniz ve günlük planınız şekillensin.
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-300">
            Sesli ya da yazılı rüya paylaşımı yapın, kahve ve el falı görselleri yükleyin, tarot destelerini seçin.
            DreamOracle, yapay zekâ destekli yorumları video storyboard ve bildirim planlarıyla sizin için hazırlar.
          </p>
        </header>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="p-6 space-y-4 bg-slate-900/60 rounded-2xl border border-slate-800">
            <h2 className="text-2xl font-semibold">Rüyanızı Anlatın</h2>
            <textarea
              value={dreamText}
              onChange={(event) => setDreamText(event.target.value)}
              placeholder="Rüyanızı yazın veya ses kaydını başlatın..."
              className="w-full min-h-[160px] rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-base focus:border-indigo-400 focus:outline-none"
            />
            {transcript && (
              <div className="p-3 text-sm rounded-xl bg-slate-800/50 text-slate-200">
                <p className="font-semibold text-indigo-200">Canlı Transkript</p>
                <p>{transcript}</p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={startVoiceCapture}
                className="px-4 py-2 text-sm font-semibold rounded-full bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-50"
                disabled={voiceStatus === 'recording'}
              >
                {voiceStatus === 'recording' ? 'Kayıt Devam Ediyor...' : 'Ses Kaydını Başlat'}
              </button>
              <button
                type="button"
                onClick={stopVoiceCapture}
                className="px-4 py-2 text-sm font-semibold rounded-full bg-slate-800 text-slate-100 hover:bg-slate-700"
                disabled={voiceStatus !== 'recording'}
              >
                Ses Kaydını Bitir
              </button>
              {audioUrl && (
                <audio controls src={audioUrl} className="flex-1 min-w-[180px]" />
              )}
            </div>
            {voiceError && <p className="text-sm text-rose-300">{voiceError}</p>}
            <button
              type="button"
              onClick={computeAnalysis}
              className="w-full px-4 py-3 text-base font-semibold rounded-xl bg-indigo-500 text-white hover:bg-indigo-400"
            >
              DreamOracle Yorumu Oluştur
            </button>
          </div>

          <div className="p-6 space-y-5 bg-slate-900/40 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-semibold">Fal Seçimleri & Koçluk Odağı</h3>
            <div className="grid gap-3">
              {serviceOptions.map((service) => (
                <label
                  key={service.label}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-indigo-400/60"
                >
                  <input
                    type="checkbox"
                    className="mt-1 text-indigo-500 focus:ring-indigo-400"
                    checked={selectedServices.includes(service.label)}
                    onChange={() => toggleService(service.label)}
                  />
                  <span>
                    <span className="block text-sm font-semibold">{service.label}</span>
                    <span className="text-sm text-slate-300">{service.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="p-6 space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <h3 className="text-xl font-semibold">Kahve ve El Falı Fotoğrafları</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-slate-300">Kahve Falı Fotoğrafı</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => attachFile('coffee', event.target.files?.[0])}
                  className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-400"
                />
                {uploads.coffee?.preview && (
                  <img
                    src={uploads.coffee.preview}
                    alt="Kahve falı önizleme"
                    className="object-cover w-full h-40 rounded-xl border border-slate-800"
                  />
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-300">El Falı Fotoğrafı</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => attachFile('palm', event.target.files?.[0])}
                  className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-400"
                />
                {uploads.palm?.preview && (
                  <img
                    src={uploads.palm.preview}
                    alt="El falı önizleme"
                    className="object-cover w-full h-40 rounded-xl border border-slate-800"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <h3 className="text-xl font-semibold">Tarot Destesi ve Kart Yükleme</h3>
            <div className="space-y-2">
              <label className="text-sm text-slate-300" htmlFor="tarotDeck">
                Tarot Destesi Seçimi
              </label>
              <select
                id="tarotDeck"
                value={uploads.tarotDeck}
                onChange={(event) =>
                  setUploads((prev) => ({ ...prev, tarotDeck: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm focus:border-indigo-400 focus:outline-none"
              >
                {tarotDeckOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-300">Tarot Kartı Fotoğrafı (Opsiyonel)</p>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => attachFile('tarotUpload', event.target.files?.[0])}
                className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-400"
              />
              {uploads.tarotUpload?.preview && (
                <img
                  src={uploads.tarotUpload.preview}
                  alt="Tarot kartı önizleme"
                  className="object-cover w-full h-40 rounded-xl border border-slate-800"
                />
              )}
            </div>
            <p className="text-sm text-slate-300">
              DreamOracle destesi seçtiğinizde platform sizin için kartları hazırlar; kendi kartınızı yüklediğinizde karşılaştırmalı analiz yapılır.
            </p>
          </div>
        </section>

        {analysis && (
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="p-6 space-y-4 bg-slate-900/60 border border-indigo-500/40 rounded-2xl">
              <h3 className="text-xl font-semibold">Yapay Zekâ Yorumunuz</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-base text-slate-200">{analysis.synopsis}</p>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-indigo-200">Ana İçgörüler</h4>
                <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                  {analysis.insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-indigo-200">Ritüel Önerisi</h4>
                <p className="text-sm text-slate-300">{analysis.ritual}</p>
              </div>
              {!!analysis.serviceInsights.length && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-indigo-200">Fal Servisi Rehberi</h4>
                  <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                    {analysis.serviceInsights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!!analysis.uploadInsights.length && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-indigo-200">Yüklediğiniz Görseller</h4>
                  <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                    {analysis.uploadInsights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-6 space-y-4 bg-slate-900/60 border border-indigo-500/40 rounded-2xl">
              <h3 className="text-xl font-semibold">Video Storyboard ve Paylaşım</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {videoScenes.map((scene) => (
                  <li key={scene.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800">
                    <p className="text-sm font-semibold text-indigo-200">{scene.title}</p>
                    <p className="text-slate-200">{scene.visual}</p>
                    <p className="text-slate-400">Anlatım: {scene.narration}</p>
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <p className="text-sm text-slate-300">
                  Paylaşılabilir video bağlantınız hazır. Oluşturduğunuz sahneleri DreamOracle video stüdyosuna aktarabilirsiniz.
                </p>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full bg-indigo-500 text-white hover:bg-indigo-400"
                >
                  Videoyu Paylaş: {shareUrl.replace('https://', '')}
                </a>
              </div>
            </div>
          </section>
        )}

        {dailyPlan && (
          <section className="p-6 space-y-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">Kişiye Özel Günlük Etkinlik Planı</h3>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-200">
                Bildirim modu: {analysis?.mood || 'Meraklı'}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <p className="text-xs font-semibold text-indigo-200 uppercase">Sabah</p>
                <p className="mt-1 text-sm text-slate-200">{dailyPlan.morning}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <p className="text-xs font-semibold text-indigo-200 uppercase">Öğle</p>
                <p className="mt-1 text-sm text-slate-200">{dailyPlan.midday}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
                <p className="text-xs font-semibold text-indigo-200 uppercase">Akşam</p>
                <p className="mt-1 text-sm text-slate-200">{dailyPlan.evening}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              DreamOracle uygulaması bu planı bildirim olarak gönderir ve gün sonunda yeni rüya yorumunuzu istemek için size hatırlatma yapar.
            </p>
          </section>
        )}

        <section className="p-6 space-y-6 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">DreamOracle Fiyatlandırması</h3>
            <p className="text-slate-300">Mevcut fiyatlar korunarak tüm özelliklere erişim planlarınız hazır.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-950/40 hover:border-indigo-400/60"
              >
                <p className="text-sm font-semibold text-indigo-200">{tier.name}</p>
                <p className="mt-2 text-2xl font-bold">{tier.price}</p>
                <p className="mt-2 text-sm text-slate-300">{tier.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200 list-disc list-inside">
                  {tier.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="px-4 py-10 bg-slate-950/80 border-t border-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">
            DreamOracle • Kişiye özel rüya yorumları ve fal rehberliği platformu.
          </p>
          <a
            href="https://dreamoracle.space"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold text-indigo-300 hover:text-indigo-200"
          >
            dreamoracle.space
          </a>
        </div>
      </footer>
    </div>
  );
}
