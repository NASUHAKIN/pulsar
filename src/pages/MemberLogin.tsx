import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/card"
import { Logo } from "../components/Logo"
import { getTeams, getMembers } from "../lib/storage"
import { toast } from "sonner"

export default function MemberLogin() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error("Please enter your email")
            return
        }

        setLoading(true)

        setTimeout(() => {
            // Find member by email
            const allMembers = getMembers()
            const member = allMembers.find(m => m.email.toLowerCase() === email.toLowerCase())

            if (!member) {
                toast.error("User not found. Please check your email.")
                setLoading(false)
                return
            }

            // Check if member has teams
            const allTeams = getTeams()
            const userTeams = allTeams.filter(t =>
                allMembers.some(m => m.id === member.id && m.teamId === t.id)
            )

            if (userTeams.length === 0) {
                toast.info("No teams found. Contact your admin to be added to a team.")
                setLoading(false)
                return
            }

            // Store current user for dashboard
            localStorage.setItem('currentUserId', member.id)
            localStorage.setItem('currentUserEmail', member.email)

            toast.success(`Welcome back ${member.name}!`)
            navigate("/dashboard")
        }, 800)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="mb-8">
                <Logo size="lg" />
            </div>

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Member Login</CardTitle>
                    <CardDescription className="text-center">
                        Sign in with your work email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button variant="link" onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Demo emails:</p>
                <p className="mt-1 font-mono text-xs">
                    sarah@pulsar.app, alex@pulsar.app, mike@pulsar.app
                </p>
            </div>
        </div>
    )
}
