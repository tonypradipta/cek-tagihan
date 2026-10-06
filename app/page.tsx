'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, ArrowRight, Bell, CalendarDays, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, CreditCard, Droplets, ExternalLink, FileText, Home, Info, LayoutDashboard, LogOut,
  Menu, MessageCircle, PartyPopper, ReceiptText, Search, ShieldCheck, Sparkles, X,
  Building2, Smartphone, Download, AlertCircle, AlertTriangle, AlertOctagon, Clock, MapPin, Store, HelpCircle
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const HELP_CENTER_URL = 'https://tirtahitabuleleng.com/'
const WHATSAPP_URL = 'https://wa.me/6287775508777'

function getInitials(name?: string) {
  if (!name) return 'PL'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getMiddleName(fullName?: string) {
  if (!fullName) return 'Pelanggan'
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]
  if (parts.length === 2) return parts[1]
  return parts[1]
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'compact' : ''}`}>
      <div className="brand-logo-wrap">
        <img
          src="/logo.png"
          alt="Perumda Air Minum Tirta Hita Buleleng"
          className="brand-logo-img"
        />
      </div>
      <div className="brand-text">
        <strong>Perumda Air Minum</strong>
        <small>Tirta Hita Buleleng</small>
      </div>
    </div>
  )
}

function TypewriterTitle() {
  const line1Text = 'Cek tagihan air,'
  const line2Text = 'lebih praktis & akurat.'

  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [showCursor1, setShowCursor1] = useState(true)
  const [showCursor2, setShowCursor2] = useState(false)

  useEffect(() => {
    let isSubscribed = true

    const runLoop = async () => {
      while (isSubscribed) {
        setText1('')
        setText2('')
        setShowCursor1(true)
        setShowCursor2(false)

        // Type Line 1
        for (let i = 1; i <= line1Text.length; i++) {
          if (!isSubscribed) return
          setText1(line1Text.slice(0, i))
          await new Promise((r) => setTimeout(r, 60))
        }

        if (!isSubscribed) return
        setShowCursor1(false)
        setShowCursor2(true)

        // Type Line 2
        for (let j = 1; j <= line2Text.length; j++) {
          if (!isSubscribed) return
          setText2(line2Text.slice(0, j))
          await new Promise((r) => setTimeout(r, 60))
        }

        // Pause for 3 seconds before repeating
        if (!isSubscribed) return
        await new Promise((r) => setTimeout(r, 3000))
      }
    }

    runLoop()

    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <h1 className="typing-title">
      <span className="typing-line">
        {text1}
        {showCursor1 && <span className="typing-cursor">|</span>}
      </span>
      <br />
      <em className="typing-line highlight">
        {text2}
        {showCursor2 && <span className="typing-cursor">|</span>}
      </em>
    </h1>
  )
}

function Landing({ onLookup }: { onLookup: (number: string) => void }) {
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const submit = async () => {
    if (!/^\d{8}$/.test(number)) {
      setError('Masukkan 8 digit nomor pelanggan yang valid.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const { data: c, error: err } = await supabase
        .from('customers')
        .select('id, name, customer_number')
        .eq('customer_number', number)
        .maybeSingle()

      if (err || !c) {
        setError(`Nomor pelanggan "${number}" tidak ditemukan di sistem. Silakan periksa kembali nomor Anda.`)
        return
      }

      onLookup(number)
    } catch (e) {
      setError('Gagal menghubungkan ke server. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const openPusatBantuan = (e: React.MouseEvent) => {
    e.preventDefault()
    window.open(HELP_CENTER_URL, '_blank', 'noopener,noreferrer')
  }

  const openContact = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
  }

  return (
    <main className="landing-page">
      <header className="landing-nav">
        <Logo />
        <nav>
          <a href="#layanan">Layanan</a>
          <a href={HELP_CENTER_URL} target="_blank" rel="noopener noreferrer">Bantuan</a>
        </nav>
        <button className="outline-btn" onClick={() => { window.location.href = '/admin/login' }}>
          Masuk Portal Admin <ArrowRight size={16} />
        </button>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="pulse-dot" /> Layanan Pelanggan Digital
          </div>
          <TypewriterTitle />
          <p>
            Akses rincian tagihan air resmi, pantau riwayat pemakaian bulanan, dan dapatkan panduan tempat pembayaran resmi Perumda Air Minum Tirta Hita Buleleng.
          </p>
          <div className="hero-trust">
            <ShieldCheck size={18} />
            <span>Resmi & Terpercaya</span>
            <span className="trust-divider" />
            <span>Layanan Informasi 24/7</span>
          </div>
        </div>

        <div className="lookup-card">
          <div className="card-kicker">
            <div className="icon-box">
              <ReceiptText size={22} />
            </div>
            <div>
              <h2>Cek Tagihan Air</h2>
              <p>Masukkan 8 digit nomor pelanggan</p>
            </div>
          </div>
          <label htmlFor="customer-number">Nomor Pelanggan</label>
          <div className={'input-wrap ' + (error ? 'has-error' : '')}>
            <Search size={19} />
            <input
              id="customer-number"
              inputMode="numeric"
              maxLength={8}
              placeholder="Contoh: 01033079"
              value={number}
              onChange={e => {
                setNumber(e.target.value.replace(/\D/g, ''))
                setError('')
              }}
              onKeyDown={e => e.key === 'Enter' && submit()}
            />
            <span className="input-count">{number.length}/8</span>
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn full" onClick={submit} disabled={loading}>
            {loading ? 'Mengecek Nomor Pelanggan...' : <>Cek Tagihan Sekarang <ArrowRight size={18} /></>}
          </button>
          <p className="lookup-note">
            <Info size={14} /> Nomor meter atau ID pelanggan PDAM dapat dicek langsung pada fisik meteran air di depan rumah, struk pembayaran lama, atau melalui situs resmi PDAM setempat
          </p>
        </div>
      </section>

      <section className="feature-row" id="layanan">
        <div className="feature">
          <span className="feature-icon blue">
            <ReceiptText size={20} />
          </span>
          <div>
            <h3>Informasi Tagihan Akurat</h3>
            <p>Cek rincian nominal & pemakaian air secara transparan.</p>
          </div>
        </div>
        <div className="feature">
          <span className="feature-icon cyan">
            <Droplets size={20} />
          </span>
          <div>
            <h3>Pantau Pemakaian</h3>
            <p>Kenali grafik konsumsi air keluarga tiap bulan.</p>
          </div>
        </div>
        <div className="feature" onClick={openContact} style={{ cursor: 'pointer' }}>
          <span className="feature-icon navy">
            <MessageCircle size={20} />
          </span>
          <div>
            <h3>Bantuan CS WhatsApp</h3>
            <p>Hubungi petugas kami untuk informasi & konfirmasi.</p>
          </div>
        </div>
      </section>

      <section className="info-strip" id="informasi">
        <div className="info-strip-main">
          <Sparkles size={22} className="info-strip-icon" />
          <div className="info-strip-text">
            <strong>Butuh informasi lengkap layanan?</strong>
            <span>Kunjungi website resmi Tirta Hita Buleleng untuk berita & panduan resmi.</span>
          </div>
        </div>
        <button className="text-btn" onClick={openPusatBantuan}>
          Pusat Bantuan <ExternalLink size={15} />
        </button>
      </section>

      <footer>
        <Logo compact />
        <span>© 2026 Perumda Air Minum Tirta Hita Buleleng. Melayani dengan Sepenuh Hati.</span>
        <div className="footer-links">
          <a href={HELP_CENTER_URL} target="_blank" rel="noopener noreferrer">Pusat Bantuan</a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Hubungi Kami</a>
        </div>
      </footer>
    </main>
  )
}

function Dashboard({ onBack, customerNumber }: { onBack: () => void; customerNumber: string }) {
  const [section, setSection] = useState('Beranda')
  const [notice, setNotice] = useState(false)
  const [tab, setTab] = useState('Semua')
  const [query, setQuery] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [guideModal, setGuideModal] = useState(false)
  const [chartRange, setChartRange] = useState<'3m' | '6m' | '12m'>('6m')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [liveCustomer, setLiveCustomer] = useState<any>(null)
  const [liveBills, setLiveBills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)
  const supabase = createClient()

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current))
    }, 3500)
  }

  useEffect(() => {
    if (liveCustomer?.id) {
      showToast(`Berhasil menemukan data tagihan pelanggan ID: ${customerNumber}!`, 'success')
    }
  }, [liveCustomer?.id])

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      setLoading(true)
      const { data: c } = await supabase
        .from('customers')
        .select('*')
        .eq('customer_number', customerNumber)
        .maybeSingle()

      if (c && isMounted) {
        setLiveCustomer({
          id: c.id,
          name: c.name,
          number: c.customer_number,
          address: c.address || 'Singaraja, Kabupaten Buleleng',
          tariff: c.tariff || 'R-1 / Rumah Tangga',
          phone: c.phone || '-',
          email: c.email || '-',
        })

        const { data: b } = await supabase
          .from('bills')
          .select('*')
          .eq('customer_id', c.id)
          .order('billing_month', { ascending: false })

        if (b && isMounted) {
          setLiveBills(
            b.map((x: any) => ({
              id: x.id,
              month: new Date(x.billing_month).toLocaleDateString('id-ID', {
                month: 'long',
                year: 'numeric',
              }),
              rawMonth: x.billing_month,
              amount: `Rp ${Number(x.amount).toLocaleString('id-ID')}`,
              numAmount: Number(x.amount),
              status: x.status === 'paid' ? 'Lunas' : x.status === 'overdue' ? 'Terlambat' : 'Belum Bayar',
              rawStatus: x.status,
              usage: `${x.usage_m3} m³`,
              due: new Date(x.due_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
              meterStart: `${Math.max(0, 1000 + Number(x.usage_m3) - 15)}`,
              meterEnd: `${1000 + Number(x.usage_m3)}`,
              adminFee: 'Rp 2.500',
              waterFee: `Rp ${Math.max(0, Number(x.amount) - 2500).toLocaleString('id-ID')}`,
            }))
          )
        } else if (isMounted) {
          setLiveBills([])
        }
      } else if (isMounted) {
        setLiveCustomer({
          name: 'Pelanggan',
          number: customerNumber,
          address: 'Singaraja, Buleleng',
        })
        setLiveBills([])
      }
      if (isMounted) setLoading(false)
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [customerNumber])

  // Compute unpaid bills strictly for Menu Tagihan
  const unpaidBills = useMemo(() => liveBills.filter(b => b.status === 'Belum Bayar'), [liveBills])
  const unpaidCount = unpaidBills.length

  // Filtered bills strictly for Menu Riwayat
  const historyBills = useMemo(() => {
    return liveBills.filter(b => (tab === 'Semua' || b.status === tab) && b.month.toLowerCase().includes(query.toLowerCase()))
  }, [liveBills, tab, query])

  // 1. Current Month Usage & Trend vs Previous Month
  const usageStats = useMemo(() => {
    if (!liveBills || liveBills.length === 0) {
      return {
        currentUsage: '0 m³',
        trendText: '0%',
        isDown: true,
        subText: 'Belum ada catatan pemakaian',
      }
    }
    const current = parseFloat(liveBills[0].usage) || 0
    const prev = liveBills[1] ? parseFloat(liveBills[1].usage) || 0 : 0

    if (prev > 0) {
      const diffPercent = Math.round(((current - prev) / prev) * 100)
      const isDown = diffPercent <= 0
      return {
        currentUsage: `${current} m³`,
        trendText: `${isDown ? '↓' : '↑'} ${Math.abs(diffPercent)}%`,
        isDown,
        subText: isDown ? 'Lebih hemat dari bulan lalu' : 'Meningkat dari bulan lalu',
      }
    }

    return {
      currentUsage: `${current} m³`,
      trendText: 'Normal',
      isDown: true,
      subText: 'Pemakaian bulan berjalan',
    }
  }, [liveBills])

  // 2. Highest Usage across customer history
  const highestUsage = useMemo(() => {
    if (!liveBills || liveBills.length === 0) {
      return {
        usage: '0 m³',
        month: 'Belum ada data',
      }
    }
    const maxBill = liveBills.reduce((max, curr) => {
      const currVal = parseFloat(curr.usage) || 0
      const maxVal = parseFloat(max.usage) || 0
      return currVal > maxVal ? curr : max
    }, liveBills[0])

    return {
      usage: `${parseFloat(maxBill.usage) || 0} m³`,
      month: maxBill.month,
    }
  }, [liveBills])

  // 3. Dynamic Chart Calculation based on customer history and chartRange
  const chartData = useMemo(() => {
    const limit = chartRange === '3m' ? 3 : chartRange === '6m' ? 6 : 12
    const sliceBills = [...liveBills].reverse().slice(-limit)
    const rangeText = chartRange === '3m' ? '3 Bulan' : chartRange === '6m' ? '6 Bulan' : '12 Bulan'

    if (sliceBills.length === 0) {
      return {
        labels: ['Belum ada data'],
        pathArea: 'M0 160 L600 160 L600 180 L0 180Z',
        pathLine: 'M0 160 L600 160',
        totalUsage: '0 m³',
        highest: '0 m³',
        highestMonth: 'Belum ada data',
        rangeText,
      }
    }

    const totalVal = sliceBills.reduce((sum, b) => sum + (parseFloat(b.usage) || 0), 0)

    const maxBillInPeriod = sliceBills.reduce((max, curr) => {
      const currVal = parseFloat(curr.usage) || 0
      const maxVal = parseFloat(max.usage) || 0
      return currVal > maxVal ? curr : max
    }, sliceBills[0])

    const labels = sliceBills.map((b) => {
      if (!b.rawMonth) return b.month
      const date = new Date(b.rawMonth)
      return date.toLocaleDateString('id-ID', { month: 'short' })
    })

    const values = sliceBills.map((b) => parseFloat(b.usage) || 0)
    const maxVal = Math.max(...values, 10)

    const width = 600
    const height = 110
    const topOffset = 30

    const points = values.map((val, idx) => {
      const x = values.length === 1 ? 300 : (idx / (values.length - 1)) * width
      const y = height + topOffset - (val / (maxVal * 1.25)) * height
      return { x, y }
    })

    let line = `M${points[0].x} ${points[0].y}`
    if (points.length === 1) {
      line = `M0 ${points[0].y} L600 ${points[0].y}`
    } else {
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const cx1 = prev.x + (curr.x - prev.x) / 2
        const cy1 = prev.y
        const cx2 = prev.x + (curr.x - prev.x) / 2
        const cy2 = curr.y
        line += ` C${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`
      }
    }

    const lastX = points.length === 1 ? 600 : points[points.length - 1].x
    const firstX = points.length === 1 ? 0 : points[0].x
    const area = `${line} L${lastX} 180 L${firstX} 180Z`

    return {
      labels,
      pathArea: area,
      pathLine: line,
      totalUsage: `${totalVal} m³`,
      highest: `${parseFloat(maxBillInPeriod.usage) || 0} m³`,
      highestMonth: maxBillInPeriod.month,
      rangeText,
    }
  }, [liveBills, chartRange])

  // 4. Status Sambungan berdasarkan kondisi tunggakan tagihan
  const connectionStatus = useMemo(() => {
    const unpaidList = liveBills.filter((b) => b.status === 'Belum Bayar' || b.status === 'Terlambat' || b.rawStatus !== 'paid')
    const count = unpaidList.length

    if (count === 0) {
      return {
        title: 'Aktif Normal',
        subtext: 'Tagihan pelanggan berjalan lancar',
        type: 'normal',
        icon: <CheckCircle2 className="success-icon" size={19} style={{ color: '#16a34a' }} />,
      }
    } else if (count === 1) {
      return {
        title: 'Aktif dengan Pengingat',
        subtext: 'Terdapat tagihan yang belum dibayar',
        type: 'reminder',
        icon: <AlertCircle className="warning-icon" size={19} style={{ color: '#eab308' }} />,
      }
    } else if (count === 2 || count === 3) {
      return {
        title: 'Aktif dengan Tunggakan',
        subtext: 'Mohon segera lakukan pembayaran',
        type: 'arrears',
        icon: <AlertTriangle className="alert-icon" size={19} style={{ color: '#f97316' }} />,
      }
    } else {
      return {
        title: 'Dalam Proses Pemutusan',
        subtext: 'Segera lakukan pembayaran',
        type: 'disconnection',
        icon: <AlertOctagon className="danger-icon" size={19} style={{ color: '#dc2626' }} />,
      }
    }
  }, [liveBills])

  const openPusatBantuan = () => {
    window.open(HELP_CENTER_URL, '_blank', 'noopener,noreferrer')
  }

  const openWhatsApp = () => {
    window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
  }

  const nav = [
    { label: 'Beranda', icon: LayoutDashboard },
    { label: 'Tagihan', icon: ReceiptText, badge: unpaidCount },
    { label: 'Riwayat', icon: CalendarDays },
  ]

  return (
    <main className="dashboard-shell">
      {/* Sidebar for Desktop */}
      <aside className="sidebar">
        <Logo />
        <div className="side-label">MENU UTAMA</div>
        {nav.map(n => (
          <button
            key={n.label}
            className={section === n.label ? 'active' : ''}
            onClick={() => setSection(n.label)}
          >
            <n.icon size={19} />
            <span>{n.label}</span>
            {n.label === 'Tagihan' && unpaidCount > 0 && <span className="nav-badge">{unpaidCount}</span>}
          </button>
        ))}

        <div className="side-bottom">
          <button onClick={openPusatBantuan}>
            <CircleHelp size={19} />
            <span>Pusat Bantuan</span>
          </button>
          <button onClick={openWhatsApp}>
            <MessageCircle size={19} />
            <span>Hubungi CS WhatsApp</span>
          </button>
          <button onClick={onBack} className="logout-btn">
            <LogOut size={19} />
            <span>Keluar Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        {/* Responsive Header */}
        <header className="dash-header">
          <button
            className="mobile-menu"
            onClick={() => setMobileMenu(true)}
            aria-label="Buka Menu Sidebar"
          >
            <Menu size={22} />
          </button>

          <div className="header-title-area">
            <p className="breadcrumb">
              Portal Pelanggan / <strong>{section}</strong>
            </p>
            <h1>{section}</h1>
          </div>

          <div className="header-actions">
            <button className="bell-btn" onClick={() => setNotice(!notice)} aria-label="Notifikasi">
              <Bell size={20} />
              {unpaidCount > 0 && <span className="bell-dot" />}
            </button>

            <div className="profile-chip">
              <div className="avatar">{getInitials(liveCustomer?.name)}</div>
              <div className="profile-mini">
                <strong>{liveCustomer?.name || 'Pelanggan'}</strong>
                <span>ID: {liveCustomer?.number || customerNumber}</span>
              </div>
            </div>

            {notice && (
              <div className="notice-pop">
                <div className="notice-head">
                  <strong>Notifikasi Tagihan</strong>
                  <button onClick={() => setNotice(false)}><X size={14} /></button>
                </div>
                {unpaidCount > 0 ? (
                  <p>Anda memiliki <strong>{unpaidCount} tagihan belum dibayar</strong>. Silakan bayar melalui tempat pembayaran resmi kami.</p>
                ) : (
                  <p>Semua tagihan air Anda bulan ini sudah lunas.</p>
                )}
                <small>Perumda Air Minum Tirta Hita Buleleng</small>
              </div>
            )}
          </div>
        </header>

        {/* SECTION: BERANDA */}
        {section === 'Beranda' && (
          <>
            <div className="welcome">
              <div>
                <span className="eyebrow">SELAMAT DATANG KEMBALI</span>
                <h2>Halo, {getMiddleName(liveCustomer?.name)} <span>👋</span></h2>
                <p>Berikut ringkasan akun dan tagihan air Anda.</p>
              </div>
              <div className="customer-chip">
                <span className="avatar small">{getInitials(liveCustomer?.name)}</span>
                <div>
                  <small>Nomor Pelanggan</small>
                  <strong>{liveCustomer?.number || customerNumber}</strong>
                </div>
              </div>
            </div>

            <section className="summary-grid">
              {unpaidBills.length > 0 ? (
                <div className="summary-card due">
                  <div className="summary-top">
                    <span>Tagihan Belum Dibayar</span>
                    <span className="status-pill warning">Belum Bayar</span>
                  </div>
                  <strong>{unpaidBills[0].amount}</strong>
                  <p>Jatuh tempo {unpaidBills[0].due}</p>
                  <button className="primary-btn light-btn" onClick={() => setSection('Tagihan')}>
                    Lihat Rincian & Cara Bayar <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="summary-card due paid-all">
                  <div className="summary-top">
                    <span>Status Tagihan</span>
                    <span className="status-pill success-pill">Semua Lunas</span>
                  </div>
                  <strong>Rp 0</strong>
                  <p>Tidak ada tunggakan pembayaran</p>
                  <button className="ghost-btn-light" onClick={() => setSection('Riwayat')}>
                    Lihat Riwayat <ChevronRight size={15} />
                  </button>
                </div>
              )}

              <div className="summary-card">
                <div className="summary-top">
                  <span>Pemakaian Air Bulan Ini</span>
                  <span className={`trend ${usageStats.isDown ? '' : 'up'}`}>{usageStats.trendText}</span>
                </div>
                <strong>{usageStats.currentUsage} <small>/ bulan</small></strong>
                <p>{usageStats.subText}</p>
                <div className="mini-bars">
                  <i /><i /><i /><i /><i /><i className="current" />
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-top">
                  <span>Status Sambungan</span>
                  {connectionStatus.icon}
                </div>
                <strong className={`service-status status-${connectionStatus.type}`}>
                  {connectionStatus.title}
                </strong>
                <p>{connectionStatus.subtext}</p>
                <button className="ghost-btn" onClick={openPusatBantuan}>
                  Pusat Bantuan <ExternalLink size={14} />
                </button>
              </div>
            </section>

            <div className="section-heading">
              <div>
                <h2>Ringkasan Pemakaian Air</h2>
                <p>Grafik konsumsi air {chartRange === '3m' ? '3 bulan' : chartRange === '6m' ? '6 bulan' : '12 bulan'} terakhir (m³)</p>
              </div>

              <div className="dropdown-container">
                <button
                  className="select-btn dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                >
                  <span>
                    {chartRange === '3m' ? '3 Bulan Terakhir' : chartRange === '6m' ? '6 Bulan Terakhir' : '12 Bulan Terakhir'}
                  </span>
                  <ChevronDown size={15} className={`chevron-icon ${dropdownOpen ? 'rotate' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button
                      className={chartRange === '3m' ? 'active' : ''}
                      onClick={() => {
                        setChartRange('3m')
                        setDropdownOpen(false)
                      }}
                    >
                      3 Bulan Terakhir
                    </button>
                    <button
                      className={chartRange === '6m' ? 'active' : ''}
                      onClick={() => {
                        setChartRange('6m')
                        setDropdownOpen(false)
                      }}
                    >
                      6 Bulan Terakhir
                    </button>
                    <button
                      className={chartRange === '12m' ? 'active' : ''}
                      onClick={() => {
                        setChartRange('12m')
                        setDropdownOpen(false)
                      }}
                    >
                      12 Bulan Terakhir (1 Tahun)
                    </button>
                  </div>
                )}
              </div>
            </div>

            <section className="usage-card">
              <div className="chart-area">
                <div className="chart-y">
                  <span>30 m³</span>
                  <span>20 m³</span>
                  <span>10 m³</span>
                  <span>0</span>
                </div>
                <div className="chart">
                  <div className="grid-line l1" />
                  <div className="grid-line l2" />
                  <div className="grid-line l3" />
                  <svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-label="Grafik pemakaian air">
                    <defs>
                      <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#087db5" stopOpacity=".35" />
                        <stop offset="100%" stopColor="#087db5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={chartData.pathArea} fill="url(#area)" />
                    <path d={chartData.pathLine} fill="none" stroke="#087db5" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                  <div className="chart-labels">
                    {chartData.labels.map(l => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="usage-callout">
                <div className="callout-stat-group">
                  <div className="callout-header">
                    <div className="callout-icon">
                      <Droplets size={18} />
                    </div>
                    <small>TOTAL PENGGUNAAN AIR</small>
                  </div>
                  <strong className="total-val">{chartData.totalUsage}</strong>
                  <span className="stat-sub">Periode {chartData.rangeText} Terakhir</span>
                </div>

                <div className="callout-rule" />

                <div className="callout-stat-group">
                  <small>PEMAKAIAN TERTINGGI</small>
                  <strong className="highest-val">{chartData.highest}</strong>
                  <span className="stat-sub">{chartData.highestMonth}</span>
                </div>

                <div className="callout-rule" />
                <p className="callout-tip">
                  Tips: Cek pipa & meteran secara berkala untuk mencegah kebocoran.
                </p>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="recent-card">
                <div className="section-heading compact">
                  <div>
                    <h2>Tagihan Terbaru</h2>
                    <p>Status tagihan bulanan</p>
                  </div>
                  <button className="text-btn" onClick={() => setSection('Tagihan')}>
                    Lihat Semua <ArrowRight size={15} />
                  </button>
                </div>
                {liveBills.slice(0, 3).map(b => (
                  <div className="bill-row" key={b.id}>
                    <div className="bill-icon">
                      <FileText size={18} />
                    </div>
                    <div>
                      <strong>{b.month}</strong>
                      <span>{b.usage} pemakaian air</span>
                    </div>
                    <div className="bill-amount">
                      <strong>{b.amount}</strong>
                      <span className={'status-text ' + (b.status === 'Lunas' ? 'paid' : '')}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="help-card">
                <div className="help-art">
                  <MessageCircle size={44} />
                </div>
                <h2>Pertanyaan Pembayaran?</h2>
                <p>Layanan Pelanggan Perumda Air Minum Tirta Hita Buleleng siap membantu via WhatsApp.</p>
                <button className="outline-btn primary-outline" onClick={openWhatsApp}>
                  <MessageCircle size={16} /> Hubungi CS WhatsApp
                </button>
              </div>
            </section>
          </>
        )}

        {/* SECTION: TAGIHAN (DEDICATED UNPAID BILLS & PAYMENT LOCATIONS INFO) */}
        {section === 'Tagihan' && (
          <section className="page-panel tagihan-custom-panel">
            <div className="tagihan-header-banner">
              <div className="tagihan-header-left">
                <span className="eyebrow-tagihan">INFORMASI TAGIHAN BULANAN</span>
                <h2>Tagihan Belum Dibayar</h2>
                <p>Menampilkan rincian tagihan air berjalan beserta informasi tempat pembayaran resmi.</p>
              </div>
              {unpaidBills.length > 0 && (
                <div className="tagihan-summary-pill">
                  <Clock size={18} />
                  <div>
                    <small>Total Menunggu Pembayaran</small>
                    <strong>Rp {unpaidBills.reduce((acc, curr) => acc + curr.numAmount, 0).toLocaleString('id-ID')}</strong>
                  </div>
                </div>
              )}
            </div>

            {unpaidBills.length > 0 ? (
              <div className="unpaid-bills-list">
                {unpaidBills.map(b => (
                  <div key={b.id} className="unpaid-card-item">
                    <div className="unpaid-card-top">
                      <div className="unpaid-period-info">
                        <span className="period-badge"><CalendarDays size={14} /> Periode Tagihan</span>
                        <h3>{b.month}</h3>
                      </div>
                      <span className="due-alert-pill">
                        <AlertCircle size={14} /> Jatuh Tempo: {b.due}
                      </span>
                    </div>

                    <div className="unpaid-card-details">
                      <div className="detail-row">
                        <span className="detail-label">Nomor Pelanggan</span>
                        <span className="detail-val"><strong>{liveCustomer.number}</strong> ({liveCustomer.name})</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Catatan Stand Meter</span>
                        <span className="detail-val">{b.meterStart} m³ - {b.meterEnd} m³ ({b.usage})</span>
                      </div>

                      <div className="cost-breakdown-box">
                        <div className="cost-line">
                          <span>Pemakaian Air ({b.usage})</span>
                          <span>{b.waterFee}</span>
                        </div>
                        <div className="cost-line">
                          <span>Biaya Administrasi & Pemeliharaan</span>
                          <span>{b.adminFee}</span>
                        </div>
                        <div className="cost-line total">
                          <strong>Total Tagihan</strong>
                          <strong className="total-amount-highlight">{b.amount}</strong>
                        </div>
                      </div>

                      {/* Official Payment Channels Information Box */}
                      <div className="payment-channels-info-box">
                        <div className="info-box-header">
                          <Building2 size={18} />
                          <strong>Tempat & Kanal Pembayaran Resmi</strong>
                        </div>
                        <p className="payment-notice-text">
                          <Info size={14} className="notice-icon" /> Pembayaran tidak dilakukan langsung di website ini. Silakan tunjukkan atau sebutkan <strong>Nomor Pelanggan: {liveCustomer.number}</strong> pada kanal pembayaran resmi berikut:
                        </p>

                        <div className="channels-grid">
                          <div className="channel-chip">
                            <MapPin size={16} />
                            <div>
                              <strong>Loket kantor Perumda Air Minum terdekat</strong>
                              <small>Kantor pusat & kantor cabang terdekat di wilayah Anda</small>
                            </div>
                          </div>
                          <div className="channel-chip">
                            <Building2 size={16} />
                            <div>
                              <strong>Mobile & Internet Banking</strong>
                              <small>Bank BPD Bali, BCA (myBCA), BNI, BRI, BSI, Bank Jago, blu by BCA</small>
                            </div>
                          </div>
                          <div className="channel-chip">
                            <Store size={16} />
                            <div>
                              <strong>Minimarket Partner</strong>
                              <small>Indomaret & Alfamart terdekat</small>
                            </div>
                          </div>
                          <div className="channel-chip">
                            <Smartphone size={16} />
                            <div>
                              <strong>E-Wallet & E-Commerce</strong>
                              <small>Tokopedia, Shopee, GoPay, Dana</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="unpaid-card-actions">
                      <button className="primary-btn pay-action-btn" onClick={() => setGuideModal(true)}>
                        <HelpCircle size={18} /> Petunjuk Pembayaran Lengkap
                      </button>
                      <button className="outline-btn help-action-btn" onClick={openWhatsApp}>
                        <MessageCircle size={16} /> Hubungi CS WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Beautiful Empty State when all bills are paid */
              <div className="all-paid-state">
                <div className="paid-success-circle">
                  <CheckCircle2 size={56} />
                </div>
                <h3>Semua Tagihan Sudah Lunas! 🎉</h3>
                <p>
                  Terima kasih! Tidak ada tagihan tertunggak untuk nomor pelanggan <strong>{liveCustomer.number}</strong>.
                </p>
                <div className="paid-state-buttons">
                  <button className="outline-btn" onClick={() => setSection('Riwayat')}>
                    <CalendarDays size={16} /> Lihat Riwayat Pembayaran
                  </button>
                  <button className="text-btn" onClick={openPusatBantuan}>
                    Kunjungi Pusat Bantuan <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* SECTION: RIWAYAT */}
        {section === 'Riwayat' && (
          <section className="page-panel">
            <div className="section-heading">
              <div>
                <h2>Riwayat Tagihan & Pembayaran</h2>
                <p>Arsip lengkap tagihan bulanan dan catatan pembayaran Anda.</p>
              </div>
              <div className="search-box">
                <Search size={16} />
                <input
                  placeholder="Cari bulan..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="tabs">
              {['Semua', 'Belum Bayar', 'Lunas'].map(t => (
                <button
                  className={tab === t ? 'selected' : ''}
                  key={t}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </div>

            {historyBills.length > 0 ? (
              historyBills.map(b => (
                <div className="bill-row large" key={b.id}>
                  <div className="bill-icon">
                    <FileText size={18} />
                  </div>
                  <div className="bill-main-info">
                    <strong>{b.month}</strong>
                    <span>Jatuh tempo {b.due} · Pemakaian {b.usage}</span>
                  </div>
                  <div className="bill-amount">
                    <strong>{b.amount}</strong>
                    <span className={'status-text ' + (b.status === 'Lunas' ? 'paid' : '')}>
                      {b.status}
                    </span>
                  </div>
                  {b.status === 'Belum Bayar' && (
                    <button className="outline-btn mini-pay" onClick={() => { setSection('Tagihan'); }}>
                      Info Bayar
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="icon-box"><FileText size={22} /></div>
                <h3>Tidak ada data riwayat</h3>
                <p>Tidak ada transaksi yang cocok dengan pencarian Anda.</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileMenu && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenu(false)}>
          <div className="mobile-drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <Logo />
              <button className="close-btn" onClick={() => setMobileMenu(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="drawer-user-card">
              <span className="avatar">{getInitials(liveCustomer?.name)}</span>
              <div>
                <strong>{liveCustomer?.name || 'Pelanggan'}</strong>
                <small>No. Pelanggan: {liveCustomer?.number || customerNumber}</small>
              </div>
            </div>

            <nav className="drawer-nav">
              {nav.map(n => (
                <button
                  key={n.label}
                  className={section === n.label ? 'active' : ''}
                  onClick={() => {
                    setSection(n.label)
                    setMobileMenu(false)
                  }}
                >
                  <n.icon size={19} />
                  <span>{n.label}</span>
                  {n.label === 'Tagihan' && unpaidCount > 0 && (
                    <span className="nav-badge">{unpaidCount}</span>
                  )}
                </button>
              ))}
            </nav>

            <div className="drawer-divider" />

            <div className="drawer-actions">
              <button onClick={openPusatBantuan} className="drawer-link-btn">
                <ExternalLink size={18} />
                <span>Pusat Bantuan (Website)</span>
              </button>
              <button onClick={openWhatsApp} className="drawer-link-btn wa-link">
                <MessageCircle size={18} />
                <span>Hubungi CS WhatsApp</span>
              </button>
              <button onClick={onBack} className="drawer-link-btn logout">
                <LogOut size={18} />
                <span>Keluar Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT LOCATIONS & GUIDE MODAL */}
      {guideModal && (
        <div className="modal-backdrop" onClick={() => setGuideModal(false)}>
          <div className="payment-modal guide-modal no-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="eyebrow">PANDUAN RESMI</span>
                <h3>Tempat & Cara Pembayaran</h3>
              </div>
              <button className="modal-close" onClick={() => setGuideModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="guide-modal-notice">
              <Info size={18} />
              <p>
                Website ini berfungsi untuk <strong>pengecekan tagihan resmi</strong>. Pembayaran tagihan dapat dilakukan melalui jaringan mitra resmi Perumda Air Minum Tirta Hita Buleleng.
              </p>
            </div>

            <div className="guide-steps-list no-scrollbar">
              <div className="guide-step-item">
                <div className="step-num">1</div>
                <div>
                  <strong>Loket kantor Perumda Air Minum terdekat</strong>
                  <p>Kunjungi kantor pusat / cabang terdekat dan tunjukkan nomor pelanggan <strong>{liveCustomer?.number || customerNumber}</strong> ke kasir.</p>
                </div>
              </div>
              <div className="guide-step-item">
                <div className="step-num">2</div>
                <div>
                  <strong>Mobile / Internet Banking</strong>
                  <p>Bank BPD Bali, BCA (termasuk myBCA), BNI, BRI, BSI, Bank Jago, dan blu by BCA. Pilih menu Pembayaran PDAM → Tirta Hita Buleleng → Masukkan ID Pelanggan <strong>{liveCustomer?.number || customerNumber}</strong>.</p>
                </div>
              </div>
              <div className="guide-step-item">
                <div className="step-num">3</div>
                <div>
                  <strong>Indomaret / Alfamart</strong>
                  <p>Sampaikan ke kasir pembayaran tagihan air Perumda Buleleng dengan menyertakan ID Pelanggan Anda.</p>
                </div>
              </div>
              <div className="guide-step-item">
                <div className="step-num">4</div>
                <div>
                  <strong>Tokopedia, Shopee, GoPay, Dana</strong>
                  <p>Buka menu Tagihan Air/PDAM → Pilih Wilayah Kabupaten Buleleng → Masukkan ID Pelanggan.</p>
                </div>
              </div>
            </div>

            <div className="modal-pay-footer">
              <button className="primary-btn full" onClick={openWhatsApp}>
                <MessageCircle size={18} /> Konfirmasi Pembayaran via WhatsApp
              </button>
              <button className="ghost-btn full" onClick={openPusatBantuan} style={{ marginTop: '8px' }}>
                Kunjungi Website Pusat Bantuan <ExternalLink size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-nav">
        {nav.map(n => (
          <button
            className={section === n.label ? 'active' : ''}
            key={n.label}
            onClick={() => setSection(n.label)}
          >
            <div className="mobile-nav-icon-wrap">
              <n.icon size={20} />
              {n.label === 'Tagihan' && unpaidCount > 0 && (
                <span className="mobile-nav-badge">{unpaidCount}</span>
              )}
            </div>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type === 'error' ? 'toast-error' : ''}`}>
            {toast.type === 'error' ? (
              <AlertCircle size={20} className="toast-icon" />
            ) : (
              <CheckCircle2 size={20} className="toast-icon" />
            )}
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)} aria-label="Tutup Notifikasi">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default function Page() {
  const [portal, setPortal] = useState(false)
  const [customerNumber, setCustomerNumber] = useState('')

  return portal ? (
    <Dashboard customerNumber={customerNumber} onBack={() => setPortal(false)} />
  ) : (
    <Landing
      onLookup={number => {
        setCustomerNumber(number)
        setPortal(true)
      }}
    />
  )
}

