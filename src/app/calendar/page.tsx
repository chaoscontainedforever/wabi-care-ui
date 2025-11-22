"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Plus, Clock, Users, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { useSchedulingCalendar } from "@/hooks/useScheduling"
import { format, addMonths, subMonths, isToday, isSameDay, startOfDay } from "date-fns"
import { Badge } from "@/components/ui/badge"
import PageLayout from "@/components/PageLayout"
import Link from "next/link"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { entries, loading } = useSchedulingCalendar()

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1))
  }

  const todayEvents = useMemo(() => {
    return entries.filter(entry => isSameDay(new Date(entry.start), new Date()))
  }, [entries])

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return entries
      .filter(entry => new Date(entry.start) > now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 5)
  }, [entries])

  const getEventDate = (event: any) => new Date(event.start)
  const getEventKey = (event: any, index: number) => `${event.id}-${index}`
  const renderEvent = (event: any) => (
    <div className="flex items-center justify-between">
      <span className="truncate">{event.student}</span>
      <Badge 
        variant={event.status === 'confirmed' ? 'default' : event.status === 'suggested' ? 'secondary' : 'outline'}
        className="ml-2 text-xs"
      >
        {event.status}
      </Badge>
    </div>
  )

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-end gap-2">
          <Link href="/scheduling">
            <Button variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Scheduling Assistant
            </Button>
          </Link>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Session
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      Calendar View
                    </CardTitle>
                    <CardDescription>
                      Schedule and track student sessions and assessments
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('prev')}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigateMonth('next')}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    Loading calendar...
                  </div>
                ) : (
                  <Calendar
                    currentDate={currentDate}
                    events={entries}
                    getEventDate={getEventDate}
                    getEventKey={getEventKey}
                    renderEvent={renderEvent}
                    className="h-auto"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today&apos;s Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : todayEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events scheduled for today</p>
                ) : (
                  <div className="space-y-3">
                    {todayEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.student}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.start), "h:mm a")} - {format(new Date(event.end), "h:mm a")}
                          </p>
                          <p className="text-xs text-muted-foreground">with {event.therapist}</p>
                        </div>
                        <Badge 
                          variant={event.status === 'confirmed' ? 'default' : event.status === 'suggested' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{event.student}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(event.start), "MMM d, h:mm a")}
                          </p>
                          <p className="text-xs text-muted-foreground">with {event.therapist}</p>
                        </div>
                        <Badge 
                          variant={event.status === 'confirmed' ? 'default' : event.status === 'suggested' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
