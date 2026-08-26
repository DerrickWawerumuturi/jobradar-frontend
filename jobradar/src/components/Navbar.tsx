'use client'

import React from 'react'
import Link from "next/link";
import {useAnalysis} from "@/lib/analysis-store";
import BackendStatus from "@/components/BackendStatus";

const Navbar = () => {
    const {analysis, hydrated} = useAnalysis();

    return (
        <header className={"flex items-center justify-between gap-4  px-5 py-5 lg:px-8"}>
            <div className={"flex flex-col gap-1"}>
                <Link
                    href={"/"}
                    className={"font-heading text-2xl font-bold uppercase leading-none tracking-tight"}
                >
                    Jobradar<span className={"text-primary"}>.</span>
                </Link>
                <span className={"font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground"}>
                    Market intelligence
                </span>
            </div>

            <div className={"flex items-center gap-4"}>
                <BackendStatus />

                <Link
                    href={"/#about"}
                    className={"font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"}
                >
                    About
                </Link>

                {hydrated && analysis && (
                    <Link
                        href={"/dashboard"}
                        className={"hidden sm:flex rounded-md border border-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"}
                    >
                        View last analysis
                    </Link>
                )}
            </div>
        </header>
    )
}
export default Navbar
