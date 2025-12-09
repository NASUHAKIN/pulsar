import { useState, useEffect } from 'react'
import { Bell, X, Check, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    type Notification
} from '../lib/notifications'
import { formatDistanceToNow } from 'date-fns'

interface NotificationCenterProps {
    userId: string
}

export function NotificationCenter({ userId }: NotificationCenterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        loadNotifications()
    }, [userId, isOpen])

    const loadNotifications = () => {
        const allNotifications = getNotifications(userId)
        setNotifications(allNotifications)
        setUnreadCount(getUnreadCount(userId))
    }

    const handleMarkAsRead = (id: string) => {
        markAsRead(id)
        loadNotifications()
    }

    const handleMarkAllAsRead = () => {
        markAllAsRead(userId)
        loadNotifications()
    }

    const handleDelete = (id: string) => {
        deleteNotification(id)
        loadNotifications()
    }

    const handleClearAll = () => {
        clearAllNotifications(userId)
        loadNotifications()
    }

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'kudos': return '🎉'
            case 'reminder': return '⏰'
            case 'risk': return '⚠️'
            case 'badge': return '🏆'
            case 'mention': return '💬'
            default: return '📢'
        }
    }

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'kudos': return 'border-yellow-500/20 bg-yellow-500/5'
            case 'reminder': return 'border-blue-500/20 bg-blue-500/5'
            case 'risk': return 'border-red-500/20 bg-red-500/5'
            case 'badge': return 'border-purple-500/20 bg-purple-500/5'
            case 'mention': return 'border-green-500/20 bg-green-500/5'
            default: return 'border-gray-500/20 bg-gray-500/5'
        }
    }

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Notification Panel */}
                    <Card className="absolute right-0 top-12 w-96 max-h-[600px] overflow-hidden z-50 bg-gray-900 border-gray-800 shadow-2xl">
                        <CardHeader className="border-b border-gray-800 pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Notifications</CardTitle>
                                <div className="flex gap-2">
                                    {notifications.length > 0 && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleMarkAllAsRead}
                                                className="text-xs"
                                            >
                                                <Check className="h-3 w-3 mr-1" />
                                                Mark All Read
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleClearAll}
                                                className="text-xs text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Clear All
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsOpen(false)}
                                        className="h-6 w-6"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[500px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-400">
                                    <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No notifications yet</p>
                                    <p className="text-xs mt-1">We'll notify you when something happens</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-800">
                                    {notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-800/50 transition-colors relative ${!notification.read ? 'border-l-2 border-indigo-500' : ''
                                                } ${getNotificationColor(notification.type)}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="text-2xl flex-shrink-0">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between mb-1">
                                                        <h4 className="text-sm font-medium text-white">
                                                            {notification.title}
                                                        </h4>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDelete(notification.id)}
                                                            className="h-6 w-6 flex-shrink-0"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-slate-500">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </span>
                                                        {!notification.read && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="text-xs h-6 px-2"
                                                            >
                                                                Mark as read
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
