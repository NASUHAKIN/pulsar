import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card"
import { Logo } from "../components/Logo"
import { seedData, STORAGE_KEYS } from "../lib/storage"

export default function Signup() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulating registration
        setTimeout(() => {
            // Seed data for new user experience
            if (!localStorage.getItem(STORAGE_KEYS.TEAMS)) {
                seedData()
            }
            setIsLoading(false)
            navigate("/dashboard")
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
            <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[800px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none opacity-50 dark:opacity-100" />

            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Logo size="lg" />
            </div>

            <Card className="w-full max-w-md bg-card border-border animate-in fade-in zoom-in duration-500">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-foreground">Create your workspace</CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Start your 14-day free trial. No credit card required.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name">First name</Label>
                                <Input id="first-name" required className="bg-background border-input focus-visible:ring-primary" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name">Last name</Label>
                                <Input id="last-name" required className="bg-background border-input focus-visible:ring-primary" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company Name</Label>
                            <Input id="company" placeholder="Acme Inc." required className="bg-background border-input focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input id="email" type="email" placeholder="name@company.com" required className="bg-background border-input focus-visible:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required className="bg-background border-input focus-visible:ring-primary" />
                        </div>
                        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Get Started"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
