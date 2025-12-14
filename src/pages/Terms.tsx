import { Logo } from "../components/Logo"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Terms() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-6 py-12 max-w-3xl">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <Logo size="sm" />

                <h1 className="text-4xl font-bold mt-8 mb-4">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-foreground/80">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                        <p>By accessing or using Pulsar, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
                        <p>Pulsar is an async team check-in platform that enables teams to share updates, track progress, and collaborate effectively without the need for synchronous meetings.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                        <p>You agree not to use Pulsar for any unlawful purpose or in any way that could damage, disable, or impair the service. You may not attempt to gain unauthorized access to any part of the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Content Ownership</h2>
                        <p>You retain ownership of all content you submit to Pulsar. By submitting content, you grant us a license to use, store, and display that content as necessary to provide the service.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Privacy</h2>
                        <p>Your use of Pulsar is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
                        <p>We reserve the right to terminate or suspend your account at any time for any reason, including violation of these terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Disclaimer</h2>
                        <p>Pulsar is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
                        <p>If you have any questions about these Terms, please contact us at support@pulsar.app</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
