import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Logo } from "../components/Logo"
import { TeamSelector } from "../components/TeamSelector"
import { LoadingSpinner } from "../components/LoadingSpinner"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/card"
import { getTeams, addTeam, getMembers, getCheckIns, seedData, getAnalytics } from "../lib/storage"
import { generateTeamSummary, extractRisksAndBlockers } from "../lib/ai"
import { AdvancedTrendChart } from "../components/AdvancedTrendChart"
import { EnhancedKudosBoard } from "../components/EnhancedKudosBoard"
import { ActionItemsList } from "../components/ActionItemsList"
import { ExportDialog } from "../components/ExportDialog"
import { NotificationCenter } from "../components/NotificationCenter"
import { Plus, Bot, User, TrendingUp, AlertTriangle, MessageSquare, Settings as SettingsIcon } from "lucide-react"
import { toast } from "sonner"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../components/ui/dialog"
import { generateSampleNotifications } from "../lib/notifications"

export default function Dashboard() {
    const navigate = useNavigate()
    const [teams, setTeams] = useState<any[]>([])
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
    const [summary, setSummary] = useState<any>(null)
    const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false)
    const [newTeamName, setNewTeamName] = useState("")
    const [analytics, setAnalytics] = useState<any>(null)

    useEffect(() => {
        try {
            seedData()
            const allTeams = getTeams()
            setTeams(allTeams)
            if (allTeams.length > 0) {
                setSelectedTeamId(allTeams[0].id)
            }

            // Generate sample notifications for demo
            generateSampleNotifications('u1')
        } catch (e) {
            console.error("Init Error", e)
        }
    }, [])

    useEffect(() => {
        if (selectedTeamId) {
            const analyticsData = getAnalytics(selectedTeamId, 7)
            setAnalytics(analyticsData)
        }
    }, [selectedTeamId])

    const handleGenerateSummary = async () => {
        if (!selectedTeamId) return
        setSummary({ loading: true })
        const members = getMembers(selectedTeamId)
        const checkins = getCheckIns(selectedTeamId)
        const teamSummary = await generateTeamSummary(checkins, members)
        const risks = extractRisksAndBlockers(checkins)
        setSummary({ teamSummary, risks, loading: false })
        toast.success("AI Summary Generated!")
    }

    const handleCreateTeam = () => {
        if (!newTeamName) return
        const newTeam = addTeam(newTeamName)
        setTeams([...teams, newTeam])
        setSelectedTeamId(newTeam.id)
        setIsTeamDialogOpen(false)
        setNewTeamName("")
        toast.success("Team Created")
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 font-sans">
            {/* Header */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 -mx-6 -mt-6 px-6 mb-6">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Logo size="sm" />
                        <div className="h-8 w-px bg-border" />
                        <TeamSelector
                            teams={teams}
                            selectedTeamId={selectedTeamId}
                            onTeamChange={setSelectedTeamId}
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        {selectedTeamId && <ExportDialog teamId={selectedTeamId} />}
                        <NotificationCenter userId="u1" />

                        {/* Create Team Button */}
                        <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" title="Create New Team">
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create New Team</DialogTitle>
                                    <CardDescription>Enter a name for your new team</CardDescription>
                                </DialogHeader>
                                <Input
                                    placeholder="Team Name"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
                                />
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsTeamDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateTeam}>Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
                            <SettingsIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            {!selectedTeamId ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <p className="text-lg text-gray-400">No team selected</p>
                    <p className="text-sm text-gray-500">Use the team selector above or create a new team with the + button</p>
                </div>
            ) : (
                <main className="grid gap-6">
                    {/* AI Summary Section */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleGenerateSummary}
                            disabled={summary?.loading}
                            variant="secondary"
                            className="group"
                        >
                            {summary?.loading ? (
                                <>
                                    <LoadingSpinner size="sm" />
                                    <span className="ml-2">Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Bot className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                                    Generate AI Summary
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Analytics Overview Cards */}
                    {analytics && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Submit Rate</p>
                                            <p className="text-2xl font-bold text-indigo-400">{analytics.submitRate.toFixed(0)}%</p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-indigo-500/50" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Delay Rate</p>
                                            <p className="text-2xl font-bold text-red-400">{analytics.delayRate.toFixed(0)}%</p>
                                        </div>
                                        <AlertTriangle className="h-8 w-8 text-red-500/50" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Avg Words</p>
                                            <p className="text-2xl font-bold text-green-400">{analytics.avgWordCount.toFixed(0)}</p>
                                        </div>
                                        <MessageSquare className="h-8 w-8 text-green-500/50" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border-yellow-500/20">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Risks</p>
                                            <p className="text-2xl font-bold text-yellow-400">{analytics.riskCount}</p>
                                        </div>
                                        <AlertTriangle className="h-8 w-8 text-yellow-500/50" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* AI Summary Results */}
                    {summary && !summary.loading && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-gray-900/50 border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bot className="h-5 w-5 text-indigo-400" />
                                        AI Team Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-300 leading-relaxed">{summary.teamSummary}</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-900/50 border-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-red-400" />
                                        Risks & Blockers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {summary.risks && summary.risks.length > 0 ? (
                                        <ul className="space-y-2">
                                            {summary.risks.map((riskObj: any, idx: number) => (
                                                <li key={idx} className="text-sm text-red-300 flex items-start gap-2">
                                                    <span className="text-red-500">•</span>
                                                    <span>
                                                        {typeof riskObj === 'string' ? riskObj : riskObj.risk || JSON.stringify(riskObj)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-400">No significant risks detected</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Advanced Trend Chart */}
                    {selectedTeamId && <AdvancedTrendChart teamId={selectedTeamId} />}

                    {/* Action Items */}
                    {selectedTeamId && <ActionItemsList teamId={selectedTeamId} />}

                    {/* Enhanced Kudos Board */}
                    {selectedTeamId && <EnhancedKudosBoard teamId={selectedTeamId} currentUserId="u1" />}
                </main>
            )}
        </div>
    )
}
