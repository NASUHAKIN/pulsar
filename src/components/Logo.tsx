import { Rocket } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function Logo({ className = "", size = "md" }: { className?: string, size?: "sm" | "md" | "lg" | "xl" }) {
    const navigate = useNavigate()

    const sizeClasses = {
        sm: "h-5 w-5",
        md: "h-8 w-8",
        lg: "h-12 w-12",
        xl: "h-24 w-24"
    }

    const titleSize = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-4xl",
        xl: "text-6xl"
    }

    return (
        <div
            className={`flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
            onClick={() => navigate('/')}
        >
            <div className="relative">
                <div className={`absolute inset-0 bg-indigo-500 blur-lg opacity-50 rounded-full animate-pulse`} />
                <div className={`relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ${sizeClasses[size]}`}>
                    <Rocket className="h-[60%] w-[60%] fill-current" />
                    <div className="absolute inset-0 rounded-xl border-2 border-white/20 animate-ping opacity-20" />
                </div>
            </div>
            <div className="flex flex-col">
                <h1 className={`font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 ${titleSize[size]}`}>
                    Pulsar
                </h1>
                {size !== "sm" && size !== "md" && (
                    <span className="text-muted-foreground font-medium tracking-wide text-sm md:text-lg">
                        Sync Less. Ship More.
                    </span>
                )}
            </div>
        </div>
    )
}
