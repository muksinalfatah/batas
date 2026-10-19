import { useMemo, useState } from 'react'
import Map, { MapMode } from './Map'
import { AreaServiceFactory } from './services/AreaService'
import logo from './assets/logo.png'
import { ISLAND_GROUPS, type IslandGroup } from './const/islands'

const statistics = [
  { label: 'Provinsi', color: 'blue', icon: 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6' },
  { label: 'Kabupaten/Kota', color: 'purple', icon: 'M3 21h18M6 21V10l6-4 6 4v11M3 21v-7h6M15 21v-9h6' },
  { label: 'Kecamatan', color: 'orange', icon: 'm12 2 9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5' },
  { label: 'Desa/Kelurahan', color: 'green', icon: 'M3 11 12 3l9 8M5 10v10h14V10M10 20v-6h4v6' },
  { label: 'Kode Tervalidasi', color: 'red', icon: 'M12 2 4 5.5v5.6c0 5 3.4 9.6 8 10.9 4.6-1.3 8-5.9 8-10.9V5.5L12 2zM8.8 12l2.2 2.2 4.2-4.4' },
]

function Icon({ path }: { path: string }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={path} /></svg>
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="portal-empty"><Icon path="M4 19V5M4 19h16M8 15v-4M12 15V7M16 15v-6" /><p>{children}</p></div>
}

function App() {
  const [version, setVersion] = useState('v1')
  const [selectedIsland, setSelectedIsland] = useState<IslandGroup | null>(null)
  const areaService = useMemo(() => AreaServiceFactory.createAreaService('area-code', version), [version])
  const today = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date())

  return (
    <div className="portal" id="beranda">
      <header className="portal-header">
        <div className="portal-header-inner">
          <a className="portal-brand" href="#beranda" aria-label="Peta Kode Wilayah — Beranda">
            <span className="portal-logo"><img src={logo} alt="Logo Kementerian Dalam Negeri" /></span>
            <span><strong>Peta Kode Wilayah</strong><small>Portal Referensi Wilayah Indonesia</small></span>
          </a>
          <nav className="portal-nav" aria-label="Navigasi utama">
            <a href="#beranda">Beranda</a><a href="#peta">Peta Interaktif</a><a href="#data">Data Wilayah</a>
          </nav>
          <div className="portal-header-right"><a className="portal-map-link" href="#peta">Jelajahi peta <span aria-hidden="true">↗</span></a><span className="portal-version">{version}</span></div>
        </div>
      </header>
      <div className="portal-notice"><div><span className="portal-status-dot" />Referensi wilayah administrasi Indonesia<span className="portal-notice-divider" /><span>Klik provinsi pada peta untuk menjelajahi kode wilayah</span></div></div>
      <main className="portal-main">
        <section className="portal-hero" aria-labelledby="portal-title">
          <div><h1 id="portal-title">Peta Sebaran<br /><em>Kode Wilayah</em> Indonesia</h1><p>Referensi kode dan data wilayah administrasi seluruh Indonesia — provinsi, kabupaten/kota, kecamatan, hingga desa/kelurahan — terpetakan dalam satu portal interaktif.</p></div>
          <div className="portal-date"><span className="portal-icon blue"><Icon path="M8 2v4M16 2v4M3 10h18M6 4h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z" /></span><div><strong>{today}</strong><small>Portal Peta Wilayah Indonesia</small></div></div>
        </section>
        <section className="portal-stats" aria-label="Statistik wilayah">
          {statistics.map(stat => <article className="portal-card portal-stat" key={stat.label} aria-label={`${stat.label}: belum diisi`}><span className={`portal-icon ${stat.color}`}><Icon path={stat.icon} /></span><div><div className="portal-stat-value" /><h2>{stat.label}</h2><div className="portal-stat-caption" /></div></article>)}
        </section>
        <section className="portal-grid-main" id="peta" aria-label="Peta interaktif dan ringkasan">
          <article className="portal-card portal-map-card">
            <div className="portal-card-head"><div><h2>Peta Sebaran Kode Wilayah per Provinsi</h2><p>Klik wilayah untuk melihat rincian kode dan batas administrasi.</p></div><label className="portal-version-select">Versi <select value={version} onChange={event => setVersion(event.target.value)}><option value="v1">v1</option></select></label></div>
            <div className="portal-map"><Map key={version} mode={MapMode.AREA} areaService={areaService} selectedIsland={selectedIsland} /></div>
          </article>
          <aside className="portal-card portal-summary">
            <div className="portal-card-head"><div><h2>Ringkasan per Pulau</h2><p>Jumlah kabupaten/kota terpetakan</p></div></div>
            <div className="portal-islands" role="group" aria-label="Sorot wilayah per pulau">
              {ISLAND_GROUPS.map(island => (
                <button type="button" key={island.id} className="portal-island" aria-pressed={selectedIsland?.id === island.id} onClick={() => setSelectedIsland(current => current?.id === island.id ? null : island)} style={{ '--island-color': island.color } as React.CSSProperties}>
                  <span className="portal-island-dot" aria-hidden="true" /><span>{island.name}</span>
                  <span className="portal-island-count" /><span className="portal-island-percent" />
                </button>
              ))}
            </div>
            <button type="button" className="portal-island-reset" onClick={() => setSelectedIsland(null)} disabled={!selectedIsland}>Tampilkan semua pulau</button>
            <div className="portal-map-tip"><Icon path="M12 3v2M12 19v2M3 12h2M19 12h2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" /><div><strong>Jelajahi wilayah</strong><p>Klik pulau untuk menyorot wilayahnya. Klik kembali untuk menampilkan semua pulau.</p></div></div>
          </aside>
        </section>
        <section className="portal-grid-bottom" id="data" aria-label="Data wilayah">
          <article className="portal-card"><div className="portal-card-head"><div><h2>Komposisi Wilayah</h2><p>Sebaran kab/kota per pulau</p></div></div><EmptyState>Data komposisi belum tersedia.</EmptyState></article>
          <article className="portal-card"><div className="portal-card-head"><div><h2>Wilayah per Level</h2><p>Hierarki kode nasional</p></div></div><EmptyState>Data hierarki belum tersedia.</EmptyState></article>
          <article className="portal-card"><div className="portal-card-head"><div><h2>Pembaruan Kode Terbaru</h2><p>Perubahan &amp; validasi terkini</p></div></div><div className="portal-table-scroll"><table className="portal-table"><thead><tr><th scope="col">Kode</th><th scope="col">Wilayah</th><th scope="col">Level</th><th scope="col">Status</th></tr></thead><tbody><tr><td colSpan={4}>Belum ada data pembaruan kode.</td></tr></tbody></table></div></article>
        </section>
      </main>
      <footer className="portal-footer"><div>© {new Date().getFullYear()} <strong>Peta Kode Wilayah</strong> · Portal Referensi Wilayah Indonesia</div><a href="#peta">Peta interaktif <span aria-hidden="true">↑</span></a></footer>
    </div>
  )
}

export default App
