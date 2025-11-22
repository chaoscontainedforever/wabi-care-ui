"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckCircle, 
  UserPlus, 
  Shield, 
  FileCheck, 
  Stethoscope, 
  ClipboardCheck,
  Circle
} from "lucide-react"
import { cn } from "@/lib/utils"

export type IntakePhase = 
  | "referral"
  | "verify-insurance" 
  | "pre-authorization"
  | "diagnosis" 
  | "initial-assessment"

export interface PhaseConfig {
  id: IntakePhase
  label: string
  status: "pending" | "in-progress" | "completed"
}

interface IntakeLifecycleCardProps {
  phases: PhaseConfig[]
  activePhase: IntakePhase
  onPhaseClick: (phase: IntakePhase) => void
}

// Icon mapping for each phase
const getPhaseIcon = (phaseId: IntakePhase) => {
  switch (phaseId) {
    case "referral":
      return UserPlus
    case "verify-insurance":
      return Shield
    case "pre-authorization":
      return FileCheck
    case "diagnosis":
      return Stethoscope
    case "initial-assessment":
      return ClipboardCheck
    default:
      return Circle
  }
}

export function IntakeLifecycleCard({ phases, activePhase, onPhaseClick }: IntakeLifecycleCardProps) {
  return (
    <Card className="shadow-sm border-2">
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4 overflow-x-auto">
          {phases.map((phase, index) => {
            const isActive = phase.id === activePhase
            const isCompleted = phase.status === "completed"
            const isInProgress = phase.status === "in-progress"
            const isClickable = isCompleted || isActive || isInProgress
            const PhaseIcon = getPhaseIcon(phase.id)
            
            return (
              <div key={phase.id} className="flex items-center flex-shrink-0">
                {/* Phase Item */}
                <button
                  onClick={() => isClickable && onPhaseClick(phase.id)}
                  disabled={!isClickable}
                  className={cn(
                    "flex flex-col items-center gap-2 min-w-[140px] transition-all",
                    isClickable && "cursor-pointer hover:opacity-80",
                    !isClickable && "cursor-not-allowed opacity-50"
                  )}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-center">
                    {isCompleted ? (
                      <CheckCircle className={cn(
                        "h-5 w-5 transition-all",
                        "text-emerald-600"
                      )} />
                    ) : (
                      <PhaseIcon className={cn(
                        "h-5 w-5 transition-all",
                        isActive && "text-primary",
                        isInProgress && !isActive && "text-primary/70",
                        !isActive && !isCompleted && !isInProgress && "text-muted-foreground"
                      )} />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span
                    className={cn(
                      "text-sm font-medium text-center leading-tight",
                      isActive && "text-primary font-semibold",
                      isCompleted && "text-emerald-600 font-medium",
                      isInProgress && "text-primary",
                      !isActive && !isCompleted && !isInProgress && "text-muted-foreground"
                    )}
                  >
                    {phase.label}
                  </span>
                  
                  {/* Status Badge */}
                  {(isActive || isInProgress) && (
                    <span className="text-[10px] text-primary font-medium mt-0.5">Active</span>
                  )}
                  {isCompleted && (
                    <span className="text-[10px] text-emerald-600 font-medium mt-0.5">Complete</span>
                  )}
                </button>
                
                {/* Connector Line */}
                {index < phases.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-12 md:w-16 mx-3 transition-colors",
                      phases[index].status === "completed" || phases[index + 1].status !== "pending"
                        ? "bg-primary/30"
                        : "bg-border"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

