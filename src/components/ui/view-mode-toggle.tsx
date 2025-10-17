"use client"

import { Grid3X3, List, Table } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ViewMode = "cards" | "list" | "table"

interface ViewModeToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}

const modes: { value: ViewMode; icon: React.ReactNode; label: string }[] = [
  { value: "cards", icon: <Grid3X3 className="h-4 w-4" />, label: "Cards" },
  { value: "list", icon: <List className="h-4 w-4" />, label: "List" },
  { value: "table", icon: <Table className="h-4 w-4" />, label: "Table" },
]

export function ViewModeToggle({ value, onChange, className }: ViewModeToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-xl border border-border/60 bg-background p-1 shadow-sm",
        className
      )}
    >
      {modes.map((mode) => (
        <Button
          key={mode.value}
          variant={value === mode.value ? "default" : "ghost"}
          size="sm"
          className={cn(
            "min-w-9 px-3 transition-all",
            value === mode.value
              ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onChange(mode.value)}
        >
          {mode.icon}
        </Button>
      ))}
    </div>
  )
}


