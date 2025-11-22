"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Edit, Shield, Target, Lightbulb, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export interface BSP {
  id: string
  goalId: string
  behaviorDefinition: string
  function: "attention" | "escape" | "access" | "automatic"
  preventionStrategies: string[]
  replacementBehaviors: string[]
  responseStrategies: string[]
  createdBy: string
  lastUpdated: string
}

interface BSPViewerProps {
  bsp: BSP | null
  onEdit?: () => void
  isCollapsible?: boolean
}

const functionColors: Record<string, string> = {
  attention: "bg-blue-100 text-blue-800",
  escape: "bg-orange-100 text-orange-800",
  access: "bg-green-100 text-green-800",
  automatic: "bg-purple-100 text-purple-800"
}

const functionLabels: Record<string, string> = {
  attention: "Attention",
  escape: "Escape/Avoidance",
  access: "Access to Items/Activities",
  automatic: "Automatic/Sensory"
}

export function BSPViewer({ bsp, onEdit, isCollapsible = true }: BSPViewerProps) {
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(true)
  const isBCBA = user?.user_metadata?.role === "BCBA" || user?.user_metadata?.role === "Administrator"

  if (!bsp) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-4 text-center text-muted-foreground">
          <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No Behavior Support Plan available for this goal</p>
          {isBCBA && onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="mt-3"
            >
              <Edit className="h-4 w-4 mr-2" />
              Create BSP
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Behavior Support Plan</CardTitle>
            <Badge variant="outline" className={functionColors[bsp.function]}>
              {functionLabels[bsp.function]}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isBCBA && onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="h-8"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            {isCollapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Behavior Definition */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Behavior Definition</h3>
            </div>
            <p className="text-sm text-muted-foreground pl-6">{bsp.behaviorDefinition}</p>
          </div>

          {/* Function of Behavior */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Function of Behavior</h3>
            </div>
            <div className="pl-6">
              <Badge variant="outline" className={functionColors[bsp.function]}>
                {functionLabels[bsp.function]}
              </Badge>
            </div>
          </div>

          {/* Prevention Strategies */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Prevention Strategies</h3>
            </div>
            <ul className="pl-6 space-y-1">
              {bsp.preventionStrategies.length > 0 ? (
                bsp.preventionStrategies.map((strategy, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{strategy}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground italic">No prevention strategies defined</li>
              )}
            </ul>
          </div>

          {/* Replacement Behaviors */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Replacement Behaviors</h3>
            </div>
            <ul className="pl-6 space-y-1">
              {bsp.replacementBehaviors.length > 0 ? (
                bsp.replacementBehaviors.map((behavior, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{behavior}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground italic">No replacement behaviors defined</li>
              )}
            </ul>
          </div>

          {/* Response Strategies */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Response Strategies</h3>
            </div>
            <ul className="pl-6 space-y-1">
              {bsp.responseStrategies.length > 0 ? (
                bsp.responseStrategies.map((strategy, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{strategy}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground italic">No response strategies defined</li>
              )}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

