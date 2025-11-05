import { useEffect, useMemo, useRef, useState } from 'react';

const dreamKeywordThemes = [
  {
    id: 'water',
    regex: /(deniz|okyanus|su|dalga|yağmur|nehir)/i,
    tag: 'Su Elementi',
    mood: 'Sakinleştirici',
    tip: 'Su sembolleri duygularınızın akışını temsil ediyor, nefes egzersizleriyle bu akışı dengeleyin.',
  },
  {
    id: 'flight',
    regex: /(uç|uçmak|kanat|gökyüzü|bulut)/i,
    tag: 'Özgürlük Arzusu',
    mood: 'Yükselen Enerji',
    tip: 'Uçuş temaları cesur adımlar atma isteğinizi gösteriyor, gün içinde minik riskler almayı deneyin.',
  },
  {
    id: 'mystery',
    regex: /(karanlık|gölge|labirent|orman|gece)/i,
    tag: 'Gölgelerle Çalışma',
    mood: 'İçe Dönüş',
    tip: 'Gölge temaları iç sesinizi dinlemeniz gerektiğine işaret eder, akşamları kısa meditasyonlar ekleyin.',
  },
  {
    id: 'crowd',
    regex: /(kalabalık|topluluk|arkadaş|aile|sohbet)/i,
    tag: 'Bağ Kurma',
    mood: 'Sosyal',
    tip: 'Kalabalık sembolleri paylaşım ihtiyacınızı hatırlatır, seçtiğiniz fal sonuçlarını sevdiklerinizle paylaşın.',
  },
  {
    id: 'journey',
    regex: /(yolculuk|tren|yol|araç|köprü)/i,
    tag: 'Yeni Yolculuk',
    mood: 'Keşif',
    tip: 'Yolculuk temaları gündemdeki geçişlere dikkat çeker, planlarınıza esneklik ekleyin.',
  },
];

const emotionThemes = [
  {
    regex: /(mutlu|neşeli|sevgi|şükran|heyecan)/i,
    tag: 'Sevgi enerjisi',
    mood: 'Coşkulu',
    tip: 'Pozitif duygular sezgisel enerjinizi yükseltir, afirmasyonlarınızı yüksek sesle tekrar edin.',
  },
  {
    regex: /(korku|panik|kaygı|endişe|ürkütücü)/i,
    tag: 'Korku Şifası',
    mood: 'Dönüşen',
    tip: 'Kaygılı semboller için topraklanma egzersizleri ekleyin, kahve falınızdan çıkan işaretleri not alın.',
  },
  {
    regex: /(huzur|sakin|dingin|ferah)/i,
    tag: 'İçsel Dinginlik',
    mood: 'Huzurlu',
    tip: 'Sakin duygular sezgisel alanınızın dengede olduğunu gösterir, gece ritüelinize teşekkür günlüğü ekleyin.',
  },
];

const serviceExtraTips = {
  'Kahve Falı': 'Kahve falınızdan gelen telve motiflerini sabah niyetlerinize dahil edin.',
  'Tarot Falı': 'Tarot kartlarınızdan seçtiğiniz arketipleri gün boyunca mikro hatırlatmalarla pekiştirin.',
  'Yıldız Falı': 'Yıldız falınızın zamanlama ipuçlarını toplantı ve buluşmalarınıza göre planlayın.',
  'El Falı': 'El falınızdan çıkan çizgi yorumlarını beden farkındalık egzersizleriyle destekleyin.',
  'Astronomi Falı': 'Astronomi falınızın rasyonel analizini hedeflerinize dair veri destekli kararlarla birleştirin.',
  'Rüya Falı': 'Rüya falınızın mesajlarını uykuya dalmadan önce tekrar edip bilinçaltınızı yönlendirin.',
};

function analyzeDreamContent(text, selectedServices, uploads) {
  const normalized = (text || '').toLowerCase();
  const tags = new Set();
  const takeaways = [];
  let detectedMood = '';

  dreamKeywordThemes.forEach((theme) => {
    if (theme.regex.test(normalized)) {
      tags.add(theme.tag);
      takeaways.push(theme.tip);
      if (!detectedMood) {
        detectedMood = theme.mood;
      }
    }
  });

  emotionThemes.forEach((theme) => {
    if (theme.regex.test(normalized)) {
      tags.add(theme.tag);
      takeaways.push(theme.tip);
      if (!detectedMood) {
        detectedMood = theme.mood;
      }
    }
  });

  if (uploads.coffee) {
    tags.add('Kahve sembolleri');
    takeaways.push('Yüklediğiniz kahve fincanı fotoğrafı aroma ve tortu sembollerinin detaylı analizine olanak tanıyor.');
  }

  if (uploads.palm) {
    tags.add('Avuç içi rehberliği');
    takeaways.push('El fotoğrafınız yaşam çizgisi ve sezgisel çizgilerinizi koçluk planına taşıyor.');
  }

  if (uploads.tarotUpload) {
    tags.add('Kişisel tarot açılımı');
    takeaways.push('Kendi tarot açılımınız enerji alanınızı doğrudan videoya taşıyacak özel semboller sunuyor.');
  }

  selectedServices.forEach((service) => {
    const tip = serviceExtraTips[service];
    if (tip) {
      takeaways.push(tip);
    }
  });

  const trimmed = (text || '').trim();
  const sentences = trimmed
    ? trimmed.split(/(?<=[.!?])\s+/).filter((sentence) => sentence && sentence.trim().length > 0)
    : [];
  const firstSentence = sentences[0]?.trim();

  let synopsis = '';
  if (firstSentence) {
    const cleaned = firstSentence.replace(/[.!?]+$/, '');
    synopsis = `Rüya anlatımınız "${cleaned}" cümlesiyle açılıyor.`;
  }

  if (detectedMood) {
    synopsis = synopsis
      ? `${synopsis} Duygusal ton ${detectedMood.toLowerCase()} bir dalgada ilerliyor.`
      : `Duygusal ton ${detectedMood.toLowerCase()} bir dalgada ilerliyor.`;
  }

  const primaryTag = Array.from(tags)[0];
  if (primaryTag) {
    synopsis = synopsis
      ? `${synopsis} ${primaryTag} temasını güçlendirmek için ritüellerinizi uyarlıyoruz.`
      : `${primaryTag} temasını güçlendirmek için ritüellerinizi uyarlıyoruz.`;
  }

  if (!trimmed) {
    synopsis = 'Rüyanızı detaylandırdıkça yapay zekâ sembolleri daha derinlemesine ilişkilendirecek.';
  }

  if (!detectedMood) {
    detectedMood = trimmed ? 'Meraklı' : 'Başlangıç';
  }

  if (tags.size === 0) {
    tags.add('Sezgisel keşif');
  }

  return {
    tags: Array.from(tags),
    mood: detectedMood,
    takeaways: Array.from(new Set(takeaways)),
    synopsis,
  };
}

function formatStoryboardTimestamp(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const interpretationTemplates = [
  {
    id: 'growth',
    title: 'Kişisel Dönüşüm',
    body: (dream, focus) =>
      `Rüyanızdaki ${dream} unsurları, iç dünyanızda güçlü bir dönüşüm isteğine işaret ediyor. ${focus} odaklı semboller, sezgisel gücünüzü ve bilinçaltınızın size sunduğu yol haritasını destekliyor. Rüyayı uyandığınızda hissettiğiniz duygularla birlikte ele almak, gerçek hayatta atacağınız adımlar için içgörü sağlar.`,
  },
  {
    id: 'balance',
    title: 'Denge ve Uyum',
    body: (dream, focus) =>
      `${dream} temalı anlatımınız, yaşamınızdaki dengelenmesi gereken alanlara ışık tutuyor. ${focus} öğeleri ise evrenle kurduğunuz bağı güçlendiriyor. Günlük rutinlerinize küçük ama istikrarlı değişiklikler eklemek, rüyanızın mesajını gerçeğe dönüştürmenize yardımcı olacaktır.`,
  },
  {
    id: 'guidance',
    title: 'Ruhsal Rehberlik',
    body: (dream, focus) =>
      `Rüyanızın ana hikayesi ${dream} etrafında şekilleniyor ve ruhsal rehberlerinizden gelen içsel mesajları temsil ediyor. ${focus} simgeleri, kalpten gelen sezgilere kulak vermeniz gerektiğini vurguluyor. Meditasyon ve niyet çalışmalarıyla bu mesajı hayatınıza taşıyabilirsiniz.`,
  },
];

const fortuneServices = [
  {
    title: 'Kahve Falı',
    description:
      'Fincan fotoğrafınızı yükleyip yapay zekâ ile birleşen geleneksel sembollerin kişisel hikâyenize nasıl yansıdığını keşfedin.',
  },
  {
    title: 'Tarot Falı',
    description:
      'DreamOracle destesi veya kendi kart açılımınızın fotoğrafı üzerinden Büyük Arkana enerjilerini analiz ederek sezgisel cevaplar üretir.',
  },
  {
    title: 'Yıldız Falı',
    description:
      'Doğum haritanızın dinamiklerini gökyüzünün güncel hareketleri ile harmanlayarak eşsiz astrolojik analizler sunar.',
  },
  {
    title: 'El Falı',
    description:
      'Avuç içi fotoğrafınızı yükleyip çizgilerinizi dijital olarak analiz ederek karakterinizi ve potansiyelinizi geleceğe taşıyan öneriler üretir.',
  },
  {
    title: 'Astronomi Falı',
    description:
      'Gök cisimlerinin bilimsel verilerini yorumlayıp yaşam döngünüzle eşleştirerek rasyonel-fütürist öngörüler sağlar.',
  },
  {
    title: 'Rüya Falı',
    description:
      'Gece yolculuklarınızı metaforik ve psikolojik açıdan inceleyerek bilinçaltınızın rehberliğini açığa çıkarır.',
  },
];

const pricingPlans = [
  {
    name: 'Temel Üyelik',
    price: '₺149 / ay',
    description: 'Rüya kaydı, hızlı yapay zekâ yorumu ve haftalık kahve-tarot seansları.',
  },
  {
    name: 'Profesyonel Üyelik',
    price: '₺299 / ay',
    description:
      'Tüm fal hizmetlerine sınırsız erişim, kişiye özel yaşam koçluğu oturumları ve video dönüşüm kredileri.',
  },
  {
    name: 'Kozmik Kulüp',
    price: '₺549 / ay',
    description:
      'Astronomi ve yıldız falı ile derin analizler, günlük etkinlik planları ve paylaşılabilir yüksek çözünürlüklü videolar.',
  },
];

const coachingFocus = [
  'Duygusal dayanıklılık geliştirme',
  'Kariyer yolculuğunu kişisel değerlerle hizalama',
  'İlişki ve iletişimde empatiyi güçlendirme',
  'Günlük alışkanlıkları sürdürülebilir ritüellere dönüştürme',
];

const focusPresets = {
  growth: {
    label: 'Dönüşüm',
    morning: {
      title: 'Şafakta dönüşüm niyeti',
      description:
        'Bilinçaltınızın sunduğu değişim mesajlarını yazarak güne başlayın, nefes çalışmasıyla bedeninizi uyandırın.',
    },
    midday:
      'Gün ortasında rüyanızdaki sembolleri tekrar gözden geçirip minik ama cesur bir aksiyon planı çıkarın.',
    evening:
      'Gün batımında kısa bir yürüyüşle bedeninizi hareketlendirin, sezgilerinizi yıldızların ritmiyle hizalayın.',
    night:
      'Uykuya dalmadan hemen önce günün öğrenimlerini rüya günlüğünüze ekleyin ve paylaşmak istediğiniz içgörüleri seçin.',
    affirmation: 'Kendimi dönüştürmeye hazırım, her sembol bana yeni bir kapı açıyor.',
  },
  balance: {
    label: 'Denge',
    morning: {
      title: 'Zihin-beden uyum ritüeli',
      description:
        'Güne hafif esneme ve anda kalma egzersizleri ile başlayın, rüyanızdaki dengelenmesi gereken alanları not alın.',
    },
    midday:
      'Kahve veya bitki çayı eşliğinde fal notlarınızı inceleyin, iş ve özel yaşam arasında mikro denge ayarlamaları yapın.',
    evening:
      'Akşam saatlerinde sevdiğiniz biriyle bağlantı kurun, empati ve şükür cümleleri paylaşın.',
    night:
      'Uykudan önce sakinleştirici bir meditasyonla zihninizi boşaltın, rüya niyeti belirleyin.',
    affirmation: 'Hayatımın her alanına uyum ve zarafet davet ediyorum.',
  },
  guidance: {
    label: 'Rehberlik',
    morning: {
      title: 'Ruhsal rehberlerle buluşma',
      description:
        'Rüya rehberlerinizden aldığınız mesajları sesli tekrar edin, sezgilerinize teşekkür edin.',
    },
    midday:
      'Tarot veya yıldız falınızdan seçtiğiniz kartı/konumu gün ortası kararlarınıza rehber olarak atayın.',
    evening:
      'Günlük hedeflerinizi gözden geçirirken sezgisel yazı egzersizi yapın, rehberlerinizden yeni işaretler isteyin.',
    night:
      'Uyumadan önce minik bir teşekkür ritüeli oluşturup rüya alanınızı koruyun.',
    affirmation: 'Evrenin rehberliği daima yanımda, işaretleri sevgiyle takip ediyorum.',
  },
};

const planBlueprint = [
  {
    key: 'morning',
    offsetMinutes: 0,
    fallbackTitle: 'Güne niyet belirleyerek başla',
    fallbackDescription:
      'Rüyanızdan gelen içgörülerle uyumlu niyet cümleleri yazın ve 5 dakikalık nefes çalışması yapın.',
  },
  {
    key: 'midday',
    offsetMinutes: 260,
    fallbackTitle: 'Fincan molasında kozmik farkındalık',
    fallbackDescription:
      'Kahve falınızdan çıkan sembolleri tekrar hatırlayıp gün ortası kararlarınıza yansıtın.',
  },
  {
    key: 'evening',
    offsetMinutes: 660,
    fallbackTitle: 'Yıldız senkronizasyonu',
    fallbackDescription:
      'Gün batımında kısa bir yürüyüş yapın ve gökyüzünü gözlemleyerek beden-zihin dengesini yenileyin.',
  },
  {
    key: 'night',
    offsetMinutes: 900,
    fallbackTitle: 'Rüya günlüğü ve paylaşım',
    fallbackDescription:
      'Günün sonunda rüya günlüğünüze yeni deneyimleri ekleyin, dileyenler için videolu paylaşım hazırlayın.',
  },
];

const tarotSources = [
  {
    id: 'deck',
    title: 'DreamOracle Kozmik Destesi',
    description:
      'Platformun seçtiği kart kombinasyonlarıyla otomatik yorum üretin. Yapay zekâ kart arketiplerini rüya temalarınızla eşleştirir.',
  },
  {
    id: 'upload',
    title: 'Kendi Kart Açılımım',
    description:
      'Kart açılımınızın fotoğrafını yükleyerek kişisel enerji alanınızı analize dahil edin. DreamOracle sembolleri kendi görsellerinizle harmanlar.',
  },
];

const channelLabels = {
  mobile: 'Mobil Uygulama',
  email: 'E-posta',
  whatsapp: 'WhatsApp',
};

const serviceHighlights = {
  'Kahve Falı': 'Fincanınızdaki sembolleri günlük kararlarınıza taşıyın.',
  'Tarot Falı': 'Günün kartı rehberliğini görev listenize not edin.',
  'Yıldız Falı': 'Gökyüzü transitlerini enerji planınıza ekleyin.',
  'El Falı': 'Avuç içi sembollerini beden farkındalığı egzersizleriyle destekleyin.',
  'Astronomi Falı': 'Bilimsel veriyle ritminizi hizalayın, odak saatlerinizi yeniden kurgulayın.',
  'Rüya Falı': 'Bilinçaltı notlarınızı rüya günlüğünüzle entegre edin.',
};

const interpretationAdvice = {
  growth: [
    'Değişim çağrısına kulak verin ve bugün tek bir yeni alışkanlık başlatın.',
    'Destek aldığınız koçunuzla dönüşüm hedeflerinizi paylaşın.',
    'Rüya günlüğünüze güçlü hissettiren sembolleri çizin veya kaydedin.',
  ],
  balance: [
    'Rüyanızda beliren zıtlıkları eşleştirerek günlük planınıza ufak molalar yerleştirin.',
    'Enerji seviyenize göre işleri 25 dakikalık odak bloklarına bölün.',
    'Akşam saatlerinde sevdiklerinizle paylaşarak dengeyi güçlendirin.',
  ],
  guidance: [
    'İçsel rehberliğinizi duymak için 10 dakikalık sezgisel yazı çalışması yapın.',
    'Tarot veya yıldız falınızdan gelen mesajı günün temasına dönüştürün.',
    'Yatmadan önce rehberlerinize teşekkür eden kısa bir meditasyon ekleyin.',
  ],
};

const baseVideoScenes = [
  'Rüya anlatımınızın ana cümlelerini neon tipografiyle açılışta gösterin.',
  'Fal kartları ve kozmik sembollerle ara geçişler oluşturun.',
  'Finalde kişisel afirmasyonunuzla kapanış yapın.',
];

const focusVideoScenes = {
  growth: [
    'Dönüşüm temasını vurgulayan ışık patlamaları ve tomurcuklanan çiçek animasyonları ekleyin.',
    'Zaman akışını hızlandırılmış şehir manzaralarıyla temsil edin.',
  ],
  balance: [
    'Ying-yang kompozisyonları ve simetrik geometriler kullanın.',
    'Nefes alış verişini temsil eden yumuşak dalga hareketleri gösterin.',
  ],
  guidance: [
    'Gökyüzü haritaları ve pusula animasyonlarıyla sezgisel rehberliği güçlendirin.',
    'Kapı veya geçit animasyonlarıyla yeni fırsatların açıldığını hissettirin.',
  ],
};

const serviceVideoScenes = {
  'Kahve Falı': 'Kahve fincanının üstünden yükselen sembolik duman efektleriyle mesajı pekiştirin.',
  'Tarot Falı': 'Seçilen kartların holografik şekilde ortaya çıktığı sahnelere yer verin.',
  'Yıldız Falı': 'Gezegenlerin yörüngede dans ettiği bir galaksi zoom efekti ekleyin.',
  'El Falı': 'Avuç içi çizgilerini ışıklı rotalar olarak beliren grafiklerle canlandırın.',
  'Astronomi Falı': 'Uydu görüntülerinden alınan gerçek yıldız verilerini görselleştirin.',
  'Rüya Falı': 'Rüya sembollerini parlayan ikonlara dönüştüren parçacık efektleri kullanın.',
};

function createVideoStoryboard({ focusId, dreamTags, selectedServices, focusKeyword, dreamMood }) {
  let currentSeconds = 0;
  const scenes = [];

  const addScene = (description, duration = 8) => {
    scenes.push({ time: formatStoryboardTimestamp(currentSeconds), description });
    currentSeconds += duration;
  };

  const focusLabel = focusPresets[focusId]?.label || 'Ritüel';
  addScene(
    `Açılışta ${focusLabel.toLowerCase()} odağını ${focusKeyword} temasına bağlayan kozmik bir intro gösterilir.`,
    7
  );

  if (dreamTags.length > 0) {
    addScene(`${dreamTags[0]} vurgusunu güçlendiren parçacık animasyonlarıyla rüyanın ana motifleri canlandırılır.`, 7);
  }

  if (dreamMood) {
    addScene(
      `${dreamMood.toLowerCase()} duygusunu destekleyen arka plan müziği ve renk paletiyle geçiş sahnesi hazırlanır.`,
      6
    );
  }

  selectedServices.forEach((service) => {
    const scene = serviceVideoScenes[service];
    addScene(scene || `${service} ritüelini temsil eden görsellerle kişisel dokunuş eklenir.`, 8);
  });

  const affirmation = focusPresets[focusId]?.affirmation;
  addScene(
    affirmation
      ? `Finalde kişisel afirmasyonunuz "${affirmation}" holografik yazıyla belirir.`
      : 'Finalde DreamOracle logosu ve paylaşım çağrısı görünür.',
    5
  );

  return scenes;
}

function parseTimeValue(value) {
  const [hours, minutes] = value.split(':').map((part) => parseInt(part, 10));
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 450; // 07:30 varsayılanı
  }
  return hours * 60 + minutes;
}

function formatTimeValue(totalMinutes) {
  const safeMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(safeMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (safeMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function generateDailyPlan({ summary, focusId, selectedServices, startTime, primaryTag }) {
  const focus = focusPresets[focusId];
  const baseMinutes = parseTimeValue(startTime || '07:30');
  return planBlueprint.map((step) => {
    const time = formatTimeValue(baseMinutes + step.offsetMinutes);
    const tagSentence = primaryTag ? `Öne çıkan tema: ${primaryTag}.` : '';
    if (!focus) {
      return {
        time,
        title: step.fallbackTitle,
        description: `${step.fallbackDescription} Seçtiğiniz ritüeller: ${selectedServices.join(', ') || 'Rüya Falı'}. ${tagSentence}`.trim(),
      };
    }

    const serviceSentence = selectedServices.length
      ? `Seçtiğiniz ${selectedServices.join(', ')} ritüellerini bu aşamaya dahil edin.`
      : 'Dilediğiniz bir fal ritüelini ekleyerek deneyimi zenginleştirin.';

    if (step.key === 'morning') {
      return {
        time,
        title: focus.morning.title,
        description: `${focus.morning.description} ${serviceSentence} ${tagSentence}`.trim(),
      };
    }

    if (step.key === 'midday') {
      return {
        time,
        title: `${focus.label} odaklı gün ortası reseti`,
        description: `${focus.midday} ${serviceSentence} ${tagSentence}`.trim(),
      };
    }

    if (step.key === 'evening') {
      return {
        time,
        title: `${focus.label} enerjisiyle akşam eşlemesi`,
        description: `${focus.evening} ${serviceSentence} ${tagSentence}`.trim(),
      };
    }

    return {
      time,
      title: `${focus.label} kapanış ritüeli`,
      description: `${focus.night} ${serviceSentence} Rüya özetiniz: ${summary}. ${tagSentence}`.trim(),
    };
  });
}

function formatDreamSummary(text) {
  if (!text) {
    return 'zengin semboller';
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return 'zengin semboller';
  }

  if (trimmed.length < 60) {
    return trimmed;
  }

  return `${trimmed.slice(0, 60)}...`;
}

export default function Home() {
  const [dreamText, setDreamText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [interpretationTitle, setInterpretationTitle] = useState('');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [videoStatus, setVideoStatus] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [interpretationInsights, setInterpretationInsights] = useState([]);
  const [personalAffirmation, setPersonalAffirmation] = useState('');
  const [dreamTags, setDreamTags] = useState([]);
  const [dreamMood, setDreamMood] = useState('');
  const [dreamSynopsis, setDreamSynopsis] = useState('');
  const [videoStoryboard, setVideoStoryboard] = useState([]);
  const [videoLink, setVideoLink] = useState('');
  const [selectedServices, setSelectedServices] = useState(['Kahve Falı', 'Tarot Falı']);
  const [personalFocus, setPersonalFocus] = useState('growth');
  const [notificationTime, setNotificationTime] = useState('07:30');
  const [notificationChannels, setNotificationChannels] = useState({
    mobile: true,
    email: true,
    whatsapp: false,
  });
  const [coffeeImage, setCoffeeImage] = useState(null);
  const [coffeePreview, setCoffeePreview] = useState('');
  const [palmImage, setPalmImage] = useState(null);
  const [palmPreview, setPalmPreview] = useState('');
  const [tarotMode, setTarotMode] = useState('deck');
  const [tarotImage, setTarotImage] = useState(null);
  const [tarotPreview, setTarotPreview] = useState('');

  const revokePreview = (url) => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const focusKeyword = useMemo(() => {
    if (!dreamText) {
      return 'fal enerji alanı';
    }
    if (/kahve|fincan/i.test(dreamText)) return 'kahve falı';
    if (/kart|tarot/i.test(dreamText)) return 'tarot falı';
    if (/yıldız|gökyüzü|gezegen/i.test(dreamText)) return 'yıldız rehberliği';
    if (/el|avuç/i.test(dreamText)) return 'el falı';
    return 'rüya sembolleri';
  }, [dreamText]);

  const selectedServiceSummary = useMemo(() => {
    if (!selectedServices.length) {
      return 'Henüz fal tercihi yapılmadı';
    }
    return selectedServices.join(' • ');
  }, [selectedServices]);

  const personalizedPlan = useMemo(
    () =>
      generateDailyPlan({
        summary: formatDreamSummary(dreamText),
        focusId: personalFocus,
        selectedServices,
        startTime: notificationTime,
        primaryTag: dreamTags[0],
      }),
    [dreamText, notificationTime, personalFocus, selectedServices, dreamTags]
  );

  const activeChannels = useMemo(
    () =>
      Object.entries(notificationChannels)
        .filter(([, value]) => value)
        .map(([key]) => channelLabels[key])
        .filter(Boolean),
    [notificationChannels]
  );

  const serviceStatuses = useMemo(
    () => ({
      'Kahve Falı': coffeePreview
        ? `Fincan görseli yüklendi${coffeeImage?.name ? ` (${coffeeImage.name})` : ''}.`
        : 'Fincan fotoğrafınızı ekleyerek tortu sembollerinin detaylı analizini açın.',
      'El Falı': palmPreview
        ? `El fotoğrafı yüklendi${palmImage?.name ? ` (${palmImage.name})` : ''}.`
        : 'Avuç içinizi fotoğraflayıp çizgilerinizin yorumlanmasını sağlayın.',
      'Tarot Falı':
        tarotMode === 'upload'
          ? tarotPreview
            ? `Kart açılımı görseli yüklendi${tarotImage?.name ? ` (${tarotImage.name})` : ''}.`
            : 'Kart açılımınızın fotoğrafını ekleyin ve yorumlara dahil edin.'
          : 'DreamOracle destesi otomatik olarak kartlarınızı seçip yorumlar.',
    }),
    [coffeePreview, coffeeImage, palmPreview, palmImage, tarotMode, tarotPreview, tarotImage]
  );

  const recommendedVideoScenes = useMemo(() => {
    if (!interpretation) {
      return [];
    }

    const focusScenes = focusVideoScenes[personalFocus] || [];
    const serviceScenes = selectedServices
      .map((service) => serviceVideoScenes[service])
      .filter(Boolean);
    const tagScenes = dreamTags.map((tag) => `${tag} temasını öne çıkaran geçişler ekleyin.`);

    return Array.from(new Set([...baseVideoScenes, ...focusScenes, ...serviceScenes, ...tagScenes]));
  }, [interpretation, personalFocus, selectedServices, dreamTags]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  useEffect(() => {
    return () => {
      revokePreview(coffeePreview);
      revokePreview(palmPreview);
      revokePreview(tarotPreview);
    };
  }, [coffeePreview, palmPreview, tarotPreview]);

  useEffect(() => {
    if (tarotMode !== 'upload') {
      setTarotImage(null);
      setTarotPreview((prev) => {
        if (prev) {
          revokePreview(prev);
        }
        return '';
      });
    }
  }, [tarotMode]);

  const handleStartRecording = async () => {
    setRecordingError('');
    setShareStatus('');
    setVideoStatus('');

    if (isRecording) return;
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      setRecordingError('Tarayıcı mikrofon kaydını desteklemiyor.');
      return;
    }

    if (typeof navigator.mediaDevices.getUserMedia !== 'function') {
      setRecordingError('Tarayıcınız mikrofon erişimini desteklemiyor.');
      return;
    }

    if (typeof MediaRecorder === 'undefined') {
      setRecordingError('Tarayıcınız ses kaydı oluşturmayı desteklemiyor.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL((prev) => {
          if (prev) {
            URL.revokeObjectURL(prev);
          }
          return url;
        });
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setRecordingError('Mikrofon izni reddedildi veya bir hata oluştu.');
    }
  };

  const handleStopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  const handleImageUpload = (event, setFile, setPreview) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFile(file);
    setPreview((prev) => {
      if (prev) {
        revokePreview(prev);
      }
      return URL.createObjectURL(file);
    });
    event.target.value = '';
  };

  const clearImage = (setFile, setPreview) => {
    setFile(null);
    setPreview((prev) => {
      if (prev) {
        revokePreview(prev);
      }
      return '';
    });
  };

  const handleInterpretation = () => {
    setShareStatus('');
    setVideoStatus('');
    setInterpretation('');
    setInterpretationTitle('');
    setInterpretationInsights([]);
    setPersonalAffirmation('');
    setDreamTags([]);
    setDreamMood('');
    setDreamSynopsis('');
    setVideoStoryboard([]);
    setVideoLink('');
    setIsInterpreting(true);

    const selectedTemplate = interpretationTemplates[
      Math.floor(Math.random() * interpretationTemplates.length)
    ];

    setTimeout(() => {
      const summary = formatDreamSummary(dreamText);
      const analysis = analyzeDreamContent(dreamText, selectedServices, {
        coffee: Boolean(coffeePreview),
        palm: Boolean(palmPreview),
        tarotUpload: tarotMode === 'upload' && Boolean(tarotPreview),
      });
      const serviceSentence = selectedServices.length
        ? `Seçtiğiniz ${selectedServices.join(', ')} ritüelleri enerjinizi destekliyor.`
        : 'Fal seçeneklerinden birini ekleyerek analizi daha da kişiselleştirebilirsiniz.';
      const uploadSentences = [];
      if (coffeePreview) {
        uploadSentences.push('Kahve fincanı görseliniz telve desenlerinin okunmasına izin veriyor.');
      }
      if (palmPreview) {
        uploadSentences.push('El fotoğrafınız karakter çizgilerinin koçluk planına taşınmasını sağlıyor.');
      }
      if (tarotMode === 'upload' && tarotPreview) {
        uploadSentences.push('Tarot açılımı görseliniz video storyboarduna kişisel kart enerjilerini ekliyor.');
      } else if (tarotMode === 'deck') {
        uploadSentences.push('DreamOracle destesi otomatik kart seçimiyle arketiplerinizi dengeye getiriyor.');
      }
      const moodSentence = analysis.mood
        ? `Duygusal tonunuz ${analysis.mood.toLowerCase()} bir frekansta ilerliyor.`
        : '';
      const tagSentence =
        analysis.tags.length > 0 ? `${analysis.tags[0]} motifleri rehber mesajlarını vurguluyor.` : '';
      const interpretationText = [
        selectedTemplate.body(summary, focusKeyword),
        moodSentence,
        tagSentence,
        serviceSentence,
        uploadSentences.join(' '),
      ]
        .filter(Boolean)
        .join(' ');

      setInterpretationTitle(selectedTemplate.title);
      setInterpretation(interpretationText);
      const combinedInsights = Array.from(
        new Set([...(interpretationAdvice[selectedTemplate.id] || []), ...analysis.takeaways, ...uploadSentences])
      );
      setInterpretationInsights(combinedInsights);
      setPersonalAffirmation(focusPresets[selectedTemplate.id]?.affirmation || '');
      setPersonalFocus(selectedTemplate.id);
      setDreamTags(analysis.tags);
      setDreamMood(analysis.mood);
      setDreamSynopsis(analysis.synopsis);
      setIsInterpreting(false);
    }, 1200);
  };

  const handleVideoConversion = () => {
    setShareStatus('');
    if (!interpretation) {
      setVideoStatus('Önce rüyanızı yorumlayın, ardından videoya dönüştürebilirsiniz.');
      return;
    }

    setVideoStatus('Rüya yorumunuz sinematik bir videoya dönüştürülüyor...');
    setVideoStoryboard([]);
    setVideoLink('');
    setTimeout(() => {
      const storyboard = createVideoStoryboard({
        focusId: personalFocus,
        dreamTags,
        selectedServices,
        focusKeyword,
        dreamMood,
      });
      const newLink = `https://dreamoracle.space/paylas/${Date.now().toString(36)}`;
      setVideoStoryboard(storyboard);
      setVideoLink(newLink);
      setVideoStatus('Video taslağınız hazır! Aşağıdaki storyboardu gözden geçirip paylaşabilirsiniz.');
    }, 1500);
  };

  const handleShareVideo = async () => {
    setShareStatus('');
    if (!interpretation) {
      setShareStatus('Önce bir rüya yorumu oluşturmalısınız.');
      return;
    }

    if (!videoLink) {
      setShareStatus('Önce videonuzu oluşturun.');
      return;
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({
          title: 'DreamOracle Rüya Yorumu',
          text: interpretation,
          url: videoLink,
        });
        setShareStatus('Video bağlantınız başarıyla paylaşıldı!');
        return;
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(videoLink);
        setShareStatus(`Video bağlantısı panoya kopyalandı: ${videoLink}`);
      } else {
        setShareStatus(`Tarayıcınız doğrudan paylaşımı desteklemiyor, bağlantınızı manuel olarak paylaşabilirsiniz: ${videoLink}`);
      }
    } catch (error) {
      setShareStatus('Paylaşım iptal edildi veya bir sorun oluştu.');
    }
  };

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) {
        return prev.filter((item) => item !== service);
      }
      return [...prev, service];
    });
  };

  const toggleChannel = (channel) => {
    setNotificationChannels((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-900 text-white">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(2,6,23,0))]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-28 text-center md:px-12">
          <a
            href="https://dreamoracle.space"
            target="_blank"
            rel="noreferrer"
            className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-200 transition hover:bg-white/20"
          >
            DreamOracle.space Rüya & Fal Ekosistemi
          </a>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
            Rüyalarınızı Sesli Anlatın, Yapay Zekâ ile Kozmik Yolculuğa Çıkın
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-indigo-100 md:text-xl">
            Sesli ya da yazılı rüya kayıtlarınızı yapay zekâ yorumlasın, dilediğiniz fal türüyle harmanlayıp
            videoya dönüştürsün. Kişiselleştirilmiş yaşam koçluğu ve günlük etkinlik bildirimleriyle sezgilerinizi
            gerçek hayata taşıyın.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              className="rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-fuchsia-400"
              onClick={handleInterpretation}
            >
              Rüyamı Yorumla
            </button>
            <button
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              onClick={handleVideoConversion}
            >
              Videoya Dönüştür
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-20 px-6 pb-24 md:px-12">
        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">Rüyanı Sesli Kaydet</h2>
            <p className="mt-3 text-sm text-indigo-100">
              Mikrofonunuzu kullanarak rüyanızı anlatın. Kayıt bittikten sonra ses dosyanızı dinleyebilir ve
              yapay zekâ destekli analize gönderebilirsiniz.
            </p>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    isRecording ? 'bg-red-500 hover:bg-red-400' : 'bg-fuchsia-500 hover:bg-fuchsia-400'
                  }`}
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                >
                  {isRecording ? 'Kaydı Bitir' : 'Kaydı Başlat'}
                </button>
                {audioURL && (
                  <audio controls src={audioURL} className="h-10">
                    Tarayıcınız ses öğesini desteklemiyor.
                  </audio>
                )}
              </div>
              {recordingError && <p className="text-sm text-red-300">{recordingError}</p>}
              <p className="text-xs text-indigo-200">
                Not: Ses dosyanız tarayıcı üzerinde güvende tutulur ve siz paylaşmadan dışarıya aktarılmaz.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">Rüyanı Yazılı Paylaş</h2>
            <p className="mt-3 text-sm text-indigo-100">
              Rüyanızı detaylandırdıkça yapay zekâ daha derin yorumlar ve kişisel farkındalık önerileri üretir.
            </p>
            <textarea
              className="mt-6 h-44 w-full rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              placeholder="Rüyanızı kelimelere dökün..."
              value={dreamText}
              onChange={(event) => setDreamText(event.target.value)}
            />
            <button
              className="mt-4 w-full rounded-full bg-indigo-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide transition hover:bg-indigo-400"
              onClick={handleInterpretation}
            >
              Rüyayı Yorumla
            </button>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur lg:grid-cols-3">
          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-6">
            <h3 className="text-xl font-semibold text-fuchsia-200">Kahve Falı Fincan Fotoğrafı</h3>
            <p className="text-sm text-indigo-100">
              Fincanınızı farklı açılardan fotoğraflayarak DreamOracle&apos;ın telve desenlerini analiz etmesine izin verin.
            </p>
            <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-fuchsia-400/40 bg-slate-950/40 p-4 text-center text-xs uppercase tracking-wide text-fuchsia-200 transition hover:border-fuchsia-300 hover:bg-fuchsia-500/5">
              <span>{coffeePreview ? 'Yeni Fotoğraf Seç' : 'Fotoğraf Yükle'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImageUpload(event, setCoffeeImage, setCoffeePreview)}
              />
            </label>
            {coffeePreview ? (
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <img
                  src={coffeePreview}
                  alt="Kahve fincanı önizlemesi"
                  className="h-40 w-full rounded-xl object-cover"
                />
                <div className="flex items-center justify-between text-xs text-indigo-200">
                  <span className="truncate">{coffeeImage?.name || 'Yüklenen görsel'}</span>
                  <button
                    type="button"
                    className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-100"
                    onClick={() => clearImage(setCoffeeImage, setCoffeePreview)}
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-indigo-200">
                Kremanın ve telve izlerinin net göründüğü bir fotoğraf seçerek ayrıntılı sembol çözümlemesi alın.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-6">
            <h3 className="text-xl font-semibold text-fuchsia-200">El Falı İçin Avuç Fotoğrafı</h3>
            <p className="text-sm text-indigo-100">
              Avuç içinizi aydınlık bir ortamda çekerek çizgilerinizin yaşam koçluğu önerilerine dönüşmesini sağlayın.
            </p>
            <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-fuchsia-400/40 bg-slate-950/40 p-4 text-center text-xs uppercase tracking-wide text-fuchsia-200 transition hover:border-fuchsia-300 hover:bg-fuchsia-500/5">
              <span>{palmPreview ? 'Yeni Fotoğraf Seç' : 'Fotoğraf Yükle'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleImageUpload(event, setPalmImage, setPalmPreview)}
              />
            </label>
            {palmPreview ? (
              <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <img src={palmPreview} alt="El falı avuç içi önizlemesi" className="h-40 w-full rounded-xl object-cover" />
                <div className="flex items-center justify-between text-xs text-indigo-200">
                  <span className="truncate">{palmImage?.name || 'Yüklenen görsel'}</span>
                  <button
                    type="button"
                    className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-100"
                    onClick={() => clearImage(setPalmImage, setPalmPreview)}
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-indigo-200">
                Her iki elinizi de yükleyerek karakter, ilişki ve kariyer çizgilerinizin derin yorumlarını alın.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-6">
            <h3 className="text-xl font-semibold text-fuchsia-200">Tarot Kart Kaynağı</h3>
            <p className="text-sm text-indigo-100">
              DreamOracle destesi ile otomatik kart seçebilir ya da kendi açılım fotoğrafınızı yükleyebilirsiniz.
            </p>
            <div className="flex flex-col gap-3">
              {tarotSources.map((option) => {
                const isActive = tarotMode === option.id;
                return (
                  <div
                    key={option.id}
                    className={`rounded-2xl border p-3 transition ${
                      isActive
                        ? 'border-fuchsia-400/60 bg-fuchsia-500/10'
                        : 'border-white/10 bg-slate-950/40 hover:border-fuchsia-300/40 hover:bg-fuchsia-500/5'
                    }`}
                  >
                    <button
                      type="button"
                      className={`w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        isActive
                          ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30'
                          : 'border border-white/30 text-indigo-100 hover:border-white hover:bg-white/10'
                      }`}
                      onClick={() => setTarotMode(option.id)}
                    >
                      {option.title}
                    </button>
                    <p className="mt-2 text-xs text-indigo-200">{option.description}</p>
                  </div>
                );
              })}
            </div>
            {tarotMode === 'upload' ? (
              tarotPreview ? (
                <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <img
                    src={tarotPreview}
                    alt="Tarot kartı açılımı önizlemesi"
                    className="h-40 w-full rounded-xl object-cover"
                  />
                  <div className="flex items-center justify-between text-xs text-indigo-200">
                    <span className="truncate">{tarotImage?.name || 'Yüklenen görsel'}</span>
                    <button
                      type="button"
                      className="font-semibold text-fuchsia-300 transition hover:text-fuchsia-100"
                      onClick={() => clearImage(setTarotImage, setTarotPreview)}
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-fuchsia-400/40 bg-slate-950/40 p-4 text-center text-xs uppercase tracking-wide text-fuchsia-200 transition hover:border-fuchsia-300 hover:bg-fuchsia-500/5">
                  <span>Kart Açılımı Fotoğrafı Yükle</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleImageUpload(event, setTarotImage, setTarotPreview)}
                  />
                </label>
              )
            ) : (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-xs text-emerald-100">
                DreamOracle kart destesi aktif. Platform kart arketiplerini rüya temasına göre seçip yorumunuza ekler.
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold text-white">Yapay Zekâ Destekli Kozmik Yorum</h2>
            <p className="mt-4 text-sm text-indigo-100">
              Fal uzmanlarının geleneksel bilgisi ile gelişmiş dil modellerini bir araya getirerek rüya sembollerini,
              gezegen konumlarını ve enerji alanlarını eş zamanlı analiz ediyoruz.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-indigo-100">
              <li>• Duygusal ton analizi ve bilinçaltı haritalama</li>
              <li>• Fal tercihlerinize göre kişiselleştirilmiş öneriler</li>
              <li>• Saniyeler içinde paylaşılabilir hikâye formatları</li>
            </ul>
            {personalAffirmation && (
              <div className="mt-6 rounded-2xl border border-fuchsia-500/40 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-100">
                <p className="font-semibold uppercase tracking-wide">Günün Afirmasyonu</p>
                <p className="mt-2">{personalAffirmation}</p>
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
            <h3 className="text-xl font-semibold text-fuchsia-200">
              {isInterpreting
                ? 'Rüyanız analiz ediliyor...'
                : interpretationTitle || 'Rüya Yorumunuz Hazır Olduğunda Burada Gözükecek'}
            </h3>
            <p className="mt-4 text-sm text-indigo-100">
              {isInterpreting
                ? 'Semboller, duygular ve fal tercihleri harmanlanıyor...'
                : interpretation || 'Rüyayı sesli veya yazılı anlatın ve “Rüyayı Yorumla” butonuna dokunun.'}
            </p>
            {(dreamMood || dreamSynopsis) && (
              <div className="mt-4 rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-4 text-sm text-fuchsia-100">
                {dreamMood && (
                  <p className="font-semibold uppercase tracking-wide">Duygusal Ton: {dreamMood}</p>
                )}
                {dreamSynopsis && (
                  <p className="mt-2 text-xs text-fuchsia-100/80">{dreamSynopsis}</p>
                )}
              </div>
            )}
            {dreamTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {dreamTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-fuchsia-400/40 bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-fuchsia-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            {interpretationInsights.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-indigo-100">
                {interpretationInsights.map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-fuchsia-300" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">Videoya Dönüştür ve Paylaş</h2>
            <p className="mt-3 text-sm text-indigo-100">
              Rüyanızın yorumunu sinematik anlatımla videoya dönüştürün. Kozmik görseller, ses efektleri ve fal kartlarıyla
              kişisel hikâyenizi paylaşılabilir formata taşıyın.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-emerald-400"
                onClick={handleVideoConversion}
              >
                Videoyu Oluştur
              </button>
              <button
                className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
                onClick={handleShareVideo}
              >
                Videoyu Paylaş
              </button>
              {videoStatus && <p className="text-sm text-indigo-100">{videoStatus}</p>}
              {shareStatus && <p className="text-sm text-fuchsia-200">{shareStatus}</p>}
              {recommendedVideoScenes.length > 0 && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Önerilen Sahne Akışı</p>
                  <ul className="mt-3 space-y-2 text-sm text-indigo-100">
                    {recommendedVideoScenes.map((scene) => (
                      <li key={scene} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        <span>{scene}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {videoStoryboard.length > 0 && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Storyboard</p>
                  <ol className="mt-3 space-y-2 text-sm text-indigo-100">
                    {videoStoryboard.map((scene) => (
                      <li
                        key={`${scene.time}-${scene.description}`}
                        className="flex items-start gap-3"
                      >
                        <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-semibold text-emerald-200">
                          {scene.time}
                        </span>
                        <span>{scene.description}</span>
                      </li>
                    ))}
                  </ol>
                  {videoLink && (
                    <p className="mt-4 break-words text-xs text-indigo-300">
                      Paylaşım bağlantınız:{' '}
                      <span className="font-semibold text-emerald-200">{videoLink}</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">Kişisel Yaşam Koçluğu</h2>
            <p className="mt-3 text-sm text-indigo-100">
              Fal tercihlerinize ve rüya arşivinize göre özel koçluk planları oluşturuyoruz. Astrolojik döngüler ve
              günlük enerji seviyeleriniz temel alınarak öneriler sunulur.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-indigo-100">
              {coachingFocus.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-fuchsia-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs uppercase tracking-wide text-indigo-300">Koçluk odağını seç</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {interpretationTemplates.map((template) => {
                  const isActive = personalFocus === template.id;
                  return (
                    <button
                      key={template.id}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                        isActive
                          ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/40'
                          : 'border border-white/30 text-indigo-100 hover:border-white hover:bg-white/10'
                      }`}
                      onClick={() => setPersonalFocus(template.id)}
                    >
                      {template.title}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-xs text-indigo-200">
              <p className="font-semibold uppercase tracking-wide text-fuchsia-200">Seçili Fal Kombinasyonu</p>
              <p className="mt-2 text-sm text-indigo-100">{selectedServiceSummary}</p>
              <ul className="mt-3 space-y-1 text-[13px] text-indigo-200">
                {selectedServices.map((service) => (
                  <li key={service} className="space-y-1">
                    <span>• {serviceHighlights[service] || 'Sezgisel içgörülerinizi takip edin.'}</span>
                    {serviceStatuses[service] && (
                      <span className="block pl-4 text-[12px] text-indigo-300">{serviceStatuses[service]}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
          <h2 className="text-3xl font-semibold text-white">Fal Evreninin Tamamı Tek Platformda</h2>
          <p className="mt-4 text-sm text-indigo-100">
            Rüya yorumlarınızı kahve, tarot, yıldız, el ve astronomi fallarıyla harmanlayarak bütünsel bir deneyim sunuyoruz.
            Her bir fal türü, yapay zekâ destekli analiz motorumuz sayesinde kişisel verilerinize göre şekilleniyor.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fortuneServices.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-lg transition hover:border-fuchsia-400/60 hover:shadow-fuchsia-500/20"
              >
                <h3 className="text-xl font-semibold text-fuchsia-200">{service.title}</h3>
                <p className="mt-3 text-sm text-indigo-100">{service.description}</p>
                {serviceStatuses[service.title] && (
                  <p className="mt-3 text-xs text-indigo-300">{serviceStatuses[service.title]}</p>
                )}
                <button
                  className={`mt-4 w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                    selectedServices.includes(service.title)
                      ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30'
                      : 'border border-white/30 text-indigo-100 hover:border-white hover:bg-white/10'
                  }`}
                  onClick={() => toggleService(service.title)}
                >
                  {selectedServices.includes(service.title) ? 'Planımda' : 'Planıma Ekle'}
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold text-white">Günlük Etkinlik Planı Bildirimleri</h2>
              <p className="mt-3 text-sm text-indigo-100">
                Rüya günlükleriniz, fal sonuçlarınız ve astrolojik ritminiz eşleştirilerek güne yayılan mikro öneriler
                oluşturulur. Bildirimler mobil uygulama ve e-posta üzerinden ulaştırılır.
              </p>
            </div>
            <div className="rounded-full bg-fuchsia-500/20 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-fuchsia-100">
              Kişiye Özel Hatırlatmalar
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-indigo-100">
                <span className="text-xs uppercase tracking-wide text-indigo-300">Bildirim başlangıç saati</span>
                <input
                  type="time"
                  value={notificationTime}
                  onChange={(event) => setNotificationTime(event.target.value)}
                  className="rounded-full border border-white/20 bg-slate-950/60 px-4 py-2 text-sm text-white outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/30"
                />
              </label>
              <div className="flex flex-col gap-2 text-sm text-indigo-100">
                <span className="text-xs uppercase tracking-wide text-indigo-300">Bildirim kanalları</span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(channelLabels).map((channel) => {
                    const isActive = notificationChannels[channel];
                    return (
                      <button
                        key={channel}
                        className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950'
                            : 'border border-white/30 text-indigo-100 hover:border-white hover:bg-white/10'
                        }`}
                        onClick={() => toggleChannel(channel)}
                      >
                        {channelLabels[channel]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-indigo-100 lg:max-w-sm">
              <p className="font-semibold uppercase tracking-wide text-emerald-200">Aktif hatırlatmalar</p>
              <p className="mt-2 text-[13px] text-indigo-200">
                {activeChannels.length > 0
                  ? `${activeChannels.join(', ')} üzerinden günlük plan özetleri gönderilecek.`
                  : 'Bildirim almak için en az bir kanal seçin.'}
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {personalizedPlan.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-fuchsia-200">{item.time}</span>
                  <span className="text-xs uppercase tracking-wide text-indigo-200">Günün ritüeli</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-indigo-100">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
          <h2 className="text-3xl font-semibold text-white">Fiyatlandırma</h2>
          <p className="mt-3 text-sm text-indigo-100">
            Fiyatlandırma yapısı mevcut hâliyle korunur. Planlar ihtiyacınıza göre ölçeklenebilir ve istediğiniz zaman
            yükseltebilir ya da düşürebilirsiniz.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 text-center shadow-lg transition hover:border-emerald-400/60 hover:shadow-emerald-500/20"
              >
                <h3 className="text-xl font-semibold text-emerald-200">{plan.name}</h3>
                <p className="mt-3 text-2xl font-bold text-white">{plan.price}</p>
                <p className="mt-4 text-sm text-indigo-100">{plan.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-white">Haydi Rüya Yolculuğunu Başlatalım</h2>
              <p className="mt-3 text-sm text-indigo-100">
                Rüyalarınızı, fallarınızı ve günlük ritüellerinizi tek çatı altında birleştiren DreamOracle ile sezgilerinizi
                güçlendirin. Topluluğumuza katılın, kozmik rehberliğinizi bugünden yapılandırın.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <a
                href="mailto:destek@dreamoracle.space"
                className="rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-fuchsia-400"
              >
                Destek ile İletişime Geç
              </a>
              <a
                href="https://dreamoracle.space"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              >
                dreamoracle.space
              </a>
              <span className="text-xs text-indigo-200">7/24 canlı koçluk ve fal danışmanlığı hattı</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-indigo-200 md:flex-row md:items-center md:justify-between md:px-12">
          <span>© {new Date().getFullYear()} DreamOracle. Tüm hakları saklıdır.</span>
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wide text-indigo-300">
            <span>Gizlilik</span>
            <span>Koşullar</span>
            <span>Topluluk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
