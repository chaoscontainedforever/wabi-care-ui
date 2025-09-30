"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Users, 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  GraduationCap,
  User,
  Phone,
  Mail,
  Settings,
  UserPlus,
  UserMinus,
  Target,
  Activity
} from "lucide-react"

// Mock student groups data
const mockGroups = [
  {
    id: "1",
    name: "Elementary ASD",
    description: "Elementary students with Autism Spectrum Disorder",
    gradeLevel: "Elementary",
    disability: "Autism Spectrum Disorder",
    studentCount: 8,
    maxStudents: 10,
    teacher: "Ms. Sarah Wilson",
    room: "Room 101",
    schedule: "Mon-Fri, 8:00 AM - 3:00 PM",
    createdDate: "2024-01-01",
    lastActivity: "2024-01-15",
    status: "active",
    students: [
      { id: "1", name: "Emma Johnson", grade: "3rd Grade", status: "active" },
      { id: "5", name: "Alex Thompson", grade: "5th Grade", status: "active" }
    ]
  },
  {
    id: "2",
    name: "Elementary ADHD",
    description: "Elementary students with ADHD",
    gradeLevel: "Elementary",
    disability: "ADHD",
    studentCount: 6,
    maxStudents: 8,
    teacher: "Ms. Sarah Wilson",
    room: "Room 102",
    schedule: "Mon-Fri, 8:30 AM - 3:30 PM",
    createdDate: "2024-01-05",
    lastActivity: "2024-01-14",
    status: "active",
    students: [
      { id: "2", name: "Michael Chen", grade: "2nd Grade", status: "active" }
    ]
  },
  {
    id: "3",
    name: "Elementary LD",
    description: "Elementary students with Learning Disabilities",
    gradeLevel: "Elementary",
    disability: "Learning Disability",
    studentCount: 4,
    maxStudents: 6,
    teacher: "Ms. Sarah Wilson",
    room: "Room 103",
    schedule: "Mon-Fri, 9:00 AM - 4:00 PM",
    createdDate: "2024-01-10",
    lastActivity: "2024-01-13",
    status: "active",
    students: [
      { id: "3", name: "Sarah Williams", grade: "4th Grade", status: "active" }
    ]
  },
  {
    id: "4",
    name: "Elementary Speech",
    description: "Elementary students with Speech and Language Impairments",
    gradeLevel: "Elementary",
    disability: "Speech and Language Impairment",
    studentCount: 3,
    maxStudents: 5,
    teacher: "Ms. Sarah Wilson",
    room: "Room 104",
    schedule: "Mon-Fri, 10:00 AM - 2:00 PM",
    createdDate: "2024-01-15",
    lastActivity: "2024-01-12",
    status: "active",
    students: [
      { id: "4", name: "David Rodriguez", grade: "1st Grade", status: "active" }
    ]
  }
]

interface GroupForm {
  name: string
  description: string
  gradeLevel: string
  disability: string
  maxStudents: number
  teacher: string
  room: string
  schedule: string
}

export function StudentGroupsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterGradeLevel, setFilterGradeLevel] = useState<string>("all")
  const [filterDisability, setFilterDisability] = useState<string>("all")
  const [selectedGroup, setSelectedGroup] = useState<any>(null)
  const [isGroupDetailOpen, setIsGroupDetailOpen] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [groupForm, setGroupForm] = useState<GroupForm>({
    name: "",
    description: "",
    gradeLevel: "",
    disability: "",
    maxStudents: 10,
    teacher: "",
    room: "",
    schedule: ""
  })

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.teacher.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGradeLevel = filterGradeLevel === "all" || group.gradeLevel === filterGradeLevel
    const matchesDisability = filterDisability === "all" || group.disability === filterDisability
    return matchesSearch && matchesGradeLevel && matchesDisability
  })

  const handleGroupClick = (group: any) => {
    setSelectedGroup(group)
    setIsGroupDetailOpen(true)
  }

  const handleCreateGroup = () => {
    // In a real app, this would create a new group
    console.log("Group created:", groupForm)
    setIsCreateGroupOpen(false)
    setGroupForm({
      name: "",
      description: "",
      gradeLevel: "",
      disability: "",
      maxStudents: 10,
      teacher: "",
      room: "",
      schedule: ""
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "inactive":
        return "text-gray-600 bg-gray-50"
      case "full":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Student Groups</h1>
            <p className="text-sm text-gray-600 mt-1">Organize students into groups for better management and instruction</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Group Settings
            </Button>
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Student Group</DialogTitle>
                  <DialogDescription>
                    Create a new group to organize students with similar needs
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="groupName">Group Name *</Label>
                      <Input
                        id="groupName"
                        value={groupForm.name}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter group name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxStudents">Max Students</Label>
                      <Input
                        id="maxStudents"
                        type="number"
                        value={groupForm.maxStudents}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, maxStudents: parseInt(e.target.value) || 10 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="groupDescription">Description</Label>
                    <Textarea
                      id="groupDescription"
                      value={groupForm.description}
                      onChange={(e) => setGroupForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the group and its purpose"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gradeLevel">Grade Level</Label>
                      <Select value={groupForm.gradeLevel} onValueChange={(value) => setGroupForm(prev => ({ ...prev, gradeLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Elementary">Elementary</SelectItem>
                          <SelectItem value="Middle School">Middle School</SelectItem>
                          <SelectItem value="High School">High School</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="disability">Primary Disability</Label>
                      <Select value={groupForm.disability} onValueChange={(value) => setGroupForm(prev => ({ ...prev, disability: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select disability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Autism Spectrum Disorder">Autism Spectrum Disorder</SelectItem>
                          <SelectItem value="ADHD">ADHD</SelectItem>
                          <SelectItem value="Learning Disability">Learning Disability</SelectItem>
                          <SelectItem value="Speech and Language Impairment">Speech and Language Impairment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="teacher">Teacher</Label>
                      <Input
                        id="teacher"
                        value={groupForm.teacher}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, teacher: e.target.value }))}
                        placeholder="Enter teacher name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="room">Room</Label>
                      <Input
                        id="room"
                        value={groupForm.room}
                        onChange={(e) => setGroupForm(prev => ({ ...prev, room: e.target.value }))}
                        placeholder="Enter room number"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input
                      id="schedule"
                      value={groupForm.schedule}
                      onChange={(e) => setGroupForm(prev => ({ ...prev, schedule: e.target.value }))}
                      placeholder="e.g., Mon-Fri, 8:00 AM - 3:00 PM"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateGroup}>
                      Create Group
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Groups</p>
                <p className="text-2xl font-bold text-blue-900">{mockGroups.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Active Groups</p>
                <p className="text-2xl font-bold text-green-900">{mockGroups.filter(g => g.status === 'active').length}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-yellow-900">{mockGroups.reduce((sum, group) => sum + group.studentCount, 0)}</p>
              </div>
              <User className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Available Spots</p>
                <p className="text-2xl font-bold text-purple-900">{mockGroups.reduce((sum, group) => sum + (group.maxStudents - group.studentCount), 0)}</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Groups</CardTitle>
              <CardDescription>Manage and organize student groups</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterGradeLevel} onValueChange={setFilterGradeLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Grade Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Elementary">Elementary</SelectItem>
                  <SelectItem value="Middle School">Middle School</SelectItem>
                  <SelectItem value="High School">High School</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDisability} onValueChange={setFilterDisability}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Disability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disabilities</SelectItem>
                  <SelectItem value="Autism Spectrum Disorder">Autism</SelectItem>
                  <SelectItem value="ADHD">ADHD</SelectItem>
                  <SelectItem value="Learning Disability">Learning Disability</SelectItem>
                  <SelectItem value="Speech and Language Impairment">Speech/Language</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card 
                key={group.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => handleGroupClick(group)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">{group.name}</h3>
                        <p className="text-xs text-muted-foreground">{group.gradeLevel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className={`text-xs ${getStatusColor(group.status)}`}>
                        {group.status}
                      </Badge>
                      <Button size="sm" variant="ghost" className="p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {group.description}
                  </p>
                  
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Students:</span>
                      <span className="font-medium">{group.studentCount}/{group.maxStudents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Teacher:</span>
                      <span className="font-medium">{group.teacher}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">{group.room}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Disability:</span>
                      <span className="font-medium">{group.disability}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="flex-1 text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      View Group
                    </Button>
                    <Button size="sm" variant="outline" className="px-2">
                      <UserPlus className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Groups Found</h3>
              <p className="text-gray-600 mb-6">No groups match your current search and filter criteria.</p>
              <Button onClick={() => setIsCreateGroupOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Group
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Detail Dialog */}
      <Dialog open={isGroupDetailOpen} onOpenChange={setIsGroupDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              {selectedGroup?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedGroup?.description} • {selectedGroup?.studentCount} students
            </DialogDescription>
          </DialogHeader>
          
          {selectedGroup && (
            <div className="space-y-6">
              {/* Group Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Group Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Group Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Grade Level</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.gradeLevel}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Primary Disability</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.disability}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Capacity</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.studentCount}/{selectedGroup.maxStudents} students</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Schedule & Location</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Teacher</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.teacher}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Room</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.room}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Schedule</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.schedule}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Created</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.createdDate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Last Activity</Label>
                      <p className="text-sm text-muted-foreground">{selectedGroup.lastActivity}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Students in Group */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Students in Group</CardTitle>
                  <CardDescription>Students currently assigned to this group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedGroup.students.map((student: any) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{student.name}</h4>
                            <p className="text-xs text-muted-foreground">{student.grade}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {student.status}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsGroupDetailOpen(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Group
                </Button>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Students
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
