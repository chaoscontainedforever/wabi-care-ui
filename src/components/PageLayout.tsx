"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { useChatAssistant } from "@/components/ChatAssistantProvider"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

interface PageLayoutProps {
  children: React.ReactNode
  breadcrumbs?: {
    label: string
    href?: string
  }[]
  title?: string
}

function PageContentWrapper({ children, breadcrumbs, title }: PageLayoutProps) {
  const { isExpanded, width } = useChatAssistant()
  const [isDesktop, setIsDesktop] = React.useState(false)

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <SidebarInset 
      className="transition-all duration-300 ease-in-out"
      style={{
        marginRight: isExpanded && isDesktop ? `${width + 16}px` : '0px'
      }}
    >
      <header className="flex h-16 shrink-0 items-center gap-2 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">
                Wabi Care
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs?.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  {crumb.href ? (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {title && (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            </div>
          </div>
        )}
        {children}
      </div>
    </SidebarInset>
  )
}

export function PageLayout({ children, breadcrumbs, title }: PageLayoutProps) {
  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "19rem",
          "--sidebar-width-icon": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <PageContentWrapper breadcrumbs={breadcrumbs} title={title}>
        {children}
      </PageContentWrapper>
    </SidebarProvider>
  )
}
