import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Logo } from "../components/Logo"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card"
import { getTeams, getMembers, getCheckIns } from "../lib/storage"
import { getMemberSession, clearMemberSession } from "./MemberLogin"
import { useTheme } from "../contexts/ThemeContext"
import {
    LogOut, Calendar, CheckCircle2, Clock, FileText,
    User, Moon, Sun, ChevronRight, AlertCircle
} from "lucide-react"
import { toast } from "sonner"

export default function MemberDashboard() {
    const navigate = useNavigate()
    const { theme, toggleTheme } = useTheme()
    const [member, setMember] = useState<any>(null)
    const [team, setTeam] = useState<any>(null)
    const [myCheckIns, setMyCheckIns] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check session
        const session = getMemberSession()
        if (!session) {
            navigate('/member-login')
            return
        }

        // Load member data
        const allMembers = getMembers()
        const currentMember = allMembers.find(m => m.id === session.memberId)

        if (!currentMember) {
            clearMemberSession()
            navigate('/member-login')
            return
        }

        setMember(currentMember)

        // Load team
        const allTeams = getTeams()
        const memberTeam = allTeams.find(t => t.id === currentMember.teamId)
        setTeam(memberTeam)

        // Load check-ins
        if (memberTeam) {
            const checkIns = getCheckIns(memberTeam.id)
            const memberCheckIns = checkIns.filter(c => c.memberId === currentMember.id)
            setMyCheckIns(memberCheckIns.slice(-10).reverse())
        }

        setIsLoading(false)
    }, [navigate])

    const handleLogout = () => {
        clearMemberSession()
        toast.success("Logged out successfully")
        navigate('/member-login')
    }

    const handleSubmitCheckIn = () => {
        if (team) {
            navigate(`/check-in/${team.id}?memberId=${member.id}`)
        }
    }

    const getLastCheckInStatus = () => {
        if (myCheckIns.length === 0) return { status: 'none', text: 'No check-ins yet' }

        const lastCheckIn = myCheckIns[0]
        const lastDate = new Date(lastCheckIn.date)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return { status: 'today', text: 'Submitted today' }
        if (diffDays === 1) return { status: 'yesterday', text: 'Submitted yesterday' }
        if (diffDays <= 7) return { status: 'recent', text: `${diffDays} days ago` }
        return { status: 'overdue', text: `${diffDays} days ago - Time for a new one!` }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        )
    }

    const checkInStatus = getLastCheckInStatus()

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Logo size="sm" />

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <div className="h-8 w-px bg-border" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium">{member?.name}</div>
                                <div className="text-xs text-muted-foreground">{team?.name}</div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:text-destructive">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="space-y-8">
                    {/* Welcome */}
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Welcome, {member?.name}!</h1>
                        <p className="text-muted-foreground">
                            Team: <span className="font-medium text-foreground">{team?.name}</span>
                        </p>
                    </div>

                    {/* Check-in Status Card */}
                    <Card className={`${checkInStatus.status === 'overdue' ? 'border-destructive/50 bg-destructive/5' :
                            checkInStatus.status === 'today' ? 'border-green-500/50 bg-green-500/5' :
                                ''
                        }`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${checkInStatus.status === 'overdue' ? 'bg-destructive/10' :
                                            checkInStatus.status === 'today' ? 'bg-green-500/10' :
                                                'bg-primary/10'
                                        }`}>
                                        {checkInStatus.status === 'overdue' ? (
                                            <AlertCircle className="h-6 w-6 text-destructive" />
                                        ) : checkInStatus.status === 'today' ? (
                                            <CheckCircle2 className="h-6 w-6 text-green-500" />
                                        ) : (
                                            <Clock className="h-6 w-6 text-primary" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">Last Check-in</p>
                                        <p className="text-sm text-muted-foreground">{checkInStatus.text}</p>
                                    </div>
                                </div>
                                <Button onClick={handleSubmitCheckIn} size="lg">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Submit Check-in
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-4xl font-bold text-primary mb-1">{myCheckIns.length}</div>
                                <p className="text-sm text-muted-foreground">Total Check-ins</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="text-4xl font-bold text-green-500 mb-1">
                                    {myCheckIns.filter(c => {
                                        const date = new Date(c.date)
                                        const now = new Date()
                                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
                                    }).length}
                                </div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Check-ins */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                My Recent Check-ins
                            </CardTitle>
                            <CardDescription>Your last 10 submissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {myCheckIns.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No check-ins yet</p>
                                    <p className="text-sm mt-2">Submit your first check-in to get started!</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myCheckIns.map(checkIn => (
                                        <div
                                            key={checkIn.id}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                        >
                                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium capitalize">{checkIn.templateType} Check-in</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(checkIn.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {checkIn.today && (
                                                <p className="text-sm text-muted-foreground max-w-xs truncate hidden md:block">
                                                    {checkIn.today}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
