import React from 'react'
import PanelHeader from "@/components/Market/PanelHeader";

const FAQS = [
    {
        q: "What do I need to start?",
        a: "Just your CV as a PDF. No account, no sign-up — upload it and the analysis starts."
    },
    {
        q: "How long does it take?",
        a: "A few minutes. Jobradar scans live job postings and scores each one against your CV, so leave the tab open while it runs."
    },
    {
        q: "What will I actually see?",
        a: "Four views: the market's headline numbers, its most-wanted skills next to yours, the gaps worth closing, and real postings ranked by how well they fit you."
    },
    {
        q: "Do I have to re-upload every time?",
        a: "No. Your last analysis stays on this device, so you can come back to the dashboard any time until you run a new one."
    },
    {
        q: "Is a low score a bad sign?",
        a: "No. Scores measure overlap with one batch of postings, not your employability — read a low number as a to-learn list, not a verdict."
    }
] as const;

/** Quick answers to the questions people have before uploading a CV. */
const Faq = () => (
    <section
        id={"faq"}
        aria-label={"Frequently asked questions"}
        className={"chart-band chart-panel-navy flex-1 border-y-0"}
    >
        <div className={"mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:py-12 lg:px-8"}>
            <PanelHeader
                title={"FAQ"}
                qualifier={""}
                lead={"The short version of everything people ask before uploading"}
            />

            <ul className={"flex flex-col"}>
                {FAQS.map(({q, a}) => (
                    <li
                        key={q}
                        className={"flex flex-col gap-1.5 border-t border-border py-4 sm:flex-row sm:gap-10"}
                    >
                        <h3 className={"shrink-0 font-heading text-sm font-bold uppercase tracking-[0.04em] sm:w-60"}>
                            {q}
                        </h3>
                        <p className={"text-sm leading-relaxed text-muted-foreground"}>{a}</p>
                    </li>
                ))}
            </ul>
        </div>
    </section>
)
export default Faq
