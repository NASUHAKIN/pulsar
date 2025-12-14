import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'
import { exportToPDF, exportToCSV, type ExportOptions } from '../lib/export'
import { FileDown, FileText, Table } from 'lucide-react'
import { toast } from 'sonner'

interface ExportDialogProps {
    teamId: string
}

export function ExportDialog({ teamId }: ExportDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [exportType, setExportType] = useState<'pdf' | 'csv'>('pdf')
    const [contentType, setContentType] = useState<ExportOptions['content']>('full-report')

    const handleExport = () => {
        const options: ExportOptions = {
            teamId,
            type: exportType,
            content: contentType
        }

        try {
            if (exportType === 'pdf') {
                exportToPDF(options)
                toast.success('PDF downloaded successfully!')
            } else {
                exportToCSV(options)
                toast.success('CSV downloaded successfully!')
            }
            setIsOpen(false)
        } catch (error) {
            toast.error('Export failed. Please try again.')
            console.error('Export error:', error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Export Reports</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Export Format</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={exportType === 'pdf' ? 'secondary' : 'outline'}
                                onClick={() => setExportType('pdf')}
                                className="justify-start"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                PDF
                            </Button>
                            <Button
                                variant={exportType === 'csv' ? 'secondary' : 'outline'}
                                onClick={() => setExportType('csv')}
                                className="justify-start"
                            >
                                <Table className="h-4 w-4 mr-2" />
                                CSV
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <Select value={contentType} onValueChange={(value) => setContentType(value as ExportOptions['content'])}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="full-report">Full Report (PDF only)</SelectItem>
                                <SelectItem value="checkins">Check-ins</SelectItem>
                                <SelectItem value="analytics">Analytics Summary</SelectItem>
                                <SelectItem value="action-items">Action Items</SelectItem>
                                <SelectItem value="kudos">Team Kudos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {exportType === 'pdf' && contentType === 'full-report' && (
                        <div className="p-3 bg-indigo-500/10 rounded border border-indigo-500/20 text-sm">
                            <p className="text-indigo-300">
                                Full report includes analytics, check-ins, and action items in a single PDF.
                            </p>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleExport}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Export {exportType.toUpperCase()}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
