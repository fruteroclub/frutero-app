# Omi Integration Implementation Plan

## Project Overview

### Objective
Integrate Omi Memory Prompt system into the Frutero Club application to capture, process, and visualize word frequencies from conversations recorded by Omi wearable devices.

### Technical Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/ui
- **Initial Storage**: Local JSON (MVP), PostgreSQL/Prisma (Production)

### Success Criteria
- ✅ Successfully receive webhook data from Omi
- ✅ Extract and process word frequencies from transcripts
- ✅ Display word cloud visualization in dashboard
- ✅ Filter by conversation context (conference, mentorship, meeting)
- ✅ Store and retrieve historical session data

---

## Phase 1: Basic Infrastructure Setup

### TICKET-001: Create Basic Webhook Endpoint

**Description**: Implement a POST endpoint to receive webhook data from Omi Memory Prompts.

**Technical Requirements**:
- Next.js 15 App Router API route
- Handle POST requests at `/api/omi/webhook`
- Parse JSON body
- Return appropriate status codes

**LLM Prompt Template**:
```
Create a Next.js 15 API route at src/app/api/omi/webhook/route.ts that:
1. Handles POST requests with JSON body
2. Logs the received data to console
3. Returns a success response with timestamp
4. Includes error handling for malformed requests
5. Uses TypeScript with proper type definitions
Use the Next.js App Router pattern with NextRequest and NextResponse.
```

**Acceptance Criteria**:
- [ ] Endpoint responds to POST requests
- [ ] Logs incoming data
- [ ] Returns 200 on success, 400/500 on errors
- [ ] TypeScript types defined

**Dependencies**: None

---

### TICKET-002: Add Request Logging System

**Description**: Implement comprehensive logging for all incoming webhook requests for debugging and analysis.

**Technical Requirements**:
- File-based logging to `omi-logs/` directory
- JSON format with timestamp
- Automatic log rotation (keep last 100 entries)
- Include headers and body

**LLM Prompt Template**:
```
Enhance the Omi webhook endpoint to include file-based logging:
1. Create logs in omi-logs/ directory (create if not exists)
2. Save each request as timestamp-based JSON file
3. Include headers, body, and metadata
4. Implement log rotation keeping only last 100 files
5. Add to .gitignore
Use Node.js fs/promises for file operations.
```

**Acceptance Criteria**:
- [ ] Logs saved to omi-logs/ directory
- [ ] JSON format with proper structure
- [ ] Log rotation implemented
- [ ] Directory added to .gitignore

**Dependencies**: TICKET-001

---

### TICKET-003: Create TypeScript Type Definitions

**Description**: Define comprehensive TypeScript interfaces for Omi webhook payloads and internal data structures.

**Technical Requirements**:
- Create `/src/lib/omi/types.ts`
- Define interfaces for webhook payload
- Define types for processed data
- Export all types for reuse

**LLM Prompt Template**:
```
Create TypeScript type definitions at src/lib/omi/types.ts for:
1. OmiWebhookPayload interface with:
   - memory_id, user_id, timestamp
   - session_metadata (context, duration, participants)
   - transcript (raw_text, language, confidence)
   - prompt_result (optional extracted data)
2. ProcessedWordFrequency type
3. SessionContext enum (conference, mentorship, meeting, casual)
4. OmiSession storage interface
Export all types for use across the application.
```

**Acceptance Criteria**:
- [ ] Complete type definitions created
- [ ] All webhook fields covered
- [ ] Types exported and reusable
- [ ] Proper enum for contexts

**Dependencies**: None

---

### TICKET-004: Create Test Endpoint

**Description**: Implement a simplified test endpoint for initial integration testing.

**Technical Requirements**:
- Endpoint at `/api/omi/test`
- Basic word frequency processing
- Immediate response with results
- Minimal validation

**LLM Prompt Template**:
```
Create a test webhook endpoint at src/app/api/omi/test/route.ts that:
1. Accepts any JSON payload
2. Extracts text from common fields (transcript, raw_transcript, text)
3. Performs basic word frequency analysis
4. Returns top 10 words immediately
5. Includes comprehensive console logging
This is for testing only - prioritize flexibility over security.
```

**Acceptance Criteria**:
- [ ] Test endpoint functional
- [ ] Processes various payload formats
- [ ] Returns word frequencies
- [ ] Extensive logging enabled

**Dependencies**: TICKET-003

---

### TICKET-005: Create Test Dashboard Page

**Description**: Build a simple dashboard page to monitor incoming test webhooks.

**Technical Requirements**:
- Page at `/app/omi-test/page.tsx`
- Display webhook URL
- Show recent webhooks
- Auto-refresh capability

**LLM Prompt Template**:
```
Create a React component at src/app/omi-test/page.tsx that:
1. Displays the webhook URL for configuration
2. Fetches and displays recent webhook logs
3. Shows word frequency for each webhook
4. Auto-refreshes every 5 seconds
5. Uses Tailwind CSS for styling
Include loading states and empty states. Make it client component with 'use client'.
```

**Acceptance Criteria**:
- [ ] Dashboard page accessible
- [ ] Shows webhook URL prominently
- [ ] Lists recent webhooks
- [ ] Auto-refresh working

**Dependencies**: TICKET-004

---

## Phase 2: Data Processing Pipeline

### TICKET-006: Implement Word Frequency Processor

**Description**: Create a robust word frequency analysis module with advanced text processing.

**Technical Requirements**:
- Create `/src/lib/omi/processor.ts`
- Remove stop words (multiple languages)
- Handle punctuation and special characters
- Case-insensitive processing
- Configurable minimum word length

**LLM Prompt Template**:
```
Create a word frequency processor at src/lib/omi/processor.ts with:
1. Class OmiProcessor with processTranscript method
2. Multi-language stop words (English, Spanish)
3. Remove punctuation and normalize text
4. Configurable options (minLength, maxWords, language)
5. Return sorted array of {word, count, percentage}
Include Spanish stop words for Latin American context.
```

**Acceptance Criteria**:
- [ ] Accurate word counting
- [ ] Stop words filtered
- [ ] Multi-language support
- [ ] Configurable options

**Dependencies**: TICKET-003

---

### TICKET-007: Add Context-Aware Filtering

**Description**: Implement context-specific stop word lists and processing rules.

**Technical Requirements**:
- Different stop words per context
- Context-specific processing rules
- Weighted word importance
- Domain vocabulary handling

**LLM Prompt Template**:
```
Enhance the word processor with context-aware filtering:
1. Add context-specific stop words:
   - conference: [presentation, slide, question]
   - mentorship: [think, maybe, suggest]
   - meeting: [agenda, item, discuss]
2. Implement getContextStopWords(context) method
3. Add word importance scoring based on context
4. Handle technical jargon appropriately
Return enhanced word frequency with relevance scores.
```

**Acceptance Criteria**:
- [ ] Context-specific filtering works
- [ ] Different results per context
- [ ] Importance scoring implemented
- [ ] Technical terms preserved

**Dependencies**: TICKET-006

---

### TICKET-008: Create Data Validation Layer

**Description**: Implement comprehensive input validation and sanitization.

**Technical Requirements**:
- Create `/src/lib/omi/validator.ts`
- Validate webhook payload structure
- Sanitize text input
- Detect and handle languages

**LLM Prompt Template**:
```
Create a validation module at src/lib/omi/validator.ts with:
1. validateWebhookPayload function using Zod or manual validation
2. Text sanitization (remove scripts, excessive whitespace)
3. Language detection for transcript
4. Payload size limits (max 1MB)
5. Return validated/sanitized data or throw errors
Include detailed error messages for debugging.
```

**Acceptance Criteria**:
- [ ] Payload validation working
- [ ] Text sanitization effective
- [ ] Size limits enforced
- [ ] Clear error messages

**Dependencies**: TICKET-003

---

### TICKET-009: Implement Storage Abstraction Layer

**Description**: Create a flexible storage interface supporting multiple backends.

**Technical Requirements**:
- Create `/src/lib/omi/storage.ts`
- Interface for CRUD operations
- JSON file implementation (MVP)
- Prepared for database migration

**LLM Prompt Template**:
```
Create storage abstraction at src/lib/omi/storage.ts with:
1. IOmiStorage interface with methods:
   - saveSession(data): Promise<string>
   - getSession(id): Promise<OmiSession>
   - listSessions(filters): Promise<OmiSession[]>
   - deleteSession(id): Promise<void>
2. JsonFileStorage class implementing interface
3. Store in data/omi-sessions/ directory
4. Include metadata and indexing
Design for easy swap to PostgreSQL later.
```

**Acceptance Criteria**:
- [ ] Storage interface defined
- [ ] JSON implementation working
- [ ] CRUD operations functional
- [ ] Ready for DB migration

**Dependencies**: TICKET-003, TICKET-006

---

## Phase 3: Frontend Components

### TICKET-010: Create Word Cloud Component

**Description**: Build an interactive word cloud visualization component.

**Technical Requirements**:
- Create `/src/components/omi/WordCloud.tsx`
- Size words by frequency
- Color coding by importance
- Hover interactions
- Responsive design

**LLM Prompt Template**:
```
Create a React component at src/components/omi/WordCloud.tsx that:
1. Accepts array of {word, count, percentage}
2. Renders words with size based on frequency
3. Uses Tailwind CSS for styling
4. Implements hover states showing count
5. Responsive grid layout
6. Color gradient from most to least frequent
Make it beautiful and interactive using Framer Motion if needed.
```

**Acceptance Criteria**:
- [ ] Words sized by frequency
- [ ] Interactive hover states
- [ ] Responsive layout
- [ ] Visually appealing

**Dependencies**: None

---

### TICKET-011: Build Session List Component

**Description**: Create a component to display historical Omi sessions.

**Technical Requirements**:
- Create `/src/components/omi/SessionList.tsx`
- Display session metadata
- Expandable details
- Search and filter
- Pagination support

**LLM Prompt Template**:
```
Create SessionList component at src/components/omi/SessionList.tsx with:
1. Display list of sessions with:
   - Timestamp, context, duration
   - Word count, top 3 words
2. Expandable rows for full details
3. Search by keywords
4. Filter by context and date range
5. Pagination (10 items per page)
Use Shadcn/ui components and Tailwind CSS.
```

**Acceptance Criteria**:
- [ ] Sessions displayed clearly
- [ ] Expandable details work
- [ ] Search functional
- [ ] Filters applied correctly

**Dependencies**: TICKET-010

---

### TICKET-012: Create Context Filter Component

**Description**: Build a filter component for conversation contexts.

**Technical Requirements**:
- Create `/src/components/omi/ContextFilter.tsx`
- Multi-select capability
- Visual context indicators
- Count badges
- Clear all option

**LLM Prompt Template**:
```
Create ContextFilter at src/components/omi/ContextFilter.tsx with:
1. Checkbox group for contexts:
   - Conference, Mentorship, Meeting, Casual
2. Visual icons for each context
3. Show count of sessions per context
4. Select all/clear all buttons
5. Emit onChange with selected contexts
Use Radix UI primitives with Tailwind styling.
```

**Acceptance Criteria**:
- [ ] All contexts selectable
- [ ] Visual indicators present
- [ ] Counts displayed
- [ ] Bulk actions work

**Dependencies**: None

---

### TICKET-013: Build Analytics Dashboard Page

**Description**: Create the main Omi analytics dashboard page.

**Technical Requirements**:
- Create `/src/app/dashboard/omi/page.tsx`
- Compose all components
- Dashboard layout
- Real-time updates
- Export functionality

**LLM Prompt Template**:
```
Create dashboard at src/app/dashboard/omi/page.tsx that:
1. Uses PageWrapper layout component
2. Includes WordCloud, SessionList, ContextFilter
3. Fetches data from /api/omi/sessions
4. Real-time updates via polling
5. Export to CSV functionality
6. Responsive grid layout
7. Loading and error states
Make it a beautiful, functional dashboard.
```

**Acceptance Criteria**:
- [ ] All components integrated
- [ ] Data fetching works
- [ ] Responsive layout
- [ ] Export functional

**Dependencies**: TICKET-010, TICKET-011, TICKET-012

---

### TICKET-014: Add Real-Time Monitor Component

**Description**: Create a component for monitoring live Omi sessions.

**Technical Requirements**:
- Create `/src/components/omi/RealTimeMonitor.tsx`
- WebSocket or polling updates
- Live word frequency
- Session timer
- Visual indicators

**LLM Prompt Template**:
```
Create RealTimeMonitor at src/components/omi/RealTimeMonitor.tsx with:
1. Connect to live session updates
2. Show current session duration timer
3. Live updating word frequency
4. Visual pulse indicator for activity
5. Start/stop monitoring controls
6. Connection status indicator
Use polling (5 second interval) for MVP.
```

**Acceptance Criteria**:
- [ ] Live updates working
- [ ] Timer accurate
- [ ] Visual feedback clear
- [ ] Controls functional

**Dependencies**: TICKET-010

---

## Phase 4: Production Features

### TICKET-015: Implement Security Layer

**Description**: Add security measures for production deployment.

**Technical Requirements**:
- Webhook signature verification
- Rate limiting
- API key authentication
- Input sanitization

**LLM Prompt Template**:
```
Add security to Omi webhook endpoint:
1. Implement HMAC signature verification:
   - Check X-Omi-Signature header
   - Verify with WEBHOOK_SECRET env var
2. Add rate limiting (10 req/min per IP)
3. API key validation from headers
4. Enhanced input sanitization
5. Security headers in responses
Create middleware at src/lib/omi/security.ts.
```

**Acceptance Criteria**:
- [ ] Signature verification works
- [ ] Rate limiting enforced
- [ ] API keys validated
- [ ] Security headers present

**Dependencies**: TICKET-008

---

### TICKET-016: Add Database Integration

**Description**: Implement PostgreSQL database storage with Prisma.

**Technical Requirements**:
- Install and configure Prisma
- Create schema for Omi data
- Migration scripts
- Connection pooling

**LLM Prompt Template**:
```
Set up Prisma with PostgreSQL for Omi data:
1. Install Prisma dependencies
2. Create schema.prisma with:
   - OmiSession model
   - WordFrequency relation
   - Indexes for performance
3. Create migration
4. Update storage.ts with PrismaStorage class
5. Environment variables for DATABASE_URL
Include connection pooling and error handling.
```

**Acceptance Criteria**:
- [ ] Prisma configured
- [ ] Schema created
- [ ] Migrations work
- [ ] Storage layer updated

**Dependencies**: TICKET-009

---

### TICKET-017: Optimize Performance

**Description**: Implement caching and performance optimizations.

**Technical Requirements**:
- Redis or in-memory caching
- Background job processing
- Query optimization
- CDN for static assets

**LLM Prompt Template**:
```
Add performance optimizations:
1. Implement caching layer:
   - Cache word frequencies for 1 hour
   - Cache session lists
2. Background processing for large transcripts
3. Optimize database queries with indexes
4. Add response compression
5. Implement request queuing
Create cache.ts and queue.ts modules.
```

**Acceptance Criteria**:
- [ ] Caching implemented
- [ ] Background jobs working
- [ ] Queries optimized
- [ ] Response times improved

**Dependencies**: TICKET-016

---

### TICKET-018: Configure Production Deployment

**Description**: Set up production deployment configuration.

**Technical Requirements**:
- Environment variables
- Docker configuration
- CI/CD pipeline
- Monitoring setup

**LLM Prompt Template**:
```
Create production deployment configuration:
1. Create .env.example with all variables
2. Dockerfile for containerization
3. docker-compose.yml for local dev
4. GitHub Actions workflow for CI/CD
5. Health check endpoint
6. Error tracking integration
Include documentation in README.
```

**Acceptance Criteria**:
- [ ] Environment configured
- [ ] Docker files created
- [ ] CI/CD pipeline working
- [ ] Monitoring active

**Dependencies**: TICKET-015, TICKET-016, TICKET-017

---

## Implementation Schedule

### Week 1: Foundation
- Day 1-2: Phase 1 (TICKET-001 to TICKET-005)
- Day 3-4: Phase 2 basics (TICKET-006 to TICKET-008)
- Day 5: Testing and debugging

### Week 2: Features
- Day 1-2: Complete Phase 2 (TICKET-009)
- Day 3-4: Phase 3 UI components (TICKET-010 to TICKET-012)
- Day 5: Dashboard integration (TICKET-013)

### Week 3: Production
- Day 1-2: Real-time features (TICKET-014)
- Day 3: Security (TICKET-015)
- Day 4: Database and optimization (TICKET-016, TICKET-017)
- Day 5: Deployment (TICKET-018)

---

## LLM Usage Guidelines

### Best Practices for Code Generation

1. **Provide Context**: Always include the project stack (Next.js 15, TypeScript, Tailwind)
2. **Be Specific**: Include exact file paths and import requirements
3. **Request Tests**: Ask for test cases or example usage
4. **Iterate**: Use follow-up prompts to refine generated code
5. **Validate**: Always test generated code before moving to next ticket

### Example Master Prompt

```
I'm building an Omi integration for a Next.js 15 app with TypeScript and Tailwind CSS.
The app uses Shadcn/ui components and the App Router pattern.

[Insert specific ticket prompt here]

Please provide complete, production-ready code with:
- Proper error handling
- TypeScript types
- Comments for complex logic
- Tailwind classes for styling
```

### Troubleshooting Prompts

**For Debugging**:
```
This code is throwing [error]. The context is [description].
Fix the issue and explain what was wrong.
```

**For Optimization**:
```
Optimize this code for performance. Current issues: [problems].
Maintain functionality while improving [metric].
```

**For Testing**:
```
Create unit tests for this component/function using Jest/React Testing Library.
Cover edge cases and error scenarios.
```

---

## Success Metrics

- **Phase 1**: Webhook receiving data successfully (< 2 days)
- **Phase 2**: Processing 95%+ accuracy on word frequency (< 3 days)
- **Phase 3**: UI components rendering correctly (< 3 days)
- **Phase 4**: Production-ready with <200ms response time (< 5 days)

## Notes

- Each ticket is designed to be self-contained
- LLM prompts are optimized for Claude, GPT-4, or similar models
- Adjust prompts based on specific AI assistant capabilities
- Test each component thoroughly before integration
- Keep security and performance in mind throughout

---

**Document Version**: 1.0.0  
**Last Updated**: December 2024  
**Total Tickets**: 18  
**Estimated Duration**: 3 weeks