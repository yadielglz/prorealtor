'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  UserPlus,
  TrendingUp
} from 'lucide-react'

interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  type: string
  status: string
  source: string
  leadScore: number
  lastContactDate: string
  nextFollowUpDate: string
  address?: string
  city?: string
  state?: string
  notes?: string
  tags: string[]
}

// Mock data - in real app this would come from Firestore
const mockContacts: Contact[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    type: 'BUYER',
    status: 'ACTIVE',
    source: 'Website',
    leadScore: 85,
    lastContactDate: '2024-01-20',
    nextFollowUpDate: '2024-01-25',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    notes: 'Looking for 3BR home in downtown area. Budget up to $1.2M',
    tags: ['Hot Lead', 'First Time Buyer']
  },
  {
    id: '2',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@email.com',
    phone: '(555) 987-6543',
    type: 'SELLER',
    status: 'ACTIVE',
    source: 'Referral',
    leadScore: 92,
    lastContactDate: '2024-01-18',
    nextFollowUpDate: '2024-01-22',
    address: '456 Oak Ave',
    city: 'San Francisco',
    state: 'CA',
    notes: 'Wants to sell current home and upgrade. Timeline: 3-6 months',
    tags: ['Qualified', 'Repeat Client']
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '(555) 456-7890',
    type: 'LEAD',
    status: 'ACTIVE',
    source: 'Social Media',
    leadScore: 65,
    lastContactDate: '2024-01-15',
    nextFollowUpDate: '2024-01-28',
    city: 'San Francisco',
    state: 'CA',
    notes: 'Interested in investment properties. Needs more information',
    tags: ['Investor', 'New Lead']
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    phone: '(555) 321-0987',
    type: 'BUYER',
    status: 'CONVERTED',
    source: 'Open House',
    leadScore: 95,
    lastContactDate: '2024-01-10',
    nextFollowUpDate: '2024-02-01',
    address: '789 Pine St',
    city: 'San Francisco',
    state: 'CA',
    notes: 'Successfully purchased property. Potential referral source',
    tags: ['Closed Deal', 'Happy Client']
  }
]

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  CONVERTED: 'bg-blue-100 text-blue-800',
  LOST: 'bg-red-100 text-red-800'
}

const typeColors = {
  LEAD: 'bg-yellow-100 text-yellow-800',
  BUYER: 'bg-blue-100 text-blue-800',
  SELLER: 'bg-green-100 text-green-800',
  VENDOR: 'bg-purple-100 text-purple-800',
  REFERRAL: 'bg-orange-100 text-orange-800'
}

const getLeadScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getLeadScoreLabel = (score: number) => {
  if (score >= 80) return 'Hot'
  if (score >= 60) return 'Warm'
  return 'Cold'
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'ALL' || contact.status === statusFilter
    const matchesType = typeFilter === 'ALL' || contact.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your leads, buyers, sellers, and referrals</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Leads</p>
                <p className="text-2xl font-bold text-green-600">
                  {contacts.filter(c => c.status === 'ACTIVE' && c.type === 'LEAD').length}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">
                  {contacts.filter(c => c.leadScore >= 80).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {contacts.filter(c => c.status === 'CONVERTED').length}
                </p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
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
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by status"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CONVERTED">Converted</option>
                <option value="LOST">Lost</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by type"
              >
                <option value="ALL">All Types</option>
                <option value="LEAD">Lead</option>
                <option value="BUYER">Buyer</option>
                <option value="SELLER">Seller</option>
                <option value="VENDOR">Vendor</option>
                <option value="REFERRAL">Referral</option>
              </select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <Badge className={statusColors[contact.status as keyof typeof statusColors]}>
                        {contact.status}
                      </Badge>
                      <Badge className={typeColors[contact.type as keyof typeof typeColors]}>
                        {contact.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {contact.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {contact.phone}
                      </div>
                      {contact.city && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {contact.city}, {contact.state}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-6 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Lead Score: </span>
                        <span className={`font-semibold ${getLeadScoreColor(contact.leadScore)}`}>
                          {contact.leadScore} ({getLeadScoreLabel(contact.leadScore)})
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Source: </span>
                        <span className="font-medium">{contact.source}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Contact: </span>
                        <span className="font-medium">{formatDate(contact.lastContactDate)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <div className={`flex items-center text-sm ${isOverdue(contact.nextFollowUpDate) ? 'text-red-600' : 'text-gray-600'}`}>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Next Follow-up: {formatDate(contact.nextFollowUpDate)}</span>
                        {isOverdue(contact.nextFollowUpDate) && (
                          <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>
                        )}
                      </div>
                    </div>

                    {contact.notes && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{contact.notes}</p>
                    )}

                    {contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
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
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first contact'
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      )}
    </div>
  )
}