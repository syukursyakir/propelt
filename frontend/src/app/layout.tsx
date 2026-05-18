import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Propelt",
  description: "AI resume and graduate job application assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
