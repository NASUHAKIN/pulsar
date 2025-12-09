import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog'
import { getActionItems, saveActionItem, updateActionItem, deleteActionItem, type ActionItem } from '../lib/actionItems'
import { getMembers } from '../lib/storage'
import { CheckCircle2, Circle, Clock, AlertCircle, Plus, Trash2, User } from 'lucide-react'
import { toast } from 'sonner'

interface ActionItemsListProps {
    teamId: string
}

export function ActionItemsList({ teamId }: ActionItemsListProps) {
    const [items, setItems] = useState<ActionItem[]>([])
    const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [newItem, setNewItem] = useState({ title: '', description: '', priority: 'medium' as const })
    const members = getMembers(teamId)

    useEffect(() => {
        loadItems()
    }, [teamId, filter])

    const loadItems = () => {
        let allItems = getActionItems(teamId)
        if (filter !== 'all') {
            allItems = allItems.filter(item => item.status === filter)
        }
        setItems(allItems.sort((a, b) => {
            // Sort by priority then date
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority]
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }))
    }

    const handleStatusChange = (id: string, newStatus: ActionItem['status']) => {
        updateActionItem(id, { status: newStatus })
        loadItems()
        toast.success('Status updated')
    }

    const handleDelete = (id: string) => {
        deleteActionItem(id)
        loadItems()
        toast.success('Action item deleted')
    }

    const handleAddItem = () => {
        if (!newItem.title.trim()) {
            toast.error('Please enter a title')
            return
        }

        saveActionItem({
            ...newItem,
            source: 'manual',
            teamId,
            status: 'todo',
            createdBy: 'current-user' // Would be actual user ID
        })

        setNewItem({ title: '', description: '', priority: 'medium' })
        setIsAddDialogOpen(false)
        loadItems()
        toast.success('Action item created')
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20'
            case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
            case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20'
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done': return <CheckCircle2 className="h-5 w-5 text-green-400" />
            case 'in-progress': return <Clock className="h-5 w-5 text-yellow-400" />
            default: return <Circle className="h-5 w-5 text-gray-400" />
        }
    }

    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            Action Items ({items.length})
                        </CardTitle>
                        <CardDescription>Track tasks and blockers</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Item
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>New Action Item</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            id="title"
                                            value={newItem.title}
                                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                            placeholder="e.g., Fix authentication bug"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            value={newItem.description}
                                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                            className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2"
                                            placeholder="Additional details..."
                                        />
                                    </div>
                                    <div>
                                        <Label>Priority</Label>
                                        <Select value={newItem.priority} onValueChange={(value: any) => setNewItem({ ...newItem, priority: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="high">High</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="low">Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleAddItem}>Create</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                    {(['all', 'todo', 'in-progress', 'done'] as const).map(status => (
                        <Button
                            key={status}
                            variant={filter === status ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setFilter(status)}
                            className="text-xs"
                        >
                            {status === 'all' ? 'All' : status.replace('-', ' ')}
                        </Button>
                    ))}
                </div>

                {/* Items List */}
                <div className="space-y-2">
                    {items.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                            <p>No action items yet</p>
                            <p className="text-sm mt-1">Create one to get started</p>
                        </div>
                    ) : (
                        items.map(item => (
                            <div
                                key={item.id}
                                className="p-4 bg-black/20 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <button
                                        onClick={() => {
                                            const nextStatus = item.status === 'todo' ? 'in-progress' : item.status === 'in-progress' ? 'done' : 'todo'
                                            handleStatusChange(item.id, nextStatus)
                                        }}
                                        className="mt-1"
                                    >
                                        {getStatusIcon(item.status)}
                                    </button>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <h4 className={`text-sm font-medium ${item.status === 'done' ? 'line-through text-gray-500' : 'text-white'}`}>
                                                {item.title}
                                            </h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-400 hover:text-red-300 h-6 px-2"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        {item.description && (
                                            <p className="text-xs text-slate-400 mb-2">{item.description}</p>
                                        )}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                            {item.source === 'ai' && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                                    AI Generated
                                                </span>
                                            )}
                                            {item.assignedTo && (
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {members.find(m => m.id === item.assignedTo)?.name || 'Unknown'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
