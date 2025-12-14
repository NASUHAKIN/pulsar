import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card"
import { Logo } from "../components/Logo"
import { useAuth } from "../contexts/AuthContext"
import { toast } from "sonner"

export default function Signup() {
    const navigate = useNavigate()
    const { signUp } = useAuth()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsLoading(true)

        const result = await signUp(email, password, name)

        setIsLoading(false)

        if (result.success && result.user) {
            toast.success("Account created successfully!")

            // Check if user has any teams
            const { getTeams } = await import('../lib/storage')
            const allTeams = getTeams()
            const userTeams = allTeams.filter(t => t.managerId === result.user!.id)

            if (userTeams.length > 0) {
                // User has teams, go to dashboard
                navigate("/dashboard")
            } else {
                // New user, start onboarding
                navigate("/onboarding")
            }
        } else {
            toast.error(result.error || "Sign up failed")
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-100" />

            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Logo size="lg" />
            </div>

            <Card className="w-full max-w-md bg-card border-border animate-in fade-in zoom-in duration-500">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-foreground">Create Account</CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Sign up to start managing your team
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="bg-background border-input focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background border-input focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="bg-background border-input focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="bg-background border-input focus-visible:ring-primary"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Account"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                            Sign In
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
