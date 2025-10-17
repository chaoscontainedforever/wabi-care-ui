"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface Mode {
  id: string
  name: string
  description: string
  icon: LucideIcon
  disabled?: boolean
}

interface DataModeSelectorProps {
  modes: Mode[]
  currentMode: string
  onSelect: (mode: string) => void
}

export function DataModeSelector({ modes, currentMode, onSelect }: DataModeSelectorProps) {
  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
      {modes.map((mode) => {
        const Icon = mode.icon
        const disabled = mode.disabled
        const isActive = currentMode === mode.id
        return (
          <Card
            key={mode.id}
            role="button"
            aria-disabled={disabled}
            onClick={() => !disabled && onSelect(mode.id)}
            className={cn(
              "transition-all border-muted shadow-sm",
              disabled ? "opacity-60 cursor-not-allowed" : "hover:border-primary/40 cursor-pointer",
              isActive && !disabled && "border-primary bg-primary/5 shadow-md"
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary h-8 w-8">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="text-left">
                  <CardTitle className="text-sm font-semibold">{mode.name}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </div>
              </div>
              {isActive && !disabled && (
                <Button variant="outline" size="xs" className="pointer-events-none">
                  Selected
                </Button>
              )}
            </CardHeader>
            {isActive && !disabled && (
              <CardContent className="pt-2 text-xs text-muted-foreground">
                <p>{mode.id === "prompting-levels" && "Track discrete trials with prompt levels."}</p>
                <p>{mode.id === "task-analysis" && "Collect yes/no or independence data for chained skills."}</p>
                <p>{mode.id === "frequency" && "Count behaviors or runs per session."}</p>
                <p>{mode.id === "duration" && "Time how long a behavior lasts."}</p>
                <p>{mode.id === "abc" && "Capture antecedent, behavior, consequence notes."}</p>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
