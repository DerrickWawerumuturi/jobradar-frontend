'use client'

import React from 'react'
import {useAnalysis} from "@/lib/analysis-store";
import JobMatches from "@/components/Market/JobMatches";

export default function DashboardJobsPage() {
    const {analysis} = useAnalysis();
    if (!analysis) return null;

    return (
        <JobMatches
            jobs={analysis.ranked_jobs}
            userSkills={analysis.market.user_skill_presence}
        />
    )
}
