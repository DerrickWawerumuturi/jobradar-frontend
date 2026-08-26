'use client'

import React from 'react'
import {useAnalysis} from "@/lib/analysis-store";
import SkillGapChart from "@/components/Market/SkillGapChart";

export default function DashboardGapsPage() {
    const {analysis} = useAnalysis();
    if (!analysis) return null;

    return (
        <SkillGapChart
            gaps={analysis.market.skill_gaps}
            jobsAnalyzed={analysis.market.jobs_analyzed}
        />
    )
}
