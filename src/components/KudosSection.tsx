import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { getKudos, getMembers } from '../lib/storage'
import { Trophy, Sparkles } from 'lucide-react'
import type { Kudos } from '../lib/storage'

interface KudosSectionProps {
    teamId: string
}

export function KudosSection({ teamId }: KudosSectionProps) {
    const [kudos, setKudos] = useState<(Kudos & { fromName: string; toName: string })[]>([])

    useEffect(() => {
        const allKudos = getKudos(teamId)
        const members = getMembers(teamId)

        const enrichedKudos = allKudos.map(k => {
            const fromMember = members.find(m => m.id === k.fromMemberId)
            const toMember = members.find(m => m.id === k.toMemberId)
            return {
                ...k,
                fromName: fromMember?.name || 'Unknown',
                toName: toMember?.name || 'Unknown'
            }
        }).slice(0, 5) // Show last 5

        setKudos(enrichedKudos)
    }, [teamId])

    if (kudos.length === 0) {
        return (
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400">
                        <Trophy className="h-5 w-5" />
                        Team Kudos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-400">
                        No kudos yet. Encourage your team to appreciate each other in their check-ins!
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Trophy className="h-5 w-5" />
                    Team Kudos ({kudos.length})
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {kudos.map(k => (
                    <div
                        key={k.id}
                        className="p-3 bg-black/30 rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-colors"
                    >
                        <div className="flex items-start gap-2">
                            <Sparkles className="h-4 w-4 text-yellow-400 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm text-white mb-1">
                                    <span className="font-semibold text-yellow-300">{k.fromName}</span>
                                    {' → '}
                                    <span className="font-semibold text-yellow-300">{k.toName}</span>
                                </p>
                                <p className="text-sm text-slate-300">{k.message}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {new Date(k.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
