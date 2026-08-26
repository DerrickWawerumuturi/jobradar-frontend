'use client'

import React, {useEffect} from 'react'
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

import {useAnalysis} from "@/lib/analysis-store";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import BackendStatus from "@/components/BackendStatus";

const TABS = [
    {href: "/dashboard", label: "Overview"},
    {href: "/dashboard/skills", label: "Skills"},
    {href: "/dashboard/gaps", label: "Gaps"},
    {href: "/dashboard/jobs", label: "Matches"}
] as const;

export default function DashboardLayout({children}: LayoutProps<"/dashboard">) {
    const {analysis, hydrated, fileName, clear} = useAnalysis();
    const pathname = usePathname();
    const router = useRouter();

    // Only redirect once localStorage has actually been read, otherwise the
    // first paint would bounce every visitor back to the landing page.
    useEffect(() => {
        if (hydrated && !analysis) router.replace("/");
    }, [hydrated, analysis, router]);

    if (!hydrated || !analysis) return null;

    return (
        <div className={"mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-5 py-6 lg:px-8"}>
            <header className={"flex flex-col gap-5"}>
                <div className={"flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5"}>
                    <div className={"flex flex-col gap-1.5"}>
                        <Link
                            href={"/"}
                            className={"font-heading text-2xl font-bold uppercase leading-none tracking-tight"}
                        >
                            Jobradar<span className={"text-primary"}>.</span>
                        </Link>
                        <p className={"font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"}>
                            <span className={"text-primary"}>{analysis.market.jobs_analyzed.toLocaleString()}</span>
                            {" "}postings analyzed
                            {fileName ? ` · ${fileName}` : ""}
                        </p>
                    </div>

                    <div className={"flex items-center gap-4"}>
                        <BackendStatus />

                        <Button
                            variant={"outline"}
                            size={"sm"}
                            onClick={() => {
                                clear();
                                router.push("/");
                            }}
                        >
                            New analysis
                        </Button>
                    </div>
                </div>

                <nav className={"flex w-fit max-w-full flex-wrap gap-1 rounded-lg border border-border bg-card p-1"}>
                    {TABS.map((tab) => {
                        const active = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors",
                                    active
                                        ? "bg-secondary text-foreground"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                )}
                            >
                                <span
                                    aria-hidden
                                    className={cn(
                                        "size-1.5 rounded-full transition-colors",
                                        active ? "bg-primary" : "bg-border"
                                    )}
                                />
                                {tab.label}
                            </Link>
                        )
                    })}
                </nav>
            </header>

            {children}
        </div>
    )
}
