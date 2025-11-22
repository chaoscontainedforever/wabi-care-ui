"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Target, 
  CheckCircle2,
  Search,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  X,
  BookOpen,
  FolderOpen,
  Save
} from "lucide-react"
import { StudentDocumentsModal } from "./StudentDocumentsModal"
import { GoalBankSelection } from "./GoalBankSelection"

interface Goal {
  id: string
  title: string
  description: string
  category: string
  level: string
  completion: number
  dataType: "prompt-levels" | "task-analysis" | "duration" | "abc-data"
  prompts: string[]
  enableOutcomeTracking: boolean
  status: "active" | "completed" | "on-hold"
  createdAt: string
}

interface TreatmentPlanTabProps {
  studentId: string
  studentName: string
}

export function TreatmentPlanTab({ studentId, studentName }: TreatmentPlanTabProps) {
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false)
  const [goalDesignerMode, setGoalDesignerMode] = useState<"create" | "bank">("create")
  const [goalBankSearchTerm, setGoalBankSearchTerm] = useState("")
  const [goalBankCategory, setGoalBankCategory] = useState<string>("all")
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Social Studies",
      description: "Improve social interaction skills",
      category: "Social Studies",
      level: "Level 3",
      completion: 0,
      dataType: "prompt-levels",
      prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts", "No response"],
      enableOutcomeTracking: false,
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "Writing",
      description: "Develop writing skills",
      category: "Writing",
      level: "Level 2",
      completion: 0,
      dataType: "prompt-levels",
      prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts"],
      enableOutcomeTracking: false,
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      title: "Math",
      description: "Enhance mathematical abilities",
      category: "Math",
      level: "Level 1",
      completion: 0,
      dataType: "task-analysis",
      prompts: [],
      enableOutcomeTracking: false,
      status: "active",
      createdAt: new Date().toISOString()
    },
    {
      id: "4",
      title: "Reduce Hand-Flapping Behavior",
      description: "Decrease hand-flapping behavior",
      category: "Behavior",
      level: "Baseline",
      completion: 0,
      dataType: "duration",
      prompts: [],
      enableOutcomeTracking: true,
      status: "active",
      createdAt: new Date().toISOString()
    }
  ])

  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(goals[0] || null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  
  // Goal form state
  const [goalFormData, setGoalFormData] = useState({
    title: "",
    description: "",
    dataType: "prompt-levels" as Goal["dataType"],
    prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts", "No response"] as string[],
    enableOutcomeTracking: false
  })

  const filteredGoals = goals.filter(goal =>
    goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal)
  }

  const handleAddGoal = () => {
    setEditingGoal(null)
    setGoalFormData({
      title: "",
      description: "",
      dataType: "prompt-levels",
      prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts", "No response"],
      enableOutcomeTracking: false
    })
    setIsGoalModalOpen(true)
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setGoalFormData({
      title: goal.title,
      description: goal.description,
      dataType: goal.dataType,
      prompts: [...goal.prompts],
      enableOutcomeTracking: goal.enableOutcomeTracking
    })
    setIsGoalModalOpen(true)
  }

  const handleSaveGoal = () => {
    if (editingGoal) {
      // Update existing goal
      setGoals(prev => prev.map(g => 
        g.id === editingGoal.id 
          ? { ...g, ...goalFormData }
          : g
      ))
      if (selectedGoal?.id === editingGoal.id) {
        setSelectedGoal({ ...editingGoal, ...goalFormData })
      }
    } else {
      // Add new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        ...goalFormData,
        category: goalFormData.title.split(' ')[0] || "General",
        level: "Level 1",
        completion: 0,
        status: "active",
        createdAt: new Date().toISOString()
      }
      setGoals(prev => [...prev, newGoal])
      setSelectedGoal(newGoal)
    }
    setIsGoalModalOpen(false)
    setEditingGoal(null)
  }

  const handleAddPrompt = () => {
    setGoalFormData({
      ...goalFormData,
      prompts: [...goalFormData.prompts, ""]
    })
  }

  const handleRemovePrompt = (index: number) => {
    setGoalFormData({
      ...goalFormData,
      prompts: goalFormData.prompts.filter((_, i) => i !== index)
    })
  }

  const handleUpdatePrompt = (index: number, value: string) => {
    const newPrompts = [...goalFormData.prompts]
    newPrompts[index] = value
    setGoalFormData({
      ...goalFormData,
      prompts: newPrompts
    })
  }

  const handleSelectFromGoalBank = (goal: Goal) => {
    setGoalFormData({
      title: goal.title,
      description: goal.description,
      dataType: goal.dataType,
      prompts: [...goal.prompts],
      enableOutcomeTracking: goal.enableOutcomeTracking
    })
    setEditingGoal(null)
    // Switch to create tab after selection
    setGoalDesignerMode("create")
  }

  const getStatusIcon = (goal: Goal) => {
    if (goal.status === "completed") {
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    }
    return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "Social Studies": "bg-blue-100 text-blue-800",
      "Writing": "bg-purple-100 text-purple-800",
      "Math": "bg-green-100 text-green-800",
      "Behavior": "bg-red-100 text-red-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="flex flex-1 overflow-hidden gap-4">
      {/* Left Panel: Goals List */}
      <Card className="w-80 flex-shrink-0 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Goals ({goals.length}/{goals.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-2">
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 flex-1"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleAddGoal}
                    className="h-9 w-9 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add Goal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-1">
            {filteredGoals.map((goal) => (
              <div
                key={goal.id}
                onClick={() => handleGoalClick(goal)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedGoal?.id === goal.id
                    ? "bg-primary/10 border border-primary"
                    : "hover:bg-muted"
                }`}
              >
                {getStatusIcon(goal)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{goal.title}</p>
                    <Badge className={`text-xs ${getCategoryBadge(goal.category)}`}>
                      {goal.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {goal.level} • {goal.completion}% complete
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Right Panel: Goal Details */}
      <Card className="flex-1 flex flex-col">
        {selectedGoal ? (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedGoal.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {selectedGoal.category} • {selectedGoal.level}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDocumentsModalOpen(true)}
                    className="gap-2"
                  >
                    <FolderOpen className="h-4 w-4" />
                    View Docs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditGoal(selectedGoal)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Goal
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedGoal.description}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Data Type</Label>
                  <Badge variant="secondary" className="capitalize">
                    {selectedGoal.dataType.replace("-", " ")}
                  </Badge>
                </div>

                {selectedGoal.prompts.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Prompts</Label>
                    <div className="space-y-2">
                      {selectedGoal.prompts.map((prompt, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <span className="text-sm">{prompt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-sm font-semibold">Enable Outcome Tracking</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Track outcomes for this goal
                    </p>
                  </div>
                  <Switch checked={selectedGoal.enableOutcomeTracking} disabled />
                </div>

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Progress</Label>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completion</span>
                      <span>{selectedGoal.completion}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${selectedGoal.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <CardTitle className="text-xl mb-2">Select a Goal</CardTitle>
              <CardDescription>
                Choose a goal from the sidebar to view details
              </CardDescription>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Goal Designer Modal */}
      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Goal</DialogTitle>
              <Button variant="ghost" size="sm" className="h-8">
                + Objective
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={goalDesignerMode} onValueChange={(value) => setGoalDesignerMode(value as "create" | "bank")} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create New Goal</TabsTrigger>
              <TabsTrigger value="bank">Choose from Goal Bank</TabsTrigger>
            </TabsList>

            {/* Create New Goal Tab */}
            <TabsContent value="create" className="mt-4">
              <div className="flex gap-6">
                {/* Left Sidebar: Data Types */}
                <div className="w-64 flex-shrink-0 space-y-2">
                  <Button
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 justify-start"
                    onClick={() => {}}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Suggest Data Tracking Template
                  </Button>
                  
                  <div className="mt-6">
                    <Label className="text-sm font-semibold mb-3 block">Data Types</Label>
                    <div className="space-y-1">
                      {[
                        { id: "prompt-levels", label: "Prompt Levels", desc: "Capture correct/incorrect with prompts" },
                        { id: "task-analysis", label: "Task Analysis", desc: "Step-by-step checklist" },
                        { id: "duration", label: "Duration", desc: "Track time per behavior" },
                        { id: "abc-data", label: "ABC Data", desc: "Antecedent-Behavior-Consequence" },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setGoalFormData({ ...goalFormData, dataType: type.id as Goal["dataType"] })}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            goalFormData.dataType === type.id
                              ? "bg-muted border-2 border-primary"
                              : "bg-background border border-border hover:bg-muted"
                          }`}
                        >
                          <div className="font-medium text-sm">{type.label}</div>
                          <div className="text-xs text-muted-foreground mt-1">{type.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Save to goal bank using existing form data
                        if (!goalFormData.title || !goalFormData.description) {
                          alert("Please fill in the goal title and description before saving to Goal Bank.")
                          return
                        }
                        // In production, this would save to database
                        console.log("Saving to goal bank:", goalFormData)
                        alert("Goal saved to Goal Bank successfully!")
                      }}
                      className="gap-2"
                      disabled={!goalFormData.title || !goalFormData.description}
                    >
                      <Save className="h-4 w-4" />
                      Save to Goal Bank
                    </Button>
                    <Button variant="outline" size="sm">Choose Prompts</Button>
                  </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goalTitle">Goal Title</Label>
                  <Input
                    id="goalTitle"
                    placeholder="e.g., Reading, Writing, Math"
                    value={goalFormData.title}
                    onChange={(e) => setGoalFormData({ ...goalFormData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goalDescription">Goal Description*</Label>
                  <Textarea
                    id="goalDescription"
                    placeholder="Write goal here.."
                    value={goalFormData.description}
                    onChange={(e) => setGoalFormData({ ...goalFormData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                {goalFormData.dataType === "prompt-levels" && (
                  <div className="space-y-2">
                    <Label>Prompts</Label>
                    <div className="space-y-2">
                      {goalFormData.prompts.map((prompt, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={prompt}
                            onChange={(e) => handleUpdatePrompt(index, e.target.value)}
                            placeholder="Enter prompt level"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemovePrompt(index)}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddPrompt}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Prompt
                    </Button>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="outcomeTracking" className="text-sm font-semibold">
                      Enable outcome tracking
                    </Label>
                  </div>
                  <Switch
                    id="outcomeTracking"
                    checked={goalFormData.enableOutcomeTracking}
                    onCheckedChange={(checked) =>
                      setGoalFormData({ ...goalFormData, enableOutcomeTracking: checked })
                    }
                  />
                </div>

                <Button variant="outline" className="w-full">
                  Advanced Options
                </Button>
              </div>

                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsGoalModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveGoal}
                      disabled={!goalFormData.title || !goalFormData.description}
                      className="bg-gradient-to-r from-pink-500 to-purple-600"
                    >
                      {editingGoal ? "Update Goal" : "Create Goal"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Choose from Goal Bank Tab */}
            <TabsContent value="bank" className="mt-4">
              <GoalBankSelection
                searchTerm={goalBankSearchTerm}
                onSearchChange={setGoalBankSearchTerm}
                selectedCategory={goalBankCategory}
                onCategoryChange={setGoalBankCategory}
                onSelectGoal={handleSelectFromGoalBank}
                onClose={() => setIsGoalModalOpen(false)}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Student Documents Modal */}
      <StudentDocumentsModal
        open={isDocumentsModalOpen}
        onOpenChange={setIsDocumentsModalOpen}
        studentId={studentId}
        studentName={studentName}
      />

    </div>
  )
}
