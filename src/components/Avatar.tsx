import { getInitials, getAvatarColor } from '../lib/profileManagement'

interface AvatarProps {
    name: string
    photoUrl?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export function Avatar({ name, photoUrl, size = 'md', className = '' }: AvatarProps) {
    const sizeClasses = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-12 w-12 text-sm',
        lg: 'h-16 w-16 text-lg',
        xl: 'h-24 w-24 text-2xl'
    }

    const initials = getInitials(name)
    const gradient = getAvatarColor(name)

    if (photoUrl) {
        return (
            <img
                src={photoUrl}
                alt={name}
                className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
            />
        )
    }

    return (
        <div
            className={`rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white ${sizeClasses[size]} ${className}`}
        >
            {initials}
        </div>
    )
}
