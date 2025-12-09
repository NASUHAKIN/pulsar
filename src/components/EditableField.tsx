import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Check, X, Edit2 } from 'lucide-react'

interface EditableFieldProps {
    value: string
    onSave: (newValue: string) => void
    label?: string
    multiline?: boolean
    placeholder?: string
    canEdit?: boolean
}

export function EditableField({
    value,
    onSave,
    label,
    multiline = false,
    placeholder = '',
    canEdit = true
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)

    const handleSave = () => {
        if (editValue.trim()) {
            onSave(editValue.trim())
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        setEditValue(value)
        setIsEditing(false)
    }

    if (!isEditing) {
        return (
            <div className="group flex items-center gap-2">
                <div>
                    {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
                    <p className="text-sm text-white">{value || placeholder}</p>
                </div>
                {canEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit2 className="h-3 w-3" />
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {label && <p className="text-xs text-muted-foreground">{label}</p>}
            <div className="flex gap-2">
                {multiline ? (
                    <textarea
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="flex-1 min-h-[60px] rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        placeholder={placeholder}
                        autoFocus
                    />
                ) : (
                    <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        placeholder={placeholder}
                        autoFocus
                        className="flex-1"
                    />
                )}
                <Button size="icon" variant="ghost" onClick={handleSave} className="text-green-400">
                    <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel} className="text-red-400">
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
