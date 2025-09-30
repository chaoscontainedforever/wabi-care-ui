"use client"

import { memo, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Search, Plus, Grid3X3, List, Table } from "@/components/icons"
import { useStudents } from "@/hooks/useSupabase"
import type { Tables } from "@/lib/database.types"

interface StudentSelectorProps {
  selectedStudent: string | null
  onStudentSelect: (studentId: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  filterDomain: string
  onFilterChange: (domain: string) => void
  viewFormat: "cards" | "list" | "table"
  onViewFormatChange: (format: "cards" | "list" | "table") => void
}

const StudentCard = memo(({ student, onSelect }: { 
  student: Tables<'students'>, 
  onSelect: (id: string) => void 
}) => (
  <Card className="hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => onSelect(student.id)}>
    <CardContent className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={student.profile_picture_url || undefined} />
          <AvatarFallback>
            <User className="h-6 w-6 text-blue-600" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-base text-gray-900">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.grade} • Age {student.age}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-medium">Disability:</span>
          <span>{student.disability}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Active
        </Badge>
      </div>
    </CardContent>
  </Card>
))

StudentCard.displayName = "StudentCard"

export const StudentSelector = memo(function StudentSelector({
  selectedStudent,
  onStudentSelect,
  searchTerm,
  onSearchChange,
  filterDomain,
  onFilterChange,
  viewFormat,
  onViewFormatChange
}: StudentSelectorProps) {
  const { students, loading: studentsLoading, error: studentsError } = useStudents()

  const filteredStudents = useMemo(() => {
    if (studentsLoading) return []
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [students, searchTerm, studentsLoading])

  if (studentsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Student</CardTitle>
          <CardDescription>Loading students...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (studentsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Select Student</CardTitle>
          <CardDescription>Error loading students</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{studentsError}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select Student</CardTitle>
            <CardDescription>Choose a student to collect data for</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDomain} onValueChange={onFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="autism">Autism</SelectItem>
              <SelectItem value="adhd">ADHD</SelectItem>
              <SelectItem value="learning">Learning Disability</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Format Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewFormat === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewFormatChange("cards")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewFormat === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewFormatChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewFormat === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewFormatChange("table")}
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>

        {/* Students List */}
        {viewFormat === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onSelect={onStudentSelect}
              />
            ))}
          </div>
        )}

        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-600">No students match your search criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

StudentSelector.displayName = "StudentSelector"
