"use client"

import { useMemo } from "react"
import { useStudents } from "@/hooks/useSupabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin } from "lucide-react"

interface SessionLauncherProps {
  selectedStudentId: string | null
  onSelectStudent: (id: string) => void
  onStartSession: () => void
}

export function SessionLauncher({ selectedStudentId, onSelectStudent, onStartSession }: SessionLauncherProps) {
  const { students, loading } = useStudents()

  const studentOptions = useMemo(() => {
    return students.map(student => ({
      id: student.id,
      label: student.name,
      subtitle: `${student.grade} • ${student.school}`
    }))
  }, [students])

  return (
    <Card className="bg-white border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Start Data Collection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Learner</Label>
          <Select value={selectedStudentId ?? undefined} onValueChange={onSelectStudent} disabled={loading}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={loading ? "Loading learners..." : "Choose learner"} />
            </SelectTrigger>
            <SelectContent>
              {studentOptions.map(option => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.subtitle}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Capture location</span>
          </div>
        </div>

        <Button className="w-full" onClick={onStartSession} disabled={!selectedStudentId}>
          Launch Session
        </Button>
      </CardContent>
    </Card>
  )
}

