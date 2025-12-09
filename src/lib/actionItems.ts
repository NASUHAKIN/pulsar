import type { CheckIn } from './storage'

export interface ActionItem {
    id: string
    title: string
    description: string
    source: 'checkin' | 'manual' | 'ai'
    sourceCheckInId?: string
    assignedTo?: string
    teamId: string
    status: 'todo' | 'in-progress' | 'done'
    priority: 'high' | 'medium' | 'low'
    dueDate?: string
    createdAt: string
    completedAt?: string
    createdBy: string
}

const STORAGE_KEY = 'antigravity_action_items'

export function getActionItems(teamId?: string): ActionItem[] {
    const items: ActionItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return teamId ? items.filter(item => item.teamId === teamId) : items
}

export function getActionItemsByMember(memberId: string): ActionItem[] {
    const items: ActionItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return items.filter(item => item.assignedTo === memberId)
}

export function saveActionItem(item: Omit<ActionItem, 'id' | 'createdAt'>): ActionItem {
    const items: ActionItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const newItem: ActionItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    }
    items.push(newItem)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    return newItem
}

export function updateActionItem(id: string, updates: Partial<ActionItem>): ActionItem | null {
    const items: ActionItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const index = items.findIndex(item => item.id === id)

    if (index === -1) return null

    items[index] = { ...items[index], ...updates }

    // Auto-set completedAt when status changes to done
    if (updates.status === 'done' && !items[index].completedAt) {
        items[index].completedAt = new Date().toISOString()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    return items[index]
}

export function deleteActionItem(id: string): boolean {
    const items: ActionItem[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const filtered = items.filter(item => item.id !== id)

    if (filtered.length === items.length) return false

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
}

// AI-powered action item extraction from check-ins
export function extractActionItemsFromCheckIn(checkIn: CheckIn, teamId: string, createdBy: string): ActionItem[] {
    const items: ActionItem[] = []

    // Extract from blockers
    if (checkIn.blockers && checkIn.blockers.trim()) {
        const blockerLines = checkIn.blockers.split('\n').filter(line => line.trim())
        blockerLines.forEach(blocker => {
            if (blocker.trim().length > 10) { // Minimum length filter
                const priority = determinePriority(blocker)
                items.push({
                    title: `Resolve: ${blocker.substring(0, 50)}${blocker.length > 50 ? '...' : ''}`,
                    description: blocker,
                    source: 'ai',
                    sourceCheckInId: checkIn.id,
                    teamId,
                    status: 'todo',
                    priority,
                    createdBy,
                    id: '',
                    createdAt: ''
                })
            }
        })
    }

    // Extract from risk assessment (OKR template)
    if (checkIn.riskAssessment && checkIn.riskAssessment.trim()) {
        const priority = 'high' as const
        items.push({
            title: `Address Risk: ${checkIn.riskAssessment.substring(0, 50)}`,
            description: checkIn.riskAssessment,
            source: 'ai',
            sourceCheckInId: checkIn.id,
            teamId,
            status: 'todo',
            priority,
            createdBy,
            id: '',
            createdAt: ''
        })
    }

    return items
}

function determinePriority(text: string): 'high' | 'medium' | 'low' {
    const lowerText = text.toLowerCase()

    // High priority keywords
    if (lowerText.includes('urgent') || lowerText.includes('critical') ||
        lowerText.includes('blocked') || lowerText.includes('asap')) {
        return 'high'
    }

    // Low priority keywords
    if (lowerText.includes('minor') || lowerText.includes('nice to have') ||
        lowerText.includes('when possible')) {
        return 'low'
    }

    return 'medium'
}

// Bulk create action items
export function createActionItemsFromCheckIn(checkIn: CheckIn, teamId: string, createdBy: string): ActionItem[] {
    const extractedItems = extractActionItemsFromCheckIn(checkIn, teamId, createdBy)
    return extractedItems.map(item => saveActionItem(item))
}
