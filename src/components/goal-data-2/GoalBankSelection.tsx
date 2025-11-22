"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, CheckCircle2 } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  category: string
  dataType: "prompt-levels" | "task-analysis" | "duration" | "abc-data"
  prompts: string[]
  enableOutcomeTracking: boolean
  createdAt: string
}

interface GoalBankSelectionProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onSelectGoal: (goal: Goal) => void
  onClose: () => void
}

// Mock goal bank data - same as GoalBankModal
const mockGoalBank: Goal[] = [
  {
    id: "gb-1",
    title: "Social Interaction Skills",
    description: "Improve peer interaction and communication in group settings",
    category: "Social",
    dataType: "prompt-levels",
    prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts", "No response"],
    enableOutcomeTracking: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "gb-2",
    title: "Following Multi-Step Instructions",
    description: "Follow 3-step instructions independently across different contexts",
    category: "Academic",
    dataType: "prompt-levels",
    prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts"],
    enableOutcomeTracking: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "gb-3",
    title: "Emotional Regulation",
    description: "Use coping strategies when frustrated or overwhelmed",
    category: "Behavioral",
    dataType: "duration",
    prompts: [],
    enableOutcomeTracking: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "gb-4",
    title: "Reading Comprehension",
    description: "Answer comprehension questions about grade-level texts",
    category: "Academic",
    dataType: "prompt-levels",
    prompts: ["Independent", "1-2 Prompts", "More than 2 Prompts"],
    enableOutcomeTracking: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "gb-5",
    title: "Hand Washing Routine",
    description: "Complete hand washing steps independently",
    category: "Life Skills",
    dataType: "task-analysis",
    prompts: [],
    enableOutcomeTracking: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "gb-6",
    title: "Aggressive Behavior Reduction",
    description: "Track and reduce instances of aggressive behavior",
    category: "Behavioral",
    dataType: "abc-data",
    prompts: [],
    enableOutcomeTracking: true,
    createdAt: new Date().toISOString()
  }
]

export function GoalBankSelection({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onSelectGoal,
  onClose
}: GoalBankSelectionProps) {
  const categories = useMemo(() => {
    const cats = new Set(mockGoalBank.map(g => g.category))
    return Array.from(cats)
  }, [])

  const filteredGoals = useMemo(() => {
    let filtered = mockGoalBank

    if (searchTerm) {
      filtered = filtered.filter(
        goal =>
          goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(goal => goal.category === selectedCategory)
    }

    return filtered
  }, [searchTerm, selectedCategory])

  const handleSelectGoal = (goal: Goal) => {
    onSelectGoal(goal)
    // Note: The parent component will handle switching to create tab
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange("all")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Goals List */}
      <ScrollArea className="h-[500px] pr-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No goals found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredGoals.map((goal) => (
              <Card
                key={goal.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleSelectGoal(goal)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{goal.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {goal.description}
                      </CardDescription>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary">{goal.category}</Badge>
                    <Badge variant="outline" className="capitalize">
                      {goal.dataType.replace("-", " ")}
                    </Badge>
                    {goal.enableOutcomeTracking && (
                      <Badge variant="outline">Outcome Tracking</Badge>
                    )}
                    {goal.prompts.length > 0 && (
                      <Badge variant="outline">{goal.prompts.length} Prompts</Badge>
                    )}
                  </div>
                  {goal.prompts.length > 0 && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Prompts:</p>
                      <div className="flex flex-wrap gap-1">
                        {goal.prompts.map((prompt, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {prompt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

