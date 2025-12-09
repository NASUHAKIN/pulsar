// Gamification system - badges and achievements

export interface Badge {
    id: string
    name: string
    description: string
    icon: string
    color: string
    requirement: string
}

export interface MemberBadge {
    memberId: string
    badgeId: string
    earnedAt: string
}

export const BADGES: Badge[] = [
    {
        id: 'streak_7',
        name: '🔥 7-Day Streak',
        description: 'Submitted check-ins for 7 consecutive days',
        icon: '🔥',
        color: 'from-orange-500 to-red-500',
        requirement: 'Submit 7 check-ins in a row'
    },
    {
        id: 'streak_30',
        name: '🚀 30-Day Warrior',
        description: 'Submitted check-ins for 30 consecutive days',
        icon: '🚀',
        color: 'from-purple-500 to-pink-500',
        requirement: 'Submit 30 check-ins in a row'
    },
    {
        id: 'helpful',
        name: '🤝 Team Helper',
        description: 'Received 10+ kudos from teammates',
        icon: '🤝',
        color: 'from-blue-500 to-cyan-500',
        requirement: 'Receive 10 kudos'
    },
    {
        id: 'wordsmith',
        name: '✍️ Wordsmith',
        description: 'Average word count over 200',
        icon: '✍️',
        color: 'from-green-500 to-emerald-500',
        requirement: 'Maintain 200+ avg words'
    },
    {
        id: 'early_bird',
        name: '🌅 Early Submitter',
        description: 'Submitted 10+ check-ins before 9 AM',
        icon: '🌅',
        color: 'from-yellow-500 to-orange-500',
        requirement: 'Submit 10 early check-ins'
    },
    {
        id: 'problem_solver',
        name: '🎯 Problem Solver',
        description: 'Resolved 20+ action items',
        icon: '🎯',
        color: 'from-indigo-500 to-purple-500',
        requirement: 'Complete 20 action items'
    },
    {
        id: 'innovator',
        name: '💡 Innovator',
        description: 'Shared 5+ innovative ideas',
        icon: '💡',
        color: 'from-pink-500 to-rose-500',
        requirement: 'Share 5 ideas'
    },
    {
        id: 'mvp_month',
        name: '🏆 Monthly MVP',
        description: 'Selected as MVP of the month',
        icon: '🏆',
        color: 'from-yellow-400 to-yellow-600',
        requirement: 'Win monthly MVP vote'
    }
]

const STORAGE_KEY = 'antigravity_member_badges'

export function getMemberBadges(memberId: string): MemberBadge[] {
    const allBadges: MemberBadge[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return allBadges.filter(b => b.memberId === memberId)
}

export function awardBadge(memberId: string, badgeId: string): MemberBadge {
    const badges: MemberBadge[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

    // Check if already has badge
    const existing = badges.find(b => b.memberId === memberId && b.badgeId === badgeId)
    if (existing) return existing

    const newBadge: MemberBadge = {
        memberId,
        badgeId,
        earnedAt: new Date().toISOString()
    }

    badges.push(newBadge)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(badges))

    return newBadge
}

export function getBadgeInfo(badgeId: string): Badge | undefined {
    return BADGES.find(b => b.id === badgeId)
}

// Auto-award badges based on activity
export function checkAndAwardBadges(memberId: string): MemberBadge[] {
    const awarded: MemberBadge[] = []

    // Import required functions
    const checkIns = JSON.parse(localStorage.getItem('antigravity_checkins') || '[]')
        .filter((c: any) => c.memberId === memberId)

    const kudos = JSON.parse(localStorage.getItem('antigravity_kudos') || '[]')
        .filter((k: any) => k.toMemberId === memberId)

    // Check streak (simplified - just count recent check-ins)
    if (checkIns.length >= 7) {
        const badge = awardBadge(memberId, 'streak_7')
        if (badge) awarded.push(badge)
    }

    if (checkIns.length >= 30) {
        const badge = awardBadge(memberId, 'streak_30')
        if (badge) awarded.push(badge)
    }

    // Check kudos
    if (kudos.length >= 10) {
        const badge = awardBadge(memberId, 'helpful')
        if (badge) awarded.push(badge)
    }

    // Check word count
    if (checkIns.length > 0) {
        const avgWords = checkIns.reduce((sum: number, c: any) => {
            const text = Object.values(c).join(' ')
            return sum + text.split(/\s+/).length
        }, 0) / checkIns.length

        if (avgWords >= 200) {
            const badge = awardBadge(memberId, 'wordsmith')
            if (badge) awarded.push(badge)
        }
    }

    return awarded
}
