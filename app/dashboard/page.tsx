import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/app/actions/auth'
import BadgesSection from '@/app/components/BadgesSection'

const packs = [
  { name: "신체", emoji: "💪", color: "#FF6B6B", bg: "#FFF0F0", href: "/pack/physical" },
  { name: "정서", emoji: "🌈", color: "#FF9F43", bg: "#FFF8EE", href: "/pack/emotional" },
  { name: "사회", emoji: "🤝", color: "#54A0FF", bg: "#EEF5FF", href: "/pack/social" },
  { name: "인지", emoji: "🧠", color: "#A29BFE", bg: "#F3F0FF", href: "/pack/cognitive" },
  { name: "생활", emoji: "🌙", color: "#FD79A8", bg: "#FFF0F8", href: "/pack/lifestyle" },
  { name: "진로", emoji: "⭐", color: "#F9CA24", bg: "#FFFBEE", href: "/pack/career" },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname, role')
    .eq('id', user.id)
    .single()

  const nickname = profile?.nickname ?? user.email
  const role = profile?.role ?? '아동'
  const isChild = role === '아동'

  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #E3F4FF 0%, #FFF9F0 100%)' }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3">
        <h1 className="text-xl font-black shimmer-text">SIX PACK</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-gray-400 font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition">
            로그아웃
          </button>
        </form>
      </div>

      {/* 프로필 카드 */}
      <section className="px-5 pb-4">
        <div className="rounded-3xl p-5 flex items-center gap-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #fff, #EEF5FF)', border: '2px solid #54A0FF30' }}>
          <div className="text-5xl animate-float-slow">{isChild ? '🧒' : '👨‍👩‍👧'}</div>
          <div>
            <p className="text-lg font-black text-gray-700">{nickname}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: isChild ? '#FF6B6B' : '#54A0FF' }}>
                {role}
              </span>
              <span className="text-xs text-gray-400">안녕하세요! 👋</span>
            </div>
          </div>
        </div>
      </section>

      {/* 웨이브 */}
      <svg viewBox="0 0 1440 30" className="w-full" preserveAspectRatio="none" style={{ fill: 'rgba(255,255,255,0.6)' }}>
        <path d="M0,15 C360,30 1080,0 1440,15 L1440,30 L0,30 Z" />
      </svg>

      {/* 6팩 그리드 */}
      <section className="px-4 py-4" style={{ background: 'rgba(255,255,255,0.6)' }}>
        <h2 className="text-base font-black text-gray-600 mb-3 px-1">🎯 나의 6팩 현황</h2>
        <div className="grid grid-cols-3 gap-2">
          {packs.map((pack) => (
            <Link
              key={pack.name}
              href={pack.href}
              className="pack-card flex flex-col items-center rounded-2xl py-4 px-2 text-center shadow-sm"
              style={{ backgroundColor: pack.bg, border: `2px solid ${pack.color}40` }}
            >
              <span className="text-3xl mb-1">{pack.emoji}</span>
              <span className="text-xs font-black" style={{ color: pack.color }}>{pack.name}</span>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{ backgroundColor: pack.color, width: '0%' }} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <svg viewBox="0 0 1440 30" className="w-full" preserveAspectRatio="none" style={{ fill: 'rgba(255,255,255,0.6)' }}>
        <path d="M0,15 C360,0 1080,30 1440,15 L1440,0 L0,0 Z" />
      </svg>

      {/* 뱃지 */}
      <BadgesSection />

      {/* 시작 CTA */}
      <section className="px-5 py-6 text-center">
        <div className="text-4xl mb-3 animate-float">💪</div>
        <p className="text-base font-black text-gray-600 mb-4">첫 번째 팩을 측정해봐!</p>
        <Link
          href="/pack/physical"
          className="btn-main inline-block font-black text-base py-3 px-8 rounded-2xl text-white"
          style={{ background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)', boxShadow: '0 6px 20px #FF6B6B44' }}
        >
          💪 신체 팩 시작하기
        </Link>
      </section>

      {/* 면책 */}
      <p className="text-gray-300 text-xs text-center py-5 px-6">
        ⚠️ 이 앱은 전문 심리치료를 대체하지 않습니다.
      </p>
    </main>
  )
}
