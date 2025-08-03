'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Play,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building2,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Voicemail
} from 'lucide-react'

interface Communication {
  id: string
  type: 'CALL' | 'EMAIL' | 'SMS' | 'MEETING' | 'NOTE'
  direction?: 'INBOUND' | 'OUTBOUND'
  subject?: string
  content?: string
  durationSeconds?: number
  phoneNumber?: string
  emailAddress?: string
  status: 'COMPLETED' | 'MISSED' | 'VOICEMAIL' | 'SENT' | 'DELIVERED' | 'FAILED'
  scheduledDate?: string
  completedDate: string
  recordingUrl?: string
  contactId?: string
  contactName?: string
  propertyId?: string
  propertyAddress?: string
  tags: string[]
  createdAt: string
}

// Mock data - in real app this would come from Firestore
const mockCommunications: Communication[] = [
  {
    id: '1',
    type: 'CALL',
    direction: 'OUTBOUND',
    subject: 'Follow-up call about property viewing',
    durationSeconds: 420,
    phoneNumber: '(555) 123-4567',
    status: 'COMPLETED',
    completedDate: '2024-01-22T10:30:00Z',
    recordingUrl: '/recordings/call-1.mp3',
    contactId: '1',
    contactName: 'Sarah Johnson',
    propertyId: '1',
    propertyAddress: '123 Oak Street',
    tags: ['Follow-up', 'Hot Lead'],
    createdAt: '2024-01-22T10:30:00Z'
  },
  {
    id: '2',
    type: 'EMAIL',
    direction: 'OUTBOUND',
    subject: 'Property Market Analysis Report',
    content: 'Hi Mike, I\'ve prepared a comprehensive market analysis for your area. Please find the attached report with current market trends and pricing recommendations.',
    emailAddress: 'mike.chen@email.com',
    status: 'DELIVERED',
    completedDate: '2024-01-21T14:15:00Z',
    contactId: '2',
    contactName: 'Mike Chen',
    tags: ['Market Analysis', 'Seller'],
    createdAt: '2024-01-21T14:15:00Z'
  },
  {
    id: '3',
    type: 'CALL',
    direction: 'INBOUND',
    subject: 'Inquiry about new listing',
    durationSeconds: 0,
    phoneNumber: '(555) 987-6543',
    status: 'MISSED',
    completedDate: '2024-01-21T09:45:00Z',
    contactId: '3',
    contactName: 'Emily Rodriguez',
    tags: ['New Inquiry', 'Missed Call'],
    createdAt: '2024-01-21T09:45:00Z'
  },
  {
    id: '4',
    type: 'SMS',
    direction: 'OUTBOUND',
    content: 'Hi David! Just wanted to confirm our meeting tomorrow at 2 PM to discuss your next investment property. See you then!',
    phoneNumber: '(555) 321-0987',
    status: 'DELIVERED',
    completedDate: '2024-01-20T16:20:00Z',
    contactId: '4',
    contactName: 'David Wilson',
    tags: ['Meeting Confirmation', 'Investor'],
    createdAt: '2024-01-20T16:20:00Z'
  },
  {
    id: '5',
    type: 'MEETING',
    subject: 'Property walkthrough and consultation',
    content: 'Conducted comprehensive property walkthrough with client. Discussed pricing strategy, market positioning, and next steps for listing.',
    status: 'COMPLETED',
    scheduledDate: '2024-01-19T15:00:00Z',
    completedDate: '2024-01-19T16:30:00Z',
    contactId: '1',
    contactName: 'Sarah Johnson',
    propertyId: '1',
    propertyAddress: '123 Oak Street',
    tags: ['Consultation', 'Property Tour'],
    createdAt: '2024-01-19T16:30:00Z'
  }
]

const typeColors = {
  CALL: 'bg-blue-100 text-blue-800',
  EMAIL: 'bg-green-100 text-green-800',
  SMS: 'bg-purple-100 text-purple-800',
  MEETING: 'bg-orange-100 text-orange-800',
  NOTE: 'bg-gray-100 text-gray-800'
}

const statusColors = {
  COMPLETED: 'bg-green-100 text-green-800',
  MISSED: 'bg-red-100 text-red-800',
  VOICEMAIL: 'bg-yellow-100 text-yellow-800',
  SENT: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800'
}

const getTypeIcon = (type: string, direction?: string) => {
  switch (type) {
    case 'CALL':
      if (direction === 'INBOUND') return PhoneIncoming
      if (direction === 'OUTBOUND') return PhoneOutgoing
      return Phone
    case 'EMAIL':
      return Mail
    case 'SMS':
      return MessageSquare
    case 'MEETING':
      return Calendar
    case 'NOTE':
      return Edit
    default:
      return Phone
  }
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<Communication[]>(mockCommunications)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const filteredCommunications = communications.filter(comm => {
    const matchesSearch = 
      comm.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.phoneNumber?.includes(searchTerm) ||
      comm.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'ALL' || comm.type === typeFilter
    const matchesStatus = statusFilter === 'ALL' || comm.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const stats = {
    totalCommunications: communications.length,
    callsToday: communications.filter(c => c.type === 'CALL' && new Date(c.completedDate).toDateString() === new Date().toDateString()).length,
    emailsSent: communications.filter(c => c.type === 'EMAIL' && c.status === 'DELIVERED').length,
    missedCalls: communications.filter(c => c.type === 'CALL' && c.status === 'MISSED').length
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600">Track calls, emails, messages, and meetings with your clients</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Make Call
          </Button>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Communication
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Communications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCommunications}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Calls Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.callsToday}</p>
              </div>
              <PhoneCall className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                <p className="text-2xl font-bold text-blue-600">{stats.emailsSent}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Missed Calls</p>
                <p className="text-2xl font-bold text-red-600">{stats.missedCalls}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
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
                  placeholder="Search communications, contacts, or content..."
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
                <option value="CALL">Calls</option>
                <option value="EMAIL">Emails</option>
                <option value="SMS">SMS</option>
                <option value="MEETING">Meetings</option>
                <option value="NOTE">Notes</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by status"
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="MISSED">Missed</option>
                <option value="VOICEMAIL">Voicemail</option>
                <option value="SENT">Sent</option>
                <option value="DELIVERED">Delivered</option>
                <option value="FAILED">Failed</option>
              </select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communications List */}
      <div className="space-y-4">
        {filteredCommunications.map((comm) => {
          const TypeIcon = getTypeIcon(comm.type, comm.direction)
          
          return (
            <Card key={comm.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      comm.status === 'MISSED' || comm.status === 'FAILED' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <TypeIcon className={`h-6 w-6 ${
                        comm.status === 'MISSED' || comm.status === 'FAILED' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {comm.subject || `${comm.type.toLowerCase()} communication`}
                        </h3>
                        <Badge className={typeColors[comm.type as keyof typeof typeColors]}>
                          {comm.type}
                        </Badge>
                        <Badge className={statusColors[comm.status as keyof typeof statusColors]}>
                          {comm.status}
                        </Badge>
                        {comm.direction && (
                          <Badge variant="outline" className="text-xs">
                            {comm.direction}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDateTime(comm.completedDate)}
                        </div>
                        {comm.durationSeconds && (
                          <div className="flex items-center">
                            <span className="font-medium">Duration: </span>
                            <span className="ml-1">{formatDuration(comm.durationSeconds)}</span>
                          </div>
                        )}
                        {comm.phoneNumber && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {comm.phoneNumber}
                          </div>
                        )}
                        {comm.emailAddress && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {comm.emailAddress}
                          </div>
                        )}
                      </div>

                      {comm.contactName && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="h-4 w-4 mr-1" />
                          <span className="font-medium">Contact: </span>
                          <span className="ml-1">{comm.contactName}</span>
                        </div>
                      )}

                      {comm.propertyAddress && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span className="font-medium">Property: </span>
                          <span className="ml-1">{comm.propertyAddress}</span>
                        </div>
                      )}

                      {comm.content && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{comm.content}</p>
                      )}

                      {comm.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {comm.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {comm.recordingUrl && (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    )}
                    {comm.type === 'CALL' && comm.status === 'MISSED' && (
                      <Button variant="outline" size="sm" className="text-blue-600">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Back
                      </Button>
                    )}
                    {comm.type === 'EMAIL' && (
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    )}
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
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCommunications.length === 0 && (
        <div className="text-center py-12">
          <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communications found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL'
              ? 'Try adjusting your search or filters'
              : 'Get started by logging your first communication'
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Communication
          </Button>
        </div>
      )}
    </div>
  )
}