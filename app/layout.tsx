import type { Metadata } from "next";
import "./globals.css";

// Font importları tamamen silindi, tarayıcının varsayılan fontu kullanılacak.

export const metadata: Metadata = {
  title: "The Feed: AI Intelligence Terminal",
  description: "News aggregation with AI summarization for political, market, and economic updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Font değişkenleri kaldırıldı */}
      <body>
        {children}
      </body>
    </html>
  );
}