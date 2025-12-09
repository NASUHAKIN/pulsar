export interface CheckInTemplate {
    id: string
    name: string
    description: string
    sector?: 'engineering' | 'product' | 'sales' | 'general'
    fields: {
        key: string
        label: string
        placeholder: string
        required: boolean
        multiline: boolean
    }[]
}

export const CHECK_IN_TEMPLATES: CheckInTemplate[] = [
    {
        id: 'daily',
        name: 'Daily Standup',
        description: 'Quick daily update for agile teams',
        sector: 'general',
        fields: [
            {
                key: 'yesterday',
                label: 'What did you do yesterday?',
                placeholder: 'e.g., Completed user authentication module, fixed 3 bugs...',
                required: true,
                multiline: true
            },
            {
                key: 'today',
                label: 'What will you do today?',
                placeholder: 'e.g., Start working on dashboard analytics...',
                required: true,
                multiline: true
            },
            {
                key: 'blockers',
                label: 'Any blockers or challenges?',
                placeholder: 'e.g., Waiting for API documentation...',
                required: false,
                multiline: true
            },
            {
                key: 'kudos',
                label: 'Shoutouts & Kudos (optional)',
                placeholder: 'Recognize a teammate who helped you...',
                required: false,
                multiline: true
            }
        ]
    },
    {
        id: 'weekly',
        name: 'Weekly Update',
        description: 'Comprehensive weekly progress report',
        sector: 'general',
        fields: [
            {
                key: 'accomplishments',
                label: 'What did you accomplish this week?',
                placeholder: 'List your key achievements and completed tasks...',
                required: true,
                multiline: true
            },
            {
                key: 'nextWeekPlans',
                label: 'What are your plans for next week?',
                placeholder: 'Outline your priorities and goals...',
                required: true,
                multiline: true
            },
            {
                key: 'blockers',
                label: 'Any blockers or risks?',
                placeholder: 'Highlight challenges that need attention...',
                required: false,
                multiline: true
            },
            {
                key: 'kudos',
                label: 'Team Appreciation (optional)',
                placeholder: 'Give a shoutout to someone who made a difference this week...',
                required: false,
                multiline: true
            }
        ]
    },
    {
        id: 'monthly',
        name: 'Monthly Progress',
        description: 'High-level monthly review',
        sector: 'general',
        fields: [
            {
                key: 'monthlySummary',
                label: 'Monthly Summary',
                placeholder: 'Overview of the month...',
                required: true,
                multiline: true
            },
            {
                key: 'keyAchievements',
                label: 'Key Achievements',
                placeholder: 'Major wins and milestones...',
                required: true,
                multiline: true
            },
            {
                key: 'metrics',
                label: 'Metrics & KPIs',
                placeholder: 'Relevant metrics and results...',
                required: false,
                multiline: true
            },
            {
                key: 'nextMonthGoals',
                label: 'Next Month Goals',
                placeholder: 'Priorities for the upcoming month...',
                required: true,
                multiline: true
            }
        ]
    },
    {
        id: 'okr',
        name: 'OKR Check-in',
        description: 'Objectives and Key Results tracking',
        sector: 'general',
        fields: [
            {
                key: 'okrProgress',
                label: 'OKR Progress',
                placeholder: 'Update on your objectives and key results...',
                required: true,
                multiline: true
            },
            {
                key: 'riskAssessment',
                label: 'Risk Assessment',
                placeholder: 'Identify potential risks to achieving OKRs...',
                required: true,
                multiline: true
            },
            {
                key: 'mitigationPlans',
                label: 'Mitigation Plans',
                placeholder: 'How will you address identified risks?...',
                required: false,
                multiline: true
            }
        ]
    },
    {
        id: 'engineering',
        name: 'Engineering Update',
        description: 'Technical team progress',
        sector: 'engineering',
        fields: [
            {
                key: 'codeChanges',
                label: 'Code Changes & Features',
                placeholder: 'Describe code changes, new features, refactorings...',
                required: true,
                multiline: true
            },
            {
                key: 'prs',
                label: 'Pull Requests',
                placeholder: 'PRs submitted, reviewed, or merged...',
                required: false,
                multiline: true
            },
            {
                key: 'technicalDebt',
                label: 'Technical Debt',
                placeholder: 'Any technical debt addressed or identified...',
                required: false,
                multiline: true
            },
            {
                key: 'deploymentStatus',
                label: 'Deployment Status',
                placeholder: 'Deployment updates, releases, infrastructure...',
                required: false,
                multiline: true
            },
            {
                key: 'blockers',
                label: 'Technical Blockers',
                placeholder: 'Technical challenges or dependencies...',
                required: false,
                multiline: true
            }
        ]
    },
    {
        id: 'product',
        name: 'Product Update',
        description: 'Product management focus',
        sector: 'product',
        fields: [
            {
                key: 'featureUpdates',
                label: 'Feature Updates',
                placeholder: 'Features shipped, in progress, or planned...',
                required: true,
                multiline: true
            },
            {
                key: 'userFeedback',
                label: 'User Feedback',
                placeholder: 'Key insights from users...',
                required: true,
                multiline: true
            },
            {
                key: 'productMetrics',
                label: 'Product Metrics',
                placeholder: 'Usage stats, engagement, conversion rates...',
                required: false,
                multiline: true
            },
            {
                key: 'roadmap',
                label: 'Roadmap Updates',
                placeholder: 'Changes or adjustments to the product roadmap...',
                required: false,
                multiline: true
            },
            {
                key: 'blockers',
                label: 'Product Blockers',
                placeholder: 'Dependencies, decisions needed...',
                required: false,
                multiline: true
            }
        ]
    },
    {
        id: 'sales',
        name: 'Sales Update',
        description: 'Sales team performance',
        sector: 'sales',
        fields: [
            {
                key: 'dealsClosed',
                label: 'Deals Closed',
                placeholder: 'Recent wins and closed deals...',
                required: true,
                multiline: true
            },
            {
                key: 'pipeline',
                label: 'Pipeline Status',
                placeholder: 'Current pipeline, opportunities in progress...',
                required: true,
                multiline: true
            },
            {
                key: 'customerFeedback',
                label: 'Customer Feedback',
                placeholder: 'Insights from customer conversations...',
                required: false,
                multiline: true
            },
            {
                key: 'targets',
                label: 'Targets & Forecast',
                placeholder: 'Progress toward targets, forecast updates...',
                required: false,
                multiline: true
            },
            {
                key: 'blockers',
                label: 'Sales Blockers',
                placeholder: 'Challenges in closing deals, needed support...',
                required: false,
                multiline: true
            }
        ]
    }
]

export function getTemplate(templateId: string): CheckInTemplate | undefined {
    return CHECK_IN_TEMPLATES.find(t => t.id === templateId)
}

export function getTemplatesBySector(sector?: 'engineering' | 'product' | 'sales' | 'general'): CheckInTemplate[] {
    if (!sector) return CHECK_IN_TEMPLATES
    return CHECK_IN_TEMPLATES.filter(t => t.sector === sector || t.sector === 'general')
}
