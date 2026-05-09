import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./_providers/ProgressBar";
import {  Cause } from "next/font/google";

const cause = Cause({
  subsets: ['latin'],
  fallback: ["sans-serif"],
})

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

  creator: "Tegar Maulana Fahreza",
  publisher: "Vercel"
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#ffffff",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#1d232a",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${cause.className} h-full antialiased`}
    >
      <body className="flex flex-col min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}