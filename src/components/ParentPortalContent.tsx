"use client"

import * as React from "react"
import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavigationBar } from "@/components/TopNavigationBar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  TrendingUp,
  Target,
  MessageSquare,
  FileText,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Download,
  Mail,
  Phone,
  Video,
  Star,
  BarChart3,
  Users,
  Heart,
  GraduationCap,
  UploadCloud
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import Link from "next/link"

// Mock data - in production, this would come from API
const mockChildData = {
  name: "Emma Johnson",
  age: 8,
  grade: "3rd Grade",
  profilePicture: null,
  therapist: {
    name: "Sarah Martinez, BCBA",
    email: "sarah.martinez@wabicare.com",
    phone: "(555) 123-4567"
  },
  currentGoals: [
    {
      id: "1",
      title: "Social Interaction Skills",
      category: "Social",
      progress: 75,
      status: "active",
      description: "Improve peer interaction and communication"
    },
    {
      id: "2",
      title: "Following Multi-Step Instructions",
      category: "Academic",
      progress: 60,
      status: "active",
      description: "Follow 3-step instructions independently"
    },
    {
      id: "3",
      title: "Emotional Regulation",
      category: "Behavioral",
      progress: 45,
      status: "active",
      description: "Use coping strategies when frustrated"
    }
  ],
  upcomingSessions: [
    {
      id: "1",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      time: "10:00 AM",
      duration: "60 min",
      therapist: "Sarah Martinez, BCBA",
      type: "In-Person"
    },
    {
      id: "2",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: "2:00 PM",
      duration: "60 min",
      therapist: "Sarah Martinez, BCBA",
      type: "In-Person"
    },
    {
      id: "3",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      time: "10:00 AM",
      duration: "60 min",
      therapist: "Sarah Martinez, BCBA",
      type: "In-Person"
    }
  ],
  recentSessions: [
    {
      id: "1",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      therapist: "Sarah Martinez, BCBA",
      summary: "Great session today! Emma worked on following 2-step instructions and showed excellent progress. She engaged well with the social skills activities.",
      goalsWorkedOn: ["Following Multi-Step Instructions", "Social Interaction Skills"],
      achievements: ["Completed 8/10 trials independently", "Used coping strategy when frustrated"]
    },
    {
      id: "2",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      therapist: "Sarah Martinez, BCBA",
      summary: "Emma practiced emotional regulation techniques and demonstrated improved self-awareness. She identified her emotions correctly 7 out of 8 times.",
      goalsWorkedOn: ["Emotional Regulation", "Social Interaction Skills"],
      achievements: ["Used deep breathing independently", "Participated in group activity"]
    }
  ],
  progressStats: {
    totalSessions: 24,
    thisMonth: 8,
    averageAccuracy: 78,
    goalsCompleted: 2,
    goalsInProgress: 3
  },
  documents: [
    {
      id: "1",
      name: "Progress Report - January 2024",
      type: "PDF",
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      size: "2.4 MB"
    },
    {
      id: "2",
      name: "IEP Goals Update",
      type: "PDF",
      date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      size: "1.8 MB"
    },
    {
      id: "3",
      name: "Session Notes - Week 3",
      type: "DOCX",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      size: "456 KB"
    }
  ],
  resources: [
    {
      id: "1",
      title: "Understanding ABA Therapy",
      type: "Article",
      description: "Learn about Applied Behavior Analysis and how it helps your child"
    },
    {
      id: "2",
      title: "Supporting Your Child at Home",
      type: "Guide",
      description: "Strategies to reinforce therapy goals in daily activities"
    },
    {
      id: "3",
      title: "Communication Tips",
      type: "Video",
      description: "Ways to improve communication with your child"
    }
  ]
}

export default function ParentPortalContent() {
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "4.5rem",
          minHeight: 0,
        } as React.CSSProperties
      }
      className="flex flex-col h-screen w-full"
    >
      <div className="flex flex-col h-screen w-full">
        <TopNavigationBar breadcrumbs={[{ label: "Parent Portal" }]} />
        <div className="flex flex-1 overflow-hidden w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-6 py-6 max-w-7xl">
                <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Parent Portal</h1>
            <p className="text-muted-foreground">
              Stay connected with your child's therapy progress and team
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/parent-portal/intake">
              <UploadCloud className="h-4 w-4" />
              Complete Intake
            </Link>
          </Button>
        </div>

        {/* Child Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={mockChildData.profilePicture || undefined} alt={mockChildData.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  {mockChildData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-1">{mockChildData.name}</CardTitle>
                <CardDescription className="text-base">
                  {mockChildData.age} years old • {mockChildData.grade}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="gap-1">
                    <Heart className="h-3 w-3" />
                    Active Therapy
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Users className="h-3 w-3" />
                    {mockChildData.therapist.name}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Message
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sessions</p>
                  <p className="text-2xl font-bold">{mockChildData.progressStats.totalSessions}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{mockChildData.progressStats.thisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Accuracy</p>
                  <p className="text-2xl font-bold">{mockChildData.progressStats.averageAccuracy}%</p>
                </div>
                <Star className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{mockChildData.progressStats.goalsInProgress}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockChildData.upcomingSessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                          <span className="text-xs font-semibold text-primary">
                            {format(session.date, "MMM")}
                          </span>
                          <span className="text-lg font-bold text-primary">
                            {format(session.date, "d")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{format(session.date, "EEEE")}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.time} • {session.duration}
                          </p>
                          <p className="text-xs text-muted-foreground">{session.therapist}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{session.type}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockChildData.currentGoals.slice(0, 2).map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{goal.title}</span>
                        <span className="text-sm font-semibold text-primary">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <Badge variant="secondary" className="text-xs">
                        {goal.category}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Session Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Latest Session Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockChildData.recentSessions[0] && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {format(mockChildData.recentSessions[0].date, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          with {mockChildData.recentSessions[0].therapist}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {formatDistanceToNow(mockChildData.recentSessions[0].date, { addSuffix: true })}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {mockChildData.recentSessions[0].summary}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Goals Worked On:</p>
                      <div className="flex flex-wrap gap-2">
                        {mockChildData.recentSessions[0].goalsWorkedOn.map((goal, idx) => (
                          <Badge key={idx} variant="secondary">{goal}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Achievements:</p>
                      <ul className="space-y-1">
                        {mockChildData.recentSessions[0].achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>View all past and upcoming therapy sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockChildData.recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-lg border space-y-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {format(session.date, "EEEE, MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">{session.therapist}</p>
                      </div>
                      <Badge variant="outline">
                        {formatDistanceToNow(session.date, { addSuffix: true })}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed">{session.summary}</p>
                    <div className="flex flex-wrap gap-2">
                      {session.goalsWorkedOn.map((goal, idx) => (
                        <Badge key={idx} variant="secondary">{goal}</Badge>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {session.achievements.map((achievement, idx) => (
                        <div key={idx} className="text-sm flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-500" />
                          {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Goals</CardTitle>
                <CardDescription>Track your child's progress on therapy goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockChildData.currentGoals.map((goal) => (
                  <div key={goal.id} className="space-y-3 p-4 rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          <Badge variant="secondary">{goal.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm font-semibold text-primary">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Your Therapist</CardTitle>
                  <CardDescription>Get in touch with {mockChildData.therapist.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <Mail className="h-4 w-4" />
                      Send Email
                      <span className="ml-auto text-xs text-muted-foreground">{mockChildData.therapist.email}</span>
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <Phone className="h-4 w-4" />
                      Call Therapist
                      <span className="ml-auto text-xs text-muted-foreground">{mockChildData.therapist.phone}</span>
                    </Button>
                    <Button className="w-full justify-start gap-2" variant="outline">
                      <Video className="h-4 w-4" />
                      Schedule Video Call
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Quick Message</p>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Ask about today's session
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Request progress update
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Schedule meeting
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documents & Reports</CardTitle>
                  <CardDescription>Download important documents and reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockChildData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(doc.date, "MMM d, yyyy")} • {doc.size}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Educational Resources</CardTitle>
                <CardDescription>Helpful materials to support your child's therapy journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockChildData.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{resource.title}</p>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <Badge variant="outline" className="mt-1">{resource.type}</Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}

