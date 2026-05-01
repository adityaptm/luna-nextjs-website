export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-b900 text-white/85 px-10 pt-12 pb-6 mt-auto border-t border-b100/10">
      <div className="max-w-[1200px] mx-auto mb-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-8">
        <div className="flex flex-col">
          <h3 className="font-display text-b100 mb-3.5 text-[1.2rem]">Luna</h3>
          <p className="text-white/60 text-[0.9rem] leading-[1.8]">Hai aku Aurhel Alana Tirta</p>
        </div>

        <div className="flex flex-col">
          <h4 className="text-b200 mb-2.5 text-[1rem]">Navigasi</h4>
          <ul className="list-none flex flex-col gap-3">
            <li>
              <a href="/home" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent">Home</a>
            </li>
            <li>
              <a href="/about-lana" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent">About Lana</a>
            </li>
            <li>
              <a href="/show-theater" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent">Show Theater</a>
            </li>
            <li>
              <a href="/gallery" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent">Gallery</a>
            </li>
            <li>
              <a href="/news" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent">News</a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h4 className="text-b200 mb-2.5 text-[1rem]">Media Sosial</h4>
          <div className="flex flex-col gap-2">
            <a href="https://x.com/AR_LanaJKT48" target="_blank" rel="noreferrer" aria-label="X" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent flex items-center gap-2">
              <span className="font-bold text-sm w-4 text-center">X</span> Twitter (X)
            </a>
            <a href="https://www.instagram.com/jkt48.lana.a/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent flex items-center gap-2">
              <i className="bx bxl-instagram text-lg"></i> Instagram
            </a>
            <a href="https://www.tiktok.com/@jkt48.lana" target="_blank" rel="noreferrer" aria-label="TikTok" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent flex items-center gap-2">
              <i className="bx bxl-tiktok text-lg"></i> TikTok
            </a>
            <a href="https://www.showroom-live.com/r/JKT48_Lana" target="_blank" rel="noreferrer" aria-label="Showroom" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent flex items-center gap-2 text-[0.85rem] font-bold">
               SR <span className="font-normal ml-0.5">Showroom</span>
            </a>
            <a href="https://www.idn.app/jkt48_lana" target="_blank" rel="noreferrer" aria-label="IDN" className="text-white/60 text-[0.9rem] leading-[1.8] transition-colors duration-200 hover:text-accent flex items-center gap-2 text-[0.85rem] font-bold">
               IDN <span className="font-normal ml-0.5">IDN Live</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto pt-5 border-t border-b100/10 text-center text-white/35 text-[0.82rem]">
        <p>&copy; {currentYear} Aurhel Alana Tirta. All rights reserved.</p>
      </div>
    </footer>
  );
}
