import React from 'react'
import PanelHeader from "@/components/Market/PanelHeader";

const STEPS = [
    {
        step: "01",
        title: "Upload your CV",
        body: "A PDF is enough. Jobradar reads it and pulls out the skills you already have."
    },
    {
        step: "02",
        title: "We scan live jobs",
        body: "It then analyzes current job ads and counts which skills employers actually ask for."
    },
    {
        step: "03",
        title: "See the comparison",
        body: "Colour-coded charts show the market's demand, the skills you cover, and the gaps worth closing."
    },
    {
        step: "04",
        title: "Start with the best fits",
        body: "Every posting is scored against your CV, so you know which jobs to look at first."
    }
] as const;

const TABS = [
    {label: "Overview", body: "The headline numbers of your analysis at a glance."},
    {label: "Skills", body: "What the market wants next to what your CV already covers."},
    {label: "Gaps", body: "The missing skills employers ask for the most."},
    {label: "Matches", body: "Live postings ranked by how well they fit you."}
] as const;

/**
 * The plain-words "what does this app do" section on the landing page,
 * dressed in the same editorial green panel as the dashboard's hero chart so
 * visitors see the house style before they ever upload a CV.
 */
const About = () => (
    <section
        id={"about"}
        aria-label={"About Jobradar"}
        className={"border-b-0"}
    >
        <div className={"mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:py-12 lg:px-8"}>
        <PanelHeader
            title={"What Jobradar does"}
            qualifier={""}
            lead={"A market report for your career: your CV on one side, live job postings on the other"}
        />

        <ol className={"grid gap-3 sm:grid-cols-2 lg:grid-cols-4"}>
            {STEPS.map(({step, title, body}) => (
                <li
                    key={step}
                    className={"flex flex-col gap-2 rounded-xl border border-border bg-card p-4"}
                >
                    <span className={"font-mono text-xs font-bold text-accent-lime"}>{step}</span>
                    <h3 className={"font-heading text-sm font-bold uppercase tracking-[0.05em]"}>
                        {title}
                    </h3>
                    <p className={"text-xs leading-relaxed text-muted-foreground"}>{body}</p>
                </li>
            ))}
        </ol>

        <div className={"flex flex-col gap-3"}>
            <h3 className={"text-center font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground"}>
                Inside the dashboard
            </h3>
            <ul className={"grid gap-x-6 gap-y-2 sm:grid-cols-2"}>
                {TABS.map(({label, body}) => (
                    <li
                        key={label}
                        className={"flex items-baseline gap-3 border-t border-border py-2.5 text-sm"}
                    >
                        <span className={"shrink-0 font-mono text-xs font-bold uppercase tracking-[0.1em] text-accent-lime"}>
                            {label}
                        </span>
                        <span className={"text-muted-foreground"}>{body}</span>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    </section>
)
export default About
