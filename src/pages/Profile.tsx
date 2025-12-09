import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { Logo } from "../components/Logo"
import { Avatar } from "../components/Avatar"
import { EditableField } from "../components/EditableField"
import { User, Sun, Moon, ArrowLeft, Trophy, TrendingUp, LogOut, Globe, Bell } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useTheme } from "../contexts/ThemeContext"
import { getMemberById, updateMember, updateMemberPreferences } from "../lib/profileManagement"
import { getMemberBadges, getBadgeInfo } from "../lib/gamification"

export default function Profile() {
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const [name, setName] = useState("Demo User")
    const [email, setEmail] = useState("user@pulsar.app")
    const [pastCheckIns, setPastCheckIns] = useState<any[]>([])
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [language, setLanguage] = useState('en')
    const [earnedBadges, setEarnedBadges] = useState<any[]>([])

    const currentUserId = 'u1'

    useEffect(() => {
        const memberData = getMemberById(currentUserId)
        if (memberData) {
            setName(memberData.name)
            setEmail(memberData.email)
            setEmailNotifications(memberData.preferences?.emailNotifications ?? true)
            setLanguage(memberData.preferences?.language ?? 'en')
        }

        const allCheckIns = JSON.parse(localStorage.getItem('antigravity_checkins') || '[]')
        const userCheckIns = allCheckIns
            .filter((c: any) => c.memberId === currentUserId)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5)
        setPastCheckIns(userCheckIns)

        // Load badges
        const badges = getMemberBadges(currentUserId)
            .map(mb => getBadgeInfo(mb.badgeId))
            .filter(b => b !== undefined)
        setEarnedBadges(badges)
    }, [])

    const handleUpdateName = (newName: string) => {
        updateMember(currentUserId, { name: newName })
        setName(newName)
        toast.success("Name updated")
    }

    const handleUpdateEmail = (newEmail: string) => {
        updateMember(currentUserId, { email: newEmail })
        setEmail(newEmail)
        toast.success("Email updated")
    }

    const handleUpdatePreferences = () => {
        updateMemberPreferences(currentUserId, {
            emailNotifications,
            language: language as 'en' | 'tr'
        })
        toast.success("Preferences updated")
    }

    const handleLogout = () => {
        toast.message("Logged out successfully")
        navigate("/")
    }

    const submissionStreak = pastCheckIns.length
    const avgWordCount = pastCheckIns.length > 0
        ? Math.round(pastCheckIns.reduce((sum, ci) => {
            const text = Object.values(ci).join(' ')
            return sum + text.split(/\s+/).length
        }, 0) / pastCheckIns.length)
        : 0

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                        <span className="font-medium">Back to Dashboard</span>
                    </div>
                    <Logo size="sm" />
                </div>
            </header>

            <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Avatar name={name} size="xl" />
                    <div>
                        <h1 className="text-3xl font-bold">{name}</h1>
                        <p className="text-muted-foreground">{email}</p>
                    </div>
                </div>

                {/* Personal Info */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <EditableField
                            value={name}
                            onSave={handleUpdateName}
                            label="Name"
                        />
                        <EditableField
                            value={email}
                            onSave={handleUpdateEmail}
                            label="Email"
                        />
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                <div>
                                    <p className="text-sm font-medium">Theme</p>
                                    <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Dark' : 'Light'}</p>
                                </div>
                            </div>
                            <Button onClick={toggleTheme} variant="outline" size="sm">
                                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span className="text-sm font-medium">Language</span>
                            </div>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="tr">Türkçe</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5" />
                                <div>
                                    <p className="text-sm font-medium">Email Notifications</p>
                                    <p className="text-xs text-muted-foreground">Receive check-in reminders</p>
                                </div>
                            </div>
                            <Button
                                variant={emailNotifications ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => setEmailNotifications(!emailNotifications)}
                            >
                                {emailNotifications ? 'Enabled' : 'Disabled'}
                            </Button>
                        </div>

                        <Button onClick={handleUpdatePreferences} className="w-full">
                            Save Preferences
                        </Button>
                    </CardContent>
                </Card>

                {/* Badges */}
                {earnedBadges.length > 0 && (
                    <Card className="bg-gray-900/50 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-400" />
                                Achievement Badges ({earnedBadges.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {earnedBadges.map((badge: any, i: number) => (
                                    <div key={i} className="p-3 bg-black/20 rounded-lg border border-gray-700 text-center">
                                        <div className="text-3xl mb-2">{badge.icon}</div>
                                        <p className="text-xs font-medium text-white">{badge.name}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Your Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                <p className="text-xs text-slate-400">Submission Streak</p>
                                <p className="text-2xl font-bold text-indigo-400">{submissionStreak}</p>
                            </div>
                            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <p className="text-xs text-slate-400">Avg Word Count</p>
                                <p className="text-2xl font-bold text-green-400">{avgWordCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Check-ins */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle>Recent Check-ins</CardTitle>
                        <CardDescription>Your submission history</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pastCheckIns.length > 0 ? (
                            <div className="space-y-3">
                                {pastCheckIns.map((ci, i) => (
                                    <div key={i} className="p-4 border rounded-lg bg-black/20">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs px-2 py-1 bg-primary/20 rounded">{ci.templateType || 'weekly'}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(ci.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">No check-ins yet</p>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-center pt-4">
                    <Button variant="destructive" className="w-full max-w-md gap-2" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </main>
        </div>
    )
}
