import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Button } from './ui/button'
import { useState, useEffect } from 'react'
import { getCheckIns, getMembers } from '../lib/storage'
import { TrendingUp, Calendar } from 'lucide-react'

interface TrendDataPoint {
    week: string
    submitRate: number
    avgWordCount: number
    riskCount: number
}

interface AdvancedTrendChartProps {
    teamId: string
}

export function AdvancedTrendChart({ teamId }: AdvancedTrendChartProps) {
    const [period, setPeriod] = useState<4 | 8>(4)
    const [trendData, setTrendData] = useState<TrendDataPoint[]>([])
    const [metric, setMetric] = useState<'submitRate' | 'avgWordCount' | 'riskCount'>('submitRate')

    useEffect(() => {
        generateTrendData()
    }, [teamId, period])

    const generateTrendData = () => {
        const data: TrendDataPoint[] = []
        const now = new Date()

        // Generate data for past N weeks
        for (let i = period - 1; i >= 0; i--) {
            const weekDate = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
            const weekStart = new Date(weekDate)
            weekStart.setDate(weekDate.getDate() - weekDate.getDay()) // Start of week

            const weekEnd = new Date(weekStart)
            weekEnd.setDate(weekStart.getDate() + 6) // End of week

            // Get check-ins for this week
            const allCheckIns = getCheckIns(teamId)
            const weekCheckIns = allCheckIns.filter(c => {
                const checkInDate = new Date(c.date)
                return checkInDate >= weekStart && checkInDate <= weekEnd
            })

            const members = getMembers(teamId)
            const submitRate = members.length > 0
                ? (weekCheckIns.length / members.length) * 100
                : 0

            const avgWordCount = weekCheckIns.length > 0
                ? weekCheckIns.reduce((sum, c) => {
                    const text = Object.values(c).join(' ')
                    return sum + text.split(/\s+/).length
                }, 0) / weekCheckIns.length
                : 0

            const riskCount = weekCheckIns.filter(c => c.blockers && c.blockers.trim()).length

            data.push({
                week: `Week ${period - i}`,
                submitRate: Math.round(submitRate),
                avgWordCount: Math.round(avgWordCount),
                riskCount
            })
        }

        setTrendData(data)
    }

    const getMetricConfig = () => {
        switch (metric) {
            case 'submitRate':
                return { name: 'Submit Rate (%)', color: '#6366f1', dataKey: 'submitRate' }
            case 'avgWordCount':
                return { name: 'Avg Word Count', color: '#10b981', dataKey: 'avgWordCount' }
            case 'riskCount':
                return { name: 'Risk Count', color: '#ef4444', dataKey: 'riskCount' }
        }
    }

    const metricConfig = getMetricConfig()

    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Team Trends
                        </CardTitle>
                        <CardDescription>Historical performance metrics</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={period === 4 ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod(4)}
                        >
                            <Calendar className="h-4 w-4 mr-1" />
                            4 Weeks
                        </Button>
                        <Button
                            variant={period === 8 ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => setPeriod(8)}
                        >
                            <Calendar className="h-4 w-4 mr-1" />
                            8 Weeks
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Metric Selector */}
                <div className="flex gap-2 mb-4">
                    <Button
                        variant={metric === 'submitRate' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setMetric('submitRate')}
                        className="text-xs"
                    >
                        Submit Rate
                    </Button>
                    <Button
                        variant={metric === 'avgWordCount' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setMetric('avgWordCount')}
                        className="text-xs"
                    >
                        Word Count
                    </Button>
                    <Button
                        variant={metric === 'riskCount' ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setMetric('riskCount')}
                        className="text-xs"
                    >
                        Risks
                    </Button>
                </div>

                {/* Chart */}
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="week"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={metricConfig.dataKey}
                            name={metricConfig.name}
                            stroke={metricConfig.color}
                            strokeWidth={3}
                            dot={{ fill: metricConfig.color, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-800">
                    <div className="text-center">
                        <p className="text-xs text-gray-400">Current</p>
                        <p className="text-lg font-bold text-white">
                            {trendData[trendData.length - 1]?.[metricConfig.dataKey as keyof TrendDataPoint] || 0}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400">Average</p>
                        <p className="text-lg font-bold text-white">
                            {Math.round(trendData.reduce((sum, d) => sum + Number(d[metricConfig.dataKey as keyof TrendDataPoint] || 0), 0) / trendData.length) || 0}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400">Trend</p>
                        <p className={`text-lg font-bold ${trendData.length > 1 && trendData[trendData.length - 1]?.[metricConfig.dataKey as keyof TrendDataPoint] > trendData[trendData.length - 2]?.[metricConfig.dataKey as keyof TrendDataPoint]
                            ? 'text-green-400'
                            : 'text-red-400'
                            }`}>
                            {trendData.length > 1 && trendData[trendData.length - 1]?.[metricConfig.dataKey as keyof TrendDataPoint] > trendData[trendData.length - 2]?.[metricConfig.dataKey as keyof TrendDataPoint]
                                ? '↗'
                                : '↘'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
