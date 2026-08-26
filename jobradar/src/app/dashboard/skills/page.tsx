'use client'

import React from 'react'
import {useAnalysis} from "@/lib/analysis-store";
import SkillDemandChart from "@/components/Market/SkillDemandChart";
import UserSkillPresence from "@/components/Market/UserSkillPresence";
import SkillLandscape from "@/components/Market/SkillLandscape";

export default function DashboardSkillsPage() {
    const {analysis} = useAnalysis();
    if (!analysis) return null;

    const {market} = analysis;

    return (
        <div className={"flex flex-col gap-10"}>
            <SkillDemandChart skills={market.top_skills} />
            <UserSkillPresence
                userSkills={market.user_skill_presence}
                topSkills={market.top_skills}
            />
            <SkillLandscape
                userSkills={market.user_skill_presence}
                gaps={market.skill_gaps}
            />
        </div>
    )
}
