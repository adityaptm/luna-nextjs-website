import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBotLuna from "../components/ChatBotLuna";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LUNA.",
  description: "Aurhel Alana - JKT48 Gen 12 fansite",
  icons: {
    icon: [
      { url: "/images/luna.webp", type: "image/webp" },
    ],
    apple: [
      { url: "/images/luna.webp", type: "image/webp" },
    ],
    shortcut: "/images/luna.webp",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden`}
      >
        {/* Background Animations */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Moon (Only visible in Dark Mode or very subtle in light) */}
          <div className="absolute top-[10%] right-[10%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-b100/20 to-b300/5 blur-xl moon-element opacity-60 dark:opacity-40" />
          
          {/* Shooting Stars (Visible in both, but colored differently in CSS) */}
          <div className="shooting-star opacity-30" style={{ top: '20%', animationDelay: '0s', animationDuration: '4s' }}></div>
          <div className="shooting-star opacity-20" style={{ top: '40%', animationDelay: '2s', animationDuration: '6s' }}></div>
          <div className="shooting-star opacity-40" style={{ top: '10%', animationDelay: '5s', animationDuration: '3s' }}></div>
          
          {/* Dark Mode: Twinkling Stars */}
          <div className="hidden dark:block">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i}
                className="twinkle-star absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 3 + 'px',
                  height: Math.random() * 3 + 'px',
                  top: Math.random() * 100 + '%',
                  left: Math.random() * 100 + '%',
                  // @ts-ignore
                  '--duration': (Math.random() * 3 + 2) + 's',
                  '--delay': Math.random() * 5 + 's'
                }}
              />
            ))}
          </div>

          {/* Light Mode: Floating Bubbles/Particles */}
          <div className="block dark:hidden">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i}
                className="floating-particle absolute rounded-full blur-sm"
                style={{
                  width: (Math.random() * 40 + 20) + 'px',
                  height: (Math.random() * 40 + 20) + 'px',
                  left: Math.random() * 100 + '%',
                  // @ts-ignore
                  '--duration': (Math.random() * 10 + 10) + 's',
                  '--delay': Math.random() * 10 + 's'
                }}
              />
            ))}
          </div>
        </div>

        <Header />
        <main className="flex-1 w-full max-w-[1200px] mx-auto my-6 px-4 md:px-6 relative z-10">
          {children}
        </main>
        <Footer />
        <ChatBotLuna />
      </body>
    </html>
  );
}
