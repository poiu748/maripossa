import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InfoStrip } from "@/components/InfoStrip";
import { Menu } from "@/components/Menu";
import { Reviews } from "@/components/Reviews";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CartBar } from "@/components/CartBar";
import { CartSheet } from "@/components/CartSheet";
import { CustomizeSheet } from "@/components/CustomizeSheet";

export default function Home() {
  return (
    <main id="top" className="relative min-h-screen w-full overflow-x-hidden bg-crust">
      <Header />
      <Hero />
      <InfoStrip />
      <Menu />
      <Reviews />
      <Contact />
      <Footer />

      <CartBar />
      <CartSheet />
      <CustomizeSheet />
    </main>
  );
}
