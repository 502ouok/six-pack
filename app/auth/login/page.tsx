'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { loginAction } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined)

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
          <p className="text-gray-500 text-sm mt-1 font-bold">다시 돌아왔어요! 👋</p>
        </div>

        <form action={action} className="flex flex-col gap-4">

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
              placeholder="비밀번호를 입력해 주세요"
              autoComplete="current-password"
              className="w-full rounded-xl px-4 py-3 text-gray-700 placeholder-gray-300 focus:outline-none transition"
              style={{ background: '#fff', border: '2px solid #e5e7eb' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#54A0FF'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
            {state?.errors?.password && (
              <p className="text-red-400 text-xs mt-1">{state.errors.password[0]}</p>
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
            style={{ background: 'linear-gradient(135deg, #54A0FF, #A29BFE)', boxShadow: '0 6px 20px #54A0FF44' }}
          >
            {pending ? '로그인 중... 🔄' : '로그인 →'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-5">
          계정이 없나요?{' '}
          <Link href="/auth/signup" className="font-black" style={{ color: '#FF6B6B' }}>
            회원가입 🚀
          </Link>
        </p>
      </div>
    </main>
  )
}
