import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card"
import { Logo } from "../components/Logo"
import { seedData, STORAGE_KEYS } from "../lib/storage"

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulating auth delay
        setTimeout(() => {
            // Ensure demo data exists
            if (!localStorage.getItem(STORAGE_KEYS.TEAMS)) {
                seedData()
            }
            setIsLoading(false)
            navigate("/dashboard")
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-100" />

            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Logo size="lg" />
            </div>

            <Card className="w-full max-w-md bg-card border-border animate-in fade-in zoom-in duration-500">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-foreground">Welcome back</CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Enter your credentials to access your workspace
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background border-input focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <a href="#" className="text-xs text-primary hover:text-primary/80">Forgot password?</a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-background border-input focus-visible:ring-primary"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary hover:text-primary/80 font-medium">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
