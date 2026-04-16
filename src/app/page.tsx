import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D85A30] flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">RankSpark</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/analyze" className="btn-primary text-sm">
            YouTube SEO Analyzer
          </Link>
          <Link href="/explore" className="btn-secondary text-sm">
            Explore Rankings
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#D85A30]/10 border border-[#D85A30]/30 rounded-full px-4 py-1.5 text-sm text-[#D85A30] mb-8">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            AI-Powered Rankings & YouTube SEO
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Rank Higher with{" "}
            <span className="text-[#D85A30]">AI-Powered</span>{" "}
            <br className="hidden md:block" />
            SEO & Rankings
          </h1>

          {/* Sub */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get instant YouTube SEO scores, AI-generated tags in Bangla, Banglish &amp; English,
            and create community rankings on any topic — all powered by Claude AI.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/analyze"
              className="btn-primary text-base px-8 py-3.5 rounded-xl inline-flex items-center gap-2"
            >
              YouTube SEO Analyzer
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link
              href="/explore"
              className="btn-secondary text-base px-8 py-3.5 rounded-xl"
            >
              Explore Rankings
            </Link>
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
            Built for Bangladeshi YouTubers and ranking enthusiasts
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
                icon: "🏆",
                title: "Community Rankings",
                desc: "Create and share rankings on any topic. Vote on items, leave comments, explore by category.",
              },
              {
                icon: "⚡",
                title: "AI-Generated Rankings",
                desc: "Describe any topic and Claude generates a ranked list with detailed reasoning for each entry.",
              },
            ].map((feature) => (
              <div key={feature.title} className="card hover:border-[#D85A30]/30 transition-colors">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-white/10 px-6 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to rank higher?</h2>
        <p className="text-white/50 mb-8">Start analyzing your YouTube video or create your first ranking.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/analyze"
            className="btn-primary text-base px-10 py-3.5 rounded-xl inline-flex items-center gap-2"
          >
            YouTube SEO Analyzer
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            href="/create"
            className="btn-secondary text-base px-10 py-3.5 rounded-xl"
          >
            Create a Ranking
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center text-white/30 text-sm">
        © {new Date().getFullYear()} RankSpark. AI-powered rankings and SEO.
      </footer>
    </main>
  );
}
