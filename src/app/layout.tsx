import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RankSpark — AI-Powered Ranking & YouTube SEO",
  description:
    "AI-powered ranking platform and YouTube SEO scoring tool. Create community rankings, analyze YouTube video metadata, and get AI-generated tags and copy.",
  keywords: ["YouTube SEO", "ranking platform", "AI rankings", "RankSpark"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#0f0f0f] text-white antialiased">
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
