"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import TurntableScroll from "./components/TurntableScroll";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";

const AudioProvider = dynamic(() => import("./components/AudioProvider"), {
  ssr: false,
});

export default function Home() {
  return (
    <AudioProvider>
      <main className="bg-[#131313] min-h-screen">
        <Navbar />
        <TurntableScroll />
        <AboutSection />
        <Footer />
      </main>
    </AudioProvider>
  );
}
