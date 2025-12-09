import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import CheckIn from "./pages/CheckIn"
import MemberLogin from "./pages/MemberLogin"
import Profile from "./pages/Profile"
import Onboarding from "./pages/Onboarding"
import Settings from "./pages/Settings"
import TeamProfile from "./pages/TeamProfile"
import NotFound from "./pages/NotFound"
import { Toaster } from "sonner"
import { useEffect } from "react"
import { seedData } from "./lib/storage"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ErrorBoundary } from "./components/ErrorBoundary"

export default function App() {
    useEffect(() => {
        try {
            seedData()
        } catch (e) {
            console.error("Storage Error:", e)
        }
    }, [])

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Onboarding />} />
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/member-login" element={<MemberLogin />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/check-in/:token" element={<CheckIn />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/team/:teamId/profile" element={<TeamProfile />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                </Router>
            </ThemeProvider>
        </ErrorBoundary>
    )
}
