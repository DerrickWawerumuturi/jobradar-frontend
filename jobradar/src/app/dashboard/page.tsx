'use client'

import React from 'react'
import {useAnalysis} from "@/lib/analysis-store";
import MarketOverview from "@/components/Market/MarketOverview";
import SkillCoverage from "@/components/Market/SkillCoverage";

export default function DashboardOverviewPage() {
    const {analysis} = useAnalysis();
    if (!analysis) return null;

    return (
        <div className={"flex flex-col gap-10"}>
            <MarketOverview market={analysis.market} />
            <SkillCoverage coverage={analysis.market.skill_coverage} />
        </div>
    )
}
