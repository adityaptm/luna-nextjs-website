"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import ChatBotLuna from "./ChatBotLuna";

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="w-full min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-[1200px] mx-auto my-6 px-4 md:px-6 relative z-10">
        {children}
      </main>
      <Footer />
      <ChatBotLuna />
    </>
  );
}
