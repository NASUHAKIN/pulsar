import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import { Logo } from "../components/Logo"
import { getMembers, saveMembers } from "../lib/storage"
import { toast } from "sonner"
import { Users } from "lucide-react"

// Member auth helpers
const MEMBER_SESSION_KEY = 'antigravity_member_session'

export function getMemberSession() {
    const data = localStorage.getItem(MEMBER_SESSION_KEY)
    return data ? JSON.parse(data) : null
}

export function saveMemberSession(member: any) {
    localStorage.setItem(MEMBER_SESSION_KEY, JSON.stringify({
        memberId: member.id,
        email: member.email,
        name: member.name,
        teamId: member.teamId
    }))
}

export function clearMemberSession() {
    localStorage.removeItem(MEMBER_SESSION_KEY)
}

export default function MemberLogin() {
    const navigate = useNavigate()
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields")
            return
        }

        setLoading(true)

        setTimeout(() => {
            // Find member by email
            const allMembers = getMembers()
            const member = allMembers.find(m => m.email.toLowerCase() === email.toLowerCase())

            if (!member) {
                toast.error("Account not found. Please sign up first.")
                setLoading(false)
                return
            }

            // Check password (stored in member.password)
            if (member.password !== password) {
                toast.error("Incorrect password")
                setLoading(false)
                return
            }

            // Save session
            saveMemberSession(member)

            toast.success(`Welcome back, ${member.name}!`)
            navigate("/member-dashboard")
            setLoading(false)
        }, 500)
    }

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields")
            return
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setLoading(true)

        setTimeout(() => {
            // Check if member exists (was added by manager)
            const allMembers = getMembers()
            const existingMember = allMembers.find(m => m.email.toLowerCase() === email.toLowerCase())

            if (!existingMember) {
                toast.error("Email not found. Ask your manager to add you to a team first.")
                setLoading(false)
                return
            }

            if (existingMember.password) {
                toast.error("Account already exists. Please login instead.")
                setMode('login')
                setLoading(false)
                return
            }

            // Set password for member
            existingMember.password = password
            saveMembers(allMembers)

            // Save session
            saveMemberSession(existingMember)

            toast.success(`Account created! Welcome, ${existingMember.name}!`)
            navigate("/member-dashboard")
            setLoading(false)
        }, 500)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="mb-8">
                <Logo size="lg" />
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-center">
                        {mode === 'login' ? 'Member Login' : 'Create Account'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {mode === 'login'
                            ? 'Sign in to submit your check-ins'
                            : 'Set up your password to access your team'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading
                                ? (mode === 'login' ? "Signing in..." : "Creating account...")
                                : (mode === 'login' ? "Sign in" : "Create Account")
                            }
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    {mode === 'login' ? (
                        <p className="text-sm text-muted-foreground">
                            First time?{" "}
                            <button
                                onClick={() => setMode('signup')}
                                className="text-primary hover:underline font-medium"
                            >
                                Create account
                            </button>
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <button
                                onClick={() => setMode('login')}
                                className="text-primary hover:underline font-medium"
                            >
                                Sign in
                            </button>
                        </p>
                    )}
                    <div className="w-full border-t pt-4">
                        <Link to="/login" className="text-sm text-muted-foreground hover:text-primary block text-center">
                            Are you a manager? Login here →
                        </Link>
                    </div>
                </CardFooter>
            </Card>

            <p className="mt-6 text-center text-sm text-muted-foreground max-w-md">
                Note: Your manager needs to add you to a team first.
                Then you can create your account using the same email.
            </p>
        </div>
    )
}
