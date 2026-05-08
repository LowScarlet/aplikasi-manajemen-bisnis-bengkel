import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./_providers/ProgressBar";
import {  Cause } from "next/font/google";

const cause = Cause({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Berkat Motor',
  description: 'Aplikasi Manajemen Bengkel Berkat Motor.',
  metadataBase: new URL('https://app.berkatmotor.lowscarlet.my.id'),
  openGraph: {
    type: "website",
    url: "https://app.berkatmotor.lowscarlet.my.id",
    title: "Berkat Motor",
    description: "Aplikasi Manajemen Bengkel Berkat Motor.",
    siteName: "Berkat Motor",
    images: [
      '/android-chrome-512x512.png'
    ]
  },
  twitter: {
    card: 'summary',
  },
  colorScheme: "dark",
  creator: "Tegar Maulana Fahreza",
  publisher: "Vercel"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${cause.className} h-full antialiased`}
    >
      <body className="flex flex-col min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}