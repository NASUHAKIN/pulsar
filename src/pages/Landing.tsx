import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { Logo } from "../components/Logo"
import { Card, CardContent } from "../components/ui/card"
import {
    Bot, Zap, Trophy, ArrowRight, User,
    CheckCircle2, Users, BarChart3, Clock, Sparkles,
    Star, ChevronRight
} from "lucide-react"

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#030712] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            {/* Ambient Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20">
                <Logo size="sm" />
                <div className="flex gap-4 items-center">
                    <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white hidden md:block">Features</button>
                    <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-400 hover:text-white hidden md:block">Pricing</button>
                    <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => navigate('/login')}>
                        Log In
                    </Button>
                    <Button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-500">
                        Get Started
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-sm text-indigo-400 mb-8">
                        <Sparkles className="h-4 w-4" />
                        AI-Powered Team Check-ins
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Replace Status Meetings with<br />Async Check-ins
                    </h1>

                    <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                        Get AI-powered summaries, spot blockers early, and keep your team aligned —
                        all without another meeting on the calendar.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20" onClick={() => navigate('/')}>
                            Start Free — No Credit Card
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 text-white bg-transparent hover:bg-white/10" onClick={() => navigate('/member-login')}>
                            <User className="h-5 w-5 mr-2" />
                            Member Login
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Free forever for small teams</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Setup in 2 minutes</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> No meetings required</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-6 py-20 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for async standups</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">Simple enough for small teams, powerful enough for enterprises</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Weekly Check-ins</h3>
                            <p className="text-slate-400">Quick weekly updates. No more long status meetings that could be an email.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Bot className="h-6 w-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">AI Summaries</h3>
                            <p className="text-slate-400">Get instant team summaries. Spot blockers and risks automatically.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4">
                                <BarChart3 className="h-6 w-6 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Real-time Analytics</h3>
                            <p className="text-slate-400">Track submission rates, response quality, and team health over time.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Trophy className="h-6 w-6 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Kudos & Recognition</h3>
                            <p className="text-slate-400">Build team culture with built-in shoutouts and appreciation.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Team Templates</h3>
                            <p className="text-slate-400">Pre-built templates for Engineering, Product, Sales, and more.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-md hover:bg-white/10 transition-all hover:scale-105">
                        <CardContent className="pt-6">
                            <div className="h-12 w-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-pink-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">Flexible Schedules</h3>
                            <p className="text-slate-400">Set custom weekly check-in schedules for each team.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* How It Works */}
            <section className="container mx-auto px-6 py-20 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Get started in 3 simple steps</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                        <h3 className="text-xl font-semibold mb-2">Create your team</h3>
                        <p className="text-slate-400">Sign up and add your team members in under 2 minutes.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                        <h3 className="text-xl font-semibold mb-2">Share the link</h3>
                        <p className="text-slate-400">Members get a unique link to submit their check-ins.</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                        <h3 className="text-xl font-semibold mb-2">Get AI insights</h3>
                        <p className="text-slate-400">Dashboard shows summaries, blockers, and team health.</p>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="container mx-auto px-6 py-20 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
                    <p className="text-slate-400">Free for small teams. Scale as you grow.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-semibold mb-2">Free</h3>
                            <div className="text-4xl font-bold mb-4">$0<span className="text-lg text-slate-400 font-normal">/month</span></div>
                            <p className="text-slate-400 mb-6">Perfect for small teams getting started</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Up to 5 team members</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Weekly check-ins</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Basic analytics</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> AI summaries</li>
                            </ul>
                            <Button className="w-full" variant="outline" onClick={() => navigate('/')}>Get Started Free</Button>
                        </CardContent>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="bg-indigo-600/20 border-indigo-500/50 backdrop-blur-md relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-xs rounded-full flex items-center gap-1">
                            <Star className="h-3 w-3" /> Most Popular
                        </div>
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-semibold mb-2">Pro</h3>
                            <div className="text-4xl font-bold mb-4">$12<span className="text-lg text-slate-400 font-normal">/user/month</span></div>
                            <p className="text-slate-400 mb-6">For growing teams that need more</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Unlimited team members</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Custom templates</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Advanced analytics</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Export to PDF/CSV</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Email notifications</li>
                            </ul>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-500" onClick={() => navigate('/')}>Start 14-day trial</Button>
                        </CardContent>
                    </Card>

                    {/* Enterprise Plan */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                            <div className="text-4xl font-bold mb-4">Custom</div>
                            <p className="text-slate-400 mb-6">For large organizations</p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Everything in Pro</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> SSO / SAML</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Custom integrations</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> Dedicated support</li>
                                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" /> SLA guarantees</li>
                            </ul>
                            <Button className="w-full" variant="outline">Contact Sales</Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20 relative z-10">
                <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-3xl p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to replace your status meetings?</h2>
                    <p className="text-slate-400 mb-8">Join thousands of teams using Pulsar for async check-ins.</p>
                    <Button size="lg" className="h-14 px-8 text-lg bg-white text-gray-900 hover:bg-slate-100" onClick={() => navigate('/')}>
                        Get Started Free
                        <ChevronRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 relative z-10">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <Logo size="sm" />
                            <p className="text-slate-400 text-sm mt-4">AI-powered async check-ins for modern teams.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white text-left">Features</button></li>
                                <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white text-left">Pricing</button></li>
                                <li><a href="#" className="hover:text-white">Changelog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li><a href="/terms" className="hover:text-white" onClick={(e) => { e.preventDefault(); navigate('/terms') }}>Terms of Service</a></li>
                                <li><a href="/privacy" className="hover:text-white" onClick={(e) => { e.preventDefault(); navigate('/privacy') }}>Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-slate-500">
                        <p>© {new Date().getFullYear()} Pulsar. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
