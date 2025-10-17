"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, GripVertical } from "lucide-react"

interface PromptLevelManagerProps {
  promptOptions: string[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, value: string) => void
}

export function PromptLevelManager({ promptOptions, onAdd, onRemove, onUpdate }: PromptLevelManagerProps) {
  return (
    <Card className="shadow-none border-muted">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold">Prompt Levels</CardTitle>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add level
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {promptOptions.map((option, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 rounded-lg border bg-background px-3 py-2"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
            <Input
              value={option}
              onChange={(e) => onUpdate(index, e.target.value)}
              className="flex-1 h-9"
            />
            <Button variant="ghost" size="sm" onClick={() => onRemove(index)} className="text-xs">
              Remove
            </Button>
          </div>
        ))}
        {promptOptions.length === 0 && (
          <p className="text-xs text-muted-foreground">No prompt levels defined yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
