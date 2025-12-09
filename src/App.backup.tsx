
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import CheckIn from "./pages/CheckIn"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import MemberLogin from "./pages/MemberLogin"
import Profile from "./pages/Profile"
import { Toaster } from "sonner"
import { useEffect } from "react"
import { seedData } from "./lib/storage"

function App() {
    useEffect(() => {
        try {
            seedData()
        } catch (e) {
            console.error("Storage Error:", e)
        }
    }, [])

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/member-login" element={<MemberLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/check-in/:token" element={<CheckIn />} />
            </Routes>
            <Toaster />
        </Router>
    )
}

export default App
