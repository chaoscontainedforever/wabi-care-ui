"use client"

import { useSchedulingSuggestions } from "@/hooks/useScheduling"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Loader2, Sparkles } from "lucide-react"

interface SchedulingSummaryCardProps {
  onOpenWorkspace: () => void
}

export function SchedulingSummaryCard({ onOpenWorkspace }: SchedulingSummaryCardProps) {
  const { suggestions, loading } = useSchedulingSuggestions()
  const nextSuggestion = suggestions[0]

  return (
    <Card className="shadow-none border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Scheduling Assistant</span>
          <Badge variant="secondary" className="text-xs">Preview</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            {loading ? (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading next suggestion…</span>
              </div>
            ) : nextSuggestion ? (
              <>
                <p className="text-sm font-medium">{nextSuggestion.student}</p>
                <p className="text-xs text-muted-foreground">Suggested with {nextSuggestion.therapist}</p>
                <p className="text-xs text-muted-foreground">{new Date(nextSuggestion.suggested_time).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{nextSuggestion.rationale}</p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No suggestions available. Sync data collection to generate insights.</p>
            )}
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={onOpenWorkspace}>
          <Sparkles className="h-4 w-4 mr-2" /> Open Scheduling Workspace
        </Button>
      </CardContent>
    </Card>
  )
}
