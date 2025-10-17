"use client"

import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"

interface GroupSessionToggleProps {
  enabled: boolean
  onToggle: (value: boolean) => void
}

export function GroupSessionToggle({ enabled, onToggle }: GroupSessionToggleProps) {
  return (
    <Card className="shadow-none border-muted">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold">Group Session Mode</CardTitle>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs">
          Record data for multiple learners simultaneously.
        </CardDescription>
      </CardContent>
    </Card>
  )
}
