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
  Menu
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
const roleNavigationMap: Record<string, string[]> = {
  RBT: ["Students", "Data Collection", "Scheduling"],
  BCBA: ["Students", "Data Collection", "Scheduling"],
  Administrator: ["Students", "Scheduling"],
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
      url: "/student-overview",
      icon: Users,
    },
    {
      title: "Data Collection",
      url: "/goal-data-2",
      icon: ClipboardList,
    },
    {
      title: "Scheduling",
      url: "/calendar",
      icon: CalendarClock,
    },
    {
      title: "IEP Management",
      url: "/iep-review",
      icon: Target,
    },
  ],
  reportsAndTools: [
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
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
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [navSections, setNavSections] = useState<string[] | null>(null)
  const [loadingPersona, setLoadingPersona] = useState(false)
  const [personaLabel, setPersonaLabel] = useState<string | null>(null)
  const { state, setOpen } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { user } = useAuth()



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
        if (!prev.includes(parentCategory)) {
          return [...prev, parentCategory]
        }
        return prev
      })
    }
  }, [pathname, findParentCategory])

  const toggleExpanded = useCallback((title: string) => {
    setExpandedItems(prev => {
      if (prev.includes(title)) {
        return prev.filter(item => item !== title)
      } else {
        return [...prev, title]
      }
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
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      {/* No header - logo moved to top navigation bar */}
      <SidebarContent className={`${state === "expanded" ? "px-6 pt-20" : "px-0 pt-20"}`}>
        {/* Platform Section */}
        <SidebarGroup>
          {state === "expanded" && (
            <div className="px-0 py-1.5">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Platform</h3>
            </div>
          )}
          <SidebarMenu className={`gap-1 ${state === "expanded" ? "" : "flex items-center flex-col justify-center"}`}>
            {loadingPersona && memoizedData.platform.length === 0 ? (
              <div className="px-0 py-2 text-xs text-muted-foreground">Loading navigation…</div>
            ) : memoizedData.platform.length === 0 ? (
              <div className="px-0 py-2 text-xs text-muted-foreground">No sections assigned</div>
            ) : memoizedData.platform.map((item) => {
              const Icon = item.icon
              const isExpanded = expandedItems.includes(item.title)
              const hasItems = item.items && item.items.length > 0
              
              return (
                <React.Fragment key={`platform-${item.title}`}>
                  <SidebarMenuItem className={state === "collapsed" ? "flex justify-center" : ""}>
                    <SidebarMenuButton 
                      type="button"
                      isActive={hasItems ? isParentActive(item.url) : isActive(item.url)}
                      className={`h-8 ${state === "expanded" ? "w-full justify-between px-0 py-1.5" : "w-8 mx-auto justify-center items-center py-1.5"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        if (hasItems) {
                          toggleExpanded(item.title)
                        } else {
                          handleNavigation(item.url)
                        }
                      }}
                    >
                      {hasItems ? (
                        <div className={`flex items-center w-full ${state === "expanded" ? "gap-3" : "justify-center"} ${isActive(item.url) ? "text-accent-foreground" : ""} pointer-events-none`}>
                          <Icon className="size-4 flex-shrink-0 pointer-events-none" />
                          {state === "expanded" && (
                            <>
                              <span className="font-medium flex-1 text-left text-sm leading-tight pointer-events-none">{item.title}</span>
                              <div className="p-1 flex-shrink-0 pointer-events-none">
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
                          className={`flex items-center w-full ${state === "expanded" ? "gap-3" : "justify-center"} ${isActive(item.url) ? "text-accent-foreground" : ""} pointer-events-none`}
                        >
                          <Icon className="size-4 flex-shrink-0 pointer-events-none" />
                          {state === "expanded" && (
                            <>
                              <span className="font-medium flex-1 text-left text-sm leading-tight pointer-events-none">{item.title}</span>
                              <div className="w-6 h-6 flex-shrink-0 pointer-events-none"></div>
                            </>
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {hasItems && isExpanded && state === "expanded" && (
                    <div className="ml-4 border-l border-gray-200 pl-4 space-y-1 mt-1">
                      {item.items!.map((subItem) => (
                        <SidebarMenuItem key={`${item.title}-${subItem.title}`}>
                          <SidebarMenuButton 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              handleNavigation(subItem.url)
                            }}
                            isActive={isActive(subItem.url)}
                            className="w-full px-0 py-1 h-7 text-sm cursor-pointer"
                          >
                            <span className="text-sidebar-foreground font-medium hover:text-foreground leading-normal pointer-events-none">
                              {subItem.title}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Reports & Tools Section */}
        <SidebarGroup className="mt-6">
          {state === "expanded" && (
            <div className="px-3 py-1.5">
              <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Reports & Tools</h3>
            </div>
          )}
          <SidebarMenu className={`gap-1 ${state === "expanded" ? "" : "flex items-center flex-col justify-center"}`}>
            {loadingPersona && memoizedData.reportsAndTools.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">Loading navigation…</div>
            ) : memoizedData.reportsAndTools.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">No sections assigned</div>
            ) : memoizedData.reportsAndTools.map((item) => {
              const Icon = item.icon
              const isExpanded = expandedItems.includes(item.title)
              const hasItems = item.items && item.items.length > 0
              
              return (
                <React.Fragment key={`reports-${item.title}`}>
                  <SidebarMenuItem className={state === "collapsed" ? "flex justify-center" : ""}>
                    <SidebarMenuButton 
                      type="button"
                      isActive={hasItems ? isParentActive(item.url) : isActive(item.url)}
                      className={`h-8 ${state === "expanded" ? "w-full justify-between px-0 py-1.5" : "w-8 mx-auto justify-center items-center py-1.5"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        if (hasItems) {
                          toggleExpanded(item.title)
                        } else {
                          handleNavigation(item.url)
                        }
                      }}
                    >
                      {hasItems ? (
                        <div className={`flex items-center w-full ${state === "expanded" ? "gap-3" : "justify-center"} ${isActive(item.url) ? "text-accent-foreground" : ""} pointer-events-none`}>
                          <Icon className="size-4 flex-shrink-0 pointer-events-none" />
                          {state === "expanded" && (
                            <>
                              <span className="font-medium flex-1 text-left text-sm leading-tight pointer-events-none">{item.title}</span>
                              <div className="p-1 flex-shrink-0 pointer-events-none">
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
                          className={`flex items-center w-full ${state === "expanded" ? "gap-3" : "justify-center"} ${isActive(item.url) ? "text-accent-foreground" : ""} pointer-events-none`}
                        >
                          <Icon className="size-4 flex-shrink-0 pointer-events-none" />
                          {state === "expanded" && (
                            <>
                              <span className="font-medium flex-1 text-left text-sm leading-tight pointer-events-none">{item.title}</span>
                              <div className="w-6 h-6 flex-shrink-0 pointer-events-none"></div>
                            </>
                          )}
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {hasItems && isExpanded && state === "expanded" && (
                    <div className="ml-4 border-l border-gray-200 pl-4 space-y-1 mt-1">
                      {item.items!.map((subItem) => (
                        <SidebarMenuItem key={`${item.title}-${subItem.title}`}>
                          <SidebarMenuButton 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              handleNavigation(subItem.url)
                            }}
                            isActive={isActive(subItem.url)}
                            className="w-full px-0 py-1 h-7 text-sm cursor-pointer"
                          >
                            <span className="text-sidebar-foreground font-medium hover:text-foreground leading-normal pointer-events-none">
                              {subItem.title}
                            </span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
