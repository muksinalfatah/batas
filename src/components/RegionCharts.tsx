import type { AreaSummary } from '../types/services'
import './RegionCharts.css'

const levels = [
  { field: 'JumlahProvinsi', label: 'Provinsi', short: 'Provinsi', color: '#0ea5e9' },
  { field: 'JumlahKabupatenKota', label: 'Kabupaten/Kota', short: 'Kab/Kota', color: '#6366f1' },
  { field: 'JumlahKecamatan', label: 'Kecamatan', short: 'Kecamatan', color: '#f59e0b' },
  { field: 'JumlahDesaKelurahan', label: 'Desa/Kelurahan', short: 'Desa/Kel.', color: '#0d9e63' },
] satisfies { field: keyof AreaSummary; label: string; short: string; color: string }[]

const fmt = (value: number) => value.toLocaleString('id-ID')

export default function RegionCharts({ summary, error }: { summary: AreaSummary | null; error: boolean }) {
  const data = levels.map(level => ({ ...level, value: summary?.[level.field] ?? 0 }))
  const total = data.reduce((sum, level) => sum + level.value, 0)
  const status = error ? 'Data wilayah belum tersedia.' : summary ? 'Belum ada data wilayah untuk versi ini.' : 'Memuat data wilayah…'
  const ready = summary !== null && total > 0
  const circumference = 2 * Math.PI * 75
  const exponent = Math.max(1, Math.ceil(Math.log10(Math.max(...data.map(level => level.value)) + 1)))
  const y = (value: number) => 190 - Math.log10(value + 1) / exponent * 154
  const ticks = [0, ...Array.from({ length: exponent }, (_, index) => 10 ** (index + 1))]

  return <>
    <article className="portal-card" aria-busy={!summary && !error}>
      <div className="portal-card-head"><div><h2>Komposisi Wilayah</h2><p>Proporsi wilayah per tingkat administrasi</p></div></div>
      {ready ? <div className="region-composition">
        <svg viewBox="0 0 220 220" className="region-donut" role="img" aria-label={`Komposisi ${fmt(total)} wilayah administrasi`}>
          <circle cx="110" cy="110" r="75" fill="none" stroke="#eef2f8" strokeWidth="24" />
          {data.map((level, index) => {
            const offset = data.slice(0, index).reduce((sum, item) => sum + item.value, 0) / total * circumference
            return <circle key={level.field} cx="110" cy="110" r="75" fill="none" stroke={level.color} strokeWidth="24"
              strokeDasharray={`${level.value / total * circumference} ${circumference}`}
              strokeDashoffset={-offset} transform="rotate(-90 110 110)">
              <title>{`${level.label}: ${fmt(level.value)} (${(level.value / total * 100).toLocaleString('id-ID', { maximumFractionDigits: 2 })}%)`}</title>
            </circle>
          })}
          <text x="110" y="108" textAnchor="middle" className="region-donut-total">{fmt(total)}</text>
          <text x="110" y="130" textAnchor="middle" className="region-chart-caption">Wilayah administrasi</text>
        </svg>
        <ul className="region-legend" aria-label="Jumlah wilayah per tingkat administrasi">
          {data.map(level => <li key={level.field}><span className="region-legend-dot" style={{ background: level.color }} aria-hidden="true" /><span>{level.label}</span><strong>{fmt(level.value)}</strong></li>)}
        </ul>
      </div> : <div className="portal-empty" role="status"><p>{status}</p></div>}
    </article>
    <article className="portal-card" aria-busy={!summary && !error}>
      <div className="portal-card-head"><div><h2>Wilayah per Level</h2><p>Hierarki kode nasional · skala logaritmik</p></div></div>
      {ready ? <div className="region-levels">
        <svg viewBox="0 0 380 245" role="img" aria-label={`Jumlah wilayah per level: ${data.map(level => `${level.label} ${fmt(level.value)}`).join(', ')}`}>
          {ticks.map(tick => {
            const tickY = tick === 10 ** exponent ? 36 : y(tick)
            return <g key={tick} aria-hidden="true"><line x1="48" y1={tickY} x2="372" y2={tickY} stroke="#eef2f8" />
              <text x="42" y={tickY + 4} textAnchor="end" className="region-chart-caption">{tick >= 1000 ? `${fmt(tick / 1000)} rb` : fmt(tick)}</text></g>
          })}
          {data.map((level, index) => <g key={level.field}>
            <rect x={62 + index * 80} y={y(level.value)} width="44" height={190 - y(level.value)} rx="6" fill={level.color}>
              <title>{`${level.label}: ${fmt(level.value)} wilayah`}</title>
            </rect>
            <text x={84 + index * 80} y={y(level.value) - 9} textAnchor="middle" className="region-bar-value">{fmt(level.value)}</text>
            <text x={84 + index * 80} y="215" textAnchor="middle" className="region-chart-caption">{level.short}</text>
          </g>)}
        </svg>
      </div> : <div className="portal-empty" role="status"><p>{status}</p></div>}
    </article>
  </>
}
