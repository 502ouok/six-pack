import Link from "next/link";

const packs = [
  { name: "신체", emoji: "💪", color: "#FF6B6B", bg: "#FFF0F0", desc: "체력·운동", href: "/pack/physical" },
  { name: "정서", emoji: "🌈", color: "#FF9F43", bg: "#FFF8EE", desc: "감정·마음", href: "/pack/emotional" },
  { name: "사회", emoji: "🤝", color: "#54A0FF", bg: "#EEF5FF", desc: "친구·관계", href: "/pack/social" },
  { name: "인지", emoji: "🧠", color: "#A29BFE", bg: "#F3F0FF", desc: "집중·사고", href: "/pack/cognitive" },
  { name: "생활", emoji: "🌙", color: "#FD79A8", bg: "#FFF0F8", desc: "수면·식습관", href: "/pack/lifestyle" },
  { name: "진로", emoji: "⭐", color: "#F9CA24", bg: "#FFFBEE", desc: "꿈·강점", href: "/pack/career" },
];

const features = [
  { emoji: "🏫", label: "WHO 기반" },
  { emoji: "📊", label: "OECD 기준" },
  { emoji: "🤖", label: "AI 맞춤" },
  { emoji: "👨‍⚕️", label: "전문가 설계" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(180deg, #E3F4FF 0%, #FFF9F0 40%, #F0FFF8 100%)" }}>

      {/* SOS 버튼 */}
      <a
        href="tel:1393"
        className="fixed top-4 right-4 z-50 flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-black px-3 py-2 rounded-full shadow-lg btn-main"
      >
        🆘 SOS
      </a>

      {/* ─── 히어로 ─── */}
      <section className="relative flex flex-col items-center pt-14 pb-4 px-6 text-center">

        {/* 배경 장식 */}
        <span className="absolute top-6 left-6 text-3xl animate-float">⭐</span>
        <span className="absolute top-10 right-8 text-2xl animate-float-delay">💫</span>
        <span className="absolute top-20 left-16 text-xl animate-float-delay2">🌟</span>
        <span className="absolute top-16 right-20 text-xl animate-float">✨</span>

        {/* 마스코트 */}
        <div className="relative mb-2">
          <div className="text-8xl animate-float-slow select-none">🏋️</div>
          <div
            className="absolute -bottom-1 -right-2 text-sm font-black text-white px-2 py-0.5 rounded-full"
            style={{ background: "#FF6B6B" }}
          >
            GO!
          </div>
        </div>

        {/* 타이틀 */}
        <h1 className="text-6xl font-black tracking-tighter mt-2 leading-none">
          <span className="shimmer-text">SIX PACK</span>
        </h1>
        <p className="text-lg font-black text-gray-500 mt-1 tracking-wide">식스팩 🔥</p>

        <p className="text-base text-gray-500 mt-3 max-w-xs mx-auto leading-relaxed">
          내 몸과 마음의 숨은 팩을 깨워봐! 💪<br/>
          <span className="font-bold text-gray-600">6가지 영역</span>을 키워가는 성장 여정
        </p>

        {/* 뱃지 */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
              style={{ background: "linear-gradient(135deg, #54A0FF, #A29BFE)" }}
            >
              {f.emoji} {f.label}
            </div>
          ))}
        </div>
      </section>

      {/* 웨이브 */}
      <svg viewBox="0 0 1440 50" className="w-full mt-2" preserveAspectRatio="none" style={{ fill: "rgba(255,255,255,0.55)" }}>
        <path d="M0,25 C240,50 480,0 720,25 C960,50 1200,0 1440,25 L1440,50 L0,50 Z" />
      </svg>

      {/* ─── 6팩 그리드 ─── */}
      <section className="px-4 pb-8" style={{ background: "rgba(255,255,255,0.55)" }}>
        <h2 className="text-center text-lg font-black text-gray-600 mb-4 pt-2">
          🎯 나의 6팩을 발견해봐!
        </h2>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {packs.map((pack, i) => (
            <Link
              key={pack.name}
              href={pack.href}
              className="pack-card flex flex-col items-center rounded-3xl p-5 text-center shadow-sm"
              style={{ backgroundColor: pack.bg, border: `2.5px solid ${pack.color}50` }}
            >
              <span className="text-4xl mb-2" style={{ animationDelay: `${i * 0.15}s` }}>
                {pack.emoji}
              </span>
              <span className="text-base font-black" style={{ color: pack.color }}>
                {pack.name}
              </span>
              <span className="text-xs text-gray-400 mt-0.5">{pack.desc}</span>

              {/* 미측정 표시 */}
              <div className="mt-3 w-full">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ backgroundColor: pack.color, width: "0%" }} />
                </div>
                <span className="text-xs text-gray-300 mt-1 block">아직 미측정</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 웨이브 아래 */}
      <svg viewBox="0 0 1440 50" className="w-full" preserveAspectRatio="none" style={{ fill: "rgba(255,255,255,0.55)" }}>
        <path d="M0,25 C360,0 1080,50 1440,25 L1440,0 L0,0 Z" />
      </svg>

      {/* ─── CTA 섹션 ─── */}
      <section className="px-6 py-10 text-center" style={{ background: "linear-gradient(135deg, #FFF9F0, #F0FFF8)" }}>

        <div className="flex justify-center gap-3 text-4xl mb-4">
          <span className="animate-float">🧒</span>
          <span className="animate-float-delay">👩</span>
          <span className="animate-float-delay2">👨</span>
        </div>

        <h2 className="text-2xl font-black text-gray-700 mb-1">함께 시작해요!</h2>
        <p className="text-sm text-gray-400 mb-6">아이와 보호자가 함께 성장하는 공간</p>

        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            href="/auth/signup?role=아동"
            className="btn-main font-black text-lg py-4 rounded-2xl text-white text-center"
            style={{ background: "linear-gradient(135deg, #FF6B6B, #FF8E53)", boxShadow: "0 6px 20px #FF6B6B55" }}
          >
            🧒 아이로 시작하기
          </Link>
          <Link
            href="/auth/signup?role=보호자"
            className="btn-main font-bold text-base py-3 rounded-2xl text-center"
            style={{
              background: "linear-gradient(135deg, #EEF5FF, #F3F0FF)",
              border: "2.5px solid #54A0FF",
              color: "#54A0FF",
            }}
          >
            👨‍👩‍👧 보호자로 시작하기
          </Link>
          <Link
            href="/auth/login"
            className="text-sm text-gray-400 hover:text-gray-600 transition py-1"
          >
            이미 계정이 있어요 →
          </Link>
        </div>
      </section>

      {/* ─── 하단 장식 ─── */}
      <svg viewBox="0 0 1440 60" className="w-full" preserveAspectRatio="none" style={{ fill: "#E3F4FF" }}>
        <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
      </svg>

      <section className="py-8 text-center px-6" style={{ background: "#E3F4FF" }}>
        <div className="text-5xl mb-3 animate-float">🌱</div>
        <p className="text-base font-black text-gray-600">매일 조금씩 자라는 나의 식스팩!</p>
        <p className="text-xs text-gray-400 mt-1">WHO·OECD 기반 어린이 성장 플랫폼</p>
      </section>

      {/* ─── 보호자 섹션 A: 왜 식스팩인가요? ─── */}
      <svg viewBox="0 0 1440 40" className="w-full" preserveAspectRatio="none" style={{ fill: "#F8FAFF" }}>
        <path d="M0,20 C480,40 960,0 1440,20 L1440,40 L0,40 Z" />
      </svg>

      <section className="px-6 py-8" style={{ background: "#F8FAFF" }}>
        <h2 className="text-xl font-black text-gray-700 text-center mb-2">👨‍👩‍👧 보호자 안내</h2>
        <p className="text-sm text-gray-400 text-center mb-6">아이의 전인적 성장을 돕는 근거 기반 플랫폼입니다</p>

        <div className="rounded-3xl p-5 mb-4 shadow-sm"
          style={{ background: "white", border: "2px solid #EEF5FF" }}>
          <h3 className="text-base font-black text-gray-700 mb-3">📌 왜 식스팩인가요?</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            WHO의 아동 발달 6영역과 OECD 2030 역량 프레임을 바탕으로,
            아이의 신체·정서·사회·인지·생활·진로를 균형 있게 키울 수 있도록 설계했습니다.
          </p>
          <div className="flex flex-col gap-2">
            {[
              { icon: "🔬", text: "국내외 연구 근거 기반 문항 설계" },
              { icon: "👨‍⚕️", text: "아동 발달 전문가와 함께 개발" },
              { icon: "🎁", text: "완전 무료, 광고 없음" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm font-bold text-gray-500">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 보호자 섹션 B: 6가지 성장 영역 ─── */}
      <section className="px-6 pb-8" style={{ background: "#F8FAFF" }}>
        <h3 className="text-base font-black text-gray-700 mb-4">🌱 6가지 성장 영역에서 키울 수 있는 것들</h3>
        <div className="flex flex-col gap-3">
          {[
            { emoji: "💪", name: "신체", color: "#FF6B6B", bg: "#FFF0F0", items: "체력 증진, 운동 습관, 신체 조절 능력" },
            { emoji: "🌈", name: "정서", color: "#FF9F43", bg: "#FFF8EE", items: "감정 인식, 감정 조절, 자기 존중감" },
            { emoji: "🤝", name: "사회", color: "#54A0FF", bg: "#EEF5FF", items: "공감 능력, 갈등 해결, 협력 태도" },
            { emoji: "🧠", name: "인지", color: "#A29BFE", bg: "#F3F0FF", items: "주의 집중, 문제 해결, 학습 동기" },
            { emoji: "🌙", name: "생활", color: "#FD79A8", bg: "#FFF0F8", items: "수면 습관, 영양 균형, 미디어 절제" },
            { emoji: "⭐", name: "진로", color: "#F9CA24", bg: "#FFFBEE", items: "강점 발견, 성장 마인드셋, 목표 의식" },
          ].map((p) => (
            <div key={p.name} className="flex items-start gap-3 rounded-2xl p-4"
              style={{ background: p.bg, border: `2px solid ${p.color}30` }}>
              <span className="text-2xl mt-0.5">{p.emoji}</span>
              <div>
                <p className="text-sm font-black" style={{ color: p.color }}>{p.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.items}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 보호자 섹션 C: 보호자는 이렇게 함께해요 ─── */}
      <svg viewBox="0 0 1440 40" className="w-full" preserveAspectRatio="none" style={{ fill: "#FFF9F0" }}>
        <path d="M0,20 C360,40 1080,0 1440,20 L1440,0 L0,0 Z" />
      </svg>

      <section className="px-6 py-8" style={{ background: "#FFF9F0" }}>
        <h3 className="text-base font-black text-gray-700 mb-5">🤗 보호자는 이렇게 함께해요</h3>
        <div className="flex flex-col gap-4">
          {[
            { step: "1", emoji: "👤", title: "보호자로 가입", desc: "별도 보호자 계정을 만들고 아이를 초대해요" },
            { step: "2", emoji: "🎮", title: "아이와 함께 놀이", desc: "6가지 팩의 게임과 활동을 아이와 같이 해봐요" },
            { step: "3", emoji: "📊", title: "성장 추이 확인", desc: "대시보드에서 아이의 팩별 현황을 한눈에 봐요" },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4 rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.8)", border: "2px solid #FF9F4320" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ background: "linear-gradient(135deg,#FF9F43,#FFCC02)" }}>
                {item.step}
              </div>
              <div>
                <p className="text-sm font-black text-gray-700">{item.emoji} {item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 보호자 섹션 D: 자주 묻는 질문 ─── */}
      <section className="px-6 pb-10" style={{ background: "#FFF9F0" }}>
        <h3 className="text-base font-black text-gray-700 mb-4">💬 자주 묻는 질문</h3>
        <div className="flex flex-col gap-3">
          {[
            { q: "무료인가요?", a: "완전 무료입니다. 광고도 없고, 유료 기능도 없어요." },
            { q: "아이 개인정보는 안전한가요?", a: "아이 이름 대신 닉네임을 사용하고, 개인 식별 정보를 최소화해요." },
            { q: "전문 심리치료를 대체하나요?", a: "아니에요. 이 앱은 일상적인 성장 지원 도구로, 전문 치료가 필요한 경우에는 반드시 전문가에게 연락하세요." },
            { q: "몇 살부터 사용할 수 있나요?", a: "초등학생(8~13세)에게 적합하게 설계됐어요. 보호자와 함께 더 어린 아이도 사용할 수 있어요." },
          ].map((faq) => (
            <div key={faq.q} className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.8)", border: "2px solid #EEF5FF" }}>
              <p className="text-sm font-black text-gray-700 mb-1">Q. {faq.q}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 면책 */}
      <p className="text-gray-400 text-xs text-center py-5 px-6" style={{ background: "#E3F4FF" }}>
        ⚠️ 이 앱은 전문 심리치료를 대체하지 않습니다.<br />
        위기 시 1393(자살예방상담전화)으로 연락하세요.
      </p>
    </main>
  );
}
