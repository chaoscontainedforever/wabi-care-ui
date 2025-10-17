"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useSchedulingSuggestions, useSchedulingCalendar } from "@/hooks/useScheduling"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import type { ViewMode } from "@/components/ui/view-mode-toggle"

interface SchedulingWorkspaceProps {
  variant?: "sheet" | "full"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  viewMode?: ViewMode
}

export function SchedulingWorkspace({ variant = "sheet", open = false, onOpenChange, viewMode = "cards" }: SchedulingWorkspaceProps) {
  const { suggestions, loading } = useSchedulingSuggestions()
  const { entries: calendarEntries, loading: calendarLoading } = useSchedulingCalendar()
  const [activeTab, setActiveTab] = useState("suggestions")

  const content = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
      </TabsList>

      <TabsContent value="suggestions" className="pt-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading suggestions…</p>
        ) : suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No suggestions available yet.</p>
        ) : (
          <div className={viewMode === "cards" ? "grid gap-4 md:grid-cols-2" : "space-y-3"}>
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className="border border-muted/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    <span>{suggestion.student}</span>
                    <Badge variant="outline">AI Suggestion</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Therapist:</span>
                    <Badge variant="outline">{suggestion.therapist}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Proposed:</span>
                    <span>{new Date(suggestion.suggested_time).toLocaleString()}</span>
                  </div>
                  <p>{suggestion.rationale}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" className={viewMode === "list" ? "w-full" : ""}>
                      <X className="h-4 w-4 mr-1" /> Decline
                    </Button>
                    <Button size="sm" className={viewMode === "list" ? "w-full" : ""}>
                      <Check className="h-4 w-4 mr-1" /> Accept & Notify
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="calendar" className="pt-4 space-y-3 text-sm text-muted-foreground">
        <p>Calendar integration displays shared availability and connected Outlook schedules.</p>
        <Card className="border border-muted/60">
          <CardContent className="p-4 space-y-4">
            {calendarLoading ? (
              <p className="text-sm text-muted-foreground">Loading calendar…</p>
            ) : (
              <>
                <Calendar
                  currentDate={new Date()}
                  events={calendarEntries}
                  getEventDate={(event) => new Date(event.start)}
                  getEventKey={(event) => event.id}
                  renderEvent={(event) => (
                    <div className="space-y-1 text-left">
                      <p className="font-medium text-foreground">{event.student}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(event.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                        {new Date(event.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <p className="text-[11px] text-muted-foreground">Therapist: {event.therapist}</p>
                    </div>
                  )}
                />
                {calendarEntries.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center">
                    No sessions scheduled for this month. Use the suggestions tab to accept upcoming sessions.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="requests" className="pt-4 space-y-3 text-sm text-muted-foreground">
        <p>Requests from staff or families will be listed here with quick actions.</p>
        <Card className="border-dashed border-muted">
          <CardContent className="text-center py-10">
            <p className="text-sm">No pending requests.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )

  if (variant === "full") {
    return (
      <div className="rounded-xl border border-muted bg-card shadow-sm p-6">
        {content}
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange ?? (() => {})}>
      <SheetContent side="right" className="max-w-4xl mx-auto w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Scheduling Assistant</SheetTitle>
          <SheetDescription>
            Review AI-generated scheduling options, view upcoming calendar, and respond to requests.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6">
          {content}
        </div>
      </SheetContent>
    </Sheet>
  )
}
