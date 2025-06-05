
export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="p-6 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">Algain</h1>
        <nav className="space-x-4">
          <a href="#products" className="hover:underline">Ürünler</a>
          <a href="#create" className="hover:underline">Ürün Oluştur</a>
          <a href="#about" className="hover:underline">Hakkımızda</a>
        </nav>
      </header>

      <section className="text-center py-20 bg-gradient-to-br from-blue-100 to-purple-200">
        <h2 className="text-4xl font-bold mb-4">Yapay Zekâ ile Dijital Ürününü Oluştur</h2>
        <p className="text-lg mb-6">Algain ile saniyeler içinde e-kitap, görsel paket, CV, prompt ve daha fazlasını üret, sat, kazan!</p>
        <a href="#create" className="px-6 py-3 bg-black text-white rounded-2xl shadow hover:scale-105 transition">Hemen Oluştur</a>
      </section>

      <section id="products" className="p-10">
        <h3 className="text-2xl font-semibold mb-6 text-center">Popüler Ürünler</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-2xl p-4 shadow">
            <h4 className="text-xl font-bold">AI Prompt Paketi</h4>
            <p className="text-sm mt-2">ChatGPT için 100+ etkili prompt içeren PDF</p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded">Satın Al</button>
          </div>
          <div className="border rounded-2xl p-4 shadow">
            <h4 className="text-xl font-bold">Notion İş Planı Şablonu</h4>
            <p className="text-sm mt-2">Girişimciler için hazır iş planı</p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded">Satın Al</button>
          </div>
          <div className="border rounded-2xl p-4 shadow">
            <h4 className="text-xl font-bold">Dijital CV Tasarımı</h4>
            <p className="text-sm mt-2">Kişiselleştirilebilir Canva şablonu</p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded">Satın Al</button>
          </div>
        </div>
      </section>

      <section id="create" className="p-10 bg-gray-100 text-center">
        <h3 className="text-2xl font-semibold mb-6">AI ile Ürün Oluştur</h3>
        <p className="mb-4">Sadece birkaç soruya cevap ver, ürününü üretelim.</p>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-2xl shadow hover:scale-105 transition">Oluşturmaya Başla</button>
      </section>

      <footer className="p-6 text-center text-sm text-gray-600" id="about">
        © 2025 Algain.com • Yapay zekâ destekli dijital pazar yeri
      </footer>
    </div>
  )
}
