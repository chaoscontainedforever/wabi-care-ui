"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

import type {
  ABCRecord,
  TaskAnalysisStep,
  TrialRecord,
  GoalSessionState,
} from "@/components/data-collection/types"

// Support both old and new prop patterns for backward compatibility
interface DiscreteTrialPanelProps {
  session?: GoalSessionState
  onRecord?: (outcome: "correct" | "incorrect", promptLevel?: string, note?: string) => void
  onPromptChange?: (promptLevel: string) => void
  history?: TrialRecord[]
  // Old props for backward compatibility
  onRecordCorrect?: () => void
  onRecordIncorrect?: () => void
  onIncrementPrompt?: () => void
  onDecrementPrompt?: () => void
  metrics?: { attempts: number; prompts: number; correct: number; incorrect: number }
}

export function DiscreteTrialPanel({ 
  session, 
  onRecord, 
  onPromptChange, 
  history,
  onRecordCorrect,
  onRecordIncorrect,
  metrics
}: DiscreteTrialPanelProps) {
  // Use new props if available, otherwise fall back to old pattern
  const useNewPattern = !!session && !!onRecord
  
  const currentSession = session || { 
    currentPrompt: "Independent", 
    totalAttempts: metrics?.attempts || 0, 
    correctCount: metrics?.correct || 0,
    incorrectCount: metrics?.incorrect || 0
  }
  const trialHistory = history || []
  
  const accuracy = useMemo(() => {
    if (currentSession.totalAttempts === 0) return 0
    return Math.round((currentSession.correctCount / currentSession.totalAttempts) * 100)
  }, [currentSession.totalAttempts, currentSession.correctCount])

  const handleCorrect = () => {
    if (useNewPattern && onRecord) {
      onRecord("correct")
    } else if (onRecordCorrect) {
      onRecordCorrect()
    }
  }

  const handleIncorrect = () => {
    if (useNewPattern && onRecord) {
      onRecord("incorrect")
    } else if (onRecordIncorrect) {
      onRecordIncorrect()
    }
  }

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Discrete Trial Data</CardTitle>
          {useNewPattern && onPromptChange && (
            <Select value={currentSession.currentPrompt} onValueChange={onPromptChange}>
              <SelectTrigger className="h-9 w-48">
                <SelectValue placeholder="Prompt Level" />
              </SelectTrigger>
              <SelectContent>
                {[currentSession.currentPrompt, "Independent", "Verbal", "Gestural", "Physical", "No Response"]
                  .filter((level, index, self) => !!level && self.indexOf(level) === index)
                  .map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="rounded-lg border bg-muted/40 py-3">
            <div className="text-lg font-bold text-primary">{currentSession.totalAttempts}</div>
            <div className="text-xs text-muted-foreground">Trials</div>
          </div>
          <div className="rounded-lg border bg-green-50 py-3">
            <div className="text-lg font-bold text-green-600">{currentSession.correctCount}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="rounded-lg border bg-red-50 py-3">
            <div className="text-lg font-bold text-red-500">{currentSession.incorrectCount}</div>
            <div className="text-xs text-muted-foreground">Incorrect</div>
          </div>
          <div className="rounded-lg border bg-blue-50 py-3">
            <div className="text-lg font-bold text-blue-600">{accuracy}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleCorrect} className="h-14 text-base font-semibold bg-green-500 hover:bg-green-600">
            ✓ Correct
          </Button>
          <Button onClick={handleIncorrect} variant="destructive" className="h-14 text-base font-semibold">
            ✗ Incorrect
          </Button>
        </div>

        {trialHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trial History</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {trialHistory.map((trial) => (
                <div
                  key={trial.id}
                  className="flex items-center justify-between rounded-lg border bg-background px-3 py-2"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant={trial.outcome === "correct" ? "secondary" : "destructive"}>
                      {trial.outcome === "correct" ? "Correct" : "Incorrect"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(trial.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>Prompt: {trial.promptLevel}</div>
                    {trial.notes && <div className="italic">{trial.notes}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface TaskAnalysisPanelProps {
  steps: TaskAnalysisStep[]
  onUpdateStep: (stepId: string, status: TaskAnalysisStep["status"]) => void
  onAddStep: (label: string) => void
  onRemoveStep: (stepId: string) => void
}

export function TaskAnalysisPanel({ steps, onUpdateStep, onAddStep, onRemoveStep }: TaskAnalysisPanelProps) {
  const [newStepLabel, setNewStepLabel] = useState("")

  const handleAdd = () => {
    if (!newStepLabel.trim()) return
    onAddStep(newStepLabel.trim())
    setNewStepLabel("")
  }

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="pb-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-sm font-semibold">Task Analysis Checklist</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            placeholder="New step..."
            className="h-8"
            value={newStepLabel}
            onChange={(e) => setNewStepLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <Button size="sm" variant="outline" onClick={handleAdd}>
            Add Step
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {steps.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No steps defined yet. Add steps to track independence across the chain.
          </p>
        )}
        {steps.map((step) => (
          <div key={step.id} className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2">
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{step.label}</div>
              <div className="text-xs text-muted-foreground">Track student performance for this step.</div>
            </div>
            <div className="flex items-center gap-1">
              {([
                { label: "Ind", value: "independent", color: "bg-green-500/10 text-green-600" },
                { label: "Prompt", value: "prompted", color: "bg-blue-500/10 text-blue-600" },
                { label: "Skip", value: "not_attempted", color: "bg-muted" },
              ] as const).map((option) => (
                <Button
                  key={option.value}
                  variant={step.status === option.value ? "default" : "outline"}
                  size="sm"
                  className={cn("h-8 px-2 text-xs", step.status === option.value ? option.color : undefined)}
                  onClick={() => onUpdateStep(step.id, option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <Button size="icon" variant="ghost" aria-label="Remove step" onClick={() => onRemoveStep(step.id)}>
              ×
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface FrequencyPanelProps {
  count: number
  history: { id: string; timestamp: number }[]
  onIncrement: () => void
  onReset: () => void
}

export function FrequencyPanel({ count, history, onIncrement, onReset }: FrequencyPanelProps) {
  const rate = useMemo(() => {
    if (history.length < 2) return "0"
    const elapsedMinutes = (history[0].timestamp - history[history.length - 1].timestamp) / 60000
    if (elapsedMinutes <= 0) return "0"
    return (history.length / elapsedMinutes).toFixed(1)
  }, [history])

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="pb-3 flex items-center justify-between">
        <CardTitle className="text-sm font-semibold">Frequency Count</CardTitle>
        <Button size="sm" variant="outline" onClick={onReset}>
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-primary">{count}</div>
            <div className="text-xs text-muted-foreground">Responses</div>
          </div>
          <Button size="lg" onClick={onIncrement} className="bg-primary text-primary-foreground">
            Record +1
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/30 py-3 text-center">
            <div className="text-lg font-semibold text-primary">{rate}</div>
            <div className="text-xs text-muted-foreground">per minute</div>
          </div>
          <div className="rounded-lg border bg-muted/30 py-3 text-center">
            <div className="text-lg font-semibold text-primary">{history.length}</div>
            <div className="text-xs text-muted-foreground">window size</div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Last Timestamps</h4>
          <div className="space-y-1 text-xs text-muted-foreground max-h-24 overflow-y-auto">
            {history.slice(0, 10).map((entry) => (
              <div key={entry.id}>
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
            ))}
            {history.length === 0 && <p>No responses recorded yet.</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DurationPanelProps {
  current?: { start: number; note?: string }
  history: { id: string; start: number; end: number; note?: string }[]
  onStart: (note?: string) => void
  onStop: () => void
  onReset: () => void
}

export function DurationPanel({ current, history, onStart, onStop, onReset }: DurationPanelProps) {
  const [note, setNote] = useState("")
  const elapsed = useMemo(() => {
    if (!current) return 0
    return Math.floor((Date.now() - current.start) / 1000)
  }, [current])

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="pb-3 flex items-center justify-between">
        <CardTitle className="text-sm font-semibold">Duration Tracking</CardTitle>
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-primary">{current ? `${elapsed}s` : "--"}</div>
            <div className="text-xs text-muted-foreground">Current Interval</div>
          </div>
          <div className="space-x-2">
            {current ? (
              <Button variant="destructive" onClick={onStop}>
                Stop
              </Button>
            ) : (
              <Button onClick={() => onStart(note)} className="bg-primary text-primary-foreground">
                Start Interval
              </Button>
            )}
          </div>
        </div>
        {!current && (
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note (e.g., on-task behavior)"
          />
        )}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Past Intervals</h4>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground">No intervals recorded yet.</p>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto text-xs text-muted-foreground">
              {history.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between">
                  <span>
                    {new Date(entry.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –
                    {new Date(entry.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span>{Math.floor((entry.end - entry.start) / 1000)}s</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ABCPanelsProps {
  history: ABCRecord[]
  onAdd: (entry: Omit<ABCRecord, "id" | "time">) => void
}

export function ABCPanels({ history, onAdd }: ABCPanelsProps) {
  const [antecedent, setAntecedent] = useState("")
  const [behavior, setBehavior] = useState("")
  const [consequence, setConsequence] = useState("")
  const [intensity, setIntensity] = useState<ABCRecord["intensity"]>("low")

  const handleSave = () => {
    if (!antecedent.trim() || !behavior.trim() || !consequence.trim()) return
    onAdd({
      antecedent: antecedent.trim(),
      behavior: behavior.trim(),
      consequence: consequence.trim(),
      intensity,
    })
    setAntecedent("")
    setBehavior("")
    setConsequence("")
    setIntensity("low")
  }

  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">ABC Narrative</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-2">
          <Textarea value={antecedent} placeholder="Antecedent" onChange={(e) => setAntecedent(e.target.value)} rows={2} />
          <Textarea value={behavior} placeholder="Behavior" onChange={(e) => setBehavior(e.target.value)} rows={2} />
          <Textarea value={consequence} placeholder="Consequence" onChange={(e) => setConsequence(e.target.value)} rows={2} />
          <Select value={intensity} onValueChange={(value: ABCRecord["intensity"]) => setIntensity(value)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Intensity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSave}>Save ABC Entry</Button>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground">Recent Entries</h4>
          {history.length === 0 ? (
            <p className="text-xs text-muted-foreground">No entries yet.</p>
          ) : (
            <div className="space-y-2 max-h-32 overflow-y-auto text-xs">
              {history.map((entry) => (
                <Card key={entry.id} className="border-muted/60">
                  <CardContent className="p-3 space-y-1">
                    <div className="flex justify-between">
                      <Badge variant="outline">{entry.intensity.toUpperCase()}</Badge>
                      <span className="text-muted-foreground">
                        {new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div><strong>A:</strong> {entry.antecedent}</div>
                    <div><strong>B:</strong> {entry.behavior}</div>
                    <div><strong>C:</strong> {entry.consequence}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface NotesPanelProps {
  value: string
  onChange: (value: string) => void
}

export function NotesPanel({ value, onChange }: NotesPanelProps) {
  return (
    <Card className="shadow-sm border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Session Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Document student behavior, prompts provided, reinforcement used…"
          rows={4}
        />
      </CardContent>
    </Card>
  )
}
