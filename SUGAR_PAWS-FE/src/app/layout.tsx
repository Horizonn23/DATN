import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import "../lib/fontawesome";
import { ClientProvider } from "@/provider/ClientProvider";
import Chatbot from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "Sugar Paws",
  description: "Lolita shop fashion",
  icons: {
    icon: [
      {
        url: "/assets/favicon/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/assets/favicon/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/assets/favicon/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
    ],
    apple: "/assets/favicon/sugar-paws-logo.png",
    shortcut: "/assets/favicon/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/favicon/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="48x48"
          href="/assets/favicon/favicon-48x48.png"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/favicon/sugar-paws-logo.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body>
        <ClientProvider>
          {children}
          <Chatbot />
        </ClientProvider>
      </body>
    </html>
  );
}
