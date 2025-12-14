import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Logo } from '../components/Logo'
import { addTeam, addMember, getTeams } from '../lib/storage'
import { useAuth } from '../contexts/AuthContext'
import { Check, Users, Briefcase, Code, ShoppingCart, Sparkles, Rocket, Zap, TrendingUp, ChevronRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

type Sector = 'engineering' | 'product' | 'sales' | 'general'

interface TeamMember {
    name: string
    email: string
}

export default function Onboarding() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [step, setStep] = useState(0) // Start at welcome screen
    const [teamName, setTeamName] = useState('')
    const [sector, setSector] = useState<Sector>('general')
    const [members, setMembers] = useState<TeamMember[]>([{ name: '', email: '' }])
    const [errors, setErrors] = useState<{ teamName?: string; members?: string[] }>({})
    const [isLoading, setIsLoading] = useState(true)

    // Check if logged-in user has existing teams - if so, redirect to Dashboard
    useEffect(() => {
        // If not logged in, always show welcome page
        if (!user) {
            setIsLoading(false)
            return
        }

        // User is logged in, check for their teams
        const teams = getTeams()
        const userTeams = teams.filter(t => t.managerId === user.id)

        if (userTeams.length > 0) {
            // User has created their own team, redirect to dashboard
            navigate('/dashboard')
        } else {
            setIsLoading(false)
        }
    }, [navigate, user])

    // Load saved data (but NEVER restore step - always start at welcome screen)
    useEffect(() => {
        const saved = localStorage.getItem('onboarding_progress')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                // Only restore data, NOT the step - user must always start from welcome
                if (data.teamName) setTeamName(data.teamName)
                if (data.sector) setSector(data.sector)
                if (data.members) setMembers(data.members)
                // Don't restore step - always start at 0 (welcome screen)
            } catch (e) {
                console.error('Failed to load progress')
            }
        }
    }, [])

    // Auto-save progress (only for steps 1-3)
    useEffect(() => {
        if (step > 0 && step < 4) {
            localStorage.setItem('onboarding_progress', JSON.stringify({
                step, teamName, sector, members
            }))
        } else if (step === 0) {
            // Clear progress when on welcome screen
            localStorage.removeItem('onboarding_progress')
        }
    }, [step, teamName, sector, members])

    const sectors = [
        {
            id: 'engineering' as Sector,
            name: 'Engineering',
            icon: Code,
            color: 'from-blue-500 to-cyan-500',
            description: 'Perfect for dev teams tracking sprints and technical work'
        },
        {
            id: 'product' as Sector,
            name: 'Product',
            icon: Sparkles,
            color: 'from-purple-500 to-pink-500',
            description: 'Ideal for product teams managing features and roadmaps'
        },
        {
            id: 'sales' as Sector,
            name: 'Sales',
            icon: ShoppingCart,
            color: 'from-green-500 to-emerald-500',
            description: 'Built for sales teams tracking deals and pipelines'
        },
        {
            id: 'general' as Sector,
            name: 'General',
            icon: Users,
            color: 'from-orange-500 to-yellow-500',
            description: 'Flexible option for any team type'
        }
    ]

    const validateStep = () => {
        const newErrors: { teamName?: string; members?: string[] } = {}

        if (step === 1) {
            if (!teamName.trim()) {
                newErrors.teamName = 'Team name is required'
            } else if (teamName.trim().length < 3) {
                newErrors.teamName = 'Team name must be at least 3 characters'
            } else if (teamName.trim().length > 50) {
                newErrors.teamName = 'Team name must be less than 50 characters'
            }
        }

        if (step === 3) {
            const memberErrors: string[] = []
            members.forEach((member, idx) => {
                if (!member.name.trim() && !member.email.trim()) {
                    // Skip empty rows
                } else if (!member.name.trim()) {
                    memberErrors[idx] = 'Name is required'
                } else if (member.name.trim().length < 2) {
                    memberErrors[idx] = 'Name must be at least 2 characters'
                } else if (!member.email.trim()) {
                    memberErrors[idx] = 'Email is required'
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
                    memberErrors[idx] = 'Invalid email format'
                }
            })
            if (memberErrors.length > 0) {
                newErrors.members = memberErrors
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (!validateStep()) {
            toast.error('Please fix the errors before continuing')
            return
        }

        if (step === 3) {
            handleComplete()
            return
        }
        setStep(step + 1)
    }

    const handleBack = () => {
        setStep(step - 1)
    }

    const handleAddMember = () => {
        setMembers([...members, { name: '', email: '' }])
    }

    const handleRemoveMember = (index: number) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index))
        }
    }

    const handleMemberChange = (index: number, field: 'name' | 'email', value: string) => {
        const updated = [...members]
        updated[index][field] = value
        setMembers(updated)
        // Clear error for this field
        if (errors.members?.[index]) {
            const newErrors = { ...errors }
            if (newErrors.members) {
                newErrors.members[index] = ''
            }
            setErrors(newErrors)
        }
    }

    const handleComplete = () => {
        // Create team linked to current user
        const team = addTeam(teamName, sector, user?.id)

        // Add members
        const validMembers = members.filter(m => m.name.trim() && m.email.trim())
        validMembers.forEach(member => {
            addMember(member.name, member.email, team.id)
        })

        // Clear saved progress
        localStorage.removeItem('onboarding_progress')

        // Move to success screen
        setStep(4)
    }

    const progress = step === 0 ? 0 : step === 4 ? 100 : ((step) / 3) * 100

    // Show loading while checking for existing teams
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Logo size="lg" />
                    <div className="animate-pulse text-gray-400">Loading...</div>
                </div>
            </div>
        )
    }

    // Welcome Screen - Clean & Minimal
    if (step === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
                <div className="flex-1 max-w-3xl mx-auto px-6 py-16 flex flex-col justify-center">
                    {/* Hero Section */}
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Logo size="lg" />

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Team Check-ins Made Simple
                            </h1>
                            <p className="text-lg text-gray-400 max-w-xl mx-auto">
                                Quick daily updates, AI-powered insights, and real-time analytics for your team
                            </p>
                        </div>

                        {/* Simple Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            <span className="px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700">
                                ⚡ 2-minute check-ins
                            </span>
                            <span className="px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700">
                                🤖 AI Summaries
                            </span>
                            <span className="px-4 py-2 bg-gray-800/50 rounded-full text-sm text-gray-300 border border-gray-700">
                                📊 Analytics
                            </span>
                        </div>

                        {/* Main CTA */}
                        <div className="pt-6">
                            <Button
                                onClick={() => {
                                    if (!user) {
                                        navigate('/signup')
                                    } else {
                                        setStep(1)
                                    }
                                }}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-10 py-6 text-lg group"
                                size="lg"
                            >
                                Get Started Free <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        {/* Login Options */}
                        <div className="pt-12 border-t border-gray-800/50 mt-12">
                            <p className="text-gray-500 text-sm mb-6">Already have an account?</p>
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="p-4 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/60 hover:border-indigo-500/50 transition-all text-center group"
                                >
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-indigo-500/30">
                                        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-white text-sm">Manager</p>
                                    <p className="text-xs text-gray-500">Manage teams</p>
                                </button>

                                <button
                                    onClick={() => navigate('/member-login')}
                                    className="p-4 rounded-xl border border-gray-700/50 bg-gray-800/30 hover:bg-gray-800/60 hover:border-green-500/50 transition-all text-center group"
                                >
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500/30">
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <p className="font-medium text-white text-sm">Member</p>
                                    <p className="text-xs text-gray-500">Submit check-ins</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Success Screen
    if (step === 4) {
        // No auto-redirect - user must click button

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-in zoom-in duration-700 delay-200">
                        <Check className="h-12 w-12 text-green-400" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold">
                            You're All Set! 🎉
                        </h1>
                        <p className="text-xl text-gray-300">
                            {teamName} is ready to start checking in
                        </p>
                    </div>

                    <Card className="bg-gray-900/50 border-gray-800 text-left">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Tips to Get Started</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-indigo-400 font-bold text-xs">1</span>
                                </div>
                                <p className="text-gray-300">Send check-in invites to your team members</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-purple-400 font-bold text-xs">2</span>
                                </div>
                                <p className="text-gray-300">Use AI summaries to get instant team insights</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-6 h-6 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-pink-400 font-bold text-xs">3</span>
                                </div>
                                <p className="text-gray-300">Celebrate wins with kudos & badges</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8"
                        size="lg"
                    >
                        Go to Dashboard <Rocket className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex flex-col">
            {/* Header */}
            <header className="p-6 flex justify-between items-center border-b border-gray-800">
                <Logo size="sm" />
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Step {step} of 3</span>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 h-1">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl">
                    {/* Step 1: Team Name */}
                    {step === 1 && (
                        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="text-center pb-8">
                                <div className="mx-auto w-16 h-16 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-indigo-400" />
                                </div>
                                <CardTitle className="text-3xl">What's your team name?</CardTitle>
                                <CardDescription className="text-lg">This will help us personalize your experience</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="teamName" className="text-lg">Team Name</Label>
                                    <Input
                                        id="teamName"
                                        placeholder="e.g., Product Engineering, Sales Team, Marketing..."
                                        value={teamName}
                                        onChange={(e) => {
                                            setTeamName(e.target.value)
                                            if (errors.teamName) setErrors({ ...errors, teamName: undefined })
                                        }}
                                        className={`h-14 text-lg bg-black/40 border-gray-700 focus:border-indigo-500 ${errors.teamName ? 'border-red-500' : ''}`}
                                        autoFocus
                                    />
                                    {errors.teamName && (
                                        <p className="text-sm text-red-400">{errors.teamName}</p>
                                    )}
                                </div>

                                <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                                    <p className="text-sm text-indigo-300">
                                        💡 <strong>Pro tip:</strong> You can create multiple teams later for different departments or projects.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 2: Sector Selection */}
                    {step === 2 && (
                        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="text-center pb-8">
                                <div className="mx-auto w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                                    <Briefcase className="h-8 w-8 text-purple-400" />
                                </div>
                                <CardTitle className="text-3xl">Choose Your Team Type</CardTitle>
                                <CardDescription className="text-lg">
                                    We'll customize templates and workflows for {teamName}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {sectors.map((s) => {
                                        const Icon = s.icon
                                        return (
                                            <button
                                                key={s.id}
                                                onClick={() => setSector(s.id)}
                                                className={`relative p-6 rounded-xl border-2 transition-all text-left ${sector === s.id
                                                    ? 'border-white bg-white/10 scale-105'
                                                    : 'border-gray-700 bg-black/20 hover:border-gray-600'
                                                    }`}
                                            >
                                                {sector === s.id && (
                                                    <div className="absolute top-3 right-3">
                                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                                            <Check className="h-4 w-4 text-black" />
                                                        </div>
                                                    </div>
                                                )}
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${s.color} p-2.5 mb-3`}>
                                                    <Icon className="h-full w-full text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">{s.name}</h3>
                                                <p className="text-sm text-gray-400">{s.description}</p>
                                            </button>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Add Members */}
                    {step === 3 && (
                        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <CardHeader className="text-center pb-6">
                                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-green-400" />
                                </div>
                                <CardTitle className="text-3xl">Add Team Members</CardTitle>
                                <CardDescription className="text-lg">
                                    Who's on the {teamName} team? (Optional - you can add more later)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                                    {members.map((member, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex gap-3 p-4 bg-black/20 rounded-lg border border-gray-700">
                                                <div className="flex-1 grid md:grid-cols-2 gap-3">
                                                    <div>
                                                        <Input
                                                            placeholder="Name"
                                                            value={member.name}
                                                            onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                                                            className={`bg-black/40 border-gray-600 ${errors.members?.[index] ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Input
                                                            type="email"
                                                            placeholder="email@company.com"
                                                            value={member.email}
                                                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                                                            className={`bg-black/40 border-gray-600 ${errors.members?.[index] ? 'border-red-500' : ''}`}
                                                        />
                                                    </div>
                                                </div>
                                                {members.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveMember(index)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </div>
                                            {errors.members?.[index] && (
                                                <p className="text-sm text-red-400 px-4">{errors.members[index]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleAddMember}
                                    variant="outline"
                                    className="w-full border-dashed border-gray-600 hover:border-gray-500"
                                >
                                    + Add Another Member
                                </Button>

                                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                                    <p className="text-sm text-yellow-300">
                                        ⚡ You can skip this step and add members later from the dashboard
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="text-gray-400 hover:text-white"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8"
                            size="lg"
                        >
                            {step === 3 ? 'Complete Setup 🚀' : 'Continue →'}
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    )
}
