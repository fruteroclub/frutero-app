import { ProfileFormValues } from '@/server/schema/user-services-schema'
import { ServiceResponse, UserExtended } from '@/types/api-v1'
import { handleResponse } from '@/lib/utils'

export async function getAllUsers(authToken?: string) {
  if (!authToken) {
    return {
      users: [],
      error: new Error('No auth token provided'),
      errorMsg: 'No auth token provided',
    }
  }
  try {
    const res = await fetch(`/api/users`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    const { users } = await res.json()

    return {
      users: users as UserExtended[],
    }
  } catch (error) {
    console.error(error)
    return {
      users: [],
      error: error as Error,
      errorMsg: String(error),
    }
  }
}

export async function getUserById(
  id: string,
): Promise<ServiceResponse<UserExtended>> {
  try {
    console.log('getUserById in service', id)
    const response = await fetch(`/api/users/${id}`)

    return handleResponse<UserExtended>(response)
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Network or unexpected error fetching user by id'
    console.error('getUserById Error:', error)
    return {
      success: false,
      error: new Error(message),
      errorMsg: message,
      data: undefined,
    }
  }
}

export async function updateUser(id: string, data: Partial<UserExtended>) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    const { user } = await res.json()

    return {
      user: user as UserExtended,
    }
  } catch (error) {
    console.error(error)
    return {
      user: null,
      error: error as Error,
      errorMsg: String(error),
    }
  }
}

export async function updateUserFarcasterAccount(
  id: string,
  farcasterId: number,
  farcasterDisplayName: string,
  farcasterUsername: string,
  farcasterAvatarUrl: string,
): Promise<{
  user: UserExtended | null
  error?: Error | null
  errorMsg?: string
}> {
  try {
    const res = await fetch(`/api/users/${id}/farcaster`, {
      method: 'PATCH',
      body: JSON.stringify({
        farcasterId,
        farcasterDisplayName,
        farcasterUsername,
        farcasterAvatarUrl,
      }),
    })

    const { user } = await res.json()

    return {
      user: user as UserExtended,
    }
  } catch (error) {
    console.error(error)
    return {
      user: null,
      error: error as Error,
      errorMsg: String(error),
    }
  }
}

export async function updateUserProfile(
  id: string,
  data: Partial<ProfileFormValues>,
) {
  try {
    const res = await fetch(`/api/users/${id}/profile`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    const { user } = await res.json()

    return {
      user: user as UserExtended,
    }
  } catch (error) {
    console.error(error)
    return {
      user: null,
      error: error as Error,
      errorMsg: String(error),
    }
  }
}
