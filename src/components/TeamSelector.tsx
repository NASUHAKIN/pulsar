import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Building2 } from 'lucide-react'

interface Team {
    id: string
    name: string
    sector?: 'engineering' | 'product' | 'sales' | 'general'
}

interface TeamSelectorProps {
    teams: Team[]
    selectedTeamId: string | null
    onTeamChange: (teamId: string) => void
}

const getSectorIcon = (sector?: string) => {
    switch (sector) {
        case 'engineering': return '⚙️'
        case 'product': return '🎯'
        case 'sales': return '💼'
        default: return '📁'
    }
}

const getSectorColor = (sector?: string) => {
    switch (sector) {
        case 'engineering': return 'text-blue-400'
        case 'product': return 'text-purple-400'
        case 'sales': return 'text-green-400'
        default: return 'text-gray-400'
    }
}

export function TeamSelector({ teams, selectedTeamId, onTeamChange }: TeamSelectorProps) {
    if (teams.length === 0) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
                <Building2 className="h-4 w-4" />
                <span>No teams</span>
            </div>
        )
    }

    // const selectedTeam = teams.find(t => t.id === selectedTeamId)

    return (
        <Select value={selectedTeamId || undefined} onValueChange={onTeamChange}>
            <SelectTrigger className="w-64 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-colors">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {teams.map((team) => (
                    <SelectItem
                        key={team.id}
                        value={team.id}
                    >
                        <div className="flex items-center gap-3 py-1">
                            <span className="text-lg">{getSectorIcon(team.sector)}</span>
                            <div className="flex flex-col items-start">
                                <span className="text-sm font-medium text-white">{team.name}</span>
                                {team.sector && (
                                    <span className={`text-xs capitalize ${getSectorColor(team.sector)}`}>
                                        {team.sector}
                                    </span>
                                )}
                            </div>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
