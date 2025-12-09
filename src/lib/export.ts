import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { getCheckIns, getMembers, getAnalytics, getKudos } from './storage'
import { getActionItems } from './actionItems'

export interface ExportOptions {
    teamId: string
    type: 'pdf' | 'csv'
    content: 'checkins' | 'analytics' | 'action-items' | 'kudos' | 'full-report'
    dateRange?: {
        start: Date
        end: Date
    }
}

// PDF Export Functions
export function exportToPDF(options: ExportOptions): void {
    const doc = new jsPDF()
    // const teamMembers = getMembers(options.teamId)  // Unused
    const teamName = `Team Report` // Could be fetched from team data

    // Title
    doc.setFontSize(20)
    doc.text(teamName, 14, 20)

    doc.setFontSize(10)
    doc.text(`Generated: ${format(new Date(), 'PPP')}`, 14, 28)

    let yPos = 40

    switch (options.content) {
        case 'checkins':
            yPos = addCheckInsSection(doc, options.teamId, yPos, options.dateRange)
            break
        case 'analytics':
            yPos = addAnalyticsSection(doc, options.teamId, yPos)
            break
        case 'action-items':
            yPos = addActionItemsSection(doc, options.teamId, yPos)
            break
        case 'kudos':
            yPos = addKudosSection(doc, options.teamId, yPos)
            break
        case 'full-report':
            yPos = addAnalyticsSection(doc, options.teamId, yPos)
            doc.addPage()
            yPos = 20
            yPos = addCheckInsSection(doc, options.teamId, yPos, options.dateRange)
            doc.addPage()
            yPos = 20
            yPos = addActionItemsSection(doc, options.teamId, yPos)
            break
    }

    // Save the PDF
    const filename = `${teamName.replace(/\s+/g, '_')}_${options.content}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
    doc.save(filename)
}

function addCheckInsSection(doc: jsPDF, teamId: string, startY: number, dateRange?: { start: Date; end: Date }): number {
    let checkIns = getCheckIns(teamId)
    const members = getMembers(teamId)

    // Filter by date range if provided
    if (dateRange) {
        checkIns = checkIns.filter(c => {
            const checkInDate = new Date(c.date)
            return checkInDate >= dateRange.start && checkInDate <= dateRange.end
        })
    }

    doc.setFontSize(14)
    doc.text('Check-ins Summary', 14, startY)

    const tableData = checkIns.map(c => {
        const member = members.find(m => m.id === c.memberId)
        return [
            member?.name || 'Unknown',
            format(new Date(c.date), 'PP'),
            c.templateType || 'weekly',
            (c.accomplishments || c.yesterday || '').substring(0, 100)
        ]
    })

    autoTable(doc, {
        startY: startY + 8,
        head: [['Member', 'Date', 'Template', 'Summary']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] },
        styles: { fontSize: 9 }
    })

    return (doc as any).lastAutoTable.finalY + 10
}

function addAnalyticsSection(doc: jsPDF, teamId: string, startY: number): number {
    const analytics = getAnalytics(teamId, 7)

    doc.setFontSize(14)
    doc.text('Team Analytics (Last 7 Days)', 14, startY)

    const tableData = [
        ['Submit Rate', `${analytics.submitRate.toFixed(1)}%`],
        ['Delay Rate', `${analytics.delayRate.toFixed(1)}%`],
        ['Avg Word Count', analytics.avgWordCount.toFixed(0)],
        ['Risk Count', analytics.riskCount.toString()]
    ]

    autoTable(doc, {
        startY: startY + 8,
        head: [['Metric', 'Value']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [99, 102, 241] },
        columnStyles: {
            0: { fontStyle: 'bold' }
        }
    })

    return (doc as any).lastAutoTable.finalY + 10
}

function addActionItemsSection(doc: jsPDF, teamId: string, startY: number): number {
    const actionItems = getActionItems(teamId)
    const members = getMembers(teamId)

    doc.setFontSize(14)
    doc.text('Action Items', 14, startY)

    const tableData = actionItems.map(item => {
        const assignee = item.assignedTo ? members.find(m => m.id === item.assignedTo)?.name || 'Unassigned' : 'Unassigned'
        return [
            item.title.substring(0, 40),
            item.priority,
            item.status,
            assignee
        ]
    })

    autoTable(doc, {
        startY: startY + 8,
        head: [['Title', 'Priority', 'Status', 'Assigned To']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] },
        styles: { fontSize: 9 }
    })

    return (doc as any).lastAutoTable.finalY + 10
}

function addKudosSection(doc: jsPDF, teamId: string, startY: number): number {
    const kudos = getKudos(teamId)
    const members = getMembers(teamId)

    doc.setFontSize(14)
    doc.text('Team Kudos', 14, startY)

    const tableData = kudos.map(k => {
        const from = members.find(m => m.id === k.fromMemberId)?.name || 'Unknown'
        const to = members.find(m => m.id === k.toMemberId)?.name || 'Unknown'
        return [
            from,
            to,
            k.message.substring(0, 80),
            format(new Date(k.date), 'PP')
        ]
    })

    autoTable(doc, {
        startY: startY + 8,
        head: [['From', 'To', 'Message', 'Date']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [251, 191, 36] },
        styles: { fontSize: 9 }
    })

    return (doc as any).lastAutoTable.finalY + 10
}

// CSV Export Functions
export function exportToCSV(options: ExportOptions): void {
    let csvData: any[] = []
    let headers: string[] = []
    let filename = ''

    switch (options.content) {
        case 'checkins':
            const checkIns = getCheckIns(options.teamId)
            const members = getMembers(options.teamId)
            headers = ['Member', 'Date', 'Template', 'Content', 'Blockers']
            csvData = checkIns.map(c => {
                const member = members.find(m => m.id === c.memberId)
                return {
                    Member: member?.name || 'Unknown',
                    Date: format(new Date(c.date), 'yyyy-MM-dd'),
                    Template: c.templateType || 'weekly',
                    Content: c.accomplishments || c.yesterday || '',
                    Blockers: c.blockers || ''
                }
            })
            filename = `checkins_${format(new Date(), 'yyyy-MM-dd')}.csv`
            break

        case 'analytics':
            const analytics = getAnalytics(options.teamId, 7)
            headers = ['Metric', 'Value']
            csvData = [
                { Metric: 'Submit Rate', Value: `${analytics.submitRate.toFixed(1)}%` },
                { Metric: 'Delay Rate', Value: `${analytics.delayRate.toFixed(1)}%` },
                { Metric: 'Avg Word Count', Value: analytics.avgWordCount.toFixed(0) },
                { Metric: 'Risk Count', Value: analytics.riskCount }
            ]
            filename = `analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`
            break

        case 'action-items':
            const actionItems = getActionItems(options.teamId)
            const teamMembers = getMembers(options.teamId)
            headers = ['Title', 'Description', 'Priority', 'Status', 'Assigned To', 'Created', 'Due Date']
            csvData = actionItems.map(item => ({
                Title: item.title,
                Description: item.description,
                Priority: item.priority,
                Status: item.status,
                'Assigned To': item.assignedTo ? teamMembers.find(m => m.id === item.assignedTo)?.name || 'Unassigned' : 'Unassigned',
                Created: format(new Date(item.createdAt), 'yyyy-MM-dd'),
                'Due Date': item.dueDate ? format(new Date(item.dueDate), 'yyyy-MM-dd') : ''
            }))
            filename = `action_items_${format(new Date(), 'yyyy-MM-dd')}.csv`
            break
    }

    // Convert to CSV string
    const csvString = [
        headers.join(','),
        ...csvData.map(row =>
            headers.map(header => {
                const value = row[header] || ''
                // Escape quotes and wrap in quotes if contains comma
                return value.toString().includes(',') ? `"${value.toString().replace(/"/g, '""')}"` : value
            }).join(',')
        )
    ].join('\n')

    // Download
    downloadCSV(csvString, filename)
}

function downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
