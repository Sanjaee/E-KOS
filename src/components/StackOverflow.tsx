import Image from "next/image";
import React from "react";
import { Timeline } from "@/components/ui/timeline";


export function StackOverflow() {
  const data = [
    {
      title: "Programming, scripting, and markup languages",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            JavaScript has been a mainstay in the developer survey and on Stack
            Overflow since our first survey. The most popular programming
            language has been JavaScript every year we have done the survey
            except for 2013 and 2014, when SQL was the most popular language.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748223/folder%20BLOG%20ZACODE/ANALISIS/bahasa_rvt0yr.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Databases",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            PostgreSQL debuted in the developer survey in 2018 when 33% of
            developers reported using it, compared with the most popular option
            that year: MySQL, in use by 59% of developers. Six years later,
            PostgreSQL is used by 49% of developers and is the most popular
            database for the second year in a row.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748527/folder%20BLOG%20ZACODE/ANALISIS/db_utf5wp.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Cloud platforms",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            AWS' share of usage amongst respondents is the same in 2024 as in
            2023, while Azure and Google Cloud increased their share. Azure has
            climbed from 26% to 28% usage and Google Cloud went from 24% to 25%.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748527/folder%20BLOG%20ZACODE/ANALISIS/cld_yhk5x6.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Web frameworks and technologies",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Node.js peaked in 2020 with its highest recorded usage score of 51%.
            While not as popular, it's still the most used web technology in the
            survey this year and has increased popularity among those learning
            to code from last year.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748528/folder%20BLOG%20ZACODE/ANALISIS/fram_od8sln.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Embedded Technologies",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Embedded technologies is a new sub-section of the developer survey
            this year. 30% of developers are using Raspberry Pi, making it the
            first most popular embedded technology in the Developer Survey.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748527/folder%20BLOG%20ZACODE/ANALISIS/emtech_qiduil.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Other frameworks and libraries",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            .NET is the most used among other frameworks and libraries again
            this year for all developers. Those learning to code are using NumPy
            and Pandas the most (as they were last year).
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748524/folder%20BLOG%20ZACODE/ANALISIS/framlib_nrl5hm.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Other tools",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Docker is used the most by professional developers (59%) and npm is
            used the most by developers learning to code (45%).
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748531/folder%20BLOG%20ZACODE/ANALISIS/tool_qiahpt.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Integrated development environment",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Visual Studio Code is used by more than twice as many developers
            than its nearest (and related) alternative, Visual Studio.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748531/folder%20BLOG%20ZACODE/ANALISIS/coditor_ludtfo.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Asynchronous tools",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Jira and Confluence top the list for most used asynchronous tools
            developers use for the third year.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748523/folder%20BLOG%20ZACODE/ANALISIS/asytoll_xtmsh5.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Synchronous tools",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Teams is the most popular synchronous tool for professional
            developers (and overall) while Discord is the most popular amongst
            those learning to code.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748530/folder%20BLOG%20ZACODE/ANALISIS/sytool_awkf0i.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },

    {
      title: "Operating system",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Windows is the most popular operating system for developers, across
            both personal and professional use.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/dgmlqboeq/image/upload/v1729748531/folder%20BLOG%20ZACODE/ANALISIS/os_mcfh7j.png"
              alt="startup template"
              width={500}
              height={500}
              className="rounded-lg  w-full shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]"
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}
