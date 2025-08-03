'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  User, 
  Building2, 
  Phone, 
  Video, 
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  type: 'SHOWING' | 'MEETING' | 'CALL' | 'INSPECTION' | 'CLOSING' | 'APPOINTMENT'
  startTime: string
  endTime: string
  location?: string
  description?: string
  contactId?: string
  contactName?: string
  propertyId?: string
  propertyAddress?: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  isVirtual?: boolean
  reminderSet?: boolean
  createdAt: string
}

// Mock calendar events - in real app this would come from Firestore
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Property Showing - 123 Oak Street',
    type: 'SHOWING',
    startTime: '2024-01-25T14:00:00Z',
    endTime: '2024-01-25T15:00:00Z',
    location: '123 Oak Street, San Francisco, CA',
    description: 'Show property to potential buyers Sarah and John',
    contactId: '1',
    contactName: 'Sarah Johnson',
    propertyId: '1',
    propertyAddress: '123 Oak Street',
    status: 'CONFIRMED',
    reminderSet: true,
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'Client Consultation - Investment Strategy',
    type: 'MEETING',
    startTime: '2024-01-25T10:30:00Z',
    endTime: '2024-01-25T11:30:00Z',
    location: 'Office Conference Room',
    description: 'Discuss investment property portfolio expansion',
    contactId: '4',
    contactName: 'David Wilson',
    status: 'SCHEDULED',
    reminderSet: true,
    createdAt: '2024-01-22T09:00:00Z'
  },
  {
    id: '3',
    title: 'Virtual Market Analysis Presentation',
    type: 'MEETING',
    startTime: '2024-01-25T16:00:00Z',
    endTime: '2024-01-25T17:00:00Z',
    description: 'Present comprehensive market analysis to seller',
    contactId: '2',
    contactName: 'Mike Chen',
    status: 'SCHEDULED',
    isVirtual: true,
    reminderSet: true,
    createdAt: '2024-01-23T14:00:00Z'
  },
  {
    id: '4',
    title: 'Property Inspection - 456 Pine Ave',
    type: 'INSPECTION',
    startTime: '2024-01-26T09:00:00Z',
    endTime: '2024-01-26T11:00:00Z',
    location: '456 Pine Avenue, San Francisco, CA',
    description: 'Home inspection with certified inspector',
    contactId: '2',
    contactName: 'Mike Chen',
    propertyId: '2',
    propertyAddress: '456 Pine Avenue',
    status: 'CONFIRMED',
    reminderSet: true,
    createdAt: '2024-01-21T16:00:00Z'
  },
  {
    id: '5',
    title: 'Follow-up Call - New Leads',
    type: 'CALL',
    startTime: '2024-01-26T14:00:00Z',
    endTime: '2024-01-26T14:30:00Z',
    description: 'Call back potential buyers from weekend open house',
    contactId: '3',
    contactName: 'Emily Rodriguez',
    status: 'SCHEDULED',
    reminderSet: false,
    createdAt: '2024-01-24T11:00:00Z'
  },
  {
    id: '6',
    title: 'Closing - 789 Elm Drive',
    type: 'CLOSING',
    startTime: '2024-01-27T15:00:00Z',
    endTime: '2024-01-27T16:30:00Z',
    location: 'Title Company Office',
    description: 'Final closing for property sale',
    contactId: '4',
    contactName: 'David Wilson',
    propertyId: '3',
    propertyAddress: '789 Elm Drive',
    status: 'CONFIRMED',
    reminderSet: true,
    createdAt: '2024-01-15T12:00:00Z'
  }
]

const typeColors = {
  SHOWING: 'bg-blue-100 text-blue-800',
  MEETING: 'bg-green-100 text-green-800',
  CALL: 'bg-purple-100 text-purple-800',
  INSPECTION: 'bg-orange-100 text-orange-800',
  CLOSING: 'bg-red-100 text-red-800',
  APPOINTMENT: 'bg-gray-100 text-gray-800'
}

const statusColors = {
  SCHEDULED: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
  NO_SHOW: 'bg-gray-100 text-gray-800'
}

const getTypeIcon = (type: string, isVirtual?: boolean) => {
  if (isVirtual) return Video
  
  switch (type) {
    case 'SHOWING':
      return Building2
    case 'MEETING':
      return User
    case 'CALL':
      return Phone
    case 'INSPECTION':
      return CheckCircle
    case 'CLOSING':
      return CheckCircle
    case 'APPOINTMENT':
      return CalendarIcon
    default:
      return CalendarIcon
  }
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

const isToday = (dateString: string) => {
  const today = new Date()
  const eventDate = new Date(dateString)
  return today.toDateString() === eventDate.toDateString()
}

const isTomorrow = (dateString: string) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const eventDate = new Date(dateString)
  return tomorrow.toDateString() === eventDate.toDateString()
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'ALL' || event.type === typeFilter
    const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const todayEvents = filteredEvents.filter(event => isToday(event.startTime))
  const tomorrowEvents = filteredEvents.filter(event => isTomorrow(event.startTime))
  const upcomingEvents = filteredEvents.filter(event => {
    const eventDate = new Date(event.startTime)
    const today = new Date()
    const dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(today.getDate() + 2)
    return eventDate >= dayAfterTomorrow && eventDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
  })

  const stats = {
    totalEvents: events.length,
    todayEvents: todayEvents.length,
    confirmedEvents: events.filter(e => e.status === 'CONFIRMED').length,
    pendingEvents: events.filter(e => e.status === 'SCHEDULED').length
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600">Manage your appointments, showings, and meetings</p>
        </div>
        <div className="flex space-x-2">
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Month
            </button>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Event
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Events</p>
                <p className="text-2xl font-bold text-green-600">{stats.todayEvents}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmedEvents}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingEvents}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search events, contacts, or properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by type"
              >
                <option value="ALL">All Types</option>
                <option value="SHOWING">Showings</option>
                <option value="MEETING">Meetings</option>
                <option value="CALL">Calls</option>
                <option value="INSPECTION">Inspections</option>
                <option value="CLOSING">Closings</option>
                <option value="APPOINTMENT">Appointments</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by status"
              >
                <option value="ALL">All Status</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Today's Events
            </CardTitle>
            <CardDescription>
              {todayEvents.length} events scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No events scheduled for today</p>
              ) : (
                todayEvents.map((event) => {
                  const TypeIcon = getTypeIcon(event.type, event.isVirtual)
                  return (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <TypeIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-600">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                        {event.contactName && (
                          <p className="text-xs text-gray-500">{event.contactName}</p>
                        )}
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                            {event.status}
                          </Badge>
                          {event.isVirtual && (
                            <Badge variant="outline">Virtual</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tomorrow's Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Tomorrow's Events
            </CardTitle>
            <CardDescription>
              {tomorrowEvents.length} events scheduled for tomorrow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tomorrowEvents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No events scheduled for tomorrow</p>
              ) : (
                tomorrowEvents.map((event) => {
                  const TypeIcon = getTypeIcon(event.type, event.isVirtual)
                  return (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <TypeIcon className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-600">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                        {event.contactName && (
                          <p className="text-xs text-gray-500">{event.contactName}</p>
                        )}
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                            {event.status}
                          </Badge>
                          {event.isVirtual && (
                            <Badge variant="outline">Virtual</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
              ) : (
                upcomingEvents.slice(0, 5).map((event) => {
                  const TypeIcon = getTypeIcon(event.type, event.isVirtual)
                  return (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <TypeIcon className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-600">{formatDate(event.startTime)}</p>
                        <p className="text-xs text-gray-600">{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                        {event.contactName && (
                          <p className="text-xs text-gray-500">{event.contactName}</p>
                        )}
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                            {event.status}
                          </Badge>
                          {event.isVirtual && (
                            <Badge variant="outline">Virtual</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Events List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Complete list of your scheduled events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const TypeIcon = getTypeIcon(event.type, event.isVirtual)
              
              return (
                <div key={event.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <TypeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <Badge className={typeColors[event.type as keyof typeof typeColors]}>
                          {event.type}
                        </Badge>
                        <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                          {event.status}
                        </Badge>
                        {event.isVirtual && (
                          <Badge variant="outline">Virtual</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(event.startTime)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location}
                          </div>
                        )}
                      </div>

                      {event.contactName && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="h-4 w-4 mr-1" />
                          <span className="font-medium">Contact: </span>
                          <span className="ml-1">{event.contactName}</span>
                        </div>
                      )}

                      {event.propertyAddress && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span className="font-medium">Property: </span>
                          <span className="ml-1">{event.propertyAddress}</span>
                        </div>
                      )}

                      {event.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by scheduling your first event'
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Event
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}