'use client'

import { Suspense, useActionState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signupAction } from '@/app/actions/auth'

const roles = [
  { value: '아동', emoji: '🧒', label: '아동', sub: '학생 / 어린이', color: '#FF6B6B', bg: '#FFF0F0' },
  { value: '보호자', emoji: '👨‍👩‍👧', label: '보호자', sub: '부모 / 선생님', color: '#54A0FF', bg: '#EEF5FF' },
] as const

function SignupForm() {
  const [state, action, pending] = useActionState(signupAction, undefined)
  const searchParams = useSearchParams()
  const preRole = searchParams.get('role')

  const adonRef = useRef<HTMLInputElement>(null)
  const guardianRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (preRole === '아동' && adonRef.current) adonRef.current.checked = true
    if (preRole === '보호자' && guardianRef.current) guardianRef.current.checked = true
  }, [preRole])

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-x-hidden"
      style={{ background: 'linear-gradient(180deg, #E3F4FF 0%, #FFF9F0 100%)' }}
    >
      {/* 배경 장식 */}
      <span className="fixed top-8 left-6 text-3xl opacity-40 animate-float pointer-events-none">⭐</span>
      <span className="fixed top-20 right-8 text-2xl opacity-40 animate-float-delay pointer-events-none">💫</span>
      <span className="fixed bottom-16 left-8 text-2xl opacity-30 animate-float-delay2 pointer-events-none">🌟</span>

      <div className="w-full max-w-sm">

        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="text-5xl mb-2 inline-block animate-float-slow">🏋️</div>
            <h1 className="text-3xl font-black tracking-tight">
              <span className="shimmer-text">SIX PACK</span>
            </h1>
          </Link>
          <p className="text-gray-500 text-sm mt-1 font-bold">회원가입 🚀</p>
        </div>

        <form action={action} className="flex flex-col gap-4">

          {/* 역할 선택 */}
          <div>
            <p className="text-sm font-black text-gray-600 mb-3">나는 누구?</p>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((r) => (
                <label key={r.value} className="cursor-pointer group">
                  <input
                    ref={r.value === '아동' ? adonRef : guardianRef}
                    type="radio"
                    name="role"
                    value={r.value}
                    className="sr-only peer"
                    required
                  />
                  <div
                    className="pack-card flex flex-col items-center gap-1 py-5 rounded-2xl border-2 text-center"
                    style={{
                      background: r.bg,
                      borderColor: r.color + '30',
                    }}
                  >
                    <span className="text-3xl">{r.emoji}</span>
                    <span className="text-sm font-black mt-1" style={{ color: r.color }}>{r.label}</span>
                    <span className="text-xs text-gray-400">{r.sub}</span>
                  </div>
                </label>
              ))}
            </div>
            {state?.errors?.role && (
              <p className="text-red-400 text-xs mt-1">{state.errors.role[0]}</p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-black text-gray-600 mb-1" htmlFor="nickname">
              닉네임 👤
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              placeholder="별명을 입력해 주세요"
              autoComplete="nickname"
              className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none transition"
              style={{ background: '#fff', border: '2px solid #e5e7eb' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#54A0FF'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            {state?.errors?.nickname && (
              <p className="text-red-400 text-xs mt-1">{state.errors.nickname[0]}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-black text-gray-600 mb-1" htmlFor="email">
              이메일 📧
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none transition"
              style={{ background: '#fff', border: '2px solid #e5e7eb' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#54A0FF'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            {state?.errors?.email && (
              <p className="text-red-400 text-xs mt-1">{state.errors.email[0]}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-black text-gray-600 mb-1" htmlFor="password">
              비밀번호 🔒
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="영문 + 숫자 8자 이상"
              autoComplete="new-password"
              className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none transition"
              style={{ background: '#fff', border: '2px solid #e5e7eb' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#54A0FF'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            {state?.errors?.password && (
              <ul className="mt-1 space-y-0.5">
                {state.errors.password.map((e) => (
                  <li key={e} className="text-red-400 text-xs">• {e}</li>
                ))}
              </ul>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-black text-gray-600 mb-1" htmlFor="confirmPassword">
              비밀번호 확인 🔒
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력해 주세요"
              autoComplete="new-password"
              className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none transition"
              style={{ background: '#fff', border: '2px solid #e5e7eb' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#54A0FF'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            {state?.errors?.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{state.errors.confirmPassword[0]}</p>
            )}
          </div>

          {/* 폼 에러 */}
          {state?.errors?.form && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-500 text-sm font-bold">{state.errors.form[0]}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn-main mt-2 font-black text-lg py-4 rounded-2xl text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', boxShadow: '0 6px 20px #FF6B6B44' }}
          >
            {pending ? '가입 중... 🔄' : '가입하기 🚀'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-5">
          이미 계정이 있나요?{' '}
          <Link href="/auth/login" className="font-black" style={{ color: '#54A0FF' }}>
            로그인 →
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>
}
