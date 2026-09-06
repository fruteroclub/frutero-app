# Omi Memory Creation Triggers - Implementation Plan

## 📋 Overview

Implement Omi's Memory Creation Triggers webhook to receive complete conversation memories with full transcripts, structured data, and metadata. This integration will organize data by user ID and extract word frequency analytics.

## 🎯 Objectives

1. **Receive Memory Creation webhooks** from Omi devices
2. **Extract word frequencies** from complete conversations
3. **Organize data by user** using custom identifiers
4. **Display analytics** in a unified dashboard
5. **Maintain compatibility** with existing real-time transcript integration

## 🏗️ Architecture

### Data Flow
```
[Omi Device] → [Memory Created] → [Webhook POST] → [/api/omi/memory?uid=USER_ID]
     ↓                                                        ↓
[AI Processing]                                    [Word Frequency Analysis]
     ↓                                                        ↓
[Structured Data]                                   [User-Organized Storage]
                                                              ↓
                                                        [Dashboard View]
```

### Storage Structure
```
omi-logs/
├── transcript/              # Real-time transcripts (existing)
│   └── omi-*.json
├── memory/                  # Memory Creation webhooks (new)
│   ├── by-user/            # Organized by user ID
│   │   ├── mel_twitter/
│   │   │   ├── memory-001.json
│   │   │   └── memory-002.json
│   │   ├── carlos_instagram/
│   │   │   └── memory-003.json
│   │   └── anonymous/
│   │       └── memory-004.json
│   └── all/                # All memories (for quick access)
│       └── memory-*.json
└── test/                   # Test webhooks
    └── test-*.json
```

## 📦 Implementation Components

### 1. TypeScript Type Definitions

**File**: `/src/lib/omi/memory-types.ts`

```typescript
// Core interfaces based on Omi documentation
interface TranscriptSegment {
  text: string
  speaker: string
  speakerId: number
  is_user: boolean
  start: number
  end: number
}

interface StructuredData {
  title: string
  overview: string
  emoji: string
  category: string
  action_items: ActionItem[]
  events: Event[]
}

interface MemoryCreation {
  id: string
  created_at: string
  started_at: string
  finished_at: string
  source: string
  language: string
  structured: StructuredData
  transcript_segments: TranscriptSegment[]
  geolocation?: Geolocation
  photos: string[]
  plugins_results: any[]
  external_data: any
  discarded: boolean
  deleted: boolean
  visibility: string
  processing_memory_id: string | null
  status: string
}

// Enhanced with user tracking
interface ProcessedMemory extends MemoryCreation {
  uid: string
  word_frequency: WordFrequency[]
  total_words: number
  conversation_duration: number
  speaker_stats: SpeakerStatistics[]
}
```

### 2. Memory Creation Webhook Endpoint

**File**: `/src/app/api/omi/memory/route.ts`

**Key Features**:
- Extract `uid` from query parameter
- Process transcript segments
- Calculate word frequency across all segments
- Organize storage by user
- Return analytics summary

**Implementation Steps**:
1. Parse query parameter for user ID
2. Validate Memory Creation payload
3. Combine all transcript segments
4. Process word frequency with language detection
5. Save to user-specific directory
6. Generate analytics response

### 3. User Management System

**File**: `/src/lib/omi/user-manager.ts`

**Functionality**:
- Sanitize user IDs for file system safety
- Create user directories as needed
- Track user statistics
- List all known users

**User ID Format Rules**:
- Alphanumeric, hyphens, underscores allowed
- Convert special characters to safe alternatives
- Default to "anonymous" if not provided
- Max length: 50 characters

### 4. Enhanced Word Processing

**File**: `/src/lib/omi/memory-processor.ts`

**Features**:
- Multi-language support (English, Spanish)
- Speaker-based analysis
- Time-weighted word importance
- Category-specific stop words
- Action item keyword extraction

**Processing Pipeline**:
```
1. Extract all text from segments
2. Detect primary language
3. Apply language-specific stop words
4. Weight by conversation context
5. Generate frequency distribution
6. Identify key topics
```

### 5. Test Endpoint

**File**: `/src/app/api/omi/memory/test/route.ts`

**Purpose**: Test Memory Creation format before Omi configuration

**Capabilities**:
- Generate sample Memory Creation payload
- Simulate different conversation types
- Test with various user IDs
- Validate processing pipeline

### 6. Dashboard Enhancements

**File**: `/src/app/omi-test/page.tsx`

**New Features**:

#### User Selection Dropdown
```typescript
<select value={selectedUser} onChange={setSelectedUser}>
  <option value="all">All Users</option>
  <option value="mel_twitter">@mel_twitter</option>
  <option value="carlos_instagram">@carlos_instagram</option>
</select>
```

#### Memory Creation Section
- Display structured data (title, overview, emoji)
- Show transcript with speaker identification
- Word frequency by speaker
- Conversation timeline visualization
- Action items list

#### User Analytics
- Total conversations per user
- Average conversation duration
- Most frequent words per user
- Activity timeline

### 7. API Enhancements

**File**: `/src/app/api/omi/logs/route.ts`

**Updates**:
- Support filtering by user ID
- Aggregate statistics endpoint
- Export functionality per user
- Memory type filtering

**New Endpoints**:
- `GET /api/omi/users` - List all users
- `GET /api/omi/stats?uid=USER_ID` - User statistics
- `GET /api/omi/export?uid=USER_ID` - Export user data

## 🚀 Implementation Phases

### Phase 1: Core Infrastructure (Day 1)
- [ ] Create Memory Creation type definitions
- [ ] Implement basic webhook endpoint
- [ ] Set up user-based file organization
- [ ] Create test endpoint

### Phase 2: Processing Pipeline (Day 2)
- [ ] Build memory processor with word frequency
- [ ] Implement speaker-based analysis
- [ ] Add language detection
- [ ] Create user management system

### Phase 3: Dashboard Integration (Day 3)
- [ ] Add Memory Creation section to dashboard
- [ ] Implement user filtering
- [ ] Display structured data
- [ ] Show speaker statistics

### Phase 4: Analytics & Polish (Day 4)
- [ ] Add user analytics views
- [ ] Implement export functionality
- [ ] Create documentation
- [ ] Test with real Omi device

## 🔧 Configuration Guide

### Setting Up in Omi App

1. **Open Omi App**
   - Navigate to Settings → Developer Mode
   - Enable Developer Settings

2. **Configure Webhook**
   - Go to Integration Settings
   - Select "Memory Creation Trigger"
   - Enter webhook URL with your custom user ID:
   ```
   https://[your-ngrok].ngrok.io/api/omi/memory?uid=YOUR_CUSTOM_ID
   ```

3. **User ID Examples**:
   - Social media: `?uid=twitter_mel` or `?uid=@melguachun`
   - Device-based: `?uid=mel_phone` or `?uid=work_device`
   - Project-based: `?uid=frutero_mel` or `?uid=hackathon_team1`
   - Anonymous: Omit parameter for `?uid=anonymous`

4. **Test Configuration**
   - Create a test memory in Omi
   - Check dashboard for received webhook
   - Verify user organization

## 📊 Expected Data Format

### Webhook Request
```http
POST /api/omi/memory?uid=mel_twitter
Content-Type: application/json

{
  "id": "mem_123456",
  "created_at": "2024-01-20T10:00:00Z",
  "started_at": "2024-01-20T09:30:00Z",
  "finished_at": "2024-01-20T10:00:00Z",
  "structured": {
    "title": "Project Planning Meeting",
    "overview": "Discussed AI integration features",
    "emoji": "💡",
    "category": "work",
    "action_items": [
      {"description": "Research word frequency algorithms", "completed": false}
    ]
  },
  "transcript_segments": [
    {
      "text": "We need to implement word frequency analysis",
      "speaker": "Speaker 0",
      "speakerId": 0,
      "is_user": true,
      "start": 0,
      "end": 5.2
    }
  ]
}
```

### Processed Response
```json
{
  "success": true,
  "memory_id": "mem_123456",
  "user_id": "mel_twitter",
  "analytics": {
    "total_words": 150,
    "unique_words": 45,
    "top_words": [
      {"word": "implement", "count": 5},
      {"word": "frequency", "count": 4}
    ],
    "duration_seconds": 1800,
    "speakers": 2
  },
  "storage": {
    "file": "memory/by-user/mel_twitter/mem_123456.json",
    "user_total_memories": 15
  }
}
```

## 🧪 Testing Strategy

### Local Testing
1. Start server: `bun dev`
2. Use test endpoint: `POST /api/omi/memory/test`
3. Verify file creation in correct user directory
4. Check dashboard display

### Ngrok Testing
1. Setup ngrok: `ngrok http 3001`
2. Configure Omi with ngrok URL + user ID
3. Create memory in Omi app
4. Monitor dashboard for incoming webhook

### Test Scenarios
- [ ] Memory with single speaker
- [ ] Memory with multiple speakers
- [ ] Spanish language conversation
- [ ] Long conversation (>30 minutes)
- [ ] Memory with action items
- [ ] Different user IDs
- [ ] Missing user ID (anonymous)

## 📈 Success Metrics

- **Webhook Reception**: 100% successful processing
- **User Organization**: Correct directory structure
- **Word Frequency**: Accurate extraction and counting
- **Dashboard Display**: Clear visualization per user
- **Performance**: <500ms processing time
- **Storage Efficiency**: Automatic rotation after 1000 memories

## 🔗 Integration Points

### Existing Systems
- **Real-time Transcripts**: Continue working at `/api/omi/webhook`
- **Test Dashboard**: Enhanced at `/omi-test`
- **File Storage**: Extended with user organization

### New Capabilities
- **User Tracking**: Organize by custom identifiers
- **Speaker Analysis**: Word frequency per speaker
- **Structured Data**: Display AI-generated summaries
- **Action Items**: Track conversation outcomes

## 📝 Documentation Updates

1. **User Guide**: How to set custom user IDs
2. **API Reference**: New endpoints and parameters
3. **Dashboard Guide**: Using user filters and analytics
4. **Troubleshooting**: Common issues and solutions

## 🚦 Go-Live Checklist

- [ ] All endpoints implemented and tested
- [ ] User organization working correctly
- [ ] Dashboard showing Memory Creation data
- [ ] Documentation updated
- [ ] Tested with real Omi device
- [ ] Multiple user IDs tested
- [ ] Error handling verified
- [ ] Performance validated

## 📌 Notes

- User IDs are for organization only (no authentication)
- File-based storage maintains simplicity
- Compatible with existing real-time integration
- Scalable to multiple users/devices
- Ready for future database migration

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Ready for Implementation