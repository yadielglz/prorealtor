'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Home, 
  Phone, 
  Mail, 
  Calendar,
  Target,
  Award,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  leads: {
    total: number
    converted: number
    conversionRate: number
    growth: number
  }
  properties: {
    listed: number
    sold: number
    avgDaysOnMarket: number
    growth: number
  }
  communications: {
    calls: number
    emails: number
    meetings: number
    responseRate: number
  }
  performance: {
    clientSatisfaction: number
    referralRate: number
    repeatClients: number
    marketShare: number
  }
}

// Mock analytics data - in real app this would come from Firestore/analytics service
const mockAnalytics: AnalyticsData = {
  revenue: {
    current: 125000,
    previous: 98000,
    growth: 27.6
  },
  leads: {
    total: 156,
    converted: 38,
    conversionRate: 24.4,
    growth: 15.2
  },
  properties: {
    listed: 24,
    sold: 18,
    avgDaysOnMarket: 22,
    growth: -8.3
  },
  communications: {
    calls: 342,
    emails: 189,
    meetings: 45,
    responseRate: 87.5
  },
  performance: {
    clientSatisfaction: 4.8,
    referralRate: 32.1,
    repeatClients: 18,
    marketShare: 12.5
  }
}

const monthlyData = [
  { month: 'Jan', revenue: 85000, leads: 45, properties: 12 },
  { month: 'Feb', revenue: 92000, leads: 52, properties: 15 },
  { month: 'Mar', revenue: 78000, leads: 38, properties: 10 },
  { month: 'Apr', revenue: 105000, leads: 61, properties: 18 },
  { month: 'May', revenue: 118000, leads: 58, properties: 20 },
  { month: 'Jun', revenue: 125000, leads: 67, properties: 24 }
]

const leadSources = [
  { source: 'Website', count: 45, percentage: 28.8 },
  { source: 'Referrals', count: 38, percentage: 24.4 },
  { source: 'Social Media', count: 32, percentage: 20.5 },
  { source: 'Open Houses', count: 25, percentage: 16.0 },
  { source: 'Cold Calls', count: 16, percentage: 10.3 }
]

const propertyTypes = [
  { type: 'Single Family', count: 12, value: 2400000 },
  { type: 'Condo', count: 8, value: 1200000 },
  { type: 'Townhouse', count: 3, value: 750000 },
  { type: 'Multi-Family', count: 1, value: 450000 }
]

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics)
  const [timeRange, setTimeRange] = useState('6M')
  const [isLoading, setIsLoading] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? TrendingUp : TrendingDown
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Track your performance and business insights</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select time range"
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="1Y">Last Year</option>
          </select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.current)}</p>
                <div className="flex items-center mt-1">
                  {React.createElement(getGrowthIcon(analytics.revenue.growth), {
                    className: `h-4 w-4 mr-1 ${getGrowthColor(analytics.revenue.growth)}`
                  })}
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.revenue.growth)}`}>
                    {formatPercentage(analytics.revenue.growth)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lead Conversion</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.leads.conversionRate}%</p>
                <div className="flex items-center mt-1">
                  {React.createElement(getGrowthIcon(analytics.leads.growth), {
                    className: `h-4 w-4 mr-1 ${getGrowthColor(analytics.leads.growth)}`
                  })}
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.leads.growth)}`}>
                    {formatPercentage(analytics.leads.growth)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Days on Market</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.properties.avgDaysOnMarket}</p>
                <div className="flex items-center mt-1">
                  {React.createElement(getGrowthIcon(analytics.properties.growth), {
                    className: `h-4 w-4 mr-1 ${getGrowthColor(analytics.properties.growth)}`
                  })}
                  <span className={`text-sm font-medium ${getGrowthColor(analytics.properties.growth)}`}>
                    {formatPercentage(analytics.properties.growth)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Client Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.performance.clientSatisfaction}/5</p>
                <div className="flex items-center mt-1">
                  <Award className="h-4 w-4 mr-1 text-yellow-500" />
                  <span className="text-sm text-gray-500">Excellent rating</span>
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600"
                    style={{ 
                      height: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 200}px`,
                      minHeight: '20px'
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{data.month}</span>
                  <span className="text-xs font-medium text-gray-900">{formatCurrency(data.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where your leads are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSources.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-blue-${500 + index * 100}`}></div>
                    <span className="text-sm font-medium text-gray-900">{source.source}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{source.count}</span>
                    <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Communication Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Activity</CardTitle>
            <CardDescription>Your outreach performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Calls Made</span>
                </div>
                <span className="text-sm font-bold">{analytics.communications.calls}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Emails Sent</span>
                </div>
                <span className="text-sm font-bold">{analytics.communications.emails}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Meetings Held</span>
                </div>
                <span className="text-sm font-bold">{analytics.communications.meetings}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Response Rate</span>
                  <span className="text-sm font-bold text-green-600">{analytics.communications.responseRate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Property Performance</CardTitle>
            <CardDescription>Breakdown by property type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {propertyTypes.map((type, index) => (
                <div key={type.type} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{type.type}</span>
                    <span className="text-sm text-gray-600">{type.count} properties</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(type.count / Math.max(...propertyTypes.map(p => p.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-900">{formatCurrency(type.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Business Health */}
        <Card>
          <CardHeader>
            <CardTitle>Business Health</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Referral Rate</span>
                  <span className="text-sm font-bold text-blue-600">{analytics.performance.referralRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${analytics.performance.referralRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Repeat Clients</span>
                  <span className="text-sm font-bold text-green-600">{analytics.performance.repeatClients}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(analytics.performance.repeatClients / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Market Share</span>
                  <span className="text-sm font-bold text-purple-600">{analytics.performance.marketShare}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full" 
                    style={{ width: `${analytics.performance.marketShare * 4}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals and Targets */}
      <Card>
        <CardHeader>
          <CardTitle>Goals & Targets</CardTitle>
          <CardDescription>Track your progress towards monthly and yearly goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.75)}`}
                    className="text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">75%</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Revenue Goal</h3>
              <p className="text-sm text-gray-600">{formatCurrency(125000)} / {formatCurrency(167000)}</p>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.63)}`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">63%</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Leads Goal</h3>
              <p className="text-sm text-gray-600">156 / 250 leads</p>
            </div>

            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.86)}`}
                    className="text-orange-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">86%</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">Properties Goal</h3>
              <p className="text-sm text-gray-600">24 / 28 properties</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}