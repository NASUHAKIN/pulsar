import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select'
import { Logo } from '../components/Logo'
import { ArrowLeft, Bell, Mail, Clock } from 'lucide-react'
import { toast } from 'sonner'
import {
    getReminderSettings,
    saveReminderSettings,
    sendReminderNotification,
    type ReminderSettings
} from '../lib/notifications'

export default function Settings() {
    const navigate = useNavigate()
    const currentUserId = 'u1' // Mock user ID

    const [settings, setSettings] = useState<ReminderSettings>({
        userId: currentUserId,
        enabled: true,
        day: 'friday',
        time: '10:00',
        digestMode: 'weekly'
    })

    useEffect(() => {
        const currentSettings = getReminderSettings(currentUserId)
        setSettings(currentSettings)
    }, [])

    const handleSave = () => {
        saveReminderSettings(settings)
        toast.success('Settings saved successfully!')
    }

    const handleTestReminder = () => {
        sendReminderNotification(currentUserId)
        toast.success('Test reminder sent! Check your notifications.')
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                        <span className="font-medium">Back to Dashboard</span>
                    </div>
                    <Logo size="sm" />
                </div>
            </header>

            <main className="container mx-auto max-w-2xl px-4 py-8 space-y-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage your notification and reminder preferences</p>
                </div>

                {/* Email Reminders */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Email Reminders
                        </CardTitle>
                        <CardDescription>Configure when you want to receive check-in reminders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-blue-400" />
                                <div>
                                    <p className="font-medium text-sm">Enable Reminders</p>
                                    <p className="text-xs text-muted-foreground">Receive email reminders for check-ins</p>
                                </div>
                            </div>
                            <Button
                                variant={settings.enabled ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                            >
                                {settings.enabled ? 'Enabled' : 'Disabled'}
                            </Button>
                        </div>

                        {settings.enabled && (
                            <>
                                <div className="space-y-2">
                                    <Label>Reminder Day</Label>
                                    <Select
                                        value={settings.day}
                                        onValueChange={(value: any) => setSettings({ ...settings, day: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="monday">Monday</SelectItem>
                                            <SelectItem value="tuesday">Tuesday</SelectItem>
                                            <SelectItem value="wednesday">Wednesday</SelectItem>
                                            <SelectItem value="thursday">Thursday</SelectItem>
                                            <SelectItem value="friday">Friday</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Reminder Time</Label>
                                    <Select
                                        value={settings.time}
                                        onValueChange={(value) => setSettings({ ...settings, time: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="09:00">9:00 AM</SelectItem>
                                            <SelectItem value="10:00">10:00 AM</SelectItem>
                                            <SelectItem value="11:00">11:00 AM</SelectItem>
                                            <SelectItem value="14:00">2:00 PM</SelectItem>
                                            <SelectItem value="15:00">3:00 PM</SelectItem>
                                            <SelectItem value="16:00">4:00 PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Digest Mode</Label>
                                    <Select
                                        value={settings.digestMode}
                                        onValueChange={(value: any) => setSettings({ ...settings, digestMode: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily Digest</SelectItem>
                                            <SelectItem value="weekly">Weekly Digest</SelectItem>
                                            <SelectItem value="none">No Digest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Receive a summary of team activity
                                    </p>
                                </div>
                            </>
                        )}

                        <div className="pt-4 border-t border-gray-800 flex gap-2">
                            <Button onClick={handleSave} className="flex-1">
                                Save Settings
                            </Button>
                            <Button onClick={handleTestReminder} variant="outline">
                                <Clock className="h-4 w-4 mr-2" />
                                Test Reminder
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Mock Email Preview */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle>Email Preview (Mock)</CardTitle>
                        <CardDescription>This is how your reminder email will look</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-6 bg-white text-black rounded-lg space-y-4">
                            <div className="border-b border-gray-200 pb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
                                        <span className="text-white text-xl">🚀</span>
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">Pulsar</h2>
                                        <p className="text-xs text-gray-500">Weekly Check-in Reminder</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold">Hi there! 👋</h3>
                                <p className="text-sm text-gray-700">
                                    It's time for your weekly check-in! Your team is waiting to hear about your progress.
                                </p>

                                <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                                    <p className="text-sm font-medium text-indigo-900 mb-2">Quick Stats:</p>
                                    <ul className="text-xs text-indigo-700 space-y-1">
                                        <li>• Submit rate this week: 85%</li>
                                        <li>• Your current streak: 5 days</li>
                                        <li>• Kudos received: 3</li>
                                    </ul>
                                </div>

                                <div className="text-center py-4">
                                    <div className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium">
                                        Submit Check-in
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    Takes less than 2 minutes ⏱️
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
