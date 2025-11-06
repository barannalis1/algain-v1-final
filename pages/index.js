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

const premiumHighlights = [
  {
    icon: '🎙️',
    title: 'Çok Kanallı Rüya Günlüğü',
    description:
      'Metin, ses, görsel ve tarot yüklemelerini tek panelde toplayarak eksiksiz bir hikâye oluşturun.',
  },
  {
    icon: '🔮',
    title: 'Profesyonel Fal Atölyesi',
    description:
      'Kahve, el ve tarot yorumlarını DreamOracle desteleriyle birleştiren ileri seviye analiz motoru.',
  },
  {
    icon: '🎬',
    title: 'Video ve Bildirim Otomasyonu',
    description:
      'Storyboard, paylaşılabilir video bağlantısı ve günlük koçluk bildirimleri tek tıklamayla hazır.',
  },
];

const serviceMetrics = [
  {
    value: '7',
    label: 'Fal Servisi',
    description: 'Rüya yorumunuzu kahve, el, tarot, astroloji ve daha fazlasıyla destekleyin.',
  },
  {
    value: '24/7',
    label: 'AI Yorum',
    description: 'Günün her saati profesyonel DreamOracle analizi elinizin altında.',
  },
  {
    value: '∞',
    label: 'Storyboard Şablonu',
    description: 'Sahne akışınızı sınırsız sayıda düzenleyip paylaşın.',
  },
  {
    value: '3x',
    label: 'Daha Fazla Etkileşim',
    description: 'Kişiselleştirilmiş plan ve bildirimlerle kullanıcı dönüşümünü artırın.',
  },
];

const processFlow = [
  {
    title: 'Rüyanızı Anlatın',
    detail: 'Ses kaydı veya metinle rüya detaylarını paylaşın, görsellerinizi ekleyin.',
    accent: 'Birleştirici Günlük',
  },
  {
    title: 'Fal Kombinasyonunu Belirleyin',
    detail: 'Kahve, el, tarot, yıldız ve yaşam koçluğunu tek akışta harmanlayın.',
    accent: 'Çoklu Servis',
  },
  {
    title: 'AI Analizi Gözden Geçirin',
    detail: 'Rüya temalarını, mood rozetlerini ve fal içgörülerini profesyonel panelde inceleyin.',
    accent: 'Kozmik Analiz',
  },
  {
    title: 'Planlayın ve Paylaşın',
    detail: 'Video storyboard’unuzu ve kişisel bildirim planınızı toplulukla paylaşın.',
    accent: 'Paylaşılabilir Deneyim',
  },
];

const testimonials = [
  {
    quote:
      'DreamOracle, fal danışmanlığımızı dijitalleştirip müşterilerimize 7/24 profesyonel yorum sunmamızı sağladı.',
    name: 'Melisa Yıldırım',
    title: 'FalCafe Kurucu Ortağı',
  },
  {
    quote:
      'Sesli kayıt ve tarot yüklemeleri tek panelde. Ekip olarak koçluk planlarını dakikalar içinde oluşturuyoruz.',
    name: 'Deniz Kaya',
    title: 'Wellness Coach',
  },
  {
    quote:
      'Video storyboard ve paylaşım linkleri, DreamOracle’u sosyal medyada yıldız haline getirdi.',
    name: 'Luna Medya',
    title: 'Kreatif Ajans',
  },
];

const faqItems = [
  {
    question: 'Sesli rüya kayıtları nasıl çalışıyor?',
    answer:
      'Tarayıcı mikrofon izinlerini vererek tek tıkla kaydı başlatabilirsiniz. DreamOracle canlı transkript oluşturur ve rüya metninize ekler.',
  },
  {
    question: 'Kahve ve el falı fotoğrafları hangi formatta olmalı?',
    answer:
      'JPEG veya PNG formatında yüklediğiniz görseller otomatik olarak optimize edilir, kart ve telve desenleri analiz edilir.',
  },
  {
    question: 'Tarot kartlarını platform mu seçiyor?',
    answer:
      'DreamOracle destesi veya Kozmik Sırlar destesi seçildiğinde AI kartları otomatik atar; dilerseniz kendi kart fotoğrafınızı yükleyebilirsiniz.',
  },
  {
    question: 'Bildirim planları neleri kapsıyor?',
    answer:
      'Rüyanızdan çıkan mood doğrultusunda sabah, öğle ve akşam ritüelleri içeren kişisel koçluk bildirimleri hazırlanır.',
  },
];

const tarotDecks = {
  'DreamOracle Destesi': [
    {
      name: 'Ay Kapısı',
      icon: '🌙',
      description:
        'Sezgilerinize güvenerek gölgeleri aydınlatın; rüya anlatımınızdaki gizli mesajları ortaya çıkarır.',
    },
    {
      name: 'Güneşin Nabzı',
      icon: '☀️',
      description:
        'Cesaret ve görünürlük zamanı. Günlük planınızda parlamanız gereken bir alanı seçin.',
    },
    {
      name: 'Yıldız Haritası',
      icon: '✨',
      description:
        'Hayal ettiğiniz rotaya rehberlik eder; kozmik eşzamanlılıkları fark etmenizi sağlar.',
    },
    {
      name: 'Rüya Şifacısı',
      icon: '🕊️',
      description:
        'Duygusal şifayı hızlandırır, paylaşmaya çağırır ve koçluk sürecine yumuşaklık katar.',
    },
    {
      name: 'Kule Işığı',
      icon: '🏰',
      description:
        'Yapıların dönüşümünü simgeler; cesurca bırakmanız gereken kalıpları vurgular.',
    },
    {
      name: 'Kader Çemberi',
      icon: '♾️',
      description:
        'Yinelenen temaları ortaya çıkarır; döngülerinizi bilinçle yeniden yazmanıza yardım eder.',
    },
  ],
  'Kozmik Sırlar Destesi': [
    {
      name: 'Nebula Koruyucusu',
      icon: '🪐',
      description:
        'Derin sezgi ve koruyucu rehberlik getirir; sınırlarınızı güçlendirir.',
    },
    {
      name: 'Zaman Yolcusu',
      icon: '⏳',
      description:
        'Geçmiş ve geleceği birleştirir; rüyanızdaki motifleri yaşam dersleriyle bağlar.',
    },
    {
      name: 'Galaksi Elçisi',
      icon: '📡',
      description:
        'İlham mesajlarını yakalar; paylaşmanız gereken sembolik bir daveti işaret eder.',
    },
    {
      name: 'Aurora Kapısı',
      icon: '🌌',
      description:
        'Yeni başlangıçlara açılan ışıklı geçittir; günlük planınızda ilk adımı netleştirir.',
    },
    {
      name: 'Kuantum Dansı',
      icon: '🌀',
      description:
        'Enerjileri yeniden düzenler; ritüellerinizi daha yaratıcı hale getirir.',
    },
    {
      name: 'Kristal Kule',
      icon: '💎',
      description:
        'Netlik ve şeffaflık getirir; niyetlerinizi yüksek frekansta tutar.',
    },
  ],
};

const serviceOptions = [
  { label: 'Rüya Falı', description: 'Metin ve ses kaydınızla AI destekli yorum.' },
  { label: 'Kahve Falı', description: 'Fotoğraf yükleyerek telve desenlerini çözümleyin.' },
  { label: 'Tarot Falı', description: 'DreamOracle destesi veya kendi kart görsellerinizle.' },
  { label: 'Yıldız Falı', description: 'Astrolojik döngülerle rüyanın zamanlamasını eşleştirin.' },
  { label: 'El Falı', description: 'Avuç içi çizgilerinizden yaşam temalarını yakalayın.' },
  { label: 'Astronomi Falı', description: 'Bilimsel gökyüzü verileriyle sezgiyi birleştirin.' },
  { label: 'Yaşam Koçluğu', description: 'Ritüeller, bildirimler ve etkinlik planları.' },
];

function generateTarotSpread(deckName, text, tarotUpload) {
  if (deckName === 'Kullanıcı Tarot Fotoğrafı') {
    if (tarotUpload?.preview) {
      return [
        {
          name: 'Yüklediğiniz Kart',
          image: tarotUpload.preview,
          description:
            'DreamOracle, yüklediğiniz kartın sembollerini rüya hikâyenizle eşleştirerek kişisel bir yorum hazırlar.',
        },
      ];
    }
    return [
      {
        name: 'Kart yüklemesi bekleniyor',
        description: 'Kendi tarot kartı fotoğrafınızı eklediğinizde görsel analizi otomatik başlar.',
      },
    ];
  }

  const deck = tarotDecks[deckName] || [];
  if (!deck.length) {
    return [];
  }

  const seed = text
    ? text
        .split('')
        .reduce((total, char) => total + char.charCodeAt(0), 0)
    : 108;

  const spread = [];
  for (let index = 0; index < Math.min(3, deck.length); index += 1) {
    const position = (seed + index * 11) % deck.length;
    const candidate = deck[position];
    if (!spread.some((card) => card.name === candidate.name)) {
      spread.push(candidate);
      continue;
    }
    const fallback = deck[(position + index + 3) % deck.length];
    if (!spread.some((card) => card.name === fallback.name)) {
      spread.push(fallback);
    }
  }

  return spread;
}

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
  const tarotSpread = useMemo(
    () => generateTarotSpread(uploads.tarotDeck, dreamText, uploads.tarotUpload),
    [uploads.tarotDeck, dreamText, uploads.tarotUpload]
  );
  const hasAnalysis = Boolean(analysis);

  const scrollToWorkbench = () => {
    const section = typeof document !== 'undefined' && document.getElementById('dream-workbench');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    if (uploads.tarotDeck && uploads.tarotDeck !== 'Kullanıcı Tarot Fotoğrafı') {
      tags.push('Tarot rehberliği');
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

    const deckInsight = uploads.tarotDeck
      ? uploads.tarotDeck === 'Kullanıcı Tarot Fotoğrafı'
        ? uploads.tarotUpload
          ? 'Kendi tarot kartı görseliniz analize dahil edildi ve semboller DreamOracle destesine göre yorumlandı.'
          : 'Kendi tarot kartınızı yüklediğinizde semboller DreamOracle tarafından çözümlenecek.'
        : `${uploads.tarotDeck} kartları DreamOracle açılımınızda otomatik olarak seçildi.`
      : null;

    const uploadInsights = [
      uploads.coffee && 'Yüklediğiniz kahve fincanı fotoğrafı telve desenlerinin tespitini hızlandırıyor.',
      uploads.palm && 'El fotoğrafınız yaşam çizgisi ve sezgisel çizgilerinizi koçluk planına taşıyor.',
      uploads.tarotUpload && 'Tarot görselleriniz DreamOracle destesindeki sembollerle eşleştiriliyor.',
      deckInsight,
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-[-15%] h-[520px] w-[520px] rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute top-1/3 right-[-25%] h-[460px] w-[460px] rounded-full bg-fuchsia-500/20 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.25),_transparent_55%)]" />
      </div>

      <header className="relative border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500/20 text-2xl">🔮</span>
            <div>
              <p className="text-lg font-semibold tracking-wide text-white">DreamOracle</p>
              <p className="text-sm text-slate-300">Profesyonel rüya & fal stüdyosu • dreamoracle.space</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <button
              type="button"
              onClick={scrollToWorkbench}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-4 py-2 font-semibold text-indigo-200 hover:bg-indigo-500/20"
            >
              Stüdyoyu aç
            </button>
            <a
              href="mailto:support@dreamoracle.space"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-semibold text-slate-200 hover:border-indigo-300 hover:text-white"
            >
              Destek ekibi
            </a>
            <a
              href="https://dreamoracle.space"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20"
            >
              dreamoracle.space
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl space-y-20 px-6 py-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 via-slate-900/80 to-slate-950 px-8 py-12 shadow-2xl shadow-indigo-500/20">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 opacity-60 lg:block">
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,_rgba(148,163,255,0.35),_transparent_65%)]" />
          </div>
          <div className="relative grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/40 bg-indigo-500/10 px-4 py-1 text-sm font-semibold text-indigo-100">
                Yeni Nesil Rüya & Fal Platformu
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl xl:text-6xl">
                DreamOracle, rüya yorumlarını profesyonel fal deneyimlerine ve kişisel planlara dönüştürür.
              </h1>
              <p className="max-w-2xl text-lg text-slate-200">
                Sesli ve yazılı rüya anlatımları, kahve ve el falı görselleri ile tarot destelerini tek arayüzde toplayın. Yapay zekâ destekli yorumlar, video storyboard ve yaşam koçluğu bildirimiyle müşterilerinize kusursuz bir akış sunun.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={scrollToWorkbench}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400"
                >
                  DreamOracle stüdyosunu başlat
                </button>
                <a
                  href={shareUrl || 'https://dreamoracle.space'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-slate-100 hover:border-indigo-300 hover:text-white"
                >
                  Platformu önizle
                </a>
              </div>
            </div>
            <div className="relative rounded-3xl border border-white/10 bg-slate-950/50 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-200">Profesyonel paket</p>
              <h3 className="mt-4 text-2xl font-semibold text-white">DreamOracle stüdyosunun ileri seviye yetenekleri</h3>
              <p className="mt-2 text-sm text-slate-300">
                Fal uzmanları, wellness koçları ve içerik ekipleri için tasarlanan yönetim paneli; tüm rüya materyallerinizi tek akışta yönetmenize izin verir.
              </p>
              <ul className="mt-6 space-y-4">
                {premiumHighlights.map((item) => (
                  <li key={item.title} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                    <span className="mt-0.5 text-xl">{item.icon}</span>
                    <div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-slate-300">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4 text-sm text-indigo-100">
                DreamOracle, tüm verileri uçtan uca şifreler ve paylaşım izinlerini sizin belirlemenize olanak tanır.
              </div>
            </div>
          </div>
          <div className="relative mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {serviceMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 shadow-lg shadow-black/20"
              >
                <p className="text-3xl font-bold text-white">{metric.value}</p>
                <p className="mt-1 text-sm font-semibold text-indigo-200">{metric.label}</p>
                <p className="mt-2 text-sm text-slate-300">{metric.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processFlow.map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-lg shadow-black/10"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">{step.accent}</p>
              <p className="mt-3 text-lg font-semibold text-white">{step.title}</p>
              <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
            </div>
          ))}
        </section>

        <section
          id="dream-workbench"
          className="grid items-start gap-10 xl:grid-cols-[1.15fr_0.85fr]"
        >
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/25">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-white">Rüyanızı anlatın</h2>
                {voiceStatus === 'recording' && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200">
                    ● Ses kaydı aktif
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Sesli veya yazılı anlatım ekleyin; DreamOracle transkriptinizi otomatik olarak günceller.
              </p>
              <textarea
                value={dreamText}
                onChange={(event) => setDreamText(event.target.value)}
                placeholder="Rüyanızı yazın veya ses kaydını başlatın..."
                className="mt-5 w-full min-h-[200px] rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-base text-slate-100 shadow-inner shadow-black/40 focus:border-indigo-400 focus:outline-none"
              />
              {transcript && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-200">
                  <p className="font-semibold text-indigo-200">Canlı transkript</p>
                  <p className="mt-1 leading-relaxed">{transcript}</p>
                </div>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={startVoiceCapture}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={voiceStatus === 'recording'}
                >
                  {voiceStatus === 'recording' ? 'Kayıt sürüyor' : 'Ses kaydını başlat'}
                </button>
                <button
                  type="button"
                  onClick={stopVoiceCapture}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-indigo-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={voiceStatus !== 'recording'}
                >
                  Kaydı tamamla
                </button>
                {audioUrl && (
                  <audio controls src={audioUrl} className="min-w-[200px] flex-1 rounded-2xl border border-white/10 bg-slate-950/70 p-2" />
                )}
              </div>
              {voiceError && (
                <p className="mt-3 text-sm font-medium text-rose-300">{voiceError}</p>
              )}
              <button
                type="button"
                onClick={computeAnalysis}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400"
              >
                DreamOracle yorumunu oluştur
              </button>
              <p className="mt-3 text-xs text-slate-400">
                Analiz başlatıldığında kahve, el ve tarot verileri de yorum motoruna dahil edilir.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/20">
              <h3 className="text-xl font-semibold text-white">Fal seçimi ve koçluk odağı</h3>
              <p className="mt-2 text-sm text-slate-300">
                Rüya yorumunu hangi ritüellerin tamamlamasını istersiniz?
              </p>
              <div className="mt-6 space-y-3">
                {serviceOptions.map((service) => (
                  <label
                    key={service.label}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 hover:border-indigo-400/40"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-white/30 text-indigo-500 focus:ring-indigo-400"
                      checked={selectedServices.includes(service.label)}
                      onChange={() => toggleService(service.label)}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-white">{service.label}</span>
                      <span className="text-sm text-slate-300">{service.description}</span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 p-4 text-sm text-indigo-100">
                {selectedServices.length
                  ? `Seçilen hizmetler: ${selectedServices.join(', ')}`
                  : 'En az bir fal hizmeti seçerek DreamOracle koçluk önerilerini etkinleştirin.'}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-300 shadow-lg shadow-black/10">
              <p className="font-semibold text-white">Profesyonel ipucu</p>
              <p className="mt-2">
                DreamOracle stüdyosunu işletmeniz için kullanıyorsanız, müşteri kartları ve tarot spreadlerini PDF olarak dışa aktarabilir, paylaşım bağlantılarını CRM’inize kaydedebilirsiniz.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/25">
            <h3 className="text-xl font-semibold text-white">Kahve ve el falı görselleri</h3>
            <p className="mt-2 text-sm text-slate-300">
              Fotoğraflarınızı yükleyin; DreamOracle telve desenlerini ve yaşam çizgilerini analiz etsin.
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Kahve falı</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => attachFile('coffee', event.target.files?.[0])}
                  className="block w-full cursor-pointer rounded-full border border-white/20 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-400"
                />
                {uploads.coffee?.preview ? (
                  <img
                    src={uploads.coffee.preview}
                    alt="Kahve falı önizleme"
                    className="aspect-video w-full rounded-2xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/60 text-xs text-slate-500">
                    Telve görselinizi ekleyin
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">El falı</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => attachFile('palm', event.target.files?.[0])}
                  className="block w-full cursor-pointer rounded-full border border-white/20 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-400"
                />
                {uploads.palm?.preview ? (
                  <img
                    src={uploads.palm.preview}
                    alt="El falı önizleme"
                    className="aspect-video w-full rounded-2xl border border-white/10 object-cover"
                  />
                ) : (
                  <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/60 text-xs text-slate-500">
                    Avuç içi görselinizi ekleyin
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/25">
            <h3 className="text-xl font-semibold text-white">Tarot destesi ve otomatik açılım</h3>
            <p className="mt-2 text-sm text-slate-300">
              DreamOracle desteleriyle kartları otomatik seçin veya kendi kartınızı yükleyin.
            </p>
            <div className="mt-6 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-indigo-200" htmlFor="tarotDeck">
                Tarot destesi
              </label>
              <select
                id="tarotDeck"
                value={uploads.tarotDeck}
                onChange={(event) => setUploads((prev) => ({ ...prev, tarotDeck: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-100 focus:border-indigo-400 focus:outline-none"
              >
                {tarotDeckOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Tarot kartı (opsiyonel)</p>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => attachFile('tarotUpload', event.target.files?.[0])}
                className="block w-full cursor-pointer rounded-full border border-white/20 bg-slate-950/80 px-4 py-2 text-xs font-semibold text-slate-200 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-400"
              />
              {uploads.tarotUpload?.preview && (
                <img
                  src={uploads.tarotUpload.preview}
                  alt="Tarot kartı önizleme"
                  className="aspect-video w-full rounded-2xl border border-white/10 object-cover"
                />
              )}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              DreamOracle destesi seçtiğinizde kartlar algoritmik olarak belirlenir; kendi fotoğrafınızı yüklediğinizde semboller karşılaştırmalı analiz edilir.
            </p>
            {tarotSpread.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-semibold text-indigo-200">Otomatik kart açılımı</h4>
                <div className="grid gap-3 sm:grid-cols-3">
                  {tarotSpread.map((card, index) => (
                    <div
                      key={`${card.name}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
                    >
                      {card.image ? (
                        <img
                          src={card.image}
                          alt={card.name}
                          className="aspect-[3/4] w-full rounded-xl border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[3/4] items-center justify-center rounded-xl border border-dashed border-white/15 bg-slate-900/70 text-3xl">
                          {card.icon || '★'}
                        </div>
                      )}
                      <p className="mt-3 text-sm font-semibold text-white">{card.name}</p>
                      {card.description && (
                        <p className="mt-1 text-xs text-slate-300">{card.description}</p>
                      )}
                    </div>
                  ))}
                </div>
                {uploads.tarotDeck === 'Kullanıcı Tarot Fotoğrafı' && !uploads.tarotUpload && (
                  <p className="text-xs text-slate-400">
                    Kendi kartınızı yüklediğinizde DreamOracle sembolleri görsel üzerinden çözümler.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/25">
            {hasAnalysis ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-2xl font-semibold text-white">Yapay zekâ yorumunuz</h3>
                  <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-100">
                    Mood: {analysis.mood}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-300">{analysis.synopsis}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {analysis.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-6 space-y-4 text-sm text-slate-300">
                  <div>
                    <p className="text-sm font-semibold text-white">Ritüel önerisi</p>
                    <p className="mt-1 text-sm text-slate-300">{analysis.ritual}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-white">Fal içgörüleri</p>
                    <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                      {analysis.insights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  {!!analysis.serviceInsights.length && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Hizmet rehberi</p>
                      <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                        {analysis.serviceInsights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!!analysis.uploadInsights.length && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Yüklediğiniz görseller</p>
                      <ul className="space-y-2 text-sm text-slate-300 list-disc list-inside">
                        {analysis.uploadInsights.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-white">Profesyonel analizi başlatın</h3>
                <p className="text-sm text-slate-300">
                  Rüyanızı ve fal tercihlerinizi paylaştığınızda DreamOracle, mood rozetleri ve kişisel ritüellerle desteklenen kapsamlı bir rapor üretir.
                </p>
                <ul className="space-y-2 text-sm text-slate-400 list-disc list-inside">
                  <li>Sesli rüya kaydı otomatik olarak transkripte dönüştürülür.</li>
                  <li>Yüklediğiniz fotoğraflar sembol eşleştirmesi için analiz motoruna dahil edilir.</li>
                  <li>Video storyboard ve paylaşım bağlantısı sonuçla birlikte hazırlanır.</li>
                </ul>
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/25">
            <h3 className="text-2xl font-semibold text-white">Video storyboard ve paylaşım</h3>
            {hasAnalysis ? (
              <>
                <p className="text-sm text-slate-300">
                  DreamOracle sahneleri rüyanızın ana temasına göre özelleştirir ve videoya dönüştürmeniz için hazırlar.
                </p>
                <ul className="mt-6 space-y-4 text-sm text-slate-300">
                  {videoScenes.map((scene) => (
                    <li key={scene.id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-sm font-semibold text-white">{scene.title}</p>
                      <p className="mt-1 text-slate-200">{scene.visual}</p>
                      <p className="mt-1 text-xs text-slate-400">Anlatım: {scene.narration}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 space-y-3">
                  <p className="text-xs text-slate-400">
                    Paylaşılabilir video bağlantınız hazır; DreamOracle Studio üzerinden düzenleyip dışa aktarabilirsiniz.
                  </p>
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-400"
                  >
                    Videoyu paylaş: {shareUrl.replace('https://', '')}
                  </a>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-300">
                Analizi tamamladıktan sonra storyboard sahneleriniz burada listelenecek ve paylaşım bağlantınız oluşturulacaktır.
              </p>
            )}
          </div>
        </section>

        {dailyPlan && (
          <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500/10 via-slate-900/80 to-slate-950 p-8 shadow-xl shadow-indigo-500/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-semibold text-white">Kişiye özel günlük etkinlik planı</h3>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-100">
                Bildirim modu: {analysis?.mood || 'Meraklı'}
              </span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Sabah</p>
                <p className="mt-2 text-sm text-slate-200">{dailyPlan.morning}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Öğle</p>
                <p className="mt-2 text-sm text-slate-200">{dailyPlan.midday}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200">Akşam</p>
                <p className="mt-2 text-sm text-slate-200">{dailyPlan.evening}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-300">
              DreamOracle uygulaması bu planı bildirim olarak gönderir ve gün sonunda yeni rüya kayıtları için sizi teşvik eder.
            </p>
          </section>
        )}

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/25">
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-white">DreamOracle fiyatlandırması</h3>
            <p className="mt-2 text-sm text-slate-300">
              Mevcut fiyatlandırmanız korunur; ek entegrasyon olmadan profesyonel stüdyoyu kullanmaya başlayın.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 text-left shadow-lg shadow-black/20"
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-200">{tier.name}</p>
                <p className="mt-3 text-3xl font-bold text-white">{tier.price}</p>
                <p className="mt-3 text-sm text-slate-300">{tier.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-200 list-disc list-inside">
                  {tier.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/25">
            <h3 className="text-2xl font-semibold text-white">Kullanıcı hikâyeleri</h3>
            <p className="mt-2 text-sm text-slate-300">
              DreamOracle ile rüya ve fal deneyimlerini ölçeklendiren profesyoneller neler söyledi?
            </p>
            <div className="mt-6 space-y-6">
              {testimonials.map((testimonial) => (
                <blockquote
                  key={testimonial.name}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200"
                >
                  <p className="italic">“{testimonial.quote}”</p>
                  <footer className="mt-3 text-xs text-indigo-200">
                    {testimonial.name} • {testimonial.title}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/25">
            <h3 className="text-2xl font-semibold text-white">Sık sorulan sorular</h3>
            <div className="mt-6 space-y-5">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm font-semibold text-white">{item.question}</p>
                  <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-fuchsia-500/20 px-8 py-10 text-center shadow-2xl shadow-indigo-500/30">
          <div className="mx-auto max-w-3xl space-y-4">
            <h3 className="text-3xl font-semibold text-white">DreamOracle ile kozmik stüdyonuzu hemen kurun</h3>
            <p className="text-sm text-slate-200">
              Rüya kayıtlarından fal yorumlarına, video paylaşımından bildirim planlarına kadar tüm akış tek platformda. Profesyonel görünüm ve otomasyonla müşterilerinizin deneyimini dönüştürün.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={scrollToWorkbench}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-white/30 transition hover:bg-slate-200"
              >
                Rüya kaydını başlat
              </button>
              <a
                href="https://dreamoracle.space"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white hover:bg-white/10"
              >
                dreamoracle.space
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-slate-950/80 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            DreamOracle • Kişiye özel rüya yorumları, fal analizleri ve yaşam koçluğu otomasyonu.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:support@dreamoracle.space"
              className="hover:text-white"
            >
              support@dreamoracle.space
            </a>
            <a
              href="https://dreamoracle.space"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-indigo-200 hover:text-indigo-100"
            >
              dreamoracle.space
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
