import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Logo } from '../components/Logo'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8 text-center">
                <Logo size="md" />

                <Card>
                    <CardHeader>
                        <div className="text-8xl font-bold text-primary mb-4">404</div>
                        <CardTitle className="text-2xl">Page Not Found</CardTitle>
                        <CardDescription>
                            The page you're looking for doesn't exist or has been moved.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3">
                            <Link to="/">
                                <Button className="w-full">
                                    <Home className="h-4 w-4 mr-2" />
                                    Go to Homepage
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button variant="outline" className="w-full">
                                    <Search className="h-4 w-4 mr-2" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                            <Button variant="ghost" className="w-full" onClick={() => window.history.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-sm text-muted-foreground">
                    Need help? Contact support
                </p>
            </div>
        </div>
    )
}
