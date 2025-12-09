import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Logo } from '../components/Logo'
import { addTeam, addMember } from '../lib/storage'
import { Check, Users, Briefcase, Code, ShoppingCart, Sparkles, Rocket, Zap, TrendingUp, ChevronRight, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

type Sector = 'engineering' | 'product' | 'sales' | 'general'

interface TeamMember {
    name: string
    email: string
}

export default function Onboarding() {
    const navigate = useNavigate()
    const [step, setStep] = useState(0) // Start at welcome screen
    const [teamName, setTeamName] = useState('')
    const [sector, setSector] = useState<Sector>('general')
    const [members, setMembers] = useState<TeamMember[]>([{ name: '', email: '' }])
    const [errors, setErrors] = useState<{ teamName?: string; members?: string[] }>({})

    // Load saved progress (but never restore step 0 - always show welcome)
    useEffect(() => {
        const saved = localStorage.getItem('onboarding_progress')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                if (data.teamName) setTeamName(data.teamName)
                if (data.sector) setSector(data.sector)
                if (data.members) setMembers(data.members)
                // Only restore step if it's > 0 (never skip welcome screen)
                if (data.step && data.step > 0) {
                    setStep(data.step)
                }
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
        // Create team
        const team = addTeam(teamName, sector)

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

    // Welcome Screen
    if (step === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-y-auto">
                <div className="max-w-6xl mx-auto px-6 py-12">
                    {/* Hero Section */}
                    <div className="text-center space-y-6 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Logo size="lg" />

                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                AI-Powered Team Check-ins
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                                Transform team communication with intelligent check-ins, real-time analytics, and automated insights
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Check className="h-5 w-5 text-green-400" />
                                <span>2-minute setup</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Check className="h-5 w-5 text-green-400" />
                                <span>No credit card</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Check className="h-5 w-5 text-green-400" />
                                <span>Free forever</span>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-16">
                        <div className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-500/20 backdrop-blur hover:scale-105 transition-transform">
                            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="h-8 w-8 text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-xl mb-3">Lightning Fast</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Daily or weekly check-ins take less than 2 minutes. Keep your team aligned without the overhead of long meetings.
                            </p>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20 backdrop-blur hover:scale-105 transition-transform">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="font-semibold text-xl mb-3">AI-Powered Insights</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Get instant team summaries, identify risks and blockers automatically. AI analyzes patterns you might miss.
                            </p>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-green-500/20 backdrop-blur hover:scale-105 transition-transform">
                            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp className="h-8 w-8 text-green-400" />
                            </div>
                            <h3 className="font-semibold text-xl mb-3">Real-Time Analytics</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Track submit rates, identify delays, monitor team mood. Make data-driven decisions with beautiful dashboards.
                            </p>
                        </div>
                    </div>

                    {/* Additional Features */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold mb-6">Everything You Need</h3>
                            <div className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">7 Check-in Templates</p>
                                    <p className="text-sm text-gray-400">Engineering, Product, Sales, and more - pre-built for your team type</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Gamification & Badges</p>
                                    <p className="text-sm text-gray-400">Keep teams motivated with kudos, achievements, and friendly competition</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Smart Notifications</p>
                                    <p className="text-sm text-gray-400">Never miss a check-in with intelligent reminders and alerts</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Check className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold mb-1">Export & Reports</p>
                                    <p className="text-sm text-gray-400">PDF and CSV exports for sharing with stakeholders</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
                            <h3 className="text-2xl font-bold mb-6">Perfect For</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <Code className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Engineering Teams</p>
                                        <p className="text-xs text-gray-400">Sprint updates, blockers, technical debt</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <Sparkles className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Product Teams</p>
                                        <p className="text-xs text-gray-400">Feature progress, user feedback, roadmap</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <ShoppingCart className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Sales Teams</p>
                                        <p className="text-xs text-gray-400">Pipeline updates, deals won, challenges</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                        <Users className="h-5 w-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">Any Team</p>
                                        <p className="text-xs text-gray-400">Flexible templates for any workflow</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center space-y-6">
                        <Button
                            onClick={() => setStep(1)}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-12 py-6 text-lg group"
                            size="lg"
                        >
                            Start Your Free Team <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>

                        <p className="text-gray-500 text-sm">
                            Join thousands of teams already using Pulsar
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Success Screen
    if (step === 4) {
        setTimeout(() => navigate('/dashboard'), 5000)

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

                    <p className="text-gray-500 text-sm">
                        Redirecting automatically in 5 seconds...
                    </p>
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
                            disabled={step === 1}
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
