import Link from "next/link";

export default function GalleryPage() {
  const photos = [
    { src: "/images/lana1.webp", alt: "Lana 1" },
    { src: "/images/lana2.webp", alt: "Lana 2" },
    { src: "/images/lana3.webp", alt: "Lana 3" },
    { src: "/images/luna.jpg", alt: "Luna 1" },
    { src: "/images/luna2.jpg", alt: "Luna 2" },
    { src: "/images/luna3.jpg", alt: "Luna 3" },
    { src: "/images/luna4.jpg", alt: "Luna 4" },
    { src: "/images/luna5.jpg", alt: "Luna 5" },
    { src: "/images/luna6.jpg", alt: "Luna 6" },
    { src: "/images/luna7.jpg", alt: "Luna 7" },
    { src: "/images/luna8.jpg", alt: "Luna 8" },
    { src: "/images/luna9.jpg", alt: "Luna 9" },
    { src: "/images/luna10.jpg", alt: "Luna 10" },
    { src: "/images/luna11.jpg", alt: "Luna 11" },
    { src: "/images/luna12.jpg", alt: "Luna 12" },
    { src: "/images/luna13.jpg", alt: "Luna 13" },
    { src: "/images/luna14.jpg", alt: "Luna 14" },
    { src: "/images/luna15.jpg", alt: "Luna 15" },
    { src: "/images/luna16.jpg", alt: "Luna 16" },
    { src: "/images/luna17.jpg", alt: "Luna 17" },
    { src: "/images/luna18.jpg", alt: "Luna 18" },
    { src: "/images/luna19.jpg", alt: "Luna 19" },
    { src: "/images/luna20.jpg", alt: "Luna 20" },
    { src: "/images/luna21.jpg", alt: "Luna 21" },
    { src: "/images/luna22.jpg", alt: "Luna 22" },
    { src: "/images/luna23.jpg", alt: "Luna 23" },
    { src: "/images/luna24.jpg", alt: "Luna 24" },
    { src: "/images/luna25.jpg", alt: "Luna 25" },
    { src: "/images/luna26.jpg", alt: "Luna 26" },
    { src: "/images/luna27.jpg", alt: "Luna 27" },
    { src: "/images/luna28.jpg", alt: "Luna 28" }
  ];

  return (
    <div className="w-full">
      <div className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-950 dark:text-white mb-4">Gallery Aurhel Alana Tirta</h1>
        <p className="text-slate-800 dark:text-slate-300 text-lg mb-8 font-medium">Kumpulan momen dan foto-foto terbaik Lana.</p>

        <Link href="/about-lana" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-[0.9rem] font-semibold transition-all border-2 border-accent text-accent hover:bg-accent/10 hover:-translate-y-0.5">
          <i className="bx bx-left-arrow-alt text-lg"></i> Kembali ke About Lana
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-20">
        {photos.map((p, i) => (
          <a key={i} href={p.src} className="block w-full aspect-[4/5] rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group" target="_blank" rel="noreferrer">
            <img src={p.src} alt={p.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </a>
        ))}
      </div>
    </div>
  );
}
