import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">RankSpark</span>
        </div>
        <Link href="/analyze" className="btn-primary text-sm">
          Go to Analyzer
        </Link>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/30 rounded-full px-4 py-1.5 text-sm text-brand mb-8">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            AI-Powered YouTube SEO for Bangla Creators
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Rank Higher on{" "}
            <span className="text-brand">YouTube</span>{" "}
            <br className="hidden md:block" />
            with Smart SEO Scoring
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get an instant SEO score for your video, AI-generated tags in Bangla,
            Banglish & English, and copy-ready content — all in one place.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="btn-primary text-base px-8 py-3.5 rounded-xl inline-flex items-center gap-2"
            >
              Go to Analyzer
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="#features"
              className="btn-secondary text-base px-8 py-3.5 rounded-xl"
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need to rank
          </h2>
          <p className="text-white/50 text-center mb-12">
            Built for Bangladeshi YouTubers who want real growth
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📊",
                title: "Live SEO Score",
                desc: "See your score update in real time as you fill out your metadata — no API call needed.",
              },
              {
                icon: "🏷️",
                title: "35+ Smart Tags",
                desc: "Auto-generated tags in Bangla (বাংলা), Banglish, and English — with exact keyword as first tag.",
              },
              {
                icon: "🤖",
                title: "AI Analysis",
                desc: "Claude AI analyzes title, description, transcript, and tags to give you a 0–100 grade.",
              },
              {
                icon: "✍️",
                title: "Copy-Ready Content",
                desc: "3 title options, optimized description, pinned comment, and channel keywords — all ready to paste.",
              },
              {
                icon: "📈",
                title: "7 Category Scores",
                desc: "Breakdown across title, description, tags, transcript, thumbnail, engagement, and authority.",
              },
              {
                icon: "⚡",
                title: "Actionable Fix Steps",
                desc: "Specific step-by-step fixes to improve your score — no vague advice.",
              },
            ].map((feature) => (
              <div key={feature.title} className="card hover:border-brand/30 transition-colors">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score visualization */}
      <section className="border-t border-white/10 px-6 py-20 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Grade Scale</h2>
          <p className="text-white/50 mb-10">Where does your video stand?</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { grade: "S", range: "90–100", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10" },
              { grade: "A", range: "80–89", color: "text-green-400 border-green-400/30 bg-green-400/10" },
              { grade: "B", range: "65–79", color: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
              { grade: "C", range: "50–64", color: "text-orange-400 border-orange-400/30 bg-orange-400/10" },
              { grade: "D", range: "35–49", color: "text-red-400 border-red-400/30 bg-red-400/10" },
              { grade: "F", range: "0–34", color: "text-red-600 border-red-600/30 bg-red-600/10" },
            ].map(({ grade, range, color }) => (
              <div
                key={grade}
                className={`border rounded-xl px-6 py-4 text-center min-w-[100px] ${color}`}
              >
                <div className="text-4xl font-black mb-1">{grade}</div>
                <div className="text-sm opacity-70">{range}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-white/10 px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to rank higher?</h2>
        <p className="text-white/50 mb-8">Start analyzing your video metadata for free.</p>
        <Link
          href="/analyze"
          className="btn-primary text-base px-10 py-3.5 rounded-xl inline-flex items-center gap-2"
        >
          Go to Analyzer
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center text-white/30 text-sm">
        © {new Date().getFullYear()} RankSpark. Built for Bangla Creators.
      </footer>
    </main>
  );
}
