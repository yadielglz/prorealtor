# 3CX Integration Architecture for Realtor Platform

## Overview

This document outlines the comprehensive architecture for integrating 3CX Phone System with the Realtor Platform, enabling seamless communication features including click-to-call, call logging, WebRTC browser calling, and real-time call management.

## Integration Components

### 1. 3CX Web Client API Integration

#### WebRTC Browser Calling
```typescript
// src/lib/3cx/webrtc-client.ts
interface ThreeCXWebRTCClient {
  connect(serverUrl: string, username: string, password: string): Promise<void>
  makeCall(phoneNumber: string): Promise<CallSession>
  answerCall(callId: string): Promise<void>
  hangupCall(callId: string): Promise<void>
  getCallHistory(): Promise<CallRecord[]>
  onIncomingCall(callback: (call: IncomingCall) => void): void
  onCallStatusChange(callback: (status: CallStatus) => void): void
}
```

#### Implementation Strategy
- **3CX Web Client SDK**: Utilize 3CX's JavaScript SDK for WebRTC functionality
- **SIP.js Integration**: Fallback to SIP.js for advanced WebRTC features
- **Real-time Communication**: WebSocket connection for call events and presence

### 2. Call Management Features

#### Click-to-Call Integration
```typescript
// src/components/3cx/click-to-call.tsx
interface ClickToCallProps {
  phoneNumber: string
  contactName?: string
  contactId?: string
  onCallStart?: (callId: string) => void
  onCallEnd?: (callId: string, duration: number) => void
}

const ClickToCallButton: React.FC<ClickToCallProps> = ({
  phoneNumber,
  contactName,
  contactId,
  onCallStart,
  onCallEnd
}) => {
  const { makeCall, callStatus } = use3CXClient()
  
  const handleCall = async () => {
    try {
      const call = await makeCall(phoneNumber)
      onCallStart?.(call.id)
      
      // Log call in Firestore
      await logCallActivity({
        contactId,
        phoneNumber,
        direction: 'OUTBOUND',
        status: 'INITIATED',
        startTime: new Date()
      })
    } catch (error) {
      console.error('Call failed:', error)
    }
  }
  
  return (
    <Button onClick={handleCall} disabled={callStatus === 'CALLING'}>
      <Phone className="h-4 w-4 mr-2" />
      {callStatus === 'CALLING' ? 'Calling...' : 'Call'}
    </Button>
  )
}
```

#### Automatic Call Logging
```typescript
// src/lib/3cx/call-logger.ts
interface CallLogEntry {
  id: string
  contactId?: string
  phoneNumber: string
  direction: 'INBOUND' | 'OUTBOUND'
  status: 'COMPLETED' | 'MISSED' | 'VOICEMAIL' | 'BUSY'
  startTime: Date
  endTime?: Date
  duration?: number
  recordingUrl?: string
  notes?: string
}

class CallLogger {
  async logCall(callData: Partial<CallLogEntry>): Promise<void> {
    // Save to Firestore communications collection
    await addDoc(collection(db, 'communications'), {
      ...callData,
      type: 'CALL',
      userId: getCurrentUserId(),
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }
  
  async updateCallStatus(callId: string, status: CallLogEntry['status'], endTime?: Date): Promise<void> {
    // Update call record with final status
    const callRef = doc(db, 'communications', callId)
    await updateDoc(callRef, {
      status,
      endTime,
      duration: endTime ? calculateDuration(startTime, endTime) : undefined,
      updatedAt: new Date()
    })
  }
}
```

### 3. Real-time Call Management

#### Call Status Dashboard
```typescript
// src/components/3cx/call-dashboard.tsx
interface ActiveCall {
  id: string
  phoneNumber: string
  contactName?: string
  direction: 'INBOUND' | 'OUTBOUND'
  status: 'RINGING' | 'CONNECTED' | 'ON_HOLD' | 'TRANSFERRING'
  startTime: Date
  duration: number
}

const CallDashboard: React.FC = () => {
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([])
  const [callQueue, setCallQueue] = useState<IncomingCall[]>([])
  const { client } = use3CXClient()
  
  useEffect(() => {
    client.onIncomingCall((call) => {
      setCallQueue(prev => [...prev, call])
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(`Incoming call from ${call.callerName || call.phoneNumber}`, {
          icon: '/icons/phone-icon.png',
          tag: call.id
        })
      }
    })
    
    client.onCallStatusChange((status) => {
      setActiveCalls(prev => 
        prev.map(call => 
          call.id === status.callId 
            ? { ...call, status: status.status, duration: status.duration }
            : call
        )
      )
    })
  }, [client])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Calls</CardTitle>
      </CardHeader>
      <CardContent>
        {activeCalls.map(call => (
          <CallItem key={call.id} call={call} />
        ))}
        {callQueue.map(call => (
          <IncomingCallItem key={call.id} call={call} />
        ))}
      </CardContent>
    </Card>
  )
}
```

### 4. Contact Integration

#### Enhanced Contact Cards
```typescript
// src/components/contacts/contact-card-with-3cx.tsx
const ContactCardWith3CX: React.FC<{ contact: Contact }> = ({ contact }) => {
  const { isOnline, lastSeen } = use3CXPresence(contact.phone)
  const { callHistory } = use3CXCallHistory(contact.phone)
  
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <h3>{contact.firstName} {contact.lastName}</h3>
            <p>{contact.phone}</p>
            {isOnline && (
              <Badge className="bg-green-100 text-green-800">
                Available
              </Badge>
            )}
          </div>
          <div className="flex space-x-2">
            <ClickToCallButton 
              phoneNumber={contact.phone}
              contactName={`${contact.firstName} ${contact.lastName}`}
              contactId={contact.id}
            />
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Recent call history */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Recent Calls</h4>
          {callHistory.slice(0, 3).map(call => (
            <div key={call.id} className="flex items-center justify-between text-sm">
              <span>{formatDate(call.startTime)}</span>
              <span>{call.duration}s</span>
              <Badge variant={call.status === 'COMPLETED' ? 'default' : 'destructive'}>
                {call.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

### 5. Configuration & Setup

#### 3CX Settings Interface
```typescript
// src/components/settings/3cx-settings.tsx
interface ThreeCXSettings {
  enabled: boolean
  serverUrl: string
  username: string
  password: string
  extension: string
  webClientUrl: string
  apiKey?: string
  features: {
    clickToCall: boolean
    callLogging: boolean
    webrtcCalling: boolean
    callRecording: boolean
    presenceStatus: boolean
    voicemailIntegration: boolean
  }
}

const ThreeCXSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<ThreeCXSettings>()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR'>('DISCONNECTED')
  
  const testConnection = async () => {
    setIsConnecting(true)
    try {
      const client = new ThreeCXClient(settings.serverUrl, settings.username, settings.password)
      await client.connect()
      setConnectionStatus('CONNECTED')
      
      // Save settings to Firestore
      await saveUserSettings({ threeCX: settings })
    } catch (error) {
      setConnectionStatus('ERROR')
      console.error('3CX connection failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>3CX Phone System Integration</CardTitle>
        <CardDescription>
          Connect your 3CX system for advanced calling features
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Settings form */}
        <div className="space-y-4">
          <div>
            <label>3CX Server URL</label>
            <input 
              type="url"
              value={settings?.serverUrl || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, serverUrl: e.target.value }))}
              placeholder="https://your-3cx-server.com"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Username</label>
              <input 
                type="text"
                value={settings?.username || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <label>Extension</label>
              <input 
                type="text"
                value={settings?.extension || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, extension: e.target.value }))}
              />
            </div>
          </div>
          
          <Button onClick={testConnection} disabled={isConnecting}>
            {isConnecting ? 'Testing...' : 'Test Connection'}
          </Button>
          
          <div className="flex items-center space-x-2">
            <span>Status:</span>
            <Badge className={statusColors[connectionStatus]}>
              {connectionStatus}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 6. Security & Authentication

#### Secure Credential Storage
```typescript
// src/lib/3cx/auth.ts
class ThreeCXAuth {
  private static encryptCredentials(credentials: ThreeCXCredentials): string {
    // Use Web Crypto API for client-side encryption
    return encrypt(JSON.stringify(credentials), getUserEncryptionKey())
  }
  
  private static decryptCredentials(encryptedData: string): ThreeCXCredentials {
    return JSON.parse(decrypt(encryptedData, getUserEncryptionKey()))
  }
  
  static async saveCredentials(credentials: ThreeCXCredentials): Promise<void> {
    const encrypted = this.encryptCredentials(credentials)
    await setDoc(doc(db, 'userSettings', getCurrentUserId()), {
      threeCXCredentials: encrypted
    }, { merge: true })
  }
  
  static async getCredentials(): Promise<ThreeCXCredentials | null> {
    const userSettings = await getDoc(doc(db, 'userSettings', getCurrentUserId()))
    const encrypted = userSettings.data()?.threeCXCredentials
    
    return encrypted ? this.decryptCredentials(encrypted) : null
  }
}
```

### 7. Error Handling & Fallbacks

#### Robust Error Management
```typescript
// src/lib/3cx/error-handler.ts
class ThreeCXErrorHandler {
  static handleConnectionError(error: Error): void {
    console.error('3CX Connection Error:', error)
    
    // Show user-friendly error message
    toast({
      title: "3CX Connection Failed",
      description: "Please check your 3CX settings and try again.",
      variant: "destructive"
    })
    
    // Log error for debugging
    logError('3CX_CONNECTION_ERROR', error, {
      timestamp: new Date(),
      userId: getCurrentUserId()
    })
  }
  
  static handleCallError(error: Error, phoneNumber: string): void {
    console.error('Call Error:', error)
    
    // Fallback to system dialer
    if (confirm('3CX call failed. Open system dialer instead?')) {
      window.open(`tel:${phoneNumber}`)
    }
  }
}
```

### 8. Performance Optimization

#### Efficient WebRTC Management
```typescript
// src/lib/3cx/webrtc-manager.ts
class WebRTCManager {
  private static instance: WebRTCManager
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  
  static getInstance(): WebRTCManager {
    if (!this.instance) {
      this.instance = new WebRTCManager()
    }
    return this.instance
  }
  
  async initializeWebRTC(): Promise<void> {
    // Initialize WebRTC with optimal settings
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers if needed
      ]
    })
    
    // Get user media with audio constraints
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      },
      video: false
    })
  }
  
  cleanup(): void {
    this.localStream?.getTracks().forEach(track => track.stop())
    this.peerConnection?.close()
    this.localStream = null
    this.peerConnection = null
  }
}
```

## Implementation Timeline

### Phase 1: Basic Integration (Week 1-2)
- [ ] 3CX Web Client SDK integration
- [ ] Basic click-to-call functionality
- [ ] Settings panel for 3CX configuration
- [ ] Connection testing and validation

### Phase 2: Call Management (Week 3-4)
- [ ] Automatic call logging to Firestore
- [ ] Real-time call status updates
- [ ] Incoming call notifications
- [ ] Call history integration with contacts

### Phase 3: Advanced Features (Week 5-6)
- [ ] WebRTC browser calling
- [ ] Call recording integration
- [ ] Presence status indicators
- [ ] Voicemail integration

### Phase 4: Polish & Optimization (Week 7-8)
- [ ] Error handling and fallbacks
- [ ] Performance optimization
- [ ] Security enhancements
- [ ] User experience improvements

## Technical Requirements

### 3CX System Requirements
- 3CX Phone System v18 or later
- Web Client enabled
- API access configured
- WebRTC support enabled
- HTTPS certificate (required for WebRTC)

### Browser Requirements
- Modern browser with WebRTC support
- Microphone permissions
- Notification permissions (optional)
- Secure context (HTTPS)

### Network Requirements
- Stable internet connection
- Firewall configuration for WebRTC
- STUN/TURN servers (if behind NAT)

## Security Considerations

1. **Credential Security**: All 3CX credentials encrypted before storage
2. **API Security**: Use secure API keys and tokens
3. **WebRTC Security**: Implement secure peer-to-peer connections
4. **Data Privacy**: Comply with call recording regulations
5. **Access Control**: Role-based access to 3CX features

## Testing Strategy

### Unit Tests
- 3CX client connection and authentication
- Call initiation and termination
- Error handling scenarios
- WebRTC functionality

### Integration Tests
- End-to-end call flow
- Firestore data synchronization
- Real-time updates
- Cross-browser compatibility

### User Acceptance Tests
- Click-to-call from contact records
- Incoming call handling
- Call logging accuracy
- Settings configuration

This architecture provides a comprehensive foundation for integrating 3CX Phone System with the Realtor Platform, enabling powerful communication features that enhance productivity and client relationship management.