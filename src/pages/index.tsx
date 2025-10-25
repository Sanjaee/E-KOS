import localFont from "next/font/local";
import { renderCanvas } from "../Theme/renderCanvas";
import { useEffect } from "react";
import { useContext, useRef } from "react";
import { ScrollContext } from "@/Theme/ScrollProvider";
import { FlipWordsDemo } from "@/components/FlipWordsDemo";
import { HoverBorderGradientDemo } from "@/components/HoverBorderGradientDemo";
import { LinkPreviewDemo } from "@/components/LinkPreviewDemo";
import PopupCard from "@/components/Popup";
import Main from "@/components/Main";
import { MacbookScrollDemo } from "@/components/ParalaxMac";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollY } = useContext(ScrollContext);
  let progress = 0;
  const { current: elContainer } = ref;

  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  useEffect(() => {
    renderCanvas();
  }, []);
  return (
    <>
      <div
        className={`${geistSans.variable} ${geistMono.variable}items-center justify-items-center min-h-screen bg-lightBg text-lightText dark:bg-darkBg dark:text-darkText font-[family-name:var(--font-geist-sans)]`}
      >
        <PopupCard />
        <canvas
          className="bg-skin-base pointer-events-none absolute inset-0"
          id="canvas"
        ></canvas>
        <div className="w-full flex flex-col justify-center items-center min-h-screen">
          <FlipWordsDemo />
          <HoverBorderGradientDemo />
          <LinkPreviewDemo />
        </div>
        <MacbookScrollDemo />
      </div>
      <Main />
    </>
  );
}
