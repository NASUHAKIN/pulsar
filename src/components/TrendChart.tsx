
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function TrendChart() {
    return (
        <Card className="h-full border-0 shadow-none bg-transparent">
            <CardHeader className="pb-4">
                <CardTitle className="text-sm font-medium">Weekly Submit Rate</CardTitle>
            </CardHeader>
            <CardContent className="pl-0 flex items-center justify-center h-[200px]">
                {/* SVG Placeholder to prevent Recharts crash */}
                <svg width="100%" height="100%" viewBox="0 0 300 100" className="opacity-50">
                    <path d="M0,80 Q50,70 100,40 T200,30 T300,10" fill="none" stroke="#8b5cf6" strokeWidth="3" />
                    <circle cx="0" cy="80" r="3" fill="#8b5cf6" />
                    <circle cx="100" cy="40" r="3" fill="#8b5cf6" />
                    <circle cx="200" cy="30" r="3" fill="#8b5cf6" />
                    <circle cx="300" cy="10" r="3" fill="#8b5cf6" />
                    <text x="10" y="95" fill="#666" fontSize="10">Week 1</text>
                    <text x="100" y="95" fill="#666" fontSize="10">Week 2</text>
                    <text x="200" y="95" fill="#666" fontSize="10">Week 3</text>
                    <text x="280" y="95" fill="#fff" fontSize="10">Current</text>
                </svg>
            </CardContent>
        </Card>
    )
}
