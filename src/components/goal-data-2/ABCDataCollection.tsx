"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, X, Clock, AlertTriangle } from "lucide-react"
import { format } from "date-fns"

export interface ABCData {
  id: string
  timestamp: number
  antecedent: string
  behavior: string
  consequence: string
  intensity: "low" | "moderate" | "high"
  notes?: string
}

interface ABCDataCollectionProps {
  abcEntries: ABCData[]
  onAddEntry: (entry: Omit<ABCData, "id" | "timestamp">) => void
  onDeleteEntry?: (id: string) => void
  isVoiceActive?: boolean
}

// Common templates for quick entry
const commonAntecedents = [
  "Transition to new activity",
  "Task demand presented",
  "Attention removed",
  "Preferred item denied",
  "Loud/noisy environment",
  "Peer interaction",
  "Waiting/idle time"
]

const commonBehaviors = [
  "Crying",
  "Screaming",
  "Hitting",
  "Throwing items",
  "Elopement",
  "Self-injury",
  "Property destruction"
]

const commonConsequences = [
  "Attention provided",
  "Task removed",
  "Preferred item given",
  "Redirected",
  "Ignored",
  "Time out",
  "No response"
]

export function ABCDataCollection({ 
  abcEntries, 
  onAddEntry, 
  onDeleteEntry,
  isVoiceActive = false 
}: ABCDataCollectionProps) {
  const [antecedent, setAntecedent] = useState("")
  const [behavior, setBehavior] = useState("")
  const [consequence, setConsequence] = useState("")
  const [intensity, setIntensity] = useState<"low" | "moderate" | "high">("moderate")
  const [notes, setNotes] = useState("")
  const [showTemplates, setShowTemplates] = useState({
    antecedent: false,
    behavior: false,
    consequence: false
  })

  const handleSave = () => {
    if (!antecedent.trim() || !behavior.trim() || !consequence.trim()) {
      alert("Please fill in Antecedent, Behavior, and Consequence")
      return
    }

    onAddEntry({
      antecedent: antecedent.trim(),
      behavior: behavior.trim(),
      consequence: consequence.trim(),
      intensity,
      notes: notes.trim() || undefined
    })

    // Reset form
    setAntecedent("")
    setBehavior("")
    setConsequence("")
    setIntensity("moderate")
    setNotes("")
  }

  const handleTemplateSelect = (type: "antecedent" | "behavior" | "consequence", value: string) => {
    if (type === "antecedent") setAntecedent(value)
    if (type === "behavior") setBehavior(value)
    if (type === "consequence") setConsequence(value)
    setShowTemplates({ ...showTemplates, [type]: false })
  }

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high": return "bg-red-100 text-red-800 border-red-300"
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low": return "bg-green-100 text-green-800 border-green-300"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* ABC Entry Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">ABC Data Collection</CardTitle>
            {isVoiceActive && (
              <Badge variant="outline" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Voice Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Antecedent */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="antecedent" className="text-sm font-semibold">
                A - Antecedent <span className="text-muted-foreground">(What happened before?)</span>
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates({ ...showTemplates, antecedent: !showTemplates.antecedent })}
                className="h-7 text-xs"
              >
                Templates
              </Button>
            </div>
            {showTemplates.antecedent && (
              <div className="p-2 bg-muted rounded-lg space-y-1 max-h-32 overflow-y-auto">
                {commonAntecedents.map((template) => (
                  <button
                    key={template}
                    onClick={() => handleTemplateSelect("antecedent", template)}
                    className="w-full text-left px-2 py-1 text-xs hover:bg-background rounded"
                  >
                    {template}
                  </button>
                ))}
              </div>
            )}
            <Textarea
              id="antecedent"
              placeholder="Describe what happened immediately before the behavior..."
              value={antecedent}
              onChange={(e) => setAntecedent(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Behavior */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="behavior" className="text-sm font-semibold">
                B - Behavior <span className="text-muted-foreground">(What did the student do?)</span>
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates({ ...showTemplates, behavior: !showTemplates.behavior })}
                className="h-7 text-xs"
              >
                Templates
              </Button>
            </div>
            {showTemplates.behavior && (
              <div className="p-2 bg-muted rounded-lg space-y-1 max-h-32 overflow-y-auto">
                {commonBehaviors.map((template) => (
                  <button
                    key={template}
                    onClick={() => handleTemplateSelect("behavior", template)}
                    className="w-full text-left px-2 py-1 text-xs hover:bg-background rounded"
                  >
                    {template}
                  </button>
                ))}
              </div>
            )}
            <Textarea
              id="behavior"
              placeholder="Describe the specific, observable behavior..."
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Consequence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="consequence" className="text-sm font-semibold">
                C - Consequence <span className="text-muted-foreground">(What happened after?)</span>
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplates({ ...showTemplates, consequence: !showTemplates.consequence })}
                className="h-7 text-xs"
              >
                Templates
              </Button>
            </div>
            {showTemplates.consequence && (
              <div className="p-2 bg-muted rounded-lg space-y-1 max-h-32 overflow-y-auto">
                {commonConsequences.map((template) => (
                  <button
                    key={template}
                    onClick={() => handleTemplateSelect("consequence", template)}
                    className="w-full text-left px-2 py-1 text-xs hover:bg-background rounded"
                  >
                    {template}
                  </button>
                ))}
              </div>
            )}
            <Textarea
              id="consequence"
              placeholder="Describe what happened immediately after the behavior..."
              value={consequence}
              onChange={(e) => setConsequence(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          {/* Intensity and Notes */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="intensity">Intensity</Label>
              <Select value={intensity} onValueChange={(value: "low" | "moderate" | "high") => setIntensity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                placeholder="Additional context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Record Button */}
          <Button
            onClick={handleSave}
            disabled={!antecedent.trim() || !behavior.trim() || !consequence.trim()}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600"
            size="lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Record ABC Entry
          </Button>
        </CardContent>
      </Card>

      {/* ABC History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent ABC Entries ({abcEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {abcEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No ABC entries recorded yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {abcEntries.map((entry) => (
                  <Card key={entry.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(entry.timestamp), "h:mm a")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getIntensityColor(entry.intensity)}>
                            {entry.intensity.toUpperCase()}
                          </Badge>
                          {onDeleteEntry && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteEntry(entry.id)}
                              className="h-6 w-6 p-0 text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold text-primary">A:</span>{" "}
                          <span>{entry.antecedent}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-primary">B:</span>{" "}
                          <span>{entry.behavior}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-primary">C:</span>{" "}
                          <span>{entry.consequence}</span>
                        </div>
                        {entry.notes && (
                          <div className="pt-2 border-t text-xs text-muted-foreground">
                            <span className="font-medium">Notes:</span> {entry.notes}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

