"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Users, 
  FileText, 
  Target, 
  BarChart3, 
  Settings, 
  Menu, 
  X,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  Calendar,
  Bell,
  HelpCircle,
  LogOut
} from "lucide-react"

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("dashboard")

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
      badge: null
    },
    {
      id: "students",
      label: "Students",
      icon: Users,
      href: "/students",
      badge: "24"
    },
    {
      id: "assessments",
      label: "Assessments",
      icon: ClipboardList,
      href: "/assessments",
      badge: "8"
    },
    {
      id: "iep-goals",
      label: "IEP Goals",
      icon: Target,
      href: "/iep-goals",
      badge: "12"
    },
    {
      id: "curriculum",
      label: "Curriculum",
      icon: GraduationCap,
      href: "/curriculum",
      badge: null
    },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      href: "/reports",
      badge: null
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      href: "/analytics",
      badge: null
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      href: "/calendar",
      badge: "3"
    }
  ]

  const bottomItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      href: "/notifications",
      badge: "5"
    },
    {
      id: "help",
      label: "Help & Support",
      icon: HelpCircle,
      href: "/help",
      badge: null
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      href: "/settings",
      badge: null
    }
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      suppressHydrationWarning
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Wabi Care</h1>
              <p className="text-xs text-muted-foreground">Special Education</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">Special Education Teacher</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 px-3",
                  isCollapsed && "px-2",
                  isActive && "bg-secondary text-secondary-foreground"
                )}
                onClick={() => setActiveItem(item.id)}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </div>

        <Separator className="my-4" />

        <div className="px-2 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-10 px-3",
                  isCollapsed && "px-2",
                  isActive && "bg-secondary text-secondary-foreground"
                )}
                onClick={() => setActiveItem(item.id)}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start h-10 px-3 text-muted-foreground hover:text-foreground",
            isCollapsed && "px-2"
          )}
        >
          <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}
