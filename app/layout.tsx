import type { Metadata } from "next";
import { Blinker } from "next/font/google";
import Script from "next/script"; // ✅ REQUIRED for scripts in App Router
import "./globals.css";
import MyProvider from "./redux/MyProvider";
import CompanyLogo from "./components/CompanyLogo";

const blinker = Blinker({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400"],
});

export const metadata: Metadata = {
  title: "Get the best metal products at Kolkata | Grillex",
  description:
    "Enhance the look of your home with the best metal products in Kolkata by Grillex. Buy our invisible grilles, metal furniture, pergolas, etc.",
  alternates: {
    canonical: "/",
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
        {/* ✅ FIXED Google Site Verification (double dash removed) */}
        <meta
          name="google-site-verification"
          content="yLPddTsRuwmxFCf8A82MB-iolThMZ4Gx7auvSZzsRVM"
        />

        {/* Existing favicon links – untouched */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon_io/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon_io/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon_io/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
      </head>

      <body className={blinker.className + " max-w-[1400px] mx-auto relative"}>
        {/* ✅ Google Analytics GA4 – script loader */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-46GCTXG4D4"
          strategy="afterInteractive"
        />

        {/* ✅ Google Analytics GA4 – config */}
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-46GCTXG4D4');
            `,
          }}
        />

        {/* Existing providers and components – untouched */}
        <MyProvider>
          <CompanyLogo />
          {children}
        </MyProvider>
      </body>
    </html>
  );
}
