import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "next-themes";
import { PagesTopLoader } from "nextjs-toploader/pages";
import { Toaster } from "@/components/ui/toaster"; // Import Toaster dari shadcn/ui

// Definisikan default SEO config
const DEFAULT_SEO = {
  title: "Zacode - Open source software developer",
  description:
    "Professional Open source software developer showcasing web development in modern technologies.",
  canonical: "https://Zacode.vercel.app",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://zacode.vercel.app",
    siteName: "Zacode",
    images: [
      {
        url: "https://zacode.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zacode",
      },
    ],
  },
  twitter: {
    handle: "@yourtwitterhandle",
    site: "@yourtwitterhandle",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "keywords",
      content:
        "software developer, web development, frontend developer, backend developer, fullstack developer, React, Next.js, JavaScript, TypeScript, OpenSource, Portfolio, Zacode",
    },
    {
      name: "author",
      content: "Ahmad Afriza",
    },
  ],
};

const disableNavbar = ["auth", "404"];

// Tambahkan JsonLD
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ahmad Afriza",
  url: "https://zacode.vercel.app",
  sameAs: [
    "https://github.com/Sanjaee",
    "https://www.linkedin.com/in/ahmad-afriza-ez4-ab9173276",
    "https://www.tiktok.com/@ahmadafriza25",
    "https://www.youtube.com/channel/UCGI119S5iGHHMgBXRCKVG8g",
    // Tambahkan social media links lainnya
  ],
  jobTitle: "Software Developer",
  worksFor: {
    "@type": "Organization",
    name: "Zacode",
  },
  image: "https://zacode.vercel.app/profile-image.jpg",
  description:
    "Professional software developer specializing in web development",
  skills: "JavaScript, TypeScript, React, Next.js, Node.js, etc.",
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { pathname } = useRouter();

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{DEFAULT_SEO.title}</title>
        <meta name="title" content={DEFAULT_SEO.title} />
        <meta name="description" content={DEFAULT_SEO.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={DEFAULT_SEO.openGraph.type} />
        <meta property="og:url" content={DEFAULT_SEO.openGraph.url} />
        <meta property="og:title" content={DEFAULT_SEO.title} />
        <meta property="og:description" content={DEFAULT_SEO.description} />
        <meta
          property="og:image"
          content={DEFAULT_SEO.openGraph.images[0].url}
        />
        <meta
          property="og:site_name"
          content={DEFAULT_SEO.openGraph.siteName}
        />

        {/* Twitter */}
        <meta name="twitter:card" content={DEFAULT_SEO.twitter.cardType} />
        <meta name="twitter:url" content={DEFAULT_SEO.openGraph.url} />
        <meta name="twitter:title" content={DEFAULT_SEO.title} />
        <meta name="twitter:description" content={DEFAULT_SEO.description} />
        <meta
          name="twitter:image"
          content={DEFAULT_SEO.openGraph.images[0].url}
        />
        <meta name="twitter:creator" content={DEFAULT_SEO.twitter.handle} />

        {/* Keywords dan Author */}
        <meta
          name="keywords"
          content={DEFAULT_SEO.additionalMetaTags[0].content}
        />
        <meta
          name="author"
          content={DEFAULT_SEO.additionalMetaTags[1].content}
        />

        {/* Favicon */}
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Canonical */}
        <link rel="canonical" href={`${DEFAULT_SEO.canonical}${pathname}`} />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Robots */}
        <meta name="robots" content="index, follow" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>

      <SessionProvider session={session}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {/* Render navbar jika path tidak ada dalam disableNavbar */}
          {!disableNavbar.includes(pathname.split("/")[1]) && <Navbar />}

          {/* Main content dengan padding conditional */}
          <main
            className={`min-h-screen ${!disableNavbar.includes(
              pathname.split("/")[1]
            )}`}
          >
            <PagesTopLoader
              color="red"
              initialPosition={0.08}
              crawlSpeed={1000}
              height={5}
              crawl={true}
              easing="ease"
              speed={100}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              template='<div class="bar" role="bar"><div class="peg"></div></div> 
              <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
              zIndex={9999999999}
              showAtBottom={false}
            />
            <Component {...pageProps} />
          </main>

          {/* Toaster dari shadcn/ui */}
          <Toaster />

          {/* <PopupChat/> */}
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
