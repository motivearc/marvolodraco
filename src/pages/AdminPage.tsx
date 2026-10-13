import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CircleHelp,
  Download,
  ImageIcon,
  LogOut,
  Package,
  RotateCcw,
  Ruler,
  Star,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useContent } from '../context/ContentContext'
import { AdminFaqs } from '../components/admin/AdminFaqs'
import { AdminImages } from '../components/admin/AdminImages'
import { AdminProducts } from '../components/admin/AdminProducts'
import { AdminReviews } from '../components/admin/AdminReviews'
import { AdminSizeGuide } from '../components/admin/AdminSizeGuide'
import { brand } from '../data/brand'
import { usePWAInstall } from '../hooks/usePWAInstall'
import { fetchAllReviews } from '../services/reviewService'

type AdminTab = 'products' | 'images' | 'size-guide' | 'faqs' | 'reviews'

export function AdminPage() {
  const { configured, loading: authLoading, user, signIn, signOut } = useAuth()
  const {
    resetContent,
    products,
    loading: contentLoading,
    saving,
    error,
    clearError,
  } = useContent()
  const { showInstallAction, requestInstall } = usePWAInstall()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)
  const [tab, setTab] = useState<AdminTab>('products')
  const [pendingReviews, setPendingReviews] = useState(0)
  const [reviewTick, setReviewTick] = useState(0)

  useEffect(() => {
    document.title = `Admin · ${brand.name}`
    return () => {
      document.title = `${brand.name} | ${brand.tagline}`
    }
  }, [])

  useEffect(() => {
    if (!user) return
    let mounted = true
    void fetchAllReviews()
      .then((rows) => {
        if (!mounted) return
        setPendingReviews(rows.filter((review) => review.status === 'pending').length)
      })
      .catch(() => {
        if (mounted) setPendingReviews(0)
      })
    return () => {
      mounted = false
    }
  }, [user, reviewTick])

  async function handleLogin(event: FormEvent) {
    event.preventDefault()
    setLoginError(null)
    setSigningIn(true)
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setSigningIn(false)
    }
  }

  if (!configured) {
    return (
      <div className="flex min-h-dynamic items-center justify-center bg-mist px-5 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="w-full max-w-lg space-y-4 border border-line bg-cream p-8">
          <p className="text-xs tracking-[0.2em] text-stone uppercase">
            {brand.name}
          </p>
          <h1 className="font-display text-3xl font-medium text-ink">
            Connect Supabase
          </h1>
          <p className="text-sm leading-relaxed text-ink-soft/80">
            Add your project credentials to a <code>.env</code> file, run the
            SQL in <code>supabase/schema.sql</code> and{' '}
            <code>supabase/seed.sql</code>, then create an admin user in the
            Supabase Auth dashboard.
          </p>
          <pre className="overflow-x-auto bg-mist p-4 text-xs text-ink-soft">
            {`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
          <Link
            to="/"
            className="inline-flex text-xs tracking-[0.12em] text-stone uppercase hover:text-ink"
          >
            Back to site
          </Link>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="flex min-h-dynamic items-center justify-center bg-mist px-5 text-sm text-stone">
        Checking session…
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-dynamic items-center justify-center bg-mist px-5 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-5 border border-line bg-cream p-8"
        >
          <div>
            <p className="text-xs tracking-[0.2em] text-stone uppercase">
              {brand.name}
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium text-ink">
              Admin access
            </h1>
            <p className="mt-2 text-sm text-ink-soft/80">
              Sign in with your Supabase Auth email and password.
            </p>
          </div>
          <label className="block space-y-2">
            <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoFocus
              className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border border-line bg-cream px-3 py-2.5 text-base outline-none focus:border-ink"
            />
          </label>
          {loginError ? <p className="text-sm text-red-700">{loginError}</p> : null}
          <button
            type="submit"
            disabled={signingIn}
            className="w-full bg-ink px-4 py-3 text-xs font-semibold tracking-[0.16em] text-cream uppercase transition hover:bg-ink-soft disabled:opacity-60"
          >
            {signingIn ? 'Signing in…' : 'Sign in'}
          </button>
          <Link
            to="/"
            className="block text-center text-xs tracking-[0.12em] text-stone uppercase hover:text-ink"
          >
            Back to site
          </Link>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-dynamic bg-mist pb-[env(safe-area-inset-bottom)]">
      <header className="border-b border-line bg-cream pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="text-xs tracking-[0.2em] text-stone uppercase">
              {brand.name}
            </p>
            <h1 className="font-display text-2xl font-medium text-ink">
              Dashboard
            </h1>
            <p className="mt-1 text-xs text-stone">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {saving ? (
              <span className="text-xs tracking-[0.12em] text-stone uppercase">
                Saving…
              </span>
            ) : null}
            {showInstallAction ? (
              <button
                type="button"
                onClick={() => void requestInstall()}
                className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink"
              >
                <Download className="size-3.5" />
                Install app
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    'Reset all products and images to the original defaults in Supabase?',
                  )
                ) {
                  void resetContent()
                }
              }}
              className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
            <button
              type="button"
              onClick={() => void signOut()}
              className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-medium tracking-[0.12em] text-ink-soft uppercase transition hover:border-ink hover:text-ink"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-ink px-3 py-2 text-xs font-semibold tracking-[0.12em] text-cream uppercase transition hover:bg-ink-soft"
            >
              <ArrowLeft className="size-3.5" />
              View site
            </Link>
          </div>
        </div>
      </header>

      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800 md:px-8">
          <div className="mx-auto flex max-w-6xl items-start justify-between gap-4">
            <p>{error}</p>
            <button
              type="button"
              onClick={clearError}
              className="shrink-0 text-xs tracking-wider uppercase"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      {contentLoading ? (
        <div className="px-5 py-16 text-center text-sm text-stone md:px-8">
          Loading catalogue from Supabase…
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-[200px_1fr] md:px-8 md:py-10">
          <aside className="space-y-1">
            <p className="mb-3 text-xs tracking-[0.16em] text-stone uppercase">
              {products.length} products
            </p>
            {(
              [
                ['products', 'Products', Package],
                ['images', 'Site', ImageIcon],
                ['size-guide', 'Size guide', Ruler],
                ['faqs', 'FAQs', CircleHelp],
                ['reviews', 'Reviews', Star],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition ${
                  tab === id
                    ? 'bg-ink text-cream'
                    : 'text-ink-soft hover:bg-cream hover:text-ink'
                }`}
              >
                <Icon className="size-4" />
                <span className="flex-1">{label}</span>
                {id === 'reviews' && pendingReviews > 0 ? (
                  <span
                    className={`min-w-5 px-1.5 text-center text-xs ${
                      tab === id ? 'text-cream' : 'text-ink'
                    }`}
                  >
                    {pendingReviews}
                  </span>
                ) : null}
              </button>
            ))}
          </aside>

          <main className="min-w-0">
            {tab === 'products' ? (
              <AdminProducts />
            ) : tab === 'images' ? (
              <AdminImages />
            ) : tab === 'size-guide' ? (
              <AdminSizeGuide />
            ) : tab === 'faqs' ? (
              <AdminFaqs />
            ) : (
              <AdminReviews onChange={() => setReviewTick((value) => value + 1)} />
            )}
          </main>
        </div>
      )}
    </div>
  )
}
