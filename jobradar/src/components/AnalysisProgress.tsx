'use client'

import React, {useEffect, useState} from 'react'

/**
 * Typical warm run. The bar is paced against this, not against real progress —
 * the API returns one response at the end and reports nothing in between.
 */
const EXPECTED_SECONDS = 45;

/** Past this, a cold start is the likely explanation and the copy says so. */
const COLD_START_HINT_SECONDS = 50;

/** The bar never implies completion it cannot know about. */
const MAX_PROGRESS = 92;

function formatElapsed(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

/**
 * Keeps a long wait legible. The analysis runs for tens of seconds — longer
 * when the container is waking from zero replicas — and a static line for that
 * long reads as a hung page, which is the point most people reload and lose
 * the request.
 */
const AnalysisProgress = () => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const started = Date.now();
        const id = setInterval(
            () => setElapsed(Math.floor((Date.now() - started) / 1000)),
            1000
        );
        return () => clearInterval(id);
    }, []);

    const progress = Math.min(MAX_PROGRESS, (elapsed / EXPECTED_SECONDS) * MAX_PROGRESS);
    const cold = elapsed >= COLD_START_HINT_SECONDS;

    return (
        <div className={"flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4"}>
            <div className={"flex items-baseline justify-between gap-4"}>
                <span className={"font-mono text-[11px] uppercase tracking-[0.16em] text-primary"}>
                    Analyzing
                </span>
                <span className={"font-mono text-[11px] tabular-nums text-muted-foreground"}>
                    {formatElapsed(elapsed)}
                </span>
            </div>

            <div
                className={"h-1 w-full overflow-hidden rounded-full bg-muted"}
                role={"progressbar"}
                aria-label={"Analysis in progress"}
                aria-valuetext={`${formatElapsed(elapsed)} elapsed`}
            >
                <div
                    className={"h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"}
                    style={{width: `${progress}%`}}
                />
            </div>

            <p className={"text-sm text-muted-foreground"}>
                {cold
                    ? "Still working. The first run after a quiet spell has to start the analysis service, which adds around half a minute."
                    : "Scanning live job postings and scoring them against your CV."}
                {" "}Leave this tab open.
            </p>
        </div>
    )
}
export default AnalysisProgress
