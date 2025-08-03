'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Upload,
  File,
  FileImage,
  FileSpreadsheet,
  FileText as FilePdf,
  Calendar,
  User,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Document {
  id: string
  name: string
  category: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: string
  signatureRequired: boolean
  signedDate?: string
  expirationDate?: string
  contactId?: string
  contactName?: string
  propertyId?: string
  propertyAddress?: string
  createdAt: string
  updatedAt: string
}

// Mock data - in real app this would come from Firestore
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Purchase Agreement - 123 Oak Street',
    category: 'Contract',
    fileUrl: '/documents/purchase-agreement-123-oak.pdf',
    fileSize: 2048000,
    mimeType: 'application/pdf',
    status: 'SIGNED',
    signatureRequired: true,
    signedDate: '2024-01-20',
    contactId: '1',
    contactName: 'Sarah Johnson',
    propertyId: '1',
    propertyAddress: '123 Oak Street',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    name: 'Property Disclosure - 456 Pine Ave',
    category: 'Disclosure',
    fileUrl: '/documents/disclosure-456-pine.pdf',
    fileSize: 1536000,
    mimeType: 'application/pdf',
    status: 'PENDING_SIGNATURE',
    signatureRequired: true,
    expirationDate: '2024-02-15',
    contactId: '2',
    contactName: 'Mike Chen',
    propertyId: '2',
    propertyAddress: '456 Pine Avenue',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    name: 'Market Analysis Report',
    category: 'Report',
    fileUrl: '/documents/market-analysis-q1-2024.xlsx',
    fileSize: 512000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    status: 'COMPLETED',
    signatureRequired: false,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '4',
    name: 'Listing Photos - 789 Elm Drive',
    category: 'Marketing',
    fileUrl: '/documents/listing-photos-789-elm.zip',
    fileSize: 10240000,
    mimeType: 'application/zip',
    status: 'COMPLETED',
    signatureRequired: false,
    propertyId: '3',
    propertyAddress: '789 Elm Drive',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05'
  }
]

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING_SIGNATURE: 'bg-yellow-100 text-yellow-800',
  SIGNED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  EXPIRED: 'bg-red-100 text-red-800'
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('pdf')) return FilePdf
  if (mimeType.includes('image')) return FileImage
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet
  return File
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const isExpiringSoon = (dateString: string) => {
  const expirationDate = new Date(dateString)
  const today = new Date()
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
  return daysUntilExpiration <= 7 && daysUntilExpiration > 0
}

const isExpired = (dateString: string) => {
  return new Date(dateString) < new Date()
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = 
      document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.propertyAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || document.status === statusFilter
    const matchesCategory = categoryFilter === 'ALL' || document.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = Array.from(new Set(documents.map(doc => doc.category)))

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage contracts, disclosures, reports, and marketing materials</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Signatures</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'PENDING_SIGNATURE').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Signed Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.signedDate === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-red-600">
                  {documents.filter(d => d.expirationDate && isExpiringSoon(d.expirationDate)).length}
                </p>
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
                  placeholder="Search documents, contacts, or properties..."
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
                <option value="DRAFT">Draft</option>
                <option value="PENDING_SIGNATURE">Pending Signature</option>
                <option value="SIGNED">Signed</option>
                <option value="COMPLETED">Completed</option>
                <option value="EXPIRED">Expired</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by category"
              >
                <option value="ALL">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((document) => {
          const FileIcon = getFileIcon(document.mimeType)
          
          return (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                        <Badge className={statusColors[document.status as keyof typeof statusColors]}>
                          {document.status.replace('_', ' ')}
                        </Badge>
                        {document.signatureRequired && (
                          <Badge variant="outline" className="text-xs">
                            Signature Required
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Category: </span>
                          {document.category}
                        </div>
                        <div>
                          <span className="font-medium">Size: </span>
                          {formatFileSize(document.fileSize)}
                        </div>
                        <div>
                          <span className="font-medium">Created: </span>
                          {formatDate(document.createdAt)}
                        </div>
                      </div>

                      {document.contactName && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <User className="h-4 w-4 mr-1" />
                          <span className="font-medium">Contact: </span>
                          <span className="ml-1">{document.contactName}</span>
                        </div>
                      )}

                      {document.propertyAddress && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span className="font-medium">Property: </span>
                          <span className="ml-1">{document.propertyAddress}</span>
                        </div>
                      )}

                      {document.signedDate && (
                        <div className="flex items-center text-sm text-green-600 mb-2">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span className="font-medium">Signed: </span>
                          <span className="ml-1">{formatDate(document.signedDate)}</span>
                        </div>
                      )}

                      {document.expirationDate && (
                        <div className={`flex items-center text-sm mb-2 ${
                          isExpired(document.expirationDate) 
                            ? 'text-red-600' 
                            : isExpiringSoon(document.expirationDate) 
                              ? 'text-yellow-600' 
                              : 'text-gray-600'
                        }`}>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="font-medium">
                            {isExpired(document.expirationDate) ? 'Expired: ' : 'Expires: '}
                          </span>
                          <span className="ml-1">{formatDate(document.expirationDate)}</span>
                          {isExpiringSoon(document.expirationDate) && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Expiring Soon
                            </Badge>
                          )}
                          {isExpired(document.expirationDate) && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Expired
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {document.status === 'DRAFT' && (
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                    {document.status === 'PENDING_SIGNATURE' && (
                      <Button size="sm">
                        Send for Signature
                      </Button>
                    )}
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

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating or uploading your first document'
            }
          </p>
          <div className="flex justify-center space-x-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Document
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}