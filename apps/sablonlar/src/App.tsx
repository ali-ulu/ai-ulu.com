import PictureRailGallery from "@/components/ui/picture-rail-gallery";
import type { PictureRailGalleryLabels, PictureRailItem } from "@/components/ui/picture-rail-gallery";
import { ArrowLeft, ArrowUpRight, Maximize2, X } from "lucide-react";
import { useState } from "react";

const img = (name: string) => `${import.meta.env.BASE_URL}stiller/${name}.webp`;

// Style references we can build in; shown as "örnek tasarım", never as ai-ulu client work.
const STILLER: PictureRailItem[] = [
  { id: "ic-mimarlik", title: "İç Mimarlık Stüdyosu", artist: "Sade, fotoğraf odaklı", image: img("interiia"), aspect: 4 / 3, frame: "black", mat: true, drop: 0.04, tag: "Örnek tasarım", details: ["Proje galerisi", "Hizmetler ve süreç", "Keşif randevusu formu"] },
  { id: "ajans", title: "Dijital Ajans", artist: "Cesur tipografi", image: img("rekolet"), aspect: 4 / 3, frame: "white", mat: true, drop: 0.12, tag: "Örnek tasarım", details: ["Vaka çalışmaları", "Hizmet paketleri", "Teklif formu"] },
  { id: "kuafor", title: "Kuaför ve Berber", artist: "Sıcak, samimi", image: img("scissor"), aspect: 4 / 3, frame: "oak", drop: -0.02, tag: "Örnek tasarım", details: ["Hizmet ve fiyat listesi", "Ekip tanıtımı", "WhatsApp randevu"] },
  { id: "hukuk", title: "Hukuk Bürosu", artist: "Ciddi, güven veren", image: img("kafka"), aspect: 4 / 3, frame: "black", mat: true, drop: 0.16, tag: "Örnek tasarım", details: ["Uzmanlık alanları", "Avukat profilleri", "Ön görüşme formu"] },
  { id: "spor", title: "Spor Salonu", artist: "Enerjik, koyu tema", image: img("flexfitness"), aspect: 1400 / 950, frame: "oak", drop: 0.06, tag: "Örnek tasarım", details: ["Ders programı", "Üyelik paketleri", "Deneme dersi kaydı"] },
  { id: "dis", title: "Diş Kliniği", artist: "Temiz, ferah", image: img("eviadental"), aspect: 4 / 3, frame: "white", mat: true, drop: 0, tag: "Örnek tasarım", details: ["Tedaviler", "Hekim kadrosu", "Online randevu"] },
  { id: "konaklama", title: "Butik Konaklama", artist: "İskandinav sadeliği", image: img("skandic"), aspect: 4 / 3, frame: "black", drop: 0.1, tag: "Örnek tasarım", details: ["Oda galerisi", "Müsaitlik ve fiyat", "Rezervasyon talebi"] },
  { id: "restoran", title: "Restoran", artist: "Atmosferik, iştah açan", image: img("tallow"), aspect: 4 / 3, frame: "oak", mat: true, drop: 0.03, tag: "Örnek tasarım", details: ["Menü", "Şef ve hikâye", "Masa rezervasyonu"] },
];

const LABELS: PictureRailGalleryLabels = { front: "Ön yüz", back: "Arka yüz", close: "Kapat", open: "Büyütmek için tıklayın" };

// Single source for the WhatsApp handoff; the message names the style the
// visitor is looking at, so the conversation starts with context.
const WHATSAPP = "905079581642";
const waLink = (text: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;

// Full-size view on top of the gallery's own detail dialog. Key events stop here so the dialog behind stays open.
function FullView({ item, onClose }: { item: PictureRailItem; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} — tam ekran`}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") { event.stopPropagation(); onClose(); }
        if (event.key === "Tab") { event.stopPropagation(); event.preventDefault(); }
      }}
    >
      <img src={item.image} alt={`${item.title} örnek tasarımı`} className="max-h-[92svh] max-w-full rounded-lg object-contain shadow-2xl" />
      <button
        type="button"
        autoFocus
        onClick={onClose}
        className="absolute right-5 top-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-card px-4 text-sm text-card-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        Kapat <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function App() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isFull, setIsFull] = useState(false);
  const openItem = openIndex === null ? null : STILLER[openIndex];

  return (
    <main className="flex min-h-svh flex-col bg-background text-foreground">
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10">
        <a href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden="true" /> ai-ulu
        </a>
        <span className="font-serif text-xl">ai-ulu</span>
      </nav>

      <div className="flex flex-1 items-center">
        <PictureRailGallery
          items={STILLER}
          labels={LABELS}
          eyebrow="Örnek tasarımlar · Sektöre göre"
          heading="Hangi tarz sizin işinize uyar?"
          caption="Çerçevelerin üzerinde gezinin, birine tıklayıp yakından bakın, arkasını çevirip içeriği görün."
          autoplay
          onOpenChange={(index) => { setOpenIndex(index); if (index === null) setIsFull(false); }}
          action={
            <a
              href={waLink(openItem ? `${openItem.title} tarzında bir site istiyorum.` : "Örnek tasarımlarınızı gördüm, bir site istiyorum.")}
              rel="noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition-transform hover:-translate-y-px focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
            >
              Bu tarzda bir site istiyorum <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          }
        />
      </div>

      <p className="px-6 pb-6 text-center text-xs text-muted-foreground">
        Görseller tarz örneğidir; siteniz markanıza ve içeriğinize göre sıfırdan tasarlanır.
      </p>

      {openItem && !isFull && (
        <button
          type="button"
          onClick={() => setIsFull(true)}
          className="fixed bottom-6 left-1/2 z-[60] inline-flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Maximize2 className="size-4" aria-hidden="true" /> Tam ekran gör
        </button>
      )}
      {openItem && isFull && <FullView item={openItem} onClose={() => setIsFull(false)} />}
    </main>
  );
}
