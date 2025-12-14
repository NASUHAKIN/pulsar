import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Logo } from "../components/Logo"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { getTeams, addTeam, getMembers, getCheckIns, seedData, getAnalytics, addMember } from "../lib/storage"
import { generateTeamSummary } from "../lib/ai"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { AdvancedTrendChart } from "../components/AdvancedTrendChart"
import { EnhancedKudosBoard } from "../components/EnhancedKudosBoard"
import { ActionItemsList } from "../components/ActionItemsList"
import { ExportDialog } from "../components/ExportDialog"
import { NotificationCenter } from "../components/NotificationCenter"
import {
    Plus, Bot, Users, TrendingUp, AlertTriangle, MessageSquare,
    Settings as SettingsIcon, LogOut, ChevronDown, Calendar,
    CheckCircle2, Clock, Sparkles, Moon, Sun, Link2, UserPlus,
    Download, Bell, Heart, ListTodo, Copy, Mail, ExternalLink
} from "lucide-react"
import { toast } from "sonner"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../components/ui/dialog"

export default function Dashboard() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [teams, setTeams] = useState<any[]>([])
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
    const [selectedTeam, setSelectedTeam] = useState<any>(null)
    const [summary, setSummary] = useState<any>(null)
    const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false)
    const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
    const [newTeamName, setNewTeamName] = useState("")
    const [newMemberName, setNewMemberName] = useState("")
    const [newMemberEmail, setNewMemberEmail] = useState("")
    const [analytics, setAnalytics] = useState<any>(null)
    const [members, setMembers] = useState<any[]>([])
    const [recentCheckIns, setRecentCheckIns] = useState<any[]>([])
    const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'kudos' | 'actions'>('overview')

    useEffect(() => {
        try {
            seedData()
            const allTeams = getTeams()
            const userTeams = user
                ? allTeams.filter(t => t.managerId === user.id || ['t1', 't2', 't3'].includes(t.id))
                : allTeams
            setTeams(userTeams)
            if (userTeams.length > 0) {
                const ownTeam = userTeams.find(t => t.managerId === user?.id)
                const teamToSelect = ownTeam || userTeams[0]
                setSelectedTeamId(teamToSelect.id)
                setSelectedTeam(teamToSelect)
            }
        } catch (e) {
            console.error("Init Error", e)
        }
    }, [user])

    useEffect(() => {
        if (selectedTeamId) {
            const analyticsData = getAnalytics(selectedTeamId, 7)
            setAnalytics(analyticsData)
            const teamMembers = getMembers(selectedTeamId)
            setMembers(teamMembers)
            const checkIns = getCheckIns(selectedTeamId)
            setRecentCheckIns(checkIns.slice(-5).reverse())
            setSelectedTeam(teams.find(t => t.id === selectedTeamId))
        }
    }, [selectedTeamId, teams])

    const handleGenerateSummary = async () => {
        if (!selectedTeamId) return
        setSummary({ loading: true })
        const teamMembers = getMembers(selectedTeamId)
        const checkins = getCheckIns(selectedTeamId)
        const teamSummary = await generateTeamSummary(checkins, teamMembers)
        setSummary({ data: teamSummary, loading: false })
        toast.success("AI Summary Generated!")
    }

    const handleCreateTeam = () => {
        if (!newTeamName) return
        const newTeam = addTeam(newTeamName, 'general', user?.id)
        setTeams([...teams, newTeam])
        setSelectedTeamId(newTeam.id)
        setIsTeamDialogOpen(false)
        setNewTeamName("")
        toast.success("Team Created!")
    }

    const handleAddMember = () => {
        if (!newMemberName || !newMemberEmail || !selectedTeamId) return
        const newMember = addMember(newMemberName, newMemberEmail, selectedTeamId)
        setMembers([...members, newMember])
        setIsMemberDialogOpen(false)
        setNewMemberName("")
        setNewMemberEmail("")
        toast.success("Member Added!")
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleTeamSelect = (team: any) => {
        setSelectedTeamId(team.id)
        setIsTeamDropdownOpen(false)
    }

    const getCheckInLink = () => {
        const baseUrl = window.location.origin + window.location.pathname
        return `${baseUrl}#/check-in/${selectedTeamId}`
    }

    const copyCheckInLink = () => {
        navigator.clipboard.writeText(getCheckInLink())
        toast.success("Link copied to clipboard!")
    }

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'analytics', label: 'Analytics', icon: Calendar },
        { id: 'kudos', label: 'Kudos', icon: Heart },
        { id: 'actions', label: 'Actions', icon: ListTodo },
    ]

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Logo size="sm" />

                        {/* Team Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                            >
                                <Users className="h-4 w-4 text-primary" />
                                <span className="font-medium">{selectedTeam?.name || "Select Team"}</span>
                                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isTeamDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isTeamDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
                                    <div className="p-2 max-h-64 overflow-y-auto">
                                        {teams.map(team => (
                                            <button
                                                key={team.id}
                                                onClick={() => handleTeamSelect(team)}
                                                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${team.id === selectedTeamId
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'hover:bg-accent'
                                                    }`}
                                            >
                                                <div className="font-medium">{team.name}</div>
                                                <div className="text-xs text-muted-foreground capitalize">{team.sector || 'general'}</div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="border-t border-border p-2">
                                        <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                                            <DialogTrigger asChild>
                                                <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-accent flex items-center gap-2 text-primary">
                                                    <Plus className="h-4 w-4" />
                                                    <span>Create New Team</span>
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Create New Team</DialogTitle>
                                                </DialogHeader>
                                                <Input
                                                    placeholder="Team Name"
                                                    value={newTeamName}
                                                    onChange={(e) => setNewTeamName(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
                                                />
                                                <DialogFooter>
                                                    <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>Cancel</Button>
                                                    <Button onClick={handleCreateTeam}>Create</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        {user && <NotificationCenter userId={user.id} />}

                        {/* Export */}
                        {selectedTeamId && <ExportDialog teamId={selectedTeamId} />}

                        {/* Theme Toggle */}
                        <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}>
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>

                        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                            <SettingsIcon className="h-5 w-5" />
                        </Button>

                        <div className="h-8 w-px bg-border" />

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium">{user?.name}</div>
                                <div className="text-xs text-muted-foreground">{user?.email}</div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:text-destructive">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {!selectedTeamId ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-10 w-10 text-primary" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-2">No Team Selected</h2>
                            <p className="text-muted-foreground">Select a team or create a new one</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Team Header with Actions */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">{selectedTeam?.name}</h1>
                                <p className="text-muted-foreground">
                                    {members.length} members • {recentCheckIns.length} recent check-ins
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex flex-wrap gap-2">
                                {/* Add Member */}
                                <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Add Member
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Team Member</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Name</Label>
                                                <Input
                                                    placeholder="John Doe"
                                                    value={newMemberName}
                                                    onChange={(e) => setNewMemberName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Email</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="john@company.com"
                                                    value={newMemberEmail}
                                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsMemberDialogOpen(false)}>Cancel</Button>
                                            <Button onClick={handleAddMember}>Add Member</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {/* Share Check-in Link */}
                                <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Link2 className="h-4 w-4 mr-2" />
                                            Share Check-in Link
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Check-in Link</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <p className="text-sm text-muted-foreground">
                                                Share this link with your team members to submit their check-ins
                                            </p>
                                            <div className="flex gap-2">
                                                <Input value={getCheckInLink()} readOnly className="flex-1" />
                                                <Button onClick={copyCheckInLink} size="icon">
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" className="flex-1" onClick={() => window.open(`mailto:?subject=Check-in%20Link&body=${encodeURIComponent(getCheckInLink())}`)}>
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    Send via Email
                                                </Button>
                                                <Button variant="outline" className="flex-1" onClick={() => window.open(getCheckInLink(), '_blank')}>
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Open Link
                                                </Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {/* AI Summary */}
                                <Button onClick={handleGenerateSummary} disabled={summary?.loading} size="sm">
                                    {summary?.loading ? (
                                        <>
                                            <LoadingSpinner size="sm" />
                                            <span className="ml-2">Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            AI Summary
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        {analytics && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="hover:border-primary/30 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Submit Rate</p>
                                                <p className="text-2xl font-bold">{analytics.submitRate.toFixed(0)}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="hover:border-destructive/30 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                                                <Clock className="h-6 w-6 text-red-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Delay Rate</p>
                                                <p className="text-2xl font-bold">{analytics.delayRate.toFixed(0)}%</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="hover:border-blue-500/30 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                                <MessageSquare className="h-6 w-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Avg Words</p>
                                                <p className="text-2xl font-bold">{analytics.avgWordCount.toFixed(0)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="hover:border-yellow-500/30 transition-colors">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                                                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Active Risks</p>
                                                <p className="text-2xl font-bold">{analytics.riskCount}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* AI Summary */}
                        {summary?.data && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bot className="h-5 w-5 text-primary" />
                                        AI Team Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed whitespace-pre-wrap">
                                        {typeof summary.data === 'string' ? summary.data : summary.data.summary}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Tabs */}
                        <div className="border-b border-border">
                            <div className="flex gap-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.id
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {activeTab === 'overview' && (
                                <div className="grid lg:grid-cols-2 gap-6">
                                    {/* Team Members */}
                                    <Card>
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <Users className="h-5 w-5 text-primary" />
                                                    Team Members
                                                </span>
                                                <Button variant="ghost" size="sm" onClick={() => setIsMemberDialogOpen(true)}>
                                                    <UserPlus className="h-4 w-4" />
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {members.length === 0 ? (
                                                <p className="text-muted-foreground text-center py-8">No members yet</p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {members.slice(0, 6).map(member => (
                                                        <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                                {member.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate">{member.name}</p>
                                                                <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {members.length > 6 && (
                                                        <p className="text-center text-sm text-muted-foreground">+{members.length - 6} more</p>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Recent Check-ins */}
                                    <Card>
                                        <CardHeader className="pb-4">
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-green-500" />
                                                Recent Check-ins
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {recentCheckIns.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-muted-foreground mb-4">No check-ins yet</p>
                                                    <Button variant="outline" size="sm" onClick={() => setIsLinkDialogOpen(true)}>
                                                        <Link2 className="h-4 w-4 mr-2" />
                                                        Share Check-in Link
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {recentCheckIns.map(checkIn => {
                                                        const member = members.find(m => m.id === checkIn.memberId)
                                                        return (
                                                            <div key={checkIn.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                                    {member?.name?.charAt(0).toUpperCase() || '?'}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium truncate">{member?.name || 'Unknown'}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {new Date(checkIn.date).toLocaleDateString()} • {checkIn.templateType}
                                                                    </p>
                                                                </div>
                                                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeTab === 'analytics' && selectedTeamId && (
                                <AdvancedTrendChart teamId={selectedTeamId} />
                            )}

                            {activeTab === 'kudos' && selectedTeamId && (
                                <EnhancedKudosBoard teamId={selectedTeamId} currentUserId={user?.id} />
                            )}

                            {activeTab === 'actions' && selectedTeamId && (
                                <ActionItemsList teamId={selectedTeamId} />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
