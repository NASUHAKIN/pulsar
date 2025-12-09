import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { saveCheckIn } from "../lib/storage"
import { CHECK_IN_TEMPLATES, getTemplate } from "../lib/checkInTemplates"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import type { CheckIn } from "../lib/storage"

export default function CheckIn() {
    const { token } = useParams() // Expecting memberId as token for MVP simplicity
    const [member, setMember] = useState<{ name: string, teamId: string } | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState('weekly')
    const [formData, setFormData] = useState<Record<string, string>>({})
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        // Look up member from storage
        const allMembers = JSON.parse(localStorage.getItem('antigravity_members') || '[]')
        const found = allMembers.find((m: any) => m.id === token)
        if (found) setMember(found)
    }, [token])

    const template = getTemplate(selectedTemplate)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!token || !member || !template) return

        // Build check-in object based on template
        const checkInData: any = {
            memberId: token,
            teamId: member.teamId,
            templateType: selectedTemplate as any,
            ...formData
        }

        saveCheckIn(checkInData)
        setSubmitted(true)
    }

    const handleFieldChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const getWordCount = (text: string) => {
        return text.split(/\s+/).filter(word => word.length > 0).length
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl">🎉</CardTitle>
                        <CardTitle>Update Sent!</CardTitle>
                        <CardDescription>Thanks for keeping the team in the loop.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                        <Button onClick={() => window.location.href = '/'} variant="outline">Return to Home</Button>
                        <p className="text-xs text-muted-foreground mt-4">(You can close this tab safely)</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!template) return null

    const totalWords = Object.values(formData).reduce((sum, text) => sum + getWordCount(text), 0)

    return (
        <div className="min-h-screen flex flex-col items-center py-10 px-4 bg-muted/30">
            <div className="w-full max-w-2xl">
                <header className="mb-8 text-center">
                    <h1 className="text-2xl font-bold">Check-in</h1>
                    {member && <p className="text-muted-foreground">Hello, {member.name}</p>}
                </header>

                {/* Template Selector */}
                <div className="mb-6">
                    <Label>Select Check-in Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {CHECK_IN_TEMPLATES.map(t => (
                                <SelectItem key={t.id} value={t.id}>
                                    {t.name} - {t.description}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Card className="border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-muted-foreground">
                                {totalWords} words written
                            </span>
                            {template.sector && (
                                <span className="text-xs px-2 py-1 bg-primary/10 rounded">
                                    {template.sector}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {template.fields.map(field => (
                                <div key={field.key} className="space-y-3">
                                    <Label htmlFor={field.key} className="text-base font-medium">
                                        {field.label}
                                        {!field.required && <span className="text-muted-foreground ml-2">(Optional)</span>}
                                    </Label>
                                    {field.multiline ? (
                                        <textarea
                                            id={field.key}
                                            className="flex min-h-[120px] w-full rounded-xl border border-input/50 bg-background/50 px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200 resize-none"
                                            placeholder={field.placeholder}
                                            value={formData[field.key] || ''}
                                            onChange={e => handleFieldChange(field.key, e.target.value)}
                                            required={field.required}
                                        />
                                    ) : (
                                        <input
                                            id={field.key}
                                            type="text"
                                            className="flex h-12 w-full rounded-xl border border-input/50 bg-background/50 px-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary transition-all duration-200"
                                            placeholder={field.placeholder}
                                            value={formData[field.key] || ''}
                                            onChange={e => handleFieldChange(field.key, e.target.value)}
                                            required={field.required}
                                        />
                                    )}
                                    {formData[field.key] && (
                                        <span className="text-xs text-muted-foreground">
                                            {getWordCount(formData[field.key])} words
                                        </span>
                                    )}
                                </div>
                            ))}

                            <Button
                                type="submit"
                                className="w-full text-lg h-14 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all"
                                size="lg"
                            >
                                Submit Check-in
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
