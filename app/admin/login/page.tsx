'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message === 'Invalid login credentials' ? 'Email atau kata sandi tidak valid.' : authError.message)
      setLoading(false)
      return
    }
    sessionStorage.setItem('admin_login_toast', 'true')
    router.push('/admin')
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-backdrop" />
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-logo-box">
            <img
              src="/logo.png"
              alt="Perumda Air Minum Tirta Hita Buleleng"
              className="admin-logo-img"
            />
          </div>

          <div className="admin-login-header">
            <span className="eyebrow-admin">
              <ShieldCheck size={14} /> AREA PETUGAS RESMI
            </span>
            <h1>Masuk Administrator</h1>
            <p>Portal pengelola data pelanggan & informasi tagihan Perumda Air Minum Tirta Hita Buleleng.</p>
          </div>

          <form onSubmit={submit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="admin-email">Email Administrator</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  placeholder="contoh: admin@thb.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Kata Sandi</label>
              <div className="input-with-icon">
                <LockKeyhole size={18} className="input-icon" />
                <input
                  id="admin-password"
                  type={show ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi akun"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-show-btn"
                  onClick={() => setShow(!show)}
                  aria-label="Tampilkan kata sandi"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="error-text admin-error">{error}</p>}

            <button className="primary-btn full admin-submit-btn" disabled={loading}>
              {loading ? 'Memproses Masuk...' : 'Masuk ke Dashboard Admin'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <Link href="/" className="back-link">
            <ArrowLeft size={16} /> Kembali ke Portal Pelanggan
          </Link>
        </div>

        <p className="admin-login-footer-text">
          © 2026 Perumda Air Minum Tirta Hita Buleleng. Hak Cipta Dilindungi.
        </p>
      </div>
    </main>
  )
}

