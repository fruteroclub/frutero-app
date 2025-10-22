'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProfileData {
  firstName?: string
  lastName?: string
  cityRegion?: string
  country?: string
  primaryRole?: string
  isStudent?: boolean
  githubUsername?: string
  discordUsername?: string
  xUsername?: string
  telegramUsername?: string
}

interface ProfileStepProps {
  data: ProfileData
  onUpdate: (data: ProfileData) => void
  onNext: () => void
  onBack: () => void
}

export function ProfileStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: ProfileStepProps) {
  const [formData, setFormData] = useState<ProfileData>(data)

  const handleChange = (field: keyof ProfileData, value: string | boolean) => {
    const updated = { ...formData, [field]: value }
    setFormData(updated)
    onUpdate(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName) {
      alert('Please enter your first name')
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Tell Us About Yourself</h2>
        <p className="text-foreground">
          Help us personalize your JAM experience
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Juan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cityRegion">City / Region</Label>
              <Input
                id="cityRegion"
                value={formData.cityRegion || ''}
                onChange={(e) => handleChange('cityRegion', e.target.value)}
                placeholder="Ciudad de México"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country || ''}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="México"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryRole">What do you do?</Label>
            <Input
              id="primaryRole"
              value={formData.primaryRole || ''}
              onChange={(e) => handleChange('primaryRole', e.target.value)}
              placeholder="Full-stack Developer, Product Designer, etc."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isStudent"
              checked={formData.isStudent || false}
              onCheckedChange={(checked) =>
                handleChange('isStudent', checked as boolean)
              }
            />
            <Label htmlFor="isStudent" className="text-sm font-normal">
              I&apos;m currently a student
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connect Your Socials (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="githubUsername">GitHub</Label>
              <Input
                id="githubUsername"
                value={formData.githubUsername || ''}
                onChange={(e) => handleChange('githubUsername', e.target.value)}
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discordUsername">Discord</Label>
              <Input
                id="discordUsername"
                value={formData.discordUsername || ''}
                onChange={(e) =>
                  handleChange('discordUsername', e.target.value)
                }
                placeholder="username"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="xUsername">X (Twitter)</Label>
              <Input
                id="xUsername"
                value={formData.xUsername || ''}
                onChange={(e) => handleChange('xUsername', e.target.value)}
                placeholder="@username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegramUsername">Telegram</Label>
              <Input
                id="telegramUsername"
                value={formData.telegramUsername || ''}
                onChange={(e) =>
                  handleChange('telegramUsername', e.target.value)
                }
                placeholder="@username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  )
}
