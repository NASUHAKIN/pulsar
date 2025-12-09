import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Trophy, Crown, Medal, Gift } from 'lucide-react'
import { getKudos, getMembers } from '../lib/storage'
import { BADGES, getMemberBadges, getBadgeInfo, checkAndAwardBadges, type Badge } from '../lib/gamification'
import { format } from 'date-fns'

interface EnhancedKudosBoardProps {
    teamId: string
    currentUserId?: string
}

export function EnhancedKudosBoard({ teamId }: EnhancedKudosBoardProps) {
    const [view, setView] = useState<'kudos' | 'badges' | 'mvp'>('kudos')
    const [kudos, setKudos] = useState<any[]>([])
    const [members, setMembers] = useState<any[]>([])
    const [memberBadges, setMemberBadges] = useState<Map<string, Badge[]>>(new Map())
    const [kudosLeaderboard, setKudosLeaderboard] = useState<any[]>([])

    useEffect(() => {
        loadData()
    }, [teamId])

    const loadData = () => {
        const teamKudos = getKudos(teamId)
        const teamMembers = getMembers(teamId)

        setKudos(teamKudos.slice(0, 10)) // Top 10 recent
        setMembers(teamMembers)

        // Load badges for each member
        const badgeMap = new Map<string, Badge[]>()
        teamMembers.forEach(member => {
            // Award any eligible badges
            checkAndAwardBadges(member.id)

            // Get member's badges
            const memberBadgesList = getMemberBadges(member.id)
            const badges = memberBadgesList
                .map(mb => getBadgeInfo(mb.badgeId))
                .filter(b => b !== undefined) as Badge[]
            badgeMap.set(member.id, badges)
        })
        setMemberBadges(badgeMap)

        // Calculate kudos leaderboard
        const kudosCount = new Map<string, number>()
        teamKudos.forEach(k => {
            kudosCount.set(k.toMemberId, (kudosCount.get(k.toMemberId) || 0) + 1)
        })

        const leaderboard = teamMembers
            .map(m => ({
                ...m,
                kudosCount: kudosCount.get(m.id) || 0,
                badges: badgeMap.get(m.id) || []
            }))
            .sort((a, b) => b.kudosCount - a.kudosCount)
            .slice(0, 5)

        setKudosLeaderboard(leaderboard)
    }

    const enrichKudos = (k: any) => {
        const from = members.find(m => m.id === k.fromMemberId)
        const to = members.find(m => m.id === k.toMemberId)
        return { ...k, fromName: from?.name || 'Unknown', toName: to?.name || 'Unknown' }
    }

    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-400" />
                            Team Recognition
                        </CardTitle>
                        <CardDescription>Celebrate achievements and milestones</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* View Switcher */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={view === 'kudos' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setView('kudos')}
                    >
                        <Gift className="h-4 w-4 mr-1" />
                        Recent Kudos
                    </Button>
                    <Button
                        variant={view === 'badges' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setView('badges')}
                    >
                        <Medal className="h-4 w-4 mr-1" />
                        Badges
                    </Button>
                    <Button
                        variant={view === 'mvp' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setView('mvp')}
                    >
                        <Crown className="h-4 w-4 mr-1" />
                        Leaderboard
                    </Button>
                </div>

                {/* Kudos View */}
                {view === 'kudos' && (
                    <div className="space-y-3">
                        {kudos.length === 0 ? (
                            <div className="text-center py-8 text-slate-400">
                                <Gift className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No kudos yet</p>
                                <p className="text-xs mt-1">Be the first to appreciate a teammate!</p>
                            </div>
                        ) : (
                            kudos.map(enrichKudos).map((k, i) => (
                                <div
                                    key={i}
                                    className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                                >
                                    <div className="flex items-start gap-3">
                                        <Trophy className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <div className="text-sm mb-1">
                                                <span className="font-semibold text-yellow-300">{k.fromName}</span>
                                                <span className="text-slate-400"> → </span>
                                                <span className="font-semibold text-yellow-300">{k.toName}</span>
                                            </div>
                                            <p className="text-sm text-slate-300">{k.message}</p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                {format(new Date(k.date), 'PPP')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Badges View */}
                {view === 'badges' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {BADGES.map(badge => (
                                <div
                                    key={badge.id}
                                    className="p-3 bg-black/20 rounded-lg border border-gray-700"
                                >
                                    <div className="text-2xl mb-2">{badge.icon}</div>
                                    <h4 className="text-sm font-semibold text-white mb-1">
                                        {badge.name}
                                    </h4>
                                    <p className="text-xs text-slate-400 mb-2">
                                        {badge.description}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {badge.requirement}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MVP Leaderboard */}
                {view === 'mvp' && (
                    <div className="space-y-3">
                        {kudosLeaderboard.map((member, index) => (
                            <div
                                key={member.id}
                                className={`p-4 rounded-lg border ${index === 0
                                    ? 'bg-yellow-500/10 border-yellow-500/30'
                                    : index === 1
                                        ? 'bg-gray-400/10 border-gray-400/30'
                                        : index === 2
                                            ? 'bg-orange-700/10 border-orange-700/30'
                                            : 'bg-black/20 border-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl font-bold">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-white">
                                            {member.name}
                                        </h4>
                                        <p className="text-xs text-slate-400">
                                            {member.kudosCount} kudos received
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        {member.badges.slice(0, 3).map((badge: Badge, i: number) => (
                                            <div
                                                key={i}
                                                className="text-lg"
                                                title={badge.name}
                                            >
                                                {badge.icon}
                                            </div>
                                        ))}
                                        {member.badges.length > 3 && (
                                            <span className="text-xs text-slate-500">
                                                +{member.badges.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
