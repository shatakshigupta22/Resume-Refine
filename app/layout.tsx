import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "./components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-space-grotesk",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ResumeRefine",
  description: "AI-powered resume tailoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
