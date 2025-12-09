import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { Logo } from "../components/Logo"
import { Card, CardContent } from "../components/ui/card"
import { Bot, Zap, Trophy, ArrowRight, User, LayoutDashboard, Database } from "lucide-react"

export default function Landing() {
    const navigate = useNavigate()

    const handleDirectorLogin = () => {
        navigate("/login")
    }

    const handleMemberLogin = () => {
        navigate("/member-login")
    }

    const handleReset = () => {
        localStorage.clear()
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20">
                <Logo size="sm" />
                <div className="flex gap-4">
                    <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={handleReset}>
                        <Database className="h-4 w-4 mr-2" />
                        Reset Demo
                    </Button>
                    <Button variant="secondary" onClick={handleDirectorLogin}>Log In</Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 container mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 pt-10 pb-20">
                <div className="animate-in fade-in zoom-in duration-700 slide-in-from-bottom-8">
                    <Logo size="xl" className="justify-center mb-8" />
                </div>

                <p className="max-w-2xl text-xl text-slate-400 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    <strong className="text-white">Zero friction.</strong> <strong className="text-white">Email-first.</strong> <strong className="text-white">AI-powered.</strong>
                </p>

                <p className="max-w-2xl text-lg text-slate-400 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    Replace weekly status meetings with async check-ins. <br className="hidden md:block" />
                    Get automatic summaries, spot risks early, and keep everyone aligned. <br className="hidden md:block" />
                    <span className="text-indigo-400 font-semibold">Setup takes 3-5 minutes.</span>

                </p>

                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 transition-all hover:scale-105" onClick={() => navigate('/onboarding')}>
                        <LayoutDashboard className="h-5 w-5 mr-2" />
                        Start Free Setup
                        <ArrowRight className="h-5 w-5 ml-2 opacity-50" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 !text-white !bg-transparent hover:bg-white/10 hover:border-white/30 transition-all hover:scale-105" onClick={handleMemberLogin}>
                        <User className="h-5 w-5 mr-2" />
                        Login as Member
                    </Button>
                </div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-6 mt-24 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                        <CardContent className="pt-6 text-left">
                            <div className="h-10 w-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-indigo-500" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Async Check-ins</h3>
                            <p className="text-slate-400 text-sm">Cancel the daily standup. Let your team share updates when they're in flow, not at 9 AM.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                        <CardContent className="pt-6 text-left">
                            <div className="h-10 w-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                                <Bot className="h-6 w-6 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">AI Summaries</h3>
                            <p className="text-slate-400 text-sm">Instantly turn a stream of updates into a concise executive summary. Spot blockers fast.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                        <CardContent className="pt-6 text-left">
                            <div className="h-10 w-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                                <Trophy className="h-6 w-6 text-yellow-500" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-white">Culture & Kudos</h3>
                            <p className="text-slate-400 text-sm">Foster team appreciation with built-in shoutouts. Celebrate wins, big and small.</p>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <footer className="text-center py-8 text-slate-500 text-xs relative z-10 border-t border-white/10">
                <p>Designed for high-velocity engineering teams.</p>
            </footer>
        </div>
    )
}
