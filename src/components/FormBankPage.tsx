import { AppSidebar } from "./app-sidebar"
import FormBankContent from "./FormBankContent"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Bell, User } from "lucide-react"

export function FormBankPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    Wabi Care
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/assessments">
                    Assessments
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Form Bank</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {/* Profile Section - Aligned with card right borders */}
          <div className="flex items-center space-x-4 ml-auto mr-6">
            {/* Notifications */}
            <button className="relative p-2 text-pink-500 hover:text-purple-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 rounded-lg transition-all duration-200">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-pink-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Dr. Sarah Wilson</p>
                  <p className="text-xs text-gray-500">BCBA</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <FormBankContent />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
