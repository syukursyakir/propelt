import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import { AuthHashRedirect } from "./auth-hash-redirect";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-newsreader",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Propelt",
  description: "A guided job application workspace for students, fresh graduates, and early-career candidates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body>
        <AuthHashRedirect />
        {children}
      </body>
    </html>
  );
}
