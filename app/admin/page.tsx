'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Droplets,
  History,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  WalletCards,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Customer = {
  id: string
  customer_number: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  tariff: string | null
}

type Bill = {
  id: string
  customer_id: string
  billing_month: string
  due_date: string
  amount: number
  usage_m3: number
  status: 'unpaid' | 'paid' | 'overdue'
  customers?: {
    name: string
    customer_number: string
  }
}

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [session, setSession] = useState<any>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [tab, setTab] = useState<'customers' | 'bills'>('customers')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState<'customer' | 'bill' | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [error, setError] = useState('')
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null)
  const [adminMobileMenu, setAdminMobileMenu] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current))
    }, 3500)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setAdminMobileMenu(false)
    router.push('/admin/login')
  }

  const load = async () => {
    const { data: c } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    const { data: b } = await supabase
      .from('bills')
      .select('*, customers(name, customer_number)')
      .order('billing_month', { ascending: false })

    setCustomers(c || [])
    setBills(b || [])
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    load()
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_login_toast')) {
      showToast('Berhasil masuk sebagai Administrator!', 'success')
      sessionStorage.removeItem('admin_login_toast')
    }
  }, [])

  const filteredCustomers = useMemo(
    () =>
      customers.filter((c) =>
        `${c.name} ${c.customer_number}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [customers, query]
  )

  const filteredBills = useMemo(
    () =>
      bills.filter((b) =>
        `${b.customers?.name} ${b.customers?.customer_number}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [bills, query]
  )

  const open = (type: 'customer' | 'bill', item?: any) => {
    setModal(type)
    setEditing(item)
    setForm(
      item
        ? { ...item }
        : type === 'customer'
        ? { tariff: 'Rumah Tangga' }
        : { status: 'unpaid', amount: 0, usage_m3: 0 }
    )
    setError('')
  }

  const save = async () => {
    setError('')
    let result
    const isEdit = !!editing
    const currentModal = modal

    if (modal === 'customer') {
      const payload = {
        customer_number: form.customer_number,
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
        tariff: form.tariff || 'Rumah Tangga',
      }
      result = editing
        ? await supabase.from('customers').update(payload).eq('id', editing.id)
        : await supabase.from('customers').insert(payload)
    } else {
      const payload = {
        customer_id: form.customer_id,
        billing_month: form.billing_month,
        due_date: form.due_date,
        amount: Number(form.amount),
        usage_m3: Number(form.usage_m3),
        status: form.status,
      }
      result = editing
        ? await supabase.from('bills').update(payload).eq('id', editing.id)
        : await supabase.from('bills').insert(payload)
    }

    if (result.error) {
      setError('Data gagal disimpan. Periksa isian dan hak akses admin.')
      showToast('Gagal menyimpan data. Periksa isian Anda.', 'error')
      return
    }

    setModal(null)
    load()

    if (currentModal === 'customer') {
      showToast(
        isEdit ? 'Berhasil memperbarui data pelanggan!' : 'Berhasil menambahkan pelanggan baru!',
        'success'
      )
    } else {
      showToast(
        isEdit ? 'Berhasil memperbarui data tagihan!' : 'Berhasil menambahkan tagihan baru!',
        'success'
      )
    }
  }

  const remove = async (type: string, id: string) => {
    if (!confirm('Hapus data ini?')) return
    const { error } = await supabase.from(type).delete().eq('id', id)
    if (error) {
      showToast('Gagal menghapus data.', 'error')
      return
    }
    showToast(`Berhasil menghapus data ${type === 'customers' ? 'pelanggan' : 'tagihan'}!`, 'success')
    load()
  }

  if (!session) {
    return (
      <main className="admin-login">
        <div className="admin-login-card">
          <div className="admin-logo">
            <img
              src="/logo.png"
              alt="Logo Tirta Hita Buleleng"
              style={{ height: '42px', objectFit: 'contain' }}
            />
          </div>
          <span className="eyebrow">AREA PETUGAS</span>
          <h1>Masuk ke Admin</h1>
          <p>Kelola data pelanggan dan tagihan Perumda Air Minum secara terpusat.</p>
          <Link href="/admin/login" className="primary-btn full">
            Buka Halaman Login
          </Link>
          <Link href="/" className="back-link">
            <ArrowLeft size={15} /> Kembali ke portal pelanggan
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <strong>Perumda Air Minum</strong>
            <small>Tirta Hita Buleleng</small>
          </div>
        </div>

        <div className="admin-side-label">PENGELOLAAN</div>

        <button
          className={tab === 'customers' ? 'active' : ''}
          onClick={() => setTab('customers')}
        >
          <Users size={18} /> Pelanggan <b>{customers.length}</b>
        </button>

        <button
          className={tab === 'bills' ? 'active' : ''}
          onClick={() => setTab('bills')}
        >
          <WalletCards size={18} /> Tagihan{' '}
          <b>{bills.filter((b) => b.status !== 'paid').length}</b>
        </button>

        <div className="admin-side-bottom">
          <Link href="/">
            <ArrowLeft size={17} /> Portal pelanggan
          </Link>
          <button onClick={handleLogout}>
            <LogOut size={17} /> Keluar
          </button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="mobile-menu"
              onClick={() => setAdminMobileMenu(true)}
              aria-label="Buka Menu Sidebar"
            >
              <Menu size={22} />
            </button>
            <div>
              <span className="eyebrow">PANEL KONTROL</span>
              <h1>{tab === 'customers' ? 'Pelanggan' : 'Tagihan'}</h1>
            </div>
          </div>
          <div className="admin-user">
            <div className="avatar">AD</div>
            <div>
              <strong>{session.user.email}</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        <div className="admin-body">
          <div className="admin-stats">
            <div>
              <Users size={19} />
              <span>
                Total pelanggan<strong>{customers.length}</strong>
              </span>
            </div>
            <div>
              <WalletCards size={19} />
              <span>
                Total tagihan<strong>{bills.length}</strong>
              </span>
            </div>
            <div>
              <CheckCircle2 size={19} />
              <span>
                Tagihan lunas
                <strong>
                  {bills.filter((b) => b.status === 'paid').length}
                </strong>
              </span>
            </div>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />
              <input
                placeholder="Cari nama atau nomor..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className="primary-btn"
              onClick={() => open(tab === 'customers' ? 'customer' : 'bill')}
            >
              <Plus size={16} /> Tambah{' '}
              {tab === 'customers' ? 'Pelanggan' : 'Tagihan'}
            </button>
          </div>

          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  {tab === 'customers' ? (
                    <>
                      <th>Pelanggan</th>
                      <th>Kontak</th>
                      <th>Tarif</th>
                      <th>Aksi</th>
                    </>
                  ) : (
                    <>
                      <th>Pelanggan</th>
                      <th>Periode</th>
                      <th>Nominal</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {tab === 'customers'
                  ? filteredCustomers.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <strong>{c.name}</strong>
                          <small>{c.customer_number}</small>
                        </td>
                        <td>
                          {c.phone || '-'}
                          <small>{c.email || '-'}</small>
                        </td>
                        <td>{c.tariff || 'Rumah Tangga'}</td>
                        <td>
                          <button
                            className="icon-action history"
                            title="Lihat Riwayat Transaksi"
                            onClick={() => setHistoryCustomer(c)}
                          >
                            <History size={15} />
                          </button>
                          <button
                            className="icon-action"
                            title="Edit Data"
                            onClick={() => open('customer', c)}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="icon-action danger"
                            title="Hapus Data"
                            onClick={() => remove('customers', c.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))
                  : filteredBills.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.customers?.name || '-'}</strong>
                          <small>{b.customers?.customer_number}</small>
                        </td>
                        <td>
                          {new Date(b.billing_month).toLocaleDateString(
                            'id-ID',
                            { month: 'long', year: 'numeric' }
                          )}
                        </td>
                        <td>
                          Rp {Number(b.amount).toLocaleString('id-ID')}
                        </td>
                        <td>
                          <span className={`table-status ${b.status}`}>
                            {b.status === 'paid'
                              ? 'Lunas'
                              : b.status === 'overdue'
                              ? 'Terlambat'
                              : 'Belum bayar'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="icon-action"
                            onClick={() => open('bill', b)}
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="icon-action danger"
                            onClick={() => remove('bills', b.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {modal && (
        <div className="modal-backdrop">
          <div className="admin-modal">
            <button className="modal-close" onClick={() => setModal(null)}>
              <X size={18} />
            </button>
            <span className="eyebrow">FORM DATA</span>
            <h2>
              {editing ? 'Edit' : 'Tambah'}{' '}
              {modal === 'customer' ? 'Pelanggan' : 'Tagihan'}
            </h2>
            <div className="modal-form">
              {modal === 'customer' ? (
                <>
                  <div className="form-group">
                    <label htmlFor="modal-cust-num">Nomor Pelanggan (8 Digit)</label>
                    <input
                      id="modal-cust-num"
                      inputMode="numeric"
                      maxLength={8}
                      placeholder="Contoh: 01033080"
                      value={form.customer_number || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          customer_number: e.target.value.replace(/\D/g, ''),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-cust-name">Nama Lengkap Pelanggan</label>
                    <input
                      id="modal-cust-name"
                      placeholder="Contoh: I Wayan Sudarma"
                      value={form.name || ''}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-cust-phone">Nomor Telepon / WhatsApp</label>
                    <input
                      id="modal-cust-phone"
                      inputMode="numeric"
                      placeholder="Contoh: 081234567890"
                      value={form.phone || ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value.replace(/\D/g, ''),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-cust-email">Alamat Email</label>
                    <input
                      id="modal-cust-email"
                      type="email"
                      placeholder="Contoh: wayan.sudarma@example.com"
                      value={form.email || ''}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-cust-address">Alamat Lengkap</label>
                    <input
                      id="modal-cust-address"
                      placeholder="Contoh: Jl. Gajah Mada No. 15, Singaraja"
                      value={form.address || ''}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-cust-tariff">Golongan Tarif</label>
                    <select
                      id="modal-cust-tariff"
                      value={form.tariff || 'R-1 / Rumah Tangga'}
                      onChange={(e) =>
                        setForm({ ...form, tariff: e.target.value })
                      }
                    >
                      <option value="R-1 / Rumah Tangga">R-1 / Rumah Tangga</option>
                      <option value="R-2 / Rumah Tangga Mampu">R-2 / Rumah Tangga Mampu</option>
                      <option value="B-1 / Niaga Kecil">B-1 / Niaga Kecil</option>
                      <option value="B-2 / Niaga Besar">B-2 / Niaga Besar</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="modal-bill-cust">Pilih Pelanggan</label>
                    <select
                      id="modal-bill-cust"
                      value={form.customer_id || ''}
                      onChange={(e) =>
                        setForm({ ...form, customer_id: e.target.value })
                      }
                    >
                      <option value="">-- Pilih Pelanggan --</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.customer_number})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-bill-month">Bulan Periode Tagihan</label>
                    <input
                      id="modal-bill-month"
                      type="date"
                      value={form.billing_month || ''}
                      onChange={(e) =>
                        setForm({ ...form, billing_month: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-bill-due">Batas Tanggal Jatuh Tempo</label>
                    <input
                      id="modal-bill-due"
                      type="date"
                      value={form.due_date || ''}
                      onChange={(e) =>
                        setForm({ ...form, due_date: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-bill-amount">Nominal Tagihan Air (Rp)</label>
                    <input
                      id="modal-bill-amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="Contoh: 156500"
                      value={form.amount ?? ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          amount: e.target.value.replace(/\D/g, ''),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-bill-usage">Volume Pemakaian (m³)</label>
                    <input
                      id="modal-bill-usage"
                      type="text"
                      inputMode="numeric"
                      placeholder="Contoh: 18"
                      value={form.usage_m3 ?? ''}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          usage_m3: e.target.value.replace(/\D/g, ''),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-bill-status">Status Pembayaran</label>
                    <select
                      id="modal-bill-status"
                      value={form.status || 'unpaid'}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="unpaid">Belum bayar</option>
                      <option value="paid">Lunas</option>
                      <option value="overdue">Terlambat</option>
                    </select>
                  </div>
                </>
              )}
              {error && <p className="error-text">{error}</p>}
              <button className="primary-btn full" onClick={save}>
                Simpan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {historyCustomer && (
        <div className="modal-backdrop">
          <div className="admin-modal history-modal">
            <button className="modal-close" onClick={() => setHistoryCustomer(null)}>
              <X size={18} />
            </button>
            <span className="eyebrow">RIWAYAT TRANSAKSI</span>
            <h2>Riwayat Transaksi Pelanggan</h2>

            <div className="history-customer-card">
              <div className="history-cust-main">
                <h3>{historyCustomer.name}</h3>
                <span className="cust-badge">ID: {historyCustomer.customer_number}</span>
              </div>
              <div className="history-cust-details">
                <div>
                  <small>Golongan Tarif</small>
                  <strong>{historyCustomer.tariff || 'Rumah Tangga'}</strong>
                </div>
                <div>
                  <small>Kontak / WA</small>
                  <strong>{historyCustomer.phone || '-'}</strong>
                </div>
                <div>
                  <small>Email</small>
                  <strong>{historyCustomer.email || '-'}</strong>
                </div>
              </div>
            </div>

            <div className="history-table-wrap">
              {bills.filter((b) => b.customer_id === historyCustomer.id).length === 0 ? (
                <div className="history-empty">
                  <p>Belum ada riwayat transaksi atau tagihan untuk pelanggan ini.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Periode</th>
                      <th>Pemakaian</th>
                      <th>Nominal Tagihan</th>
                      <th>Jatuh Tempo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills
                      .filter((b) => b.customer_id === historyCustomer.id)
                      .map((b) => (
                        <tr key={b.id}>
                          <td>
                            <strong>
                              {new Date(b.billing_month).toLocaleDateString('id-ID', {
                                month: 'long',
                                year: 'numeric',
                              })}
                            </strong>
                          </td>
                          <td>{b.usage_m3} m³</td>
                          <td>Rp {Number(b.amount).toLocaleString('id-ID')}</td>
                          <td>
                            {new Date(b.due_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td>
                            <span className={`table-status ${b.status}`}>
                              {b.status === 'paid'
                                ? 'Lunas'
                                : b.status === 'overdue'
                                ? 'Terlambat'
                                : 'Belum bayar'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="history-modal-footer">
              <button
                className="primary-btn"
                onClick={() => {
                  const cust = historyCustomer
                  setHistoryCustomer(null)
                  open('bill', {
                    customer_id: cust.id,
                    status: 'unpaid',
                    amount: '',
                    usage_m3: '',
                    billing_month: '',
                    due_date: '',
                  })
                }}
              >
                <Plus size={16} /> Tambah Tagihan
              </button>
              <button className="secondary-btn" onClick={() => setHistoryCustomer(null)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MOBILE DRAWER FOR ADMIN */}
      {adminMobileMenu && (
        <div className="mobile-drawer-backdrop" onClick={() => setAdminMobileMenu(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="admin-brand">
                <img
                  src="/logo.png"
                  alt="Logo"
                  style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
                />
                <div>
                  <strong>Perumda Air Minum</strong>
                  <small>Tirta Hita Buleleng</small>
                </div>
              </div>
              <button className="close-btn" onClick={() => setAdminMobileMenu(false)} aria-label="Tutup Menu">
                <X size={20} />
              </button>
            </div>

            <div className="drawer-user-card">
              <div className="avatar">AD</div>
              <div>
                <strong>{session?.user?.email || 'Admin'}</strong>
                <small>Administrator</small>
              </div>
            </div>

            <nav className="drawer-nav">
              <button
                className={tab === 'customers' ? 'active' : ''}
                onClick={() => {
                  setTab('customers')
                  setAdminMobileMenu(false)
                }}
              >
                <Users size={19} />
                <span>Data Pelanggan</span>
                <span className="nav-badge">{customers.length}</span>
              </button>
              <button
                className={tab === 'bills' ? 'active' : ''}
                onClick={() => {
                  setTab('bills')
                  setAdminMobileMenu(false)
                }}
              >
                <WalletCards size={19} />
                <span>Data Tagihan</span>
                <span className="nav-badge">{bills.filter((b) => b.status !== 'paid').length}</span>
              </button>
            </nav>

            <div className="drawer-divider" />

            <div className="drawer-actions">
              <Link href="/" className="drawer-link-btn" onClick={() => setAdminMobileMenu(false)}>
                <ArrowLeft size={18} />
                <span>Portal Pelanggan</span>
              </Link>
              <button onClick={handleLogout} className="drawer-link-btn logout">
                <LogOut size={18} />
                <span>Keluar Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
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
