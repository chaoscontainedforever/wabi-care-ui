"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNavigationBar } from "@/components/TopNavigationBar"
import { useChatAssistant } from "@/components/ChatAssistantProvider"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { generateBreadcrumbs } from "@/lib/breadcrumbs"

interface PageLayoutProps {
  children: React.ReactNode
  breadcrumbs?: {
    label: string
    href?: string
  }[]
  title?: string
}

function PageContentWrapper({ children, title }: PageLayoutProps) {
  const { isExpanded, width } = useChatAssistant()
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <SidebarInset 
      className="flex-1 flex flex-col transition-all duration-300 ease-in-out overflow-hidden min-w-0"
      style={{
        marginRight: isExpanded && isDesktop ? `${width + 16}px` : '0px'
      }}
    >
      <div className="flex-1 flex flex-col gap-4 pt-4 px-4 pb-4 overflow-auto">
        {title && (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
            </div>
          </div>
        )}
        {children}
      </div>
    </SidebarInset>
  )
}

export function PageLayout({ children, breadcrumbs, title }: PageLayoutProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs dynamically if not provided
  const finalBreadcrumbs = breadcrumbs || generateBreadcrumbs(pathname)
  
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "4.5rem",
          minHeight: 0,
        } as React.CSSProperties
      }
      className="flex flex-col h-screen w-full"
    >
      <div className="flex flex-col h-screen w-full">
        {/* Top bar extends full width and merges with sidebar */}
        <TopNavigationBar breadcrumbs={finalBreadcrumbs} />
        <div className="flex flex-1 overflow-hidden w-full">
          <AppSidebar />
          <PageContentWrapper title={title}>
            {children}
          </PageContentWrapper>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default PageLayout
