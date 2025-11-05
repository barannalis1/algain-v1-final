import { useEffect, useMemo, useRef, useState } from 'react';

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
      'Geleneksel sembolleri yapay zekâ ile birleştirerek fincanınızdaki işaretlerin kişisel hikâyenize nasıl yansıdığını keşfedin.',
  },
  {
    title: 'Tarot Falı',
    description:
      'Büyük Arkana enerjilerini gerçek zamanlı analiz ederek sorularınıza sezgisel ve yol gösterici cevaplar üretir.',
  },
  {
    title: 'Yıldız Falı',
    description:
      'Doğum haritanızın dinamiklerini gökyüzünün güncel hareketleri ile harmanlayarak eşsiz astrolojik analizler sunar.',
  },
  {
    title: 'El Falı',
    description:
      'Avuç içi çizgilerinizi dijital olarak tarayıp karakterinizi, ilişkilerinizi ve potansiyelinizi geleceğe taşıyan öneriler üretir.',
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

const defaultDailyPlan = [
  {
    time: '07:30',
    title: 'Güne niyet belirleyerek başla',
    description:
      'Rüyanızdan gelen içgörülerle uyumlu niyet cümleleri yazın ve 5 dakikalık nefes çalışması yapın.',
  },
  {
    time: '12:15',
    title: 'Fincan molasında kozmik farkındalık',
    description:
      'Kahve falınızdan çıkan sembolleri tekrar hatırlayıp gün ortası kararlarınıza yansıtın.',
  },
  {
    time: '18:45',
    title: 'Yıldız senkronizasyonu',
    description:
      'Gün batımında kısa bir yürüyüş yapın ve gökyüzünü gözlemleyerek beden-zihin dengesini yenileyin.',
  },
  {
    time: '22:00',
    title: 'Rüya günlüğü ve paylaşım',
    description:
      'Günün sonunda rüya günlüğünüze yeni deneyimleri ekleyin, dileyenler için videolu paylaşım hazırlayın.',
  },
];

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

  const handleStartRecording = async () => {
    setRecordingError('');
    setShareStatus('');
    setVideoStatus('');

    if (isRecording) return;
    if (typeof window === 'undefined' || !navigator.mediaDevices) {
      setRecordingError('Tarayıcı mikrofon kaydını desteklemiyor.');
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

  const handleInterpretation = () => {
    setShareStatus('');
    setVideoStatus('');
    setInterpretation('');
    setInterpretationTitle('');
    setIsInterpreting(true);

    const selectedTemplate = interpretationTemplates[
      Math.floor(Math.random() * interpretationTemplates.length)
    ];

    setTimeout(() => {
      const summary = formatDreamSummary(dreamText);
      setInterpretationTitle(selectedTemplate.title);
      setInterpretation(selectedTemplate.body(summary, focusKeyword));
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
    setTimeout(() => {
      setVideoStatus('Video taslağınız hazır! Paylaşmak için "Videoyu Paylaş" seçeneğini kullanabilirsiniz.');
    }, 1500);
  };

  const handleShareVideo = async () => {
    setShareStatus('');
    if (!interpretation) {
      setShareStatus('Önce bir rüya yorumu oluşturmalısınız.');
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Rüya Yolculuğum',
          text: interpretation,
        });
        setShareStatus('Video bağlantınız başarıyla paylaşıldı!');
      } else {
        setShareStatus('Tarayıcınız doğrudan paylaşımı desteklemiyor, videoyu indirip manuel olarak paylaşabilirsiniz.');
      }
    } catch (error) {
      setShareStatus('Paylaşım iptal edildi veya bir sorun oluştu.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-900 text-white">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_rgba(2,6,23,0))]" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-28 text-center md:px-12">
          <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-fuchsia-200">
            Algain Rüya & Fal Ekosistemi
          </span>
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
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {defaultDailyPlan.map((item) => (
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
                Rüyalarınızı, fallarınızı ve günlük ritüellerinizi tek çatı altında birleştiren Algain ile sezgilerinizi
                güçlendirin. Topluluğumuza katılın, kozmik rehberliğinizi bugünden yapılandırın.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <a
                href="mailto:destek@algain.com"
                className="rounded-full bg-fuchsia-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-fuchsia-400"
              >
                Destek ile İletişime Geç
              </a>
              <span className="text-xs text-indigo-200">7/24 canlı koçluk ve fal danışmanlığı hattı</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-slate-950/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm text-indigo-200 md:flex-row md:items-center md:justify-between md:px-12">
          <span>© {new Date().getFullYear()} Algain. Tüm hakları saklıdır.</span>
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
