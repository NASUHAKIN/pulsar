import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../components/ui/dialog'
import { Logo } from '../components/Logo'
import { Avatar } from '../components/Avatar'
import { EditableField } from '../components/EditableField'
import { getTeamById, updateTeam, removeMemberFromTeam, changeMemberRole, canEditTeam } from '../lib/profileManagement'
import { getMembers, addMember, type Member, type Sector } from '../lib/storage'
import { ArrowLeft, Users, Settings as SettingsIcon, UserPlus, Trash2, Crown } from 'lucide-react'
import { toast } from 'sonner'

export default function TeamProfile() {
    const { teamId } = useParams<{ teamId: string }>()
    const navigate = useNavigate()
    const currentUserId = 'u1' // Mock user ID

    const [team, setTeam] = useState<any>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [canEdit, setCanEdit] = useState(false)
    const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
    const [newMember, setNewMember] = useState({ name: '', email: '', role: 'member' as const })

    useEffect(() => {
        loadData()
    }, [teamId])

    const loadData = () => {
        if (!teamId) return

        const teamData = getTeamById(teamId)
        if (teamData) {
            setTeam(teamData)
            setCanEdit(canEditTeam(currentUserId, teamId))
        }

        const teamMembers = getMembers(teamId)
        setMembers(teamMembers)
    }

    const handleUpdateTeamName = (newName: string) => {
        if (!teamId) return
        const updated = updateTeam(teamId, { name: newName })
        if (updated) {
            setTeam(updated)
            toast.success('Team name updated')
        }
    }

    const handleUpdateDescription = (newDesc: string) => {
        if (!teamId) return
        const updated = updateTeam(teamId, { description: newDesc })
        if (updated) {
            setTeam(updated)
            toast.success('Description updated')
        }
    }

    const handleUpdateSector = (newSector: Sector) => {
        if (!teamId) return
        const updated = updateTeam(teamId, { sector: newSector })
        if (updated) {
            setTeam(updated)
            toast.success('Sector updated')
        }
    }

    const handleAddMember = () => {
        if (!teamId || !newMember.name.trim() || !newMember.email.trim()) {
            toast.error('Please fill all fields')
            return
        }

        const added = addMember(newMember.name, newMember.email, teamId)
        if (newMember.role && newMember.role !== 'member') {
            changeMemberRole(added.id, newMember.role as 'leader')
        }

        setNewMember({ name: '', email: '', role: 'member' })
        setIsAddMemberOpen(false)
        loadData()
        toast.success('Member added successfully')
    }

    const handleRemoveMember = (memberId: string) => {
        if (!teamId || !confirm('Are you sure you want to remove this member?')) return

        const success = removeMemberFromTeam(memberId, teamId)
        if (success) {
            loadData()
            toast.success('Member removed')
        }
    }

    const handleChangeRole = (memberId: string, newRole: 'leader' | 'member') => {
        const updated = changeMemberRole(memberId, newRole)
        if (updated) {
            loadData()
            toast.success('Role updated')
        }
    }

    if (!team) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p>Team not found</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                        <span className="font-medium">Back to Dashboard</span>
                    </div>
                    <Logo size="sm" />
                </div>
            </header>

            <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
                {/* Team Header */}
                <div className="flex items-start gap-6">
                    <Avatar name={team.name} photoUrl={team.photoUrl} size="xl" />
                    <div className="flex-1">
                        <EditableField
                            value={team.name}
                            onSave={handleUpdateTeamName}
                            placeholder="Team Name"
                            canEdit={canEdit}
                        />
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                {team.sector || 'general'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {members.length} members
                            </span>
                        </div>
                    </div>
                </div>

                {/* Team Info */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <SettingsIcon className="h-5 w-5" />
                            Team Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <EditableField
                            value={team.description || 'No description'}
                            onSave={handleUpdateDescription}
                            label="Description"
                            multiline
                            placeholder="Add a team description..."
                            canEdit={canEdit}
                        />

                        {canEdit && (
                            <div className="space-y-2">
                                <Label>Sector</Label>
                                <Select value={team.sector || 'general'} onValueChange={(value) => handleUpdateSector(value as Sector)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="engineering">Engineering</SelectItem>
                                        <SelectItem value="product">Product</SelectItem>
                                        <SelectItem value="sales">Sales</SelectItem>
                                        <SelectItem value="general">General</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Team Members */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Team Members ({members.length})
                                </CardTitle>
                                <CardDescription>Manage your team members and roles</CardDescription>
                            </div>
                            {canEdit && (
                                <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Add Member
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Member</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    value={newMember.name}
                                                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={newMember.email}
                                                    onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                                                    placeholder="john@company.com"
                                                />
                                            </div>
                                            <div>
                                                <Label>Role</Label>
                                                <Select value={newMember.role} onValueChange={(value: any) => setNewMember({ ...newMember, role: value })}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="member">Member</SelectItem>
                                                        <SelectItem value="leader">Leader</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleAddMember}>Add Member</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            {members.map(member => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar name={member.name} photoUrl={member.photoUrl} size="md" />
                                        <div>
                                            <p className="text-sm font-medium text-white">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </div>
                                        {member.role === 'leader' && (
                                            <Crown className="h-4 w-4 text-yellow-400" title="Leader" />
                                        )}
                                    </div>
                                    {canEdit && (
                                        <div className="flex gap-2">
                                            <Select
                                                value={member.role}
                                                onValueChange={(value: any) => handleChangeRole(member.id, value)}
                                            >
                                                <SelectTrigger className="w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="member">Member</SelectItem>
                                                    <SelectItem value="leader">Leader</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveMember(member.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
