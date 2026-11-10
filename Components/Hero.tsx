import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-16 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:py-28">
        {/* Left column — copy */}
        <div className="max-w-xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-4 w-[3px] bg-[#225e4d]" />
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#225e4d]">
              Shaping Smarter Finance
            </span>
          </div>

          <h1 className="font-bold leading-[1.04] tracking-tight text-[#454648] text-[32px] sm:text-[40px] md:text-[46px] lg:text-[42px] xl:text-[48px]">
            Autonomous FinTech systems for maximum throughput.
          </h1>

          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-[#454648]/80">
            We streamline the complete asset lifecycle through modular, zero-latency SaaS systems that integrate instantly.
          </p>

          <Link
            href="/contact"
            className="group mt-9 inline-flex items-center gap-8 rounded-full bg-[#225e4d] py-2.5 pl-7 pr-2.5 text-[16px] font-semibold text-white transition-colors duration-200 hover:bg-[#1b4d3f]"
          >
            Get in touch
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#454648] transition-transform duration-200 group-hover:rotate-45">
              <ArrowUpRight size={18} />
            </span>
          </Link>
        </div>

        {/* Right column — visual */}
        <div className="relative mx-auto flex w-full max-w-[600px] items-center justify-center lg:mx-0 lg:ml-auto">
          <div className="relative w-full aspect-[1440/808] overflow-hidden">
            <img
              src="/robot-gif.gif"
              alt="Autonomous AI Systems"
              width={1440}
              height={808}
              decoding="async"
              fetchPriority="low"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}