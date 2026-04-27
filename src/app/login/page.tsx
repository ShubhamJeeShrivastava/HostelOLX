'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function GoogleMark() {
  // Simple Google "G" mark (inline SVG) to avoid extra deps.
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.659 32.658 29.233 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.937 6.053 29.695 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.957 3.043l5.657-5.657C34.937 6.053 29.695 4 24 4c-7.682 0-14.35 4.328-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.566 0 10.702-2.133 14.56-5.602l-6.727-5.69C29.799 34.24 27.02 35.2 24 35.2c-5.213 0-9.628-3.318-11.284-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.349-2.388 4.352-4.47 5.708l.003-.002 6.727 5.69C36.093 40.785 44 36 44 24c0-1.341-.138-2.651-.389-3.917z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emailOk = useMemo(() => (email.length === 0 ? true : isValidEmail(email)), [email]);
  const canSubmit = useMemo(() => {
    if (isSubmitting || isGoogleSubmitting) return false;
    if (!email.trim() || !password) return false;
    if (!isValidEmail(email)) return false;
    if (password.length < 6) return false;
    return true;
  }, [email, password, isSubmitting, isGoogleSubmitting]);

  async function onGoogleLogin() {
    setError(null);
    setSuccess(null);
    setIsGoogleSubmitting(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setError('Google login failed. Please try again.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Placeholder until backend auth exists.
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(`Signed in as ${email.trim()} ${rememberMe ? '(remembered)' : ''}`.trim());
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-[#1A1C1C] selection:bg-[#006E17]/20 selection:text-[#006E17]">
      <header className="sticky top-0 z-40 bg-[#F9F9F9]/80 backdrop-blur-[20px] border-b border-[#E2E2E2]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Hostel<span className="text-[#BB020C]">OLX</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="bg-white border border-[#EEEEEE] text-[#1A1C1C] px-4 py-2 rounded-xl font-bold text-sm hover:border-[#006E17]/30 hover:text-[#006E17] transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <section className="lg:sticky lg:top-24">
            <div className="bg-white border border-[#EEEEEE] rounded-3xl p-7 sm:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-[360px] h-[360px] rounded-full bg-[#006E17]/8 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full bg-[#BB020C]/6 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#006E17]/10 text-[#006E17] text-xs font-bold uppercase tracking-wider">
                  Verified campus-only access
                </div>
                <h1 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Sign in to your <span className="text-[#006E17]">HostelOLX</span> account
                </h1>
                <p className="mt-4 text-[#5f5e5e] text-sm sm:text-base leading-relaxed">
                  Log in to chat safely, save listings, and post items inside your campus community.
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'Private chat', desc: 'Negotiate without sharing your phone number.' },
                    { title: 'Trusted listings', desc: 'See items from verified hostel residents.' },
                    { title: 'Quick posting', desc: 'Sell, rent, or lend in under a minute.' },
                    { title: 'Campus-first', desc: 'Meet at safe on-campus spots.' },
                  ].map((x) => (
                    <div key={x.title} className="p-4 rounded-2xl border border-[#EEEEEE] bg-[#F9F9F9]">
                      <div className="font-bold text-sm">{x.title}</div>
                      <div className="text-[#5f5e5e] text-xs mt-1 leading-relaxed">{x.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-[#EEEEEE] rounded-3xl p-7 sm:p-10 shadow-sm">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Welcome back</h2>
                <p className="mt-2 text-sm text-[#5f5e5e]">Use your college email for the best experience.</p>
              </div>
              <div className="shrink-0 flex items-center gap-2 rounded-2xl bg-[#F9F9F9] border border-[#EEEEEE] p-1">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E2E2E2] text-sm font-extrabold">
                  Sign in
                </span>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 rounded-xl text-sm font-extrabold text-[#5f5e5e] hover:text-[#006E17] transition-colors"
                >
                  Sign up
                </Link>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <button
                type="button"
                onClick={onGoogleLogin}
                disabled={isSubmitting || isGoogleSubmitting}
                className={[
                  'w-full py-3 rounded-xl font-extrabold text-sm transition-all active:scale-[0.99] flex items-center justify-center gap-3 border',
                  isSubmitting || isGoogleSubmitting
                    ? 'bg-[#E8E8E8] text-[#5f5e5e] border-[#E2E2E2] cursor-not-allowed'
                    : 'bg-white text-[#1A1C1C] border-[#E2E2E2] hover:border-[#006E17]/30 hover:-translate-y-0.5',
                ].join(' ')}
              >
                {isGoogleSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Connecting…
                  </>
                ) : (
                  <>
                    <GoogleMark />
                    Continue with Google
                  </>
                )}
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px bg-[#EEEEEE] flex-1" />
                <div className="text-xs font-bold text-[#b3b1b0] uppercase tracking-wider">or</div>
                <div className="h-px bg-[#EEEEEE] flex-1" />
              </div>

              <form className="space-y-5" onSubmit={onSubmit}>
              <div>
                <label className="text-sm font-bold" htmlFor="email">
                  Email
                </label>
                <div className="mt-2 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3b1b0]" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@college.edu"
                    className={[
                      'w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm focus:outline-none transition-colors',
                      emailOk ? 'border-[#E2E2E2] focus:border-[#006E17]' : 'border-[#BB020C]/50 focus:border-[#BB020C]',
                    ].join(' ')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {!emailOk && (
                  <p className="mt-2 text-xs font-semibold text-[#BB020C]">Enter a valid email address.</p>
                )}
              </div>

              <div>
                <label className="text-sm font-bold" htmlFor="password">
                  Password
                </label>
                <div className="mt-2 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b3b1b0]" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 bg-white border border-[#E2E2E2] rounded-xl text-sm focus:outline-none focus:border-[#006E17] transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-[#F3F3F3] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#5f5e5e]" />
                    ) : (
                      <Eye className="w-4 h-4 text-[#5f5e5e]" />
                    )}
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#3d4a3a] select-none">
                    <input
                      type="checkbox"
                      className="accent-[#006E17]"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-sm font-bold text-[#006E17] hover:underline underline-offset-4"
                    onClick={() => setError('Password reset is not wired up yet.')}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {(error || success) && (
                <div
                  className={[
                    'rounded-2xl px-4 py-3 text-sm font-semibold border',
                    success
                      ? 'bg-[#d1fae5] text-[#006E17] border-[#006E17]/20'
                      : 'bg-[#BB020C]/5 text-[#BB020C] border-[#BB020C]/20',
                  ].join(' ')}
                  role="status"
                >
                  {success ?? error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className={[
                  'w-full py-3 rounded-xl font-extrabold text-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2',
                  canSubmit
                    ? 'bg-[#006E17] text-white shadow-[0_10px_30px_rgba(0,110,23,0.20)] hover:-translate-y-0.5'
                    : 'bg-[#E8E8E8] text-[#5f5e5e] cursor-not-allowed',
                ].join(' ')}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              <div className="pt-2 text-center text-sm text-[#5f5e5e]">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-bold text-[#006E17] hover:underline underline-offset-4">
                  Sign up
                </Link>
              </div>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

