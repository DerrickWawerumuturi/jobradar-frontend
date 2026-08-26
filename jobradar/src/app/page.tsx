import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LandscapePreview from "@/components/LandscapePreview";
import About from "@/components/About";
import Faq from "@/components/Faq";

export default function Home() {
  return (
      <div className={"flex min-h-screen flex-col"}>
        <Navbar />
        <main className={"flex flex-1 flex-col gap-14"}>
          <Hero />
          <LandscapePreview />
          {/* About fades into the FAQ, and the navy band runs to the page bottom. */}
          <div className={"flex flex-1 flex-col"}>
            <About />
            {/*<div*/}
            {/*    aria-hidden*/}
            {/*    className={"h-24 shrink-0"}*/}
            {/*    style={{background: "linear-gradient(180deg, var(--panel-maroon), var(--panel-navy))"}}*/}
            {/*/>*/}
            <Faq />
          </div>
        </main>

        {/* The footer lives inside the navy band, closing the page. */}
        <footer className={"chart-band chart-panel-navy flex flex-wrap items-center justify-between gap-3 border-b-0 px-5 py-6 lg:px-8"}>
          <span className={"font-heading text-sm font-bold uppercase tracking-tight"}>
            Jobradar<span className={"text-primary"}>.</span>
          </span>
          <span className={"font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"}>
            Upload a CV · read the market · close the gap
          </span>
        </footer>
      </div>
  )
}
