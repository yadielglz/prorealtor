'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Phone, 
  Mail, 
  Building2, 
  Key, 
  Database,
  Smartphone,
  Globe,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle
} from 'lucide-react'

interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    licenseNumber: string
    brokerage: string
    bio: string
    website: string
    profileImage: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    leadAlerts: boolean
    appointmentReminders: boolean
    documentUpdates: boolean
    marketingEmails: boolean
  }
  privacy: {
    profileVisibility: 'PUBLIC' | 'PRIVATE' | 'CONTACTS_ONLY'
    showPhone: boolean
    showEmail: boolean
    allowDirectMessages: boolean
    dataSharing: boolean
  }
  integrations: {
    threeCX: {
      enabled: boolean
      serverUrl: string
      username: string
      extension: string
      status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
    }
    mls: {
      enabled: boolean
      provider: string
      username: string
      status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
    }
    docusign: {
      enabled: boolean
      accountId: string
      status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
    }
    googleCalendar: {
      enabled: boolean
      email: string
      status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR'
    }
  }
  preferences: {
    theme: 'LIGHT' | 'DARK' | 'SYSTEM'
    language: string
    timezone: string
    dateFormat: string
    currency: string
    defaultView: 'DASHBOARD' | 'CALENDAR' | 'CONTACTS' | 'PROPERTIES'
  }
}

// Mock settings data - in real app this would come from Firestore
const mockSettings: UserSettings = {
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@realty.com',
    phone: '(555) 123-4567',
    licenseNumber: 'RE123456',
    brokerage: 'ABC Realty Group',
    bio: 'Experienced real estate professional with 10+ years in the San Francisco Bay Area market.',
    website: 'https://johndoe.realty',
    profileImage: ''
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    leadAlerts: true,
    appointmentReminders: true,
    documentUpdates: true,
    marketingEmails: false
  },
  privacy: {
    profileVisibility: 'CONTACTS_ONLY',
    showPhone: true,
    showEmail: true,
    allowDirectMessages: true,
    dataSharing: false
  },
  integrations: {
    threeCX: {
      enabled: false,
      serverUrl: '',
      username: '',
      extension: '',
      status: 'DISCONNECTED'
    },
    mls: {
      enabled: true,
      provider: 'CRMLS',
      username: 'john.doe',
      status: 'CONNECTED'
    },
    docusign: {
      enabled: true,
      accountId: 'abc123',
      status: 'CONNECTED'
    },
    googleCalendar: {
      enabled: true,
      email: 'john.doe@gmail.com',
      status: 'CONNECTED'
    }
  },
  preferences: {
    theme: 'SYSTEM',
    language: 'en-US',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
    defaultView: 'DASHBOARD'
  }
}

const statusColors = {
  CONNECTED: 'bg-green-100 text-green-800',
  DISCONNECTED: 'bg-gray-100 text-gray-800',
  ERROR: 'bg-red-100 text-red-800'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(mockSettings)
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setHasChanges(false)
    setIsLoading(false)
  }

  const handleInputChange = (section: keyof UserSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleNestedInputChange = (section: keyof UserSettings, subsection: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...(prev[section] as any)[subsection],
          [field]: value
        }
      }
    }))
    setHasChanges(true)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <div className="flex space-x-2">
          {hasChanges && (
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
          <Button onClick={handleSave} disabled={!hasChanges || isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal and professional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={settings.profile.firstName}
                      onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={settings.profile.lastName}
                      onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <input
                      type="text"
                      value={settings.profile.licenseNumber}
                      onChange={(e) => handleInputChange('profile', 'licenseNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brokerage</label>
                    <input
                      type="text"
                      value={settings.profile.brokerage}
                      onChange={(e) => handleInputChange('profile', 'brokerage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={settings.profile.website}
                    onChange={(e) => handleInputChange('profile', 'website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://your-website.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={settings.profile.bio}
                    onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell clients about your experience and expertise..."
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Settings */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              {/* 3CX Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    3CX Phone System Integration
                  </CardTitle>
                  <CardDescription>
                    Connect your 3CX phone system for seamless click-to-call functionality, call logging, and WebRTC browser calling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge className={statusColors[settings.integrations.threeCX.status]}>
                        {settings.integrations.threeCX.status}
                      </Badge>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.integrations.threeCX.enabled}
                        onChange={(e) => handleNestedInputChange('integrations', 'threeCX', 'enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  {settings.integrations.threeCX.enabled && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">3CX Integration Features:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Click-to-call from contact records</li>
                          <li>• Automatic call logging and recording</li>
                          <li>• WebRTC browser-based calling</li>
                          <li>• Real-time call status and presence</li>
                          <li>• Call history synchronization</li>
                          <li>• Voicemail integration</li>
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">3CX Server URL</label>
                          <input
                            type="url"
                            value={settings.integrations.threeCX.serverUrl}
                            onChange={(e) => handleNestedInputChange('integrations', 'threeCX', 'serverUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://your-3cx-server.com"
                          />
                          <p className="text-xs text-gray-500 mt-1">Your 3CX server URL or IP address</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <input
                            type="text"
                            value={settings.integrations.threeCX.username}
                            onChange={(e) => handleNestedInputChange('integrations', 'threeCX', 'username', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="your-3cx-username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Extension Number</label>
                          <input
                            type="text"
                            value={settings.integrations.threeCX.extension}
                            onChange={(e) => handleNestedInputChange('integrations', 'threeCX', 'extension', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="100"
                          />
                          <p className="text-xs text-gray-500 mt-1">Your 3CX extension number</p>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800">Setup Requirements:</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              To complete the 3CX integration, ensure your 3CX system has the Web Client enabled and 
                              your user account has the necessary permissions for API access and WebRTC calling.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        Test 3CX Connection
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Other Integrations */}
              <Card>
                <CardHeader>
                  <CardTitle>Other Integrations</CardTitle>
                  <CardDescription>Manage your connected services and applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Database className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">MLS Integration</h3>
                        <p className="text-sm text-gray-500">Provider: {settings.integrations.mls.provider}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[settings.integrations.mls.status]}>
                      {settings.integrations.mls.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="h-8 w-8 text-red-500" />
                      <div>
                        <h3 className="font-medium">DocuSign</h3>
                        <p className="text-sm text-gray-500">Electronic signatures</p>
                      </div>
                    </div>
                    <Badge className={statusColors[settings.integrations.docusign.status]}>
                      {settings.integrations.docusign.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-8 w-8 text-green-500" />
                      <div>
                        <h3 className="font-medium">Google Calendar</h3>
                        <p className="text-sm text-gray-500">Calendar synchronization</p>
                      </div>
                    </div>
                    <Badge className={statusColors[settings.integrations.googleCalendar.status]}>
                      {settings.integrations.googleCalendar.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs would go here but keeping it simple for now */}
          {activeTab !== 'profile' && activeTab !== 'integrations' && (
            <Card>
              <CardHeader>
                <CardTitle>{tabs.find(t => t.id === activeTab)?.label} Settings</CardTitle>
                <CardDescription>This section is coming soon...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-gray-600">
                    {tabs.find(t => t.id === activeTab)?.label} settings will be available in a future update.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}