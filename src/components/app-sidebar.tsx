"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Users, 
  Target, 
  BarChart3, 
  Settings,
  ClipboardList,
  TrendingUp,
  Calendar,
  Home,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// Wabi Care navigation data for special education platform
const navigationData = {
  platform: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Data Collection",
      url: "/students",
      icon: Users,
      items: [
        { title: "All Students", url: "/students" },
        { title: "Goal Data", url: "/goal-data" },
        { title: "Student Groups", url: "/students/groups" },
      ],
    },
    {
      title: "Assessments",
      url: "/assessments",
      icon: ClipboardList,
      items: [
        { title: "Form Bank", url: "/form-bank" },
      ],
    },
    {
      title: "IEP Management",
      url: "/iep",
      icon: Target,
      items: [
        { title: "Goal Bank", url: "/iep-goals" },
        { title: "IEP Builder", url: "/iep-builder" },
        { title: "IEP Review", url: "/iep-review" },
        { title: "Progress Tracking", url: "/iep/progress" },
      ],
    },
  ],
  reportsAndTools: [
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
      items: [
        { title: "Student Progress", url: "/reports/progress" },
        { title: "Assessment Results", url: "/reports/assessments" },
        { title: "IEP Compliance", url: "/reports/compliance" },
        { title: "Analytics Dashboard", url: "/reports/analytics" },
      ],
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: TrendingUp,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        { title: "School Settings", url: "/settings/school" },
        { title: "User Management", url: "/settings/users" },
        { title: "Data Import", url: "/settings/import" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const { state, setOpen } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { user, signOut } = useAuth()



  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => navigationData, [])

  // Function to find which parent category contains the current path
  const findParentCategory = useCallback((pathname: string) => {
    const allItems = [...memoizedData.platform, ...memoizedData.reportsAndTools]
    
    for (const item of allItems) {
      if (item.items) {
        for (const subItem of item.items) {
          if (pathname.startsWith(subItem.url)) {
            return item.title
          }
        }
      }
      // Also check if the pathname matches the main category URL
      if (pathname.startsWith(item.url)) {
        return item.title
      }
    }
    return null
  }, [memoizedData])

  // Auto-expand parent category when pathname changes
  useEffect(() => {
    const parentCategory = findParentCategory(pathname)
    if (parentCategory) {
      setExpandedItems(prev => {
        // Only update if the parent category is not already expanded
        if (!prev.has(parentCategory)) {
          return new Set([...prev, parentCategory])
        }
        return prev
      })
    }
  }, [pathname, findParentCategory])

  const toggleExpanded = useCallback((title: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }, [])

  // Function to check if a URL is active
  const isActive = useCallback((url: string) => {
    return pathname === url
  }, [pathname])

  const isParentActive = useCallback((url: string) => {
    if (pathname === url) return true
    return pathname.startsWith(url + '/')
  }, [pathname])

  // Navigation handler
  const handleNavigation = useCallback((url: string) => {
    router.push(url)
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setOpen(false)
    }
  }, [router, isMobile, setOpen])


  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className={`${state === "expanded" ? "" : "flex items-center flex-col"}`}>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => handleNavigation("/dashboard")}>
              <div className={`flex items-center ${state === "expanded" ? "gap-3" : "justify-center"}`}>
                <div className="flex aspect-square size-6 items-center justify-center">
                  {/* Incomplete circle logo with primary gradient */}
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    className="size-6"
                  >
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ec4899" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                    <circle 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      fill="none" 
                      stroke="url(#logoGradient)" 
                      strokeWidth="2.5"
                      strokeDasharray="20 4"
                      strokeLinecap="round"
                      transform="rotate(-90 12 12)"
                    />
                  </svg>
                </div>
                {state === "expanded" && (
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Wabi Care</span>
                  </div>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className={`${state === "expanded" ? "px-2" : "px-2"}`}>
        {/* Platform Section */}
        <SidebarGroup>
          {state === "expanded" && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Platform</h3>
            </div>
          )}
          <SidebarMenu className={`gap-1 ${state === "expanded" ? "" : "flex items-center flex-col"}`}>
            {memoizedData.platform.map((item) => {
              const Icon = item.icon
              const isExpanded = expandedItems.has(item.title)
              const hasItems = item.items && item.items.length > 0
              
              return (
                <div key={`platform-${item.title}`}>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={hasItems ? isParentActive(item.url) : isActive(item.url)}
                      className={`h-9 ${state === "expanded" ? "w-full justify-between px-3 py-2" : "w-8 mx-auto justify-center py-2"}`}
                      onClick={() => {
                        if (hasItems) {
                          toggleExpanded(item.title)
                        } else {
                          handleNavigation(item.url)
                        }
                      }}
                    >
                      {hasItems ? (
                        <div className={`flex items-center w-full ${state === "expanded" ? "gap-3" : "justify-center"} ${isActive(item.url) ? "text-accent-foreground" : ""}`}>
                          <Icon className="size-4 flex-shrink-0" />
                          {state === "expanded" && (
                            <>
                              <span className="font-medium flex-1 text-left">{item.title}</span>
                              <div className="p-1 flex-shrink-0">
                                {isExpanded ? (
                                  <ChevronDown className="size-3" />
                                ) : (
                                  <ChevronRight className="size-3" />
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div 
                          className={`flex items-center ${state === "expanded" ? "gap-3" : "justify-center"} ${isActive(item.url) ? "text-accent-foreground" : ""}`}
                          onClick={() => handleNavigation(item.url)}
                        >
                          <Icon className="size-4 flex-shrink-0" />
                          {state === "expanded" && (
                            <>
                              <span className="font-medium flex-1 text-left">{item.title}</span>
                              <div className="w-6 h-6 flex-shrink-0"></div>
                            </>
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {hasItems && isExpanded && state === "expanded" && (
                    <div className="ml-4 border-l border-gray-200 pl-4 space-y-1">
                      {item.items!.map((subItem) => (
                        <SidebarMenuItem key={`${item.title}-${subItem.title}`}>
                          <SidebarMenuButton 
                            onClick={() => handleNavigation(subItem.url)}
                            isActive={isActive(subItem.url)}
                            className="w-full px-3 py-1.5 h-8 text-sm cursor-pointer"
                          >
                            <span className="text-muted-foreground hover:text-foreground">
                              {subItem.title}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Reports & Tools Section */}
        <SidebarGroup className="mt-6">
          {state === "expanded" && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reports & Tools</h3>
            </div>
          )}
          <SidebarMenu className={`gap-1 ${state === "expanded" ? "" : "flex items-center flex-col"}`}>
            {memoizedData.reportsAndTools.map((item) => {
              const Icon = item.icon
              const isExpanded = expandedItems.has(item.title)
              const hasItems = item.items && item.items.length > 0
              
              return (
                <div key={`reports-${item.title}`}>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      isActive={hasItems ? isParentActive(item.url) : isActive(item.url)}
                      className={`h-9 ${state === "expanded" ? "w-full justify-between px-3 py-2" : "w-8 mx-auto justify-center py-2"}`}
                      onClick={() => {
                        if (hasItems) {
                          toggleExpanded(item.title)
                        } else {
                          handleNavigation(item.url)
                        }
                      }}
                    >
                      {hasItems ? (
                        <div className={`flex items-center w-full ${state === "expanded" ? "gap-3" : "justify-center"} ${isActive(item.url) ? "text-accent-foreground" : ""}`}>
                          <Icon className="size-4 flex-shrink-0" />
                          {state === "expanded" && (
                            <>
                              <span className="font-medium flex-1 text-left">{item.title}</span>
                              <div className="p-1 flex-shrink-0">
                                {isExpanded ? (
                                  <ChevronDown className="size-3" />
                                ) : (
                                  <ChevronRight className="size-3" />
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <div 
                          className={`flex items-center ${state === "expanded" ? "gap-3" : "justify-center"} ${isActive(item.url) ? "text-accent-foreground" : ""}`}
                          onClick={() => handleNavigation(item.url)}
                        >
                          <Icon className="size-4 flex-shrink-0" />
                          {state === "expanded" && (
                            <>
                              <span className="font-medium flex-1 text-left">{item.title}</span>
                              <div className="w-6 h-6 flex-shrink-0"></div>
                            </>
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {hasItems && isExpanded && state === "expanded" && (
                    <div className="ml-4 border-l border-gray-200 pl-4 space-y-1">
                      {item.items!.map((subItem) => (
                        <SidebarMenuItem key={`${item.title}-${subItem.title}`}>
                          <SidebarMenuButton 
                            onClick={() => handleNavigation(subItem.url)}
                            isActive={isActive(subItem.url)}
                            className="w-full px-3 py-1.5 h-8 text-sm cursor-pointer"
                          >
                            <span className="text-muted-foreground hover:text-foreground">
                              {subItem.title}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
        
        {/* User info and sign out */}
        {user && (
          <SidebarGroup className="mt-auto">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={async () => {
                    await signOut()
                    router.push("/login")
                  }}
                  className="w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="size-4 flex-shrink-0" />
                  {state === "expanded" && (
                    <span className="font-medium flex-1 text-left">Sign Out</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
