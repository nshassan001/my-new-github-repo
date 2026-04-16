import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
      <span className="mb-4 inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
        RankSpark
      </span>
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
        YouTube SEO scoring that helps your videos rank faster
      </h1>
      <p className="mb-10 max-w-2xl text-base text-slate-600 md:text-lg">
        Analyze your title, description, tags, and keyword strategy with an AI-powered SEO score.
        Get a factor-by-factor breakdown and instant optimization tips.
      </p>
      <Link
        href="/analyze"
        className="rounded-xl bg-primary px-8 py-4 font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-[#c84f28]"
      >
        Analyze a Video
      </Link>
    </main>
  );
}
