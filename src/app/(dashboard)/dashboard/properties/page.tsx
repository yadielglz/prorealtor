'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react'

interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFeet: number
  propertyType: string
  status: string
  listDate: string
  daysOnMarket: number
  images: string[]
}

// Mock data - in real app this would come from Firestore
const mockProperties: Property[] = [
  {
    id: '1',
    address: '123 Oak Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2100,
    propertyType: 'SINGLE_FAMILY',
    status: 'ACTIVE',
    listDate: '2024-01-15',
    daysOnMarket: 18,
    images: ['/api/placeholder/400/300']
  },
  {
    id: '2',
    address: '456 Pine Avenue',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1400,
    propertyType: 'CONDO',
    status: 'PENDING',
    listDate: '2024-01-10',
    daysOnMarket: 23,
    images: ['/api/placeholder/400/300']
  },
  {
    id: '3',
    address: '789 Elm Drive',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94104',
    price: 2100000,
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 3200,
    propertyType: 'SINGLE_FAMILY',
    status: 'SOLD',
    listDate: '2023-12-20',
    daysOnMarket: 45,
    images: ['/api/placeholder/400/300']
  }
]

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  SOLD: 'bg-blue-100 text-blue-800',
  WITHDRAWN: 'bg-gray-100 text-gray-800',
  EXPIRED: 'bg-red-100 text-red-800'
}

const propertyTypeLabels = {
  SINGLE_FAMILY: 'Single Family',
  CONDO: 'Condo',
  TOWNHOUSE: 'Townhouse',
  MULTI_FAMILY: 'Multi Family',
  LAND: 'Land',
  COMMERCIAL: 'Commercial'
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [isLoading, setIsLoading] = useState(false)

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || property.status === statusFilter
    const matchesType = typeFilter === 'ALL' || property.propertyType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatSquareFeet = (sqft: number) => {
    return new Intl.NumberFormat('en-US').format(sqft)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your property listings and inventory</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Listings</p>
                <p className="text-2xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'ACTIVE').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Sales</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {properties.filter(p => p.status === 'PENDING').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sold This Month</p>
                <p className="text-2xl font-bold text-blue-600">
                  {properties.filter(p => p.status === 'SOLD').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-500 rounded-full"></div>
              </div>
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
                  placeholder="Search by address or city..."
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
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PENDING">Pending</option>
                <option value="SOLD">Sold</option>
                <option value="WITHDRAWN">Withdrawn</option>
                <option value="EXPIRED">Expired</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="SINGLE_FAMILY">Single Family</option>
                <option value="CONDO">Condo</option>
                <option value="TOWNHOUSE">Townhouse</option>
                <option value="MULTI_FAMILY">Multi Family</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>

              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
              <img
                src={property.images[0] || '/api/placeholder/400/300'}
                alt={property.address}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2">
                <Badge className={statusColors[property.status as keyof typeof statusColors]}>
                  {property.status}
                </Badge>
              </div>
              <div className="absolute top-2 right-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="mb-2">
                <h3 className="font-semibold text-lg text-gray-900">{formatPrice(property.price)}</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                </p>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  {property.bedrooms} bed
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  {property.bathrooms} bath
                </div>
                <div className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  {formatSquareFeet(property.squareFeet)} sqft
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {propertyTypeLabels[property.propertyType as keyof typeof propertyTypeLabels]}
                </span>
                <span className="text-gray-600">
                  {property.daysOnMarket} days on market
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first property listing'
            }
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </div>
      )}
    </div>
  )
}