"use client"

import { useAuth } from "@/contexts/AuthContext"
import { PageLayout } from "@/components/PageLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Calendar, Shield } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <PageLayout
        breadcrumbs={[
          { label: "Profile" }
        ]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout
      breadcrumbs={[
        { label: "Profile" }
      ]}
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                  alt={user.user_metadata?.full_name || user.email || "User"}
                />
                <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl">
                  {user.user_metadata?.full_name 
                    ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('')
                    : user.email?.[0]?.toUpperCase() || 'U'
                  }
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || "User"}
                </CardTitle>
                <CardDescription className="text-lg">
                  Teacher • Wabi Care Platform
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  defaultValue={user.user_metadata?.full_name || ""}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    defaultValue={user.email || ""}
                    className="pl-10"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                />
              </div>
              <Button className="w-full">
                Update Personal Information
              </Button>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Manage your account settings and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  defaultValue="Teacher"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="school">School/Organization</Label>
                <Input
                  id="school"
                  placeholder="Enter your school or organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Member Since</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="joinDate"
                    defaultValue={new Date(user.created_at).toLocaleDateString()}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Security</Label>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    Two-Factor Authentication
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Customize your Wabi Care experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Light</Button>
                  <Button variant="outline" size="sm">Dark</Button>
                  <Button variant="outline" size="sm">System</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Input defaultValue="English" />
              </div>
            </div>
            <Button className="w-full">
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
