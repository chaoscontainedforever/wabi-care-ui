export type TrialRecord = {
  id: string
  timestamp: number
  outcome: "correct" | "incorrect"
  promptLevel: string
  notes?: string
}

export type TaskAnalysisStep = {
  id: string
  label: string
  status: "independent" | "prompted" | "not_attempted"
}

export type ABCRecord = {
  id: string
  time: number
  antecedent: string
  behavior: string
  consequence: string
  intensity: "low" | "moderate" | "high"
}

export type DurationRecord = {
  id: string
  start: number
  end: number
  note?: string
}

export type GoalSessionState = {
  notes: string
  trialHistory: TrialRecord[]
  currentPrompt: string
  totalPrompts: number
  totalAttempts: number
  correctCount: number
  incorrectCount: number
  frequencyCount: number
  frequencyStart?: number
  frequencyHistory: { id: string; timestamp: number }[]
  durationCurrent?: { start: number; note?: string }
  durationHistory: DurationRecord[]
  taskSteps: TaskAnalysisStep[]
  abcEntries: ABCRecord[]
  lastMode?: string
}
