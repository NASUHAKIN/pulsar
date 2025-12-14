import { Logo } from "../components/Logo"
import { Button } from "../components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function Privacy() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-6 py-12 max-w-3xl">
                <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <Logo size="sm" />

                <h1 className="text-4xl font-bold mt-8 mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-foreground/80">
                    <section>
                        <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly, including your name, email address, and check-in content. We also collect usage data such as page views and feature interactions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                        <p>We use your information to provide and improve Pulsar, communicate with you about the service, and ensure security. We may use aggregated data for analytics purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">3. Data Storage</h2>
                        <p>Your data is securely stored and protected using industry-standard encryption. We retain your data for as long as your account is active or as needed to provide services.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>
                        <p>We do not sell your personal information. We may share data with service providers who assist in operating our platform, subject to confidentiality agreements.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
                        <p>You have the right to access, correct, or delete your personal information. You may also export your data at any time from your account settings.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
                        <p>We use cookies and similar technologies to enhance your experience, analyze usage, and personalize content. You can control cookie settings in your browser.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">7. Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold mb-3">9. Contact</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at privacy@pulsar.app</p>
                    </section>
                </div>
            </div>
        </div>
    )
}
