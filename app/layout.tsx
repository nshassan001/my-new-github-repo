import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RankSpark — YouTube SEO Scoring Tool",
  description:
    "Analyze and optimize your YouTube video metadata for maximum reach. Get AI-powered SEO scores, tag suggestions, and copy-ready content for Bangla, Banglish, and English channels.",
  keywords: ["YouTube SEO", "video optimization", "Bangla YouTube", "tag generator", "RankSpark"],
  openGraph: {
    title: "RankSpark",
    description: "AI-powered YouTube SEO scoring for Bangla creators",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0f0f0f] text-white antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f5f5f5",
              border: "1px solid rgba(255,255,255,0.1)",
            },
            success: {
              iconTheme: { primary: "#D85A30", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
