import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import CheckIn from "./pages/CheckIn"
import MemberLogin from "./pages/MemberLogin"
import MemberDashboard from "./pages/MemberDashboard"
import Profile from "./pages/Profile"
import Onboarding from "./pages/Onboarding"
import Settings from "./pages/Settings"
import TeamProfile from "./pages/TeamProfile"
import NotFound from "./pages/NotFound"
import Terms from "./pages/Terms"
import Privacy from "./pages/Privacy"
import { Toaster } from "sonner"
import { useEffect } from "react"
import { seedData } from "./lib/storage"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ErrorBoundary } from "./components/ErrorBoundary"

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

// Public Route (redirect to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        )
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return <>{children}</>
}

function AppRoutes() {
    useEffect(() => {
        try {
            seedData()
        } catch (e) {
            console.error("Storage Error:", e)
        }
    }, [])

    return (
        <Routes>
            {/* Landing page - always public */}
            <Route path="/" element={<Landing />} />

            {/* Auth pages - redirect to dashboard if already logged in */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Member routes */}
            <Route path="/member-login" element={<MemberLogin />} />
            <Route path="/member-dashboard" element={<MemberDashboard />} />
            <Route path="/check-in/:token" element={<CheckIn />} />

            {/* Protected routes - require manager authentication */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/team/:teamId/profile" element={<ProtectedRoute><TeamProfile /></ProtectedRoute>} />

            {/* Legal pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <Router>
                        <AppRoutes />
                        <Toaster />
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    )
}
