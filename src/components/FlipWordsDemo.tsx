import React from "react";
import { FlipWords } from "@/components/ui/flip-words";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";

export function FlipWordsDemo() {
  const words = ["better", "Easy", "Beautiful", "Modern", "Fast", "Powerful"];
  const text = `source code siap pakai dan layanan konsultasi untuk membangun website, aplikasi, atau solusi digital sesuai kebutuhan.`;
  const desktop = [
    {
      text: "Build",
    },
    {
      text: "Websites",
    },
    {
      text: "With",
    },
    {
      text: "Zacode",
      className: "text-gradient-triple animate-text-shimmer",
    },
  ];

  return (
    <div className=" flex flex-col justify-center items-center ">
      <div className="text-[32px] lg:text-5xl font-extrabold text-neutral-600 dark:text-neutral-400 leading-tight lg:leading-snug block md:hidden">
        Build
        <FlipWords words={words} /> <br />
        websites with Zacode
      </div>

      <div className="text-[32px] lg:text-5xl font-extrabold text-neutral-600 dark:text-neutral-100 leading-tight lg:leading-snug  hidden md:flex">
        <TypewriterEffectSmooth words={desktop} />
      </div>

      <TextGenerateEffect words={text} />
    </div>
  );
}
