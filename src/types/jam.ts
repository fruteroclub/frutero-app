export type ProjectStage =
  | 'IDEA'
  | 'PROTOTYPE'
  | 'BUILD'
  | 'PROJECT'
  | 'INCUBATE'
  | 'ACCELERATE'
  | 'SCALE'

export interface QuestStats {
  completed: number
  total: number
  percentComplete: number
  individualCompleted: number
  teamCompleted: number
}

export interface ProjectInfo {
  id: string
  slug: string
  name: string
  stage: ProjectStage
  memberCount: number
  members: Array<{
    id: string
    displayName: string
    avatarUrl: string | null
  }>
}

export interface MentorshipInfo {
  id: string
  mentorName: string
  mentorAvatar: string | null
  nextSession: Date | null
  sessionsCompleted: number
  status: 'active' | 'paused' | 'completed'
}

export interface Deadline {
  id: string
  title: string
  dueDate: Date
  type: 'quest' | 'program'
  questId?: string
  programId?: string
}

export interface Activity {
  id: string
  type:
    | 'quest_completed'
    | 'project_updated'
    | 'mentor_session'
    | 'post_created'
  description: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

export interface DashboardStats {
  quests: QuestStats
  project: ProjectInfo | null
  mentorship: MentorshipInfo | null
  deadlines: Deadline[]
  recentActivities: Activity[]
}
