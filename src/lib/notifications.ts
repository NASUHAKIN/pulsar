export interface Notification {
    id: string
    userId: string
    type: 'reminder' | 'kudos' | 'mention' | 'risk' | 'badge' | 'system'
    title: string
    message: string
    read: boolean
    createdAt: string
    actionUrl?: string
}

const STORAGE_KEY = 'antigravity_notifications'

export function getNotifications(userId: string): Notification[] {
    const all: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return all.filter(n => n.userId === userId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}

export function getUnreadCount(userId: string): number {
    return getNotifications(userId).filter(n => !n.read).length
}

export function markAsRead(notificationId: string): void {
    const all: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const notification = all.find(n => n.id === notificationId)
    if (notification) {
        notification.read = true
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    }
}

export function markAllAsRead(userId: string): void {
    const all: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    all.forEach(n => {
        if (n.userId === userId) n.read = true
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Notification {
    const all: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
    }
    all.push(newNotification)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    return newNotification
}

export function deleteNotification(notificationId: string): void {
    const all: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const filtered = all.filter(n => n.id !== notificationId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function clearAllNotifications(userId: string): void {
    const all: Notification[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const filtered = all.filter(n => n.userId !== userId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

// Mock email reminder system
export interface ReminderSettings {
    userId: string
    enabled: boolean
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
    time: string // "10:00"
    digestMode: 'daily' | 'weekly' | 'none'
}

const REMINDER_SETTINGS_KEY = 'antigravity_reminder_settings'

export function getReminderSettings(userId: string): ReminderSettings {
    const all: ReminderSettings[] = JSON.parse(localStorage.getItem(REMINDER_SETTINGS_KEY) || '[]')
    const existing = all.find(s => s.userId === userId)

    if (existing) return existing

    // Default settings
    return {
        userId,
        enabled: true,
        day: 'friday',
        time: '10:00',
        digestMode: 'weekly'
    }
}

export function saveReminderSettings(settings: ReminderSettings): void {
    const all: ReminderSettings[] = JSON.parse(localStorage.getItem(REMINDER_SETTINGS_KEY) || '[]')
    const index = all.findIndex(s => s.userId === settings.userId)

    if (index >= 0) {
        all[index] = settings
    } else {
        all.push(settings)
    }

    localStorage.setItem(REMINDER_SETTINGS_KEY, JSON.stringify(all))
}

// Simulate sending reminder notification
export function sendReminderNotification(userId: string): Notification {
    return createNotification({
        userId,
        type: 'reminder',
        title: '⏰ Check-in Reminder',
        message: "Don't forget to submit your weekly check-in!",
        read: false,
        actionUrl: '/check-in/user1' // Mock URL
    })
}

// Auto-generate sample notifications (for demo)
export function generateSampleNotifications(userId: string): void {
    const samples: Omit<Notification, 'id' | 'createdAt'>[] = [
        {
            userId,
            type: 'kudos',
            title: '🎉 New Kudos Received!',
            message: 'Alice gave you kudos for helping with the deployment',
            read: false
        },
        {
            userId,
            type: 'badge',
            title: '🏆 Badge Earned!',
            message: 'You earned the "7-Day Streak" badge!',
            read: false
        },
        {
            userId,
            type: 'risk',
            title: '⚠️ Risk Detected',
            message: 'Your team has 3 high-priority blockers',
            read: true
        },
        {
            userId,
            type: 'system',
            title: '📊 Weekly Report Ready',
            message: 'Your team report for this week is ready to view',
            read: true
        }
    ]

    samples.forEach(n => createNotification(n))
}
