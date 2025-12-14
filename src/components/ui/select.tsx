import * as React from "react"

interface SelectProps {
    children: React.ReactNode
    value?: string
    onValueChange?: (value: string) => void
    className?: string
}

interface SelectItemProps {
    value: string
    children: React.ReactNode
}

const Select = ({ children, value, onValueChange }: SelectProps) => {
    return (
        <div className="relative">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        value,
                        onValueChange,
                    })
                }
                return child
            })}
        </div>
    )
}

const SelectTrigger = ({
    children,
    className,
    value,
    onValueChange,
}: {
    children: React.ReactNode
    className?: string
    value?: string
    onValueChange?: (value: string) => void
}) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedLabel, setSelectedLabel] = React.useState<string>("")
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const contentRef = React.useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node) &&
                contentRef.current &&
                !contentRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className || ""}`}
            >
                <span className="truncate">{selectedLabel || "Select..."}</span>
                <svg
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <div
                    ref={contentRef}
                    className="absolute z-50 mt-1 w-full rounded-md border border-gray-700 bg-gray-900 shadow-lg"
                >
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child) && child.type === SelectContent) {
                            return React.cloneElement(child as React.ReactElement<any>, {
                                value,
                                onValueChange,
                                setSelectedLabel,
                                setIsOpen,
                            })
                        }
                        return null
                    })}
                </div>
            )}
        </div>
    )
}

const SelectContent = ({
    children,
    value,
    onValueChange,
    setSelectedLabel,
    setIsOpen,
}: {
    children: React.ReactNode
    value?: string
    onValueChange?: (value: string) => void
    setSelectedLabel?: (label: string) => void
    setIsOpen?: (open: boolean) => void
}) => {
    return (
        <div className="max-h-60 overflow-auto py-1">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && child.type === SelectItem) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        isSelected: value === (child.props as SelectItemProps).value,
                        onSelect: (itemValue: string, label: string) => {
                            onValueChange?.(itemValue)
                            setSelectedLabel?.(label)
                            setIsOpen?.(false)
                        },
                    })
                }
                return child
            })}
        </div>
    )
}

const SelectValue = () => null

const SelectItem = ({
    value,
    children,
    isSelected,
    onSelect,
}: SelectItemProps & {
    isSelected?: boolean
    onSelect?: (value: string, label: string) => void
}) => {
    const labelRef = React.useRef<HTMLDivElement>(null)

    // Get text content for label
    const getTextContent = (node: React.ReactNode): string => {
        if (typeof node === "string") return node
        if (typeof node === "number") return String(node)
        if (React.isValidElement(node)) {
            return React.Children.toArray(node.props.children)
                .map((child) => getTextContent(child))
                .join(" ")
        }
        if (Array.isArray(node)) {
            return node.map((child) => getTextContent(child)).join(" ")
        }
        return ""
    }

    return (
        <div
            ref={labelRef}
            onClick={() => onSelect?.(value, getTextContent(children).trim())}
            className={`cursor-pointer px-3 py-2 hover:bg-gray-800 transition-colors ${isSelected ? "bg-indigo-600/20 text-indigo-400" : "text-gray-200"
                }`}
        >
            {children}
        </div>
    )
}

export { Select, SelectTrigger, SelectContent, SelectValue, SelectItem }
