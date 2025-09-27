# Jam Platform MVP - Implementation Plan

**Version**: 1.1  
**Project**: Mentorship Coordination Platform within Frutero App  
**Approach**: Ship fast, gather feedback, iterate based on real usage

## 1. Overview

### 1.1 Definitions

**Frutero Jam Program**: A 6-week community mentorship program that runs in parallel to external hackathons, courses, and incubator programs. Provides systematic guidance, accountability, and measurable outcomes through structured mentorship relationships.

**Jam Platform**: The MVP mentorship coordination platform within the Frutero App that powers initiatives like Frutero Jam and other mentorship programs. This is the technical infrastructure we are building.

### 1.2 Implementation Scope

This implementation plan covers building the **Jam platform MVP** - a mentorship coordination system within the Frutero App that will:
- Power the Frutero Jam 6-week program as its first use case
- Support future mentorship programs beyond Frutero Jam
- Provide systematic coordination infrastructure for 50+ participants per cohort
- Enable structured accountability and progress tracking with 90% completion rate targets

### 1.3 Core Value Proposition

**Platform Goal**: Build the technical infrastructure for mentorship coordination that enables programs like Frutero Jam to achieve systematic outcomes.

**Program Support**: The platform will enable the Frutero Jam program to guide builders through external hackathons with measurable results.

### 1.4 Success Metrics Implementation

- **User-Centric**: 90% program completion, 85% session attendance, 4.5/5 satisfaction
- **Business**: 50+ participants per cohort, 90% mentor retention, 70% daily engagement
- **Technical**: Reliable functionality, Para integration, data consistency

## 2. PRD Requirements Mapping

### 2.1 Platform Feature Coverage

The Jam platform MVP implements all features needed to support mentorship programs like Frutero Jam:

| User Story | Feature Area | Implementation Priority | Technical Complexity |
|------------|--------------|------------------------|---------------------|
| US-001 | Para Authentication | High | Medium |
| US-002 | Project Registration | High | Low |
| US-003 | Track Selection | High | Low |
| US-004 | Program Discovery | High | Medium |
| US-005 | Professional Profile | High | Low |
| US-006 | Professional Status | Medium | Low |
| US-007 | Quest Viewing | High | Medium |
| US-008 | Quest Submission | High | Medium |
| US-009 | Stage Advancement | High | Medium |
| US-010 | Build in Public | Medium | Low |
| US-011 | Mentor Discovery | High | Medium |
| US-012 | Session Tracking | High | Medium |
| US-013 | Rating System | Medium | Low |
| US-014 | Reward Tracking | Medium | Medium |
| US-015 | Badge System | Medium | Low |

### 2.2 Platform Functional Requirements

**Authentication and Onboarding** (High Priority)
- Para integration for platform access (wallet/email authentication)
- Onboarding wizard for platform participants
- Professional profile creation within the platform

**Program Coordination** (High Priority)
- Discovery interface for external programs that run alongside mentorship programs
- Tracking of participant enrollment in external programs
- Coordination of program deadlines and milestones

**Progress Tracking** (High Priority)
- Platform quest system for tracking deliverables
- Weekly milestone management within the platform
- Automatic progression tracking based on platform activity

**Mentorship Coordination** (High Priority)
- Platform interface for mentor-participant matching
- Session tracking and documentation within the platform
- Quality monitoring tools for program coordinators

**Recognition Systems** (Medium Priority)
- Platform badge system for achievement recognition
- PULPA token distribution through platform activities
- Build in Public features within the platform

## 3. Database Schema Implementation

### 3.1 Current vs Target Schema Analysis

**Current Schema Status**: 14 tables with simplified structure  
**Target Schema**: Reference schema optimized for Jam platform MVP requirements  
**Migration Strategy**: Enhance existing schema to support the platform's mentorship coordination features

### 3.2 Schema Changes Required

#### Enhanced Tables for Platform Support
```sql
-- Programs: External programs that participants join alongside mentorship (e.g., hackathons)
ALTER TABLE programs 
ADD COLUMN organizer TEXT NOT NULL,
ADD COLUMN application_url TEXT,
ADD COLUMN submission_deadline TIMESTAMP,
ADD COLUMN tracks TEXT[] DEFAULT '{}',
ADD COLUMN theme TEXT,
MODIFY COLUMN status ENUM('UPCOMING', 'ACTIVE', 'COMPLETED');

-- Projects: Simplify to one-per-user model
ALTER TABLE projects
ADD COLUMN repository_url TEXT,
ADD COLUMN video_url TEXT,
ADD COLUMN production_url TEXT,
ADD COLUMN pitch_deck_url TEXT,
ADD COLUMN website TEXT,
MODIFY COLUMN stage ENUM('IDEA', 'PROTOTYPE', 'BUILD', 'PROJECT');

-- Quests: Add timing and submission capabilities
ALTER TABLE quests
ADD COLUMN available_from TIMESTAMP NOT NULL,
ADD COLUMN due_date TIMESTAMP NOT NULL,
ADD COLUMN category TEXT,
ADD COLUMN difficulty TEXT;

-- UserQuests: Add proof-of-work submission
ALTER TABLE user_quests
ADD COLUMN submission_text TEXT,
ADD COLUMN submission_urls TEXT[] DEFAULT '{}',
MODIFY COLUMN status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- UserBadges: Add earning context
ALTER TABLE user_badges
ADD COLUMN earned_from TEXT;

-- ProgramUsers: Add track tracking
ALTER TABLE program_users
ADD COLUMN track TEXT NOT NULL; -- "founder", "professional", "freelancer"
```

#### New Tables for Platform Features
```sql
-- Mentorships: Core platform feature for coordinating mentor-participant relationships
CREATE TABLE mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active', -- "active", "completed", "paused"
  session_notes JSONB, -- Array of session summaries
  mentor_rating INTEGER, -- 1-5 scale, participant rates mentor
  participant_rating INTEGER, -- 1-5 scale, mentor rates participant
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(mentor_id, participant_id)
);
```

#### Removed Complexity
- **Drop tiers table**: Too complex for MVP badge system
- **Drop communities/tokens**: Not in MVP scope
- **Simplify rewards**: Focus on PULPA distribution only

### 3.3 Migration Strategy

**Step 1**: Create backup of current schema
**Step 2**: Apply schema modifications via migration script
**Step 3**: Preserve existing user/profile/project data
**Step 4**: Add new mentorship relationships
**Step 5**: Test data consistency and relationships

## 4. Technical Architecture

### 4.1 API Endpoints

#### Authentication & User Management
```typescript
POST /api/auth/para              // Para authentication signup/login
GET  /api/users/me               // Current user profile
PUT  /api/users/me               // Update user profile
POST /api/users/onboarding       // Complete onboarding wizard
```

#### Project Management
```typescript
POST /api/projects               // Create single user project (onboarding)
GET  /api/projects/me            // Get user's project
PUT  /api/projects/:id           // Update project details
PUT  /api/projects/:id/stage     // Update project stage
```

#### Program Coordination
```typescript
GET  /api/programs               // List external programs (with filters)
GET  /api/programs/:id           // Program details
POST /api/programs/:id/join      // Track program participation
GET  /api/programs/my            // User's enrolled programs
```

#### Quest System
```typescript
GET  /api/quests                 // Available quests for user
GET  /api/quests/:id             // Quest details
POST /api/user-quests/:id/submit // Submit quest progress
PUT  /api/user-quests/:id        // Update quest status
GET  /api/user-quests/my         // User's quest progress
```

#### Mentorship
```typescript
GET  /api/mentors                // Browse available mentors
POST /api/mentorships/request    // Request mentor connection
GET  /api/mentorships/my         // User's mentorship relationships
POST /api/mentorships/:id/session // Log session completion
POST /api/mentorships/:id/rate   // Submit mutual ratings
```

#### Community & Rewards
```typescript
POST /api/posts                  // Create Build in Public post
GET  /api/posts                  // Browse community posts
GET  /api/rewards/my             // User's reward history
GET  /api/badges/my              // User's earned badges
POST /api/badges/:id/award       // Award badge to user (admin)
```

### 4.2 Component Architecture

#### Reuse Existing Infrastructure
```
src/components/
├── ui/              # Existing Shadcn components
├── layout/          # Existing PageWrapper, Navbar, Footer
├── buttons/         # Existing auth buttons (Para integration)
└── jam-platform/    # New Jam platform components
    ├── onboarding/  # Platform onboarding wizard
    ├── dashboard/   # Platform participant dashboard
    ├── quests/      # Platform quest management
    ├── projects/    # Project management within platform
    ├── programs/    # External program discovery interface
    ├── mentors/     # Platform mentor coordination
    ├── sessions/    # Platform session tracking
    └── community/   # Platform community features
```

#### Key New Platform Components
```typescript
// Platform Onboarding Flow
OnboardingWizard         // Platform participant setup wizard
ProjectRegistration      // Project creation within platform
TrackSelection          // Program track selection (Founder/Professional/Freelancer)
GoalSetting            // Goal definition for mentorship programs

// Platform Dashboard & Navigation
JamPlatformDashboard   // Main platform dashboard for participants
QuestTracker           // Platform quest progress tracking
MentorshipPanel        // Platform mentorship coordination status
ProgramTimeline        // External program deadline tracking

// Platform Quest System
QuestList              // Platform quests available to participants
QuestDetails           // Quest requirements within platform
QuestSubmission        // Platform submission interface
ProgressTracker        // Platform progress visualization

// Platform Mentorship System
MentorDirectory        // Browse mentors within platform
MentorProfile          // Mentor profiles in platform
ConnectionRequest      // Platform mentor connection requests
SessionLogger          // Platform session documentation
RatingInterface        // Platform rating system

// External Program Coordination (Platform Feature)
ProgramDirectory       // Platform interface for external programs
ProgramCard            // Program cards within platform
ProgramDetails         // Program details view in platform
ApplicationTracker     // Platform tracking of external applications

// Platform Community Features
BuildInPublicEditor    // Platform post creation interface
CommunityFeed         // Platform community feed
RewardHistory         // Platform PULPA token tracking
BadgeDisplay          // Platform badge showcase
```

### 4.3 Integration Points

#### Para Authentication
- Wallet connection for web3 users
- Email fallback for traditional signup
- Session management and token handling
- Profile linking with wallet address

#### External Program Coordination
- Program data entry and management (admin)
- Application deadline tracking
- External link generation and tracking
- Participant enrollment coordination

#### Reward Distribution
- PULPA token calculation and distribution
- Activity tracking for reward eligibility
- Badge issuance based on quest completion
- Transparent reward history and balance display

## 5. Platform Feature Implementation

### 5.1 Authentication & Onboarding Features

#### US-001: Platform Account Creation via Para
**Implementation**:
- Integrate Para authentication into the Jam platform
- Support both wallet connection and email signup for platform access
- Generate platform username with display name customization
- Secure platform session management with token refresh

**Technical Requirements**:
- Update Para integration to support both auth methods
- Implement username generation algorithm
- Add display name customization interface
- Configure session persistence and security

#### US-002: Project Registration in Platform
**Implementation**:
- Create single project per platform participant during onboarding
- Platform project creation form with name, description, category
- Automatic assignment as project owner within platform
- Generate shareable project URL within platform

**Technical Requirements**:
- Enforce one-to-one user-project relationship
- Project creation validation and error handling
- URL slug generation and uniqueness checking
- Project visibility and sharing controls

#### US-003: Program Track Selection in Platform
**Implementation**:
- Platform interface for track selection (Founder/Professional/Freelancer)
- Goal definition within platform for mentorship programs
- Information visibility for platform mentor matching
- Example goals per track for program participants

**Technical Requirements**:
- Track enum definition and validation
- Goal storage and structured data format
- Mentor visibility and filtering by track
- Example content management system

#### US-005: Professional Profile Creation in Platform
**Implementation**:
- Platform profile form (name, location, role)
- Social media integration within platform profiles
- Platform profile completeness indicator
- Privacy controls within platform for information sharing

**Technical Requirements**:
- Profile validation and completeness scoring
- Social media username validation
- Privacy setting management
- Profile display and sharing interfaces

#### US-006: Professional Status Setting
**Implementation**:
- Student indicator and professional role selection
- Professional background description area
- Status influence on mentor matching and opportunities
- Update notifications to mentors for guidance adjustment

**Technical Requirements**:
- Professional status enum and validation
- Mentor notification system for status changes
- Matching algorithm integration
- Status-based opportunity filtering

### 5.2 External Program Coordination Features

#### US-004: External Program Discovery via Platform
**Implementation**:
- Platform listing of external programs (hackathons, courses) that run alongside mentorship
- Platform filters for program discovery by date, track, type
- Platform tracking of multiple program enrollments with conflict warnings
- Platform links to external program websites

**Technical Requirements**:
- Platform data model for external program information
- Platform search and filtering interface
- Platform schedule conflict detection
- Platform analytics for external link tracking

**Platform Program Management**:
- Platform admin interface for external program data entry
- Bulk import of external programs into platform
- Platform tracking of external program status
- Platform analytics for participant enrollments

### 5.3 Platform Quest & Progress Features

#### US-007: Platform Quest Management
**Implementation**:
- Platform quest dashboard for program participants
- Platform filters for quest status tracking
- Quest requirements displayed within platform
- Platform quest assignment based on program track

**Technical Requirements**:
- Quest assignment algorithm based on track and progress
- Status filtering and sorting interface
- Detailed quest display with rich content
- Availability calculation based on user state

#### US-008: Quest Progress Submission in Platform
**Implementation**:
- Platform submission interface for quest progress
- Platform support for proof-of-work uploads
- Platform accountability trail with timestamps
- Platform notifications to mentors for review

**Technical Requirements**:
- File upload handling for multiple formats
- Progress validation and submission tracking
- Mentor notification system integration
- Submission history and accountability tracking

#### US-009: Project Stage Advancement
**Implementation**:
- Clear stage progression (IDEA → PROTOTYPE → BUILD → PROJECT)
- Automatic advancement based on quest completion
- Manual updates with mentor approval
- Stage changes unlock badges, rewards, opportunities

**Technical Requirements**:
- Stage progression validation logic
- Mentor approval workflow for manual updates
- Badge and reward trigger system
- Opportunity unlocking based on stage

### 5.4 Platform Mentorship Features

#### US-011: Mentor Discovery within Platform
**Implementation**:
- Platform mentor directory with expertise profiles
- Platform matching algorithm for mentor-participant pairing
- Platform connection request system
- Structured mentorship relationships within platform

**Technical Requirements**:
- Mentor profile system with expertise tagging
- Matching algorithm implementation
- Connection request workflow and approval
- Relationship management and communication setup

#### US-012: Platform Session Management
**Implementation**:
- Platform integration with calendar systems
- Platform resources for session preparation
- Platform tracking of session completion
- Platform handling of session rescheduling

**Technical Requirements**:
- Calendar integration (Google Calendar, Outlook)
- Session state management and tracking
- Documentation templates and storage
- Rescheduling workflow and notifications

#### US-013: Mutual Rating System
**Implementation**:
- 1-5 scale feedback collection from both parties
- Anonymous feedback submission for honest evaluation
- Low rating pattern detection and coordinator review
- High rating accumulation for reputation building

**Technical Requirements**:
- Rating interface with anonymous submission
- Pattern detection algorithms for quality monitoring
- Coordinator alert system for intervention
- Reputation calculation and display system

### 5.5 Platform Community & Recognition Features

#### US-010: Build in Public within Platform
**Implementation**:
- Platform post creation interface
- Platform community feed for program participants
- Platform social media sharing features
- Platform engagement metrics tracking

**Technical Requirements**:
- Rich content editor with media upload
- Public feed aggregation and display
- Social media API integration for sharing
- Engagement tracking and analytics

#### US-014: PULPA Rewards in Platform
**Implementation**:
- Platform automated reward distribution
- Platform interface for manual reward issuance
- Platform reward history tracking
- Platform token balance display

**Technical Requirements**:
- Reward calculation engine for different activities
- Manual reward issuance interface for coordinators
- Reward history tracking and display
- Token balance management and display

#### US-015: Platform Badge System
**Implementation**:
- Platform badge criteria and earning system
- Platform badge categories for different skills
- Platform public badge display
- Platform badge sharing capabilities

**Technical Requirements**:
- Badge criteria definition and validation system
- Category management and skill taxonomy
- Public badge display with verification details
- Sharing interface for professional networks

## 6. Platform Success Metrics Implementation

### 6.1 Platform User Metrics

**Program Completion Rate (Target: 90%)**
- Platform tracking of participant progression through quests
- Platform monitoring of mentorship session attendance
- Platform identification of drop-off points for intervention
- Platform automated alerts for at-risk participants

**Session Attendance Rate (Target: 85%)**
- Session scheduling and completion tracking
- Missed session identification and follow-up
- Mentor availability and participant engagement correlation
- Quality improvement based on attendance patterns

**Satisfaction Scores (Target: 4.5/5)**
- Post-session rating collection and analysis
- Program completion surveys and feedback
- Mentor quality assessment and improvement
- Participant experience optimization

### 6.2 Platform Business Metrics

**Cohort Enrollment (Target: 50+ participants per program)**
- Platform registration tracking for programs like Frutero Jam
- Platform waiting list management for programs
- Platform analytics for source attribution
- Platform capacity planning for scaling

**Mentor Retention (Target: 90%)**
- Mentor satisfaction and engagement tracking
- Quality rating trends and improvement areas
- Mentor workload and availability optimization
- Recognition and incentive program effectiveness

**Platform Engagement (Target: 70% daily active)**
- Daily active user tracking and patterns
- Feature usage analytics and optimization
- Quest completion rates and timing
- Community engagement and content creation

### 6.3 Platform Technical Metrics

**Platform System Health**
- Jam platform feature availability monitoring
- Platform API performance tracking
- Platform database optimization
- Platform integration stability (Para authentication, external program links)

**Data Consistency**
- Quest tracking accuracy and synchronization
- Reward distribution verification and audit trails
- Badge issuance validation and criteria compliance
- Mentorship relationship integrity and history

## 7. Platform Implementation Strategy

### 7.1 Platform Development Phases

**Phase 1: Core Platform Foundation**
- Para authentication integration for platform access
- Platform participant profiles and project registration
- Basic platform quest system
- Platform mentor-participant matching

**Phase 2: Platform Feature Enhancement**
- Platform quest submission with proof-of-work
- Platform session tracking and rating systems
- Platform interface for external program discovery
- Platform reward and badge distribution

**Phase 3: Platform Community Features**
- Platform Build in Public capabilities
- Platform analytics dashboard for coordinators
- Platform mobile optimization
- Platform UX refinements based on program participant feedback

### 7.2 Platform Quality Assurance: Ship Fast, Iterate

**Platform Development Approach**
- Manual testing of platform features during development
- Beta testing with Frutero Jam program participants
- Real platform user feedback prioritized over extensive QA
- Critical platform issue fixes, defer nice-to-have features

**Feedback Integration**
- Weekly user feedback collection and analysis
- Rapid iteration based on actual usage patterns
- Feature prioritization based on user value
- Performance monitoring with basic metrics

**Risk Management**
- Data backup and recovery procedures
- Graceful degradation for external integrations
- User communication for service interruptions
- Rollback procedures for critical issues

### 7.3 Platform Launch and Iteration

**Platform Deployment Strategy**
- Staging environment for platform beta testing with program participants
- Production deployment of Jam platform within Frutero App
- Gradual rollout to Frutero Jam program cohorts
- Continuous platform deployment for rapid iteration

**Post-Launch Platform Operations**
- Platform user feedback collection from program participants
- Platform performance monitoring and optimization
- Platform feature analytics from mentorship programs
- Platform growth strategies for supporting multiple programs

## 8. Platform Technical Specifications

### 8.1 Platform Database Schema (DDL Scripts)

```sql
-- Migration Script: Current schema to Jam platform MVP schema
-- Run after backing up existing Frutero App data

-- 1. Enhance Programs table for external coordination
ALTER TABLE programs 
ADD COLUMN organizer TEXT,
ADD COLUMN application_url TEXT,
ADD COLUMN submission_deadline TIMESTAMP,
ADD COLUMN tracks TEXT[] DEFAULT '{}',
ADD COLUMN theme TEXT;

-- Update existing enum values
ALTER TYPE program_status RENAME TO program_status_old;
CREATE TYPE program_status AS ENUM('UPCOMING', 'ACTIVE', 'COMPLETED');
ALTER TABLE programs ALTER COLUMN status TYPE program_status USING status::text::program_status;
DROP TYPE program_status_old;

-- 2. Enhance Projects for single-user model
ALTER TABLE projects
ADD COLUMN repository_url TEXT,
ADD COLUMN video_url TEXT,
ADD COLUMN production_url TEXT,
ADD COLUMN pitch_deck_url TEXT,
ADD COLUMN website TEXT;

-- Update project stage enum
ALTER TYPE project_stage RENAME TO project_stage_old;
CREATE TYPE project_stage AS ENUM('IDEA', 'PROTOTYPE', 'BUILD', 'PROJECT');
ALTER TABLE projects ALTER COLUMN stage TYPE project_stage USING stage::text::project_stage;
DROP TYPE project_stage_old;

-- 3. Enhance Quests with timing and categories
ALTER TABLE quests
ADD COLUMN available_from TIMESTAMP NOT NULL DEFAULT NOW(),
ADD COLUMN due_date TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '7 days',
ADD COLUMN category TEXT,
ADD COLUMN difficulty TEXT;

-- 4. Enhance UserQuests with proof-of-work submission
ALTER TABLE user_quests
ADD COLUMN submission_text TEXT,
ADD COLUMN submission_urls TEXT[] DEFAULT '{}';

-- Update user quest status enum
ALTER TYPE user_quest_status RENAME TO user_quest_status_old;
CREATE TYPE user_quest_status AS ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');
ALTER TABLE user_quests ALTER COLUMN status TYPE user_quest_status USING status::text::user_quest_status;
DROP TYPE user_quest_status_old;

-- 5. Enhance UserBadges with earning context
ALTER TABLE user_badges
ADD COLUMN earned_from TEXT;

-- 6. Enhance ProgramUsers with track tracking
ALTER TABLE program_users
ADD COLUMN track TEXT DEFAULT 'professional';

-- 7. Create Mentorships table
CREATE TABLE mentorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  session_notes JSONB,
  mentor_rating INTEGER CHECK (mentor_rating >= 1 AND mentor_rating <= 5),
  participant_rating INTEGER CHECK (participant_rating >= 1 AND participant_rating <= 5),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_mentorship UNIQUE(mentor_id, participant_id)
);

-- 8. Add mentorship relations
CREATE INDEX idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX idx_mentorships_participant_id ON mentorships(participant_id);
CREATE INDEX idx_mentorships_status ON mentorships(status);

-- 9. Update rewards table structure (if needed)
ALTER TABLE rewards
MODIFY COLUMN reason TEXT NOT NULL;

-- 10. Add helpful indexes for performance
CREATE INDEX idx_user_quests_status ON user_quests(status);
CREATE INDEX idx_user_quests_user_id ON user_quests(user_id);
CREATE INDEX idx_programs_status ON programs(status);
CREATE INDEX idx_programs_start_date ON programs(start_date);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
```

### 8.2 Platform TypeScript Interfaces

```typescript
// Type definitions for Jam platform MVP within Frutero App

// Users and Authentication
interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Profile {
  id: string;
  firstName?: string;
  lastName?: string;
  cityRegion?: string;
  country?: string;
  primaryRole?: string;
  isStudent: boolean;
  discordUsername?: string;
  farcasterUsername?: string;
  githubUsername?: string;
  xUsername?: string;
  telegramUsername?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Projects
interface Project {
  id: string;
  name: string;
  description: string;
  category?: string;
  stage: 'IDEA' | 'PROTOTYPE' | 'BUILD' | 'PROJECT';
  repositoryUrl?: string;
  videoUrl?: string;
  productionUrl?: string;
  pitchDeckUrl?: string;
  website?: string;
  githubUsername?: string;
  xUsername?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// External Programs
interface Program {
  id: string;
  name: string;
  description?: string;
  organizer: string;
  website?: string;
  applicationUrl?: string;
  startDate: Date;
  endDate: Date;
  submissionDeadline?: Date;
  category?: string;
  tracks: string[];
  totalPrizes?: number;
  theme?: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Quest System
interface Quest {
  id: string;
  title: string;
  description: string;
  category?: string;
  difficulty?: string;
  rewardPoints: number;
  availableFrom: Date;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface UserQuest {
  id: string;
  userId: string;
  questId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  progress: number; // 0-100
  submissionText?: string;
  submissionUrls: string[];
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Mentorship
interface Mentorship {
  id: string;
  mentorId: string;
  participantId: string;
  status: 'active' | 'completed' | 'paused';
  sessionNotes?: SessionNote[];
  mentorRating?: number; // 1-5
  participantRating?: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

interface SessionNote {
  date: Date;
  duration?: number;
  summary: string;
  objectives?: string[];
  outcomes?: string[];
  nextSteps?: string[];
}

// Program Participation
interface ProgramUser {
  id: string;
  programId: string;
  userId: string;
  track: 'founder' | 'professional' | 'freelancer';
  status: 'active' | 'completed' | 'withdrawn';
  joinedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Build in Public
interface Post {
  id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  tags: string[];
  viewCount: number;
  authorId: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Rewards and Badges
interface Badge {
  id: string;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  pointValue: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedFrom?: string;
  earnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Reward {
  id: string;
  userId: string;
  amount: number;
  reason: string;
  questId?: string;
  badgeId?: string;
  createdAt: Date;
}

// API Response Types
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Onboarding Flow
interface OnboardingData {
  profile: Partial<Profile>;
  project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
  track: 'founder' | 'professional' | 'freelancer';
  goals: string[];
}
```

### 8.3 Platform Component Props

```typescript
// Platform component prop interfaces for type safety

// Onboarding Components
interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  initialData?: Partial<OnboardingData>;
}

interface ProjectRegistrationProps {
  onSubmit: (project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  initialProject?: Partial<Project>;
}

interface TrackSelectionProps {
  selectedTrack?: string;
  onSelect: (track: 'founder' | 'professional' | 'freelancer') => void;
}

// Platform Dashboard Components
interface JamPlatformDashboardProps {
  user: User;
  activeQuests: UserQuest[];
  mentorships: Mentorship[];
  externalPrograms: Program[];
}

interface QuestTrackerProps {
  quests: UserQuest[];
  onQuestClick: (questId: string) => void;
}

// Quest Components
interface QuestListProps {
  quests: Quest[];
  userQuests: UserQuest[];
  onQuestSelect: (quest: Quest) => void;
}

interface QuestSubmissionProps {
  quest: Quest;
  userQuest: UserQuest;
  onSubmit: (submission: {
    progress: number;
    submissionText?: string;
    submissionUrls: string[];
  }) => void;
}

// Mentorship Components
interface MentorDirectoryProps {
  mentors: User[];
  onMentorSelect: (mentor: User) => void;
  filters?: {
    expertise?: string[];
    availability?: string;
    track?: string;
  };
}

interface ConnectionRequestProps {
  mentor: User;
  participant: User;
  onSubmit: (message: string) => void;
}

// Program Components
interface ProgramDirectoryProps {
  programs: Program[];
  onProgramSelect: (program: Program) => void;
  filters?: {
    category?: string;
    tracks?: string[];
    status?: string;
  };
}

interface ProgramCardProps {
  program: Program;
  isEnrolled?: boolean;
  onEnroll?: (programId: string) => void;
  onClick?: () => void;
}

// Community Components
interface BuildInPublicEditorProps {
  onSubmit: (post: {
    title: string;
    content: string;
    tags: string[];
    projectId?: string;
  }) => void;
  initialPost?: Partial<Post>;
}

interface CommunityFeedProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
  onLoadMore?: () => void;
}

// Reward Components
interface RewardHistoryProps {
  rewards: Reward[];
  totalBalance: number;
}

interface BadgeDisplayProps {
  badges: UserBadge[];
  earnedBadges: Badge[];
  availableBadges: Badge[];
}
```

This comprehensive implementation plan provides complete coverage of all PRD requirements for building the Jam platform MVP within the Frutero App. The platform will power the Frutero Jam 6-week mentorship program as its first use case, while being designed to support additional mentorship programs in the future. The approach prioritizes shipping functional platform features quickly and iterating based on real feedback from program participants.