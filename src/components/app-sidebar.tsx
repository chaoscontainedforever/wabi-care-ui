"use client"

import * as React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/AuthContext"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { 
  Users, 
  Target, 
  BarChart3, 
  Settings,
  ClipboardList,
  TrendingUp,
  Calendar,
  CalendarClock,
  Receipt,
  Home,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut,
  User
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Wabi Care navigation data for special education platform
const roleNavigationMap: Record<string, string[]> = {
  RBT: ["Students", "Data Collection", "Scheduling"],
  BCBA: ["Students", "Data Collection", "Scheduling"],
  Administrator: ["Students", "Scheduling", "Smart Billing"],
  Parent: ["Scheduling", "Data Collection"],
}

const navigationData = {
  platform: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Students",
      url: "/students",
      icon: Users,
      items: [
        { title: "Student Intake", url: "/students/new" },
        { title: "All Students", url: "/students" },
        { title: "Student Overview", url: "/student-overview" },
      ],
    },
    {
      title: "Data Collection",
      url: "/goal-data",
      icon: ClipboardList,
      items: [
        { title: "Goal Data", url: "/goal-data" },
        { title: "Session Reporting", url: "/session-reporting" },
        { title: "Goal Bank", url: "/iep-goals" },
        { title: "Form Bank", url: "/form-bank" },
      ],
    },
    {
      title: "Smart Billing",
      url: "/billing",
      icon: Receipt,
      items: [
        { title: "Dashboard", url: "/billing" },
        { title: "Claim Audit", url: "/billing/claim-audit" },
      ],
    },
    {
      title: "Scheduling",
      url: "/scheduling",
      icon: CalendarClock,
      items: [
        { title: "Dashboard", url: "/scheduling" },
        { title: "Calendar", url: "/calendar" },
      ],
    },
    {
      title: "IEP Management",
      url: "/iep",
      icon: Target,
      items: [
        { title: "IEP Review", url: "/iep-review" },
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
  const [navSections, setNavSections] = useState<string[] | null>(null)
  const [loadingPersona, setLoadingPersona] = useState(false)
  const [personaLabel, setPersonaLabel] = useState<string | null>(null)
  const { state, setOpen } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { user, signOut } = useAuth()

  useEffect(() => {
    if (!user?.email) {
      setNavSections(null)
      setPersonaLabel(null)
      return
    }

    const sectionsKey = `navSections:${user.email}`
    const personaKey = `personaLabel:${user.email}`

    let hasCachedData = false
    if (typeof window !== "undefined") {
      const storedSections = window.sessionStorage.getItem(sectionsKey)
      if (storedSections) {
        try {
          const parsed = JSON.parse(storedSections) as string[]
          if (Array.isArray(parsed)) {
            setNavSections(parsed)
            hasCachedData = true
          }
        } catch (err) {
          console.warn("Failed to parse cached nav sections", err)
        }
      }
      const storedPersona = window.sessionStorage.getItem(personaKey)
      if (storedPersona) {
        setPersonaLabel(storedPersona)
      }
    }

    let isMounted = true
    const fetchPersonaNav = async () => {
      // If Supabase env vars are missing, fall back immediately to full navigation
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase env vars missing. Falling back to default navigation.")
        setNavSections(null)
        setPersonaLabel(null)
        setLoadingPersona(false)
        return
      }

      try {
        if (!hasCachedData) {
          setLoadingPersona(true)
        }
        const supabase = createClientComponentClient()
        const { data, error } = await supabase
          .from("user_portal_roles")
          .select("nav_sections, persona")
          .eq("email", user.email)
          .maybeSingle()

        if (error) throw error
        if (!isMounted) return

        const sections = data?.nav_sections ?? null
        const persona = data?.persona ?? null
        setNavSections(sections)
        setPersonaLabel(persona)

        if (typeof window !== "undefined") {
          if (sections) {
            window.sessionStorage.setItem(sectionsKey, JSON.stringify(sections))
          } else {
            window.sessionStorage.removeItem(sectionsKey)
          }

          if (persona) {
            window.sessionStorage.setItem(personaKey, persona)
          } else {
            window.sessionStorage.removeItem(personaKey)
          }
        }
      } catch (err) {
        console.error("Failed to load persona navigation", err)
        if (!isMounted) return
        setNavSections(null)
        setPersonaLabel(null)
        if (typeof window !== "undefined") {
          window.sessionStorage.removeItem(sectionsKey)
          window.sessionStorage.removeItem(personaKey)
        }
      } finally {
        if (isMounted) {
          setLoadingPersona(false)
        }
      }
    }

    fetchPersonaNav()

    return () => {
      isMounted = false
    }
  }, [user?.email])

  const filteredNavigationData = useMemo(() => {
    if (!navSections) {
      return navigationData
    }

    const filteredPlatform = navigationData.platform.filter((item) =>
      item.title === "Dashboard" || navSections.includes(item.title)
    )

    return {
      platform: filteredPlatform,
      reportsAndTools: navigationData.reportsAndTools,
    }
  }, [navSections])

  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => filteredNavigationData, [filteredNavigationData])

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

      {/* Separator line between logo and navigation */}
      <div className="px-2">
        <div className="h-px bg-sidebar-border"></div>
      </div>
      
      <SidebarContent className={`${state === "expanded" ? "px-2" : "px-2"}`}>
        {/* Platform Section */}
        <SidebarGroup>
          {state === "expanded" && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Platform</h3>
            </div>
          )}
          <SidebarMenu className={`gap-1 ${state === "expanded" ? "" : "flex items-center flex-col"}`}>
            {loadingPersona && memoizedData.platform.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">Loading navigation…</div>
            ) : memoizedData.platform.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">No sections assigned</div>
            ) : memoizedData.platform.map((item) => {
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
            {loadingPersona && memoizedData.reportsAndTools.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">Loading navigation…</div>
            ) : memoizedData.reportsAndTools.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">No sections assigned</div>
            ) : memoizedData.reportsAndTools.map((item) => {
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
        
        {/* User Profile Section at Bottom */}
        {user && (
          <SidebarGroup className="mt-auto">
            <SidebarMenu>
              {/* User Profile with Logout Icon */}
              <SidebarMenuItem>
                <div className={`flex items-center ${state === "expanded" ? "gap-3 px-3 py-2" : "flex-col py-2"}`}>
                  {/* Profile Section - Clickable */}
                  <div 
                    className={`flex items-center cursor-pointer hover:bg-sidebar-accent rounded-md transition-colors ${state === "expanded" ? "flex-1 gap-3" : "justify-center"}`}
                    onClick={() => handleNavigation("/profile")}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.user_metadata?.avatar_url || user.user_metadata?.picture} 
                        alt={user.user_metadata?.full_name || user.email || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium">
                        {user.user_metadata?.full_name 
                          ? user.user_metadata.full_name.split(' ').map(n => n[0]).join('')
                          : user.email?.[0]?.toUpperCase() || 'U'
                        }
                      </AvatarFallback>
                    </Avatar>
                    
                    {state === "expanded" && (
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-foreground truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0] || "User"}
                        </span>
                         <span className="text-xs text-muted-foreground truncate">
                           {personaLabel ?? "Member"}
                         </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Logout Icon */}
                  <SidebarMenuButton 
                    onClick={async () => {
                      await signOut()
                      router.push("/login")
                    }}
                    className={`h-8 w-8 p-0 hover:bg-sidebar-accent ${state === "expanded" ? "" : "mx-auto"}`}
                  >
                    <LogOut className="size-4 flex-shrink-0" />
                  </SidebarMenuButton>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
