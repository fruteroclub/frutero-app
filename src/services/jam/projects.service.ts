/**
 * Projects Service
 * Frontend service layer for project API calls
 */

export interface Project {
  id: string
  name: string
  slug: string
  description: string
  category?: string
  stage: string
  adminId: string
  website?: string
  walletAddress?: string
  // New hackathon fields
  repositoryUrl?: string
  videoUrl?: string
  productionUrl?: string
  pitchDeckUrl?: string
  avatarUrl?: string
  xUsername?: string
  // Member count for display
  members?: { userId: string; role: string }[]
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  userId: string
  role: 'ADMIN' | 'MEMBER'
  joinedAt: string
}

export interface CreateProjectData {
  name: string
  description: string
  category?: string
  stage?: string
  walletAddress?: string
  website?: string
  adminId: string
}

export interface UpdateProjectData {
  id: string
  adminId: string
  name?: string
  description?: string
  category?: string
  stage?: string
  walletAddress?: string
  website?: string
}

/**
 * Get all projects
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/jam/projects')

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch projects' }))
      throw new Error(error.error || 'Failed to fetch projects')
    }

    return res.json()
  } catch (error) {
    console.error('Projects fetch error:', error)
    throw error
  }
}

/**
 * Get user's projects
 */
export async function getUserProjects(userId: string): Promise<Project[]> {
  try {
    const res = await fetch(`/api/jam/projects?userId=${userId}`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch user projects' }))
      throw new Error(error.error || 'Failed to fetch user projects')
    }

    return res.json()
  } catch (error) {
    console.error('User projects fetch error:', error)
    throw error
  }
}

/**
 * Get project by slug
 */
export async function getProject(slug: string): Promise<Project | null> {
  try {
    const res = await fetch(`/api/jam/projects/${slug}`)

    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch project' }))
      throw new Error(error.error || 'Failed to fetch project')
    }

    return res.json()
  } catch (error) {
    console.error('Project fetch error:', error)
    throw error
  }
}

/**
 * Create new project
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
  try {
    const res = await fetch('/api/jam/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to create project' }))
      throw new Error(error.error || 'Failed to create project')
    }

    return res.json()
  } catch (error) {
    console.error('Project creation error:', error)
    throw error
  }
}

/**
 * Update project
 */
export async function updateProject(data: UpdateProjectData): Promise<Project> {
  try {
    const res = await fetch('/api/jam/projects', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to update project' }))
      throw new Error(error.error || 'Failed to update project')
    }

    return res.json()
  } catch (error) {
    console.error('Project update error:', error)
    throw error
  }
}

/**
 * Get project members
 */
export async function getProjectMembers(slug: string): Promise<ProjectMember[]> {
  try {
    const res = await fetch(`/api/jam/projects/${slug}/members`)

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to fetch members' }))
      throw new Error(error.error || 'Failed to fetch members')
    }

    return res.json()
  } catch (error) {
    console.error('Members fetch error:', error)
    throw error
  }
}

/**
 * Add project member
 */
export async function addProjectMember(
  slug: string,
  userId: string,
  role: 'ADMIN' | 'MEMBER' = 'MEMBER'
): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/jam/projects/${slug}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to add member' }))
      throw new Error(error.error || 'Failed to add member')
    }

    return res.json()
  } catch (error) {
    console.error('Add member error:', error)
    throw error
  }
}

/**
 * Update member role
 */
export async function updateMemberRole(
  slug: string,
  userId: string,
  role: 'ADMIN' | 'MEMBER'
): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/jam/projects/${slug}/members/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to update role' }))
      throw new Error(error.error || 'Failed to update role')
    }

    return res.json()
  } catch (error) {
    console.error('Update role error:', error)
    throw error
  }
}

/**
 * Remove project member
 */
export async function removeMember(
  slug: string,
  userId: string
): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`/api/jam/projects/${slug}/members/${userId}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to remove member' }))
      throw new Error(error.error || 'Failed to remove member')
    }

    return res.json()
  } catch (error) {
    console.error('Remove member error:', error)
    throw error
  }
}
