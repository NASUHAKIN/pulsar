export interface Member {
    id: string
    name: string
    email: string
    teamId: string
    role: 'leader' | 'member'
    createdAt: string
    password?: string // For member authentication
    // Profile fields
    photoUrl?: string
    bio?: string
    preferences?: MemberPreferences
    joinedAt?: string
}

export interface MemberPreferences {
    theme: 'dark' | 'light' | 'auto'
    language: 'en' | 'tr'
    emailNotifications: boolean
    emailDigest: 'daily' | 'weekly' | 'none'
}

export type Sector = 'engineering' | 'product' | 'sales' | 'general'

export interface Team {
    id: string
    name: string
    managerId: string
    sector?: Sector
    createdAt: string
    // Profile fields
    description?: string
    photoUrl?: string
    defaultTemplate?: 'daily' | 'weekly' | 'monthly' | 'okr' | 'engineering' | 'product' | 'sales'
    checkInFrequency?: 'daily' | 'weekly' | 'monthly'
    isPublic?: boolean
}

export interface CheckIn {
    id: string
    memberId: string
    teamId: string
    date: string
    templateType: 'daily' | 'weekly' | 'monthly' | 'okr' | 'engineering' | 'product' | 'sales'
    // Common fields
    yesterday?: string
    today?: string
    blockers?: string
    kudos?: string
    // Weekly specific
    accomplishments?: string
    nextWeekPlans?: string
    // Monthly specific
    monthlySummary?: string
    keyAchievements?: string
    metrics?: string
    nextMonthGoals?: string
    // OKR specific
    okrProgress?: string
    riskAssessment?: string
    mitigationPlans?: string
    // Engineering specific
    codeChanges?: string
    prs?: string
    technicalDebt?: string
    deploymentStatus?: string
    // Product specific
    featureUpdates?: string
    userFeedback?: string
    productMetrics?: string
    roadmap?: string
    // Sales specific
    dealsClosed?: string
    pipeline?: string
    customerFeedback?: string
    targets?: string
}

export interface Kudos {
    id: string
    fromMemberId: string
    toMemberId: string
    teamId: string
    message: string
    date: string
}

export interface Analytics {
    teamId: string
    period: string // ISO date string
    submitRate: number // percentage
    delayRate: number // percentage
    avgWordCount: number
    riskCount: number
    memberStats: {
        memberId: string
        submitted: boolean
        wordCount: number
        hasBlockers: boolean
    }[]
}

export const STORAGE_KEYS = {
    TEAMS: 'antigravity_teams',
    MEMBERS: 'antigravity_members',
    CHECKINS: 'antigravity_checkins',
    KUDOS: 'antigravity_kudos',
    THEME: 'antigravity_theme',
}

// Seed demo data
export function seedData() {
    // Check if data already exists
    const existingTeams = localStorage.getItem(STORAGE_KEYS.TEAMS)
    if (!existingTeams || existingTeams === '[]') {
        // Load demo data dynamically
        import('./demoData').then(module => {
            module.seedDemoData()
        }).catch(() => {
            // Fallback: create minimal data if demo module fails
            const defaultTeam = {
                id: 't1',
                name: 'Demo Team',
                managerId: 'u1',
                sector: 'general' as const,
                createdAt: new Date().toISOString(),
                isPublic: true
            }
            localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify([defaultTeam]))
        })
    }
}

export function getTeams(): Team[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEAMS) || '[]')
}

export function saveTeams(teams: Team[]): void {
    localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams))
}

export function getMembers(teamId?: string): Member[] {
    const all: Member[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS) || '[]')
    return teamId ? all.filter(m => m.teamId === teamId) : all
}

export function saveMembers(members: Member[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members))
}

export function getCheckIns(teamId: string): CheckIn[] {
    const all: CheckIn[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKINS) || '[]')
    return all.filter((c) => c.teamId === teamId)
}

export function saveCheckIn(checkin: CheckIn): void {
    const checkins: CheckIn[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECKINS) || '[]')
    checkins.push(checkin)
    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins))
}

export function addTeam(name: string, sector: Sector = 'general', userId?: string): Team {
    const teams = getTeams()
    const newTeam: Team = {
        id: crypto.randomUUID(),
        name,
        managerId: userId || 'temp-manager',
        sector,
        createdAt: new Date().toISOString(),
        isPublic: true,
        defaultTemplate: 'weekly',
        checkInFrequency: 'weekly'
    }
    teams.push(newTeam)
    saveTeams(teams)
    return newTeam
}

export function addMember(name: string, email: string, teamId: string): Member {
    const members = getMembers()
    const newMember: Member = {
        id: crypto.randomUUID(),
        name,
        email,
        teamId,
        role: 'member', // Default role
        createdAt: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        preferences: {
            theme: 'dark',
            language: 'en',
            emailNotifications: true,
            emailDigest: 'weekly'
        }
    }
    members.push(newMember)
    saveMembers(members)
    return newMember
}

// Analytics Functions
export function getAnalytics(teamId: string, periodDays: number = 7): Analytics {
    const members = getMembers(teamId)
    const checkins = getCheckIns(teamId)
    const cutoffDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000)

    const recentCheckIns = checkins.filter(c => new Date(c.date) >= cutoffDate)
    const memberStats = members.map(member => {
        const memberCheckIns = recentCheckIns.filter(c => c.memberId === member.id)
        const lastCheckIn = memberCheckIns[memberCheckIns.length - 1]
        const wordCount = lastCheckIn ? countWords(lastCheckIn) : 0
        const hasBlockers = lastCheckIn ? !!lastCheckIn.blockers : false

        return {
            memberId: member.id,
            submitted: memberCheckIns.length > 0,
            wordCount,
            hasBlockers
        }
    })

    const submitRate = members.length > 0 ? (memberStats.filter(s => s.submitted).length / members.length) * 100 : 0
    const delayRate = 100 - submitRate // Simplified: not submitted = delayed
    const avgWordCount = memberStats.length > 0 ?
        memberStats.reduce((sum, s) => sum + s.wordCount, 0) / memberStats.length : 0
    const riskCount = memberStats.filter(s => s.hasBlockers).length

    return {
        teamId,
        period: new Date().toISOString(),
        submitRate,
        delayRate,
        avgWordCount,
        riskCount,
        memberStats
    }
}

function countWords(checkIn: CheckIn): number {
    const allText = [
        checkIn.yesterday, checkIn.today, checkIn.blockers, checkIn.kudos,
        checkIn.accomplishments, checkIn.nextWeekPlans, checkIn.monthlySummary,
        checkIn.keyAchievements, checkIn.metrics, checkIn.nextMonthGoals,
        checkIn.okrProgress, checkIn.riskAssessment, checkIn.mitigationPlans,
        checkIn.codeChanges, checkIn.prs, checkIn.technicalDebt, checkIn.deploymentStatus,
        checkIn.featureUpdates, checkIn.userFeedback, checkIn.productMetrics, checkIn.roadmap,
        checkIn.dealsClosed, checkIn.pipeline, checkIn.customerFeedback, checkIn.targets
    ].filter(Boolean).join(' ')

    return allText.split(/\s+/).filter(word => word.length > 0).length
}

export function getSubmitRate(teamId: string, periodDays: number = 7): number {
    return getAnalytics(teamId, periodDays).submitRate
}

export function getDelayRate(teamId: string, periodDays: number = 7): number {
    return getAnalytics(teamId, periodDays).delayRate
}

export function getWordCountAverage(teamId: string, periodDays: number = 7): number {
    return getAnalytics(teamId, periodDays).avgWordCount
}

export function getRiskCount(teamId: string, periodDays: number = 7): number {
    return getAnalytics(teamId, periodDays).riskCount
}

// Kudos Functions
export function saveKudos(kudos: Omit<Kudos, 'id' | 'date'>) {
    const allKudos: Kudos[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.KUDOS) || '[]')
    const newKudos: Kudos = {
        ...kudos,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString()
    }
    allKudos.push(newKudos)
    localStorage.setItem(STORAGE_KEYS.KUDOS, JSON.stringify(allKudos))
    return newKudos
}

export function getKudos(teamId: string): Kudos[] {
    const allKudos: Kudos[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.KUDOS) || '[]')
    return allKudos.filter(k => k.teamId === teamId)
}

export function getKudosForMember(memberId: string): Kudos[] {
    const allKudos: Kudos[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.KUDOS) || '[]')
    return allKudos.filter(k => k.toMemberId === memberId)
}

// Theme Functions
export function getTheme(): 'dark' | 'light' {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark'
}

export function setTheme(theme: 'dark' | 'light') {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
}
