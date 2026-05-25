import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";
import { ReduxProvider } from "~/providers/redux-provider";
import AuthProvider from "~/providers/AuthProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Streamyst",
  description: "Media Forwarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="auto">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <ReduxProvider>
            <GlobalProviders>

              {children}
              <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
              />
            </GlobalProviders>
          </ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
