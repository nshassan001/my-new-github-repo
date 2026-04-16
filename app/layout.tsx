import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RankSpark | YouTube SEO Scoring",
  description: "Score and improve your YouTube video metadata for better ranking potential.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "0.75rem",
            },
          }}
        />
      </body>
    </html>
  );
}
