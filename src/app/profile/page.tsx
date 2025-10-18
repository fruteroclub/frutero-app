'use client'

import PageWrapper from '@/components/layout/page-wrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useMutation } from '@tanstack/react-query'
import { updateUser, updateUserProfile } from '@/services/users-services'
import { toast } from 'sonner'
import {
  profileFormSchema,
  ProfileFormValues,
  userAccountFormSchema,
  UserAccountFormValues,
} from '@/server/schema/user-services-schema'
import { Checkbox } from '@/components/ui/checkbox'
import { ProtectedRoute } from '@/components/layout/protected-route-wrapper'
import { useAppAuth } from '@/store/auth-context'

export default function Profile() {
  const { login, user } = useAppAuth()

  const { mutateAsync: updateUserAccount, status: updateUserAccountStatus } =
    useMutation({
      mutationFn: async (data: UserAccountFormValues) => {
        if (!user?.id) {
          throw new Error('User ID is required')
        }
        return await updateUser(user.id, data)
      },
      onSuccess: ({ user }) => {
        if (user) {
          // Convert UserExtended to UserWithProfile (profile?: Profile -> profile: Profile | null)
          const userWithProfile = {
            ...user,
            profile: user.profile ?? null,
            metadata: (user.metadata as Record<string, unknown>) ?? null,
          }
          login(userWithProfile)
          toast.success('Profile updated successfully')
        }
      },
      onError: () => {
        toast.error('Failed to update profile')
      },
    })

  const { mutateAsync: updateProfile, status: updateProfileStatus } =
    useMutation({
      mutationFn: async (data: ProfileFormValues) => {
        if (!user?.id) {
          throw new Error('User ID is required')
        }
        return await updateUserProfile(user.id, data)
      },
      onSuccess: ({ user }) => {
        if (user) {
          // Convert UserExtended to UserWithProfile (profile?: Profile -> profile: Profile | null)
          const userWithProfile = {
            ...user,
            profile: user.profile ?? null,
            metadata: (user.metadata as Record<string, unknown>) ?? null,
          }
          login(userWithProfile)
          toast.success('Profile updated successfully')
        }
      },
      onError: () => {
        toast.error('Failed to update profile')
      },
    })

  // Initialize form with user data
  const userForm = useForm<UserAccountFormValues>({
    resolver: zodResolver(userAccountFormSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      website: user?.website || '',
    },
  })

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      cityRegion: user?.profile?.cityRegion || '',
      country: user?.profile?.country || '',
      primaryRole: user?.profile?.primaryRole || '',
      professionalProfile: user?.profile?.professionalProfile || '',
      isStudent: user?.profile?.isStudent || false,
    },
  })

  async function onSubmitUserAccountHandler(data: UserAccountFormValues) {
    try {
      await updateUserAccount(data)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  async function onSubmitProfileHandler(data: ProfileFormValues) {
    try {
      await updateProfile(data)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  useEffect(() => {
    if (user) {
      userForm.reset({
        displayName: user.displayName || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
      })
    }
    if (user?.profile) {
      profileForm.reset({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        cityRegion: user.profile.cityRegion || '',
        country: user.profile.country || '',
        primaryRole: user.profile.primaryRole || '',
        professionalProfile: user.profile.professionalProfile || '',
        isStudent: user.profile.isStudent || false,
      })
    }
  }, [user, userForm, profileForm])

  return (
    <ProtectedRoute>
      <PageWrapper>
        <div className="page">
          <div className="container flex flex-col items-center gap-y-8 pb-12 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
            <h2>Profile</h2>

            <div className="w-full px-2 md:flex md:justify-center">
              <Card className="flex w-full items-center gap-x-4 p-6 md:w-2/3 md:px-8 lg:px-12 xl:w-1/2">
                <div>
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={user?.avatarUrl ?? '/images/logos/reggie.png'}
                    />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0)}
                      {user?.displayName?.charAt(1)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Card>
            </div>

            <Tabs defaultValue="account" className="w-full px-2">
              <TabsList className="flex w-full justify-center gap-x-4">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <Card className="w-full">
                  <CardHeader className="flex-row items-center space-y-0 gap-x-4 pb-4 md:px-8">
                    <CardTitle className="font-stratos m-0 text-left text-xl font-normal">
                      Account{' '}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-y-4">
                    <Form {...userForm}>
                      <form
                        onSubmit={userForm.handleSubmit(
                          onSubmitUserAccountHandler,
                        )}
                        className="space-y-6"
                      >
                        <FormField
                          control={userForm.control}
                          name="displayName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Display Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your display name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="your@email.com"
                                  type="email"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormDescription>
                                Your email address will not be shared publicly
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about yourself"
                                  className="resize-none"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormDescription>
                                Share your bio with the community
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={userForm.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="https://your-website.com"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-center py-4">
                          <Button
                            type="submit"
                            disabled={updateUserAccountStatus === 'pending'}
                          >
                            {updateUserAccountStatus === 'pending'
                              ? 'Updating...'
                              : 'Update Account'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="profile">
                <Card className="w-full">
                  <CardHeader className="flex-row items-center space-y-0 gap-x-4 pb-4 md:px-8">
                    <CardTitle className="font-stratos m-0 text-left text-xl font-normal">
                      Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-y-4">
                    <Form {...profileForm}>
                      <form
                        onSubmit={profileForm.handleSubmit(
                          onSubmitProfileHandler,
                        )}
                        className="space-y-6"
                      >
                        <FormField
                          control={profileForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your first name"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your last name"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="cityRegion"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City/Region</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your city or region"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your country"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="primaryRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Role</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your primary role"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="professionalProfile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Profile</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell us about your professional background"
                                  className="resize-none"
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormDescription>
                                Share your professional experience and skills
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="isStudent"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>Student Status</FormLabel>
                                <FormDescription>
                                  Check this if you are currently a student
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-center py-4">
                          <Button
                            type="submit"
                            disabled={updateProfileStatus === 'pending'}
                          >
                            {updateProfileStatus === 'pending'
                              ? 'Updating...'
                              : 'Update Profile'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageWrapper>
    </ProtectedRoute>
  )
}
