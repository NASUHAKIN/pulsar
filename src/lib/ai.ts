import type { CheckIn, Member } from "./storage";

export interface AISummaryType {
    summary: string;
    top3Points: string[];
    blockers: string[];
    achievements: string[];
    topRisks: { risk: string; severity: 'high' | 'medium' | 'low' }[];
    sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
}

export interface MemberHighlight {
    memberId: string;
    highlights: string[];
}

export async function generateTeamSummary(
    checkIns: CheckIn[],
    _members: Member[]
): Promise<AISummaryType> {
    if (checkIns.length === 0) {
        return {
            summary: "No check-ins available for this period.",
            top3Points: ["No activity to report"],
            blockers: [],
            achievements: [],
            topRisks: [],
            sentiment: 'neutral'
        };
    }

    // Extract all blockers and risks
    const allBlockers = checkIns
        .map(c => c.blockers || c.riskAssessment || '')
        .filter(b => b.trim().length > 0);

    // Extract achievements
    const achievements = checkIns
        .map(c => c.accomplishments || c.keyAchievements || c.yesterday || c.dealsClosed || '')
        .filter(a => a.trim().length > 0)
        .slice(0, 5);

    // Identify top risks
    const risks = allBlockers.map(blocker => {
        const severity = blocker.toLowerCase().includes('critical') || blocker.toLowerCase().includes('urgent')
            ? 'high' as const
            : blocker.toLowerCase().includes('minor')
                ? 'low' as const
                : 'medium' as const;
        return { risk: blocker, severity };
    }).slice(0, 3);

    // Determine sentiment
    const hasBlockers = allBlockers.length > 0;
    const hasCriticalBlockers = risks.some(r => r.severity === 'high');
    const sentiment = hasCriticalBlockers ? 'critical' : hasBlockers ? 'negative' : 'positive';

    // Generate 3-point summary
    const top3Points = generateTop3Points(checkIns, allBlockers, achievements);

    // Create executive summary
    const summary = `
**Team Update:** ${checkIns.length} team members submitted updates.
${achievements.length > 0 ? `\n**Key Progress:** Team made significant progress with ${achievements.length} notable achievements.` : ''}
${allBlockers.length > 0 ? `\n**Attention Needed:** ${allBlockers.length} blocker(s) identified that need resolution.` : '\n**Status:** Team is on track with no major blockers.'}
    `.trim();

    return {
        summary,
        top3Points,
        blockers: allBlockers,
        achievements,
        topRisks: risks,
        sentiment
    };
}

function generateTop3Points(checkIns: CheckIn[], blockers: string[], achievements: string[]): string[] {
    const points: string[] = [];

    // Point 1: Activity summary
    points.push(`${checkIns.length} team members provided updates with ${achievements.length} achievements reported`);

    // Point 2: Progress or blockers
    if (blockers.length === 0) {
        points.push("Team is progressing smoothly with no critical blockers");
    } else {
        points.push(`${blockers.length} blocker(s) require attention and resolution`);
    }

    // Point 3: Specific highlight or action item
    if (blockers.length > 0) {
        const firstBlocker = blockers[0].substring(0, 60) + (blockers[0].length > 60 ? '...' : '');
        points.push(`Priority: Address "${firstBlocker}"`);
    } else if (achievements.length > 0) {
        const topAchievement = achievements[0].substring(0, 60) + (achievements[0].length > 60 ? '...' : '');
        points.push(`Highlight: ${topAchievement}`);
    } else {
        points.push("Team maintaining steady progress");
    }

    return points.slice(0, 3);
}

export function extractRisksAndBlockers(checkIns: CheckIn[]): { risk: string; severity: 'high' | 'medium' | 'low'; source: string }[] {
    const risks: { risk: string; severity: 'high' | 'medium' | 'low'; source: string }[] = [];

    checkIns.forEach(checkIn => {
        const blockerText = checkIn.blockers || checkIn.riskAssessment || '';
        if (blockerText.trim()) {
            const severity = blockerText.toLowerCase().includes('critical') || blockerText.toLowerCase().includes('urgent')
                ? 'high' as const
                : blockerText.toLowerCase().includes('minor')
                    ? 'low' as const
                    : 'medium' as const;

            risks.push({
                risk: blockerText,
                severity,
                source: checkIn.memberId
            });
        }
    });

    return risks.sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
    }).slice(0, 3);
}

export function generateMemberHighlights(checkIns: CheckIn[], member: Member): MemberHighlight {
    const memberCheckIns = checkIns.filter(c => c.memberId === member.id);
    const highlights: string[] = [];

    if (memberCheckIns.length === 0) {
        return { memberId: member.id, highlights: ["No recent activity"] };
    }

    // Extract key contributions
    memberCheckIns.forEach(checkIn => {
        const achievement = checkIn.accomplishments || checkIn.keyAchievements || checkIn.dealsClosed || checkIn.codeChanges;
        if (achievement && achievement.trim()) {
            const preview = achievement.substring(0, 80) + (achievement.length > 80 ? '...' : '');
            highlights.push(preview);
        }
    });

    if (highlights.length === 0) {
        highlights.push("Consistent participation in team check-ins");
    }

    return {
        memberId: member.id,
        highlights: highlights.slice(0, 3)
    };
}

export function analyzeSubmitPatterns(checkIns: CheckIn[], members: Member[]): {
    consistentContributors: string[];
    needsFollowUp: string[];
    averageResponseLength: number;
} {
    const memberSubmissions = new Map<string, number>();
    let totalWords = 0;

    members.forEach(m => memberSubmissions.set(m.id, 0));

    checkIns.forEach(c => {
        memberSubmissions.set(c.memberId, (memberSubmissions.get(c.memberId) || 0) + 1);
        // Simple word count
        const allText = Object.values(c).join(' ');
        totalWords += allText.split(/\s+/).length;
    });

    const consistentContributors = members
        .filter(m => (memberSubmissions.get(m.id) || 0) >= 2)
        .map(m => m.id);

    const needsFollowUp = members
        .filter(m => (memberSubmissions.get(m.id) || 0) === 0)
        .map(m => m.id);

    const averageResponseLength = checkIns.length > 0 ? Math.round(totalWords / checkIns.length) : 0;

    return {
        consistentContributors,
        needsFollowUp,
        averageResponseLength
    };
}
