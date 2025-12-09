import type { Team, Member, MemberPreferences } from './storage'

// Team Profile Management
export function updateTeam(teamId: string, updates: Partial<Team>): Team | null {
    const allTeams: Team[] = JSON.parse(localStorage.getItem('antigravity_teams') || '[]')
    const index = allTeams.findIndex(t => t.id === teamId)

    if (index === -1) return null

    allTeams[index] = { ...allTeams[index], ...updates }
    localStorage.setItem('antigravity_teams', JSON.stringify(allTeams))

    return allTeams[index]
}

export function deleteTeam(teamId: string): boolean {
    const allTeams: Team[] = JSON.parse(localStorage.getItem('antigravity_teams') || '[]')
    const filtered = allTeams.filter(t => t.id !== teamId)

    if (filtered.length === allTeams.length) return false

    localStorage.setItem('antigravity_teams', JSON.stringify(filtered))

    // Also delete associated members and check-ins
    const allMembers: Member[] = JSON.parse(localStorage.getItem('antigravity_members') || '[]')
    const filteredMembers = allMembers.filter(m => m.teamId !== teamId)
    localStorage.setItem('antigravity_members', JSON.stringify(filteredMembers))

    return true
}

// Member Profile Management
export function updateMember(memberId: string, updates: Partial<Member>): Member | null {
    const allMembers: Member[] = JSON.parse(localStorage.getItem('antigravity_members') || '[]')
    const index = allMembers.findIndex(m => m.id === memberId)

    if (index === -1) return null

    allMembers[index] = { ...allMembers[index], ...updates }
    localStorage.setItem('antigravity_members', JSON.stringify(allMembers))

    return allMembers[index]
}

export function updateMemberPreferences(memberId: string, preferences: Partial<MemberPreferences>): Member | null {
    const allMembers: Member[] = JSON.parse(localStorage.getItem('antigravity_members') || '[]')
    const index = allMembers.findIndex(m => m.id === memberId)

    if (index === -1) return null

    const currentPreferences = allMembers[index].preferences || {
        theme: 'dark',
        language: 'en',
        emailNotifications: true,
        emailDigest: 'weekly'
    }

    allMembers[index].preferences = { ...currentPreferences, ...preferences }
    localStorage.setItem('antigravity_members', JSON.stringify(allMembers))

    return allMembers[index]
}

export function removeMemberFromTeam(memberId: string, teamId: string): boolean {
    const allMembers: Member[] = JSON.parse(localStorage.getItem('antigravity_members') || '[]')
    const member = allMembers.find(m => m.id === memberId && m.teamId === teamId)

    if (!member) return false

    const filtered = allMembers.filter(m => m.id !== memberId)
    localStorage.setItem('antigravity_members', JSON.stringify(filtered))

    return true
}

export function changeMemberRole(memberId: string, newRole: 'leader' | 'member'): Member | null {
    return updateMember(memberId, { role: newRole })
}

// Get team by ID
export function getTeamById(teamId: string): Team | null {
    const allTeams: Team[] = JSON.parse(localStorage.getItem('antigravity_teams') || '[]')
    return allTeams.find(t => t.id === teamId) || null
}

// Get member by ID
export function getMemberById(memberId: string): Member | null {
    const allMembers: Member[] = JSON.parse(localStorage.getItem('antigravity_members') || '[]')
    return allMembers.find(m => m.id === memberId) || null
}

// Permission checks
export function canEditTeam(userId: string, teamId: string): boolean {
    const member = getMemberById(userId)
    return member !== null && member.teamId === teamId && member.role === 'leader'
}

export function canEditMember(userId: string, memberId: string): boolean {
    return userId === memberId
}

// Avatar generation
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
}

export function getAvatarColor(name: string): string {
    const colors = [
        'from-red-500 to-pink-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-yellow-500 to-orange-500',
        'from-purple-500 to-pink-500',
        'from-indigo-500 to-purple-500',
        'from-teal-500 to-green-500',
        'from-orange-500 to-red-500'
    ]

    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
}
