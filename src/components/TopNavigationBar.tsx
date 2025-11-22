"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useChatAssistant } from "@/components/ChatAssistantProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Search, Sparkles, User, Settings, LogOut, Grid3X3, MessageSquare, Gift, Users, Briefcase, Mail, MessageCircle } from "lucide-react"

interface TopNavigationBarProps {
  breadcrumbs?: {
    label: string
    href?: string
  }[]
}

export function TopNavigationBar({ breadcrumbs = [] }: TopNavigationBarProps) {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { isExpanded, toggleChat } = useChatAssistant()
  const { state } = useSidebar()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center gap-4 border-b border-sidebar-border bg-sidebar text-sidebar-foreground">
      {/* Logo section with padding and right border */}
      <div 
        className={`flex items-center border-r border-sidebar-border transition-all duration-200 ease-in-out ${state === 'collapsed' ? 'justify-center px-0' : 'gap-3 px-6'}`}
        style={{ 
          width: state === 'collapsed' ? 'var(--sidebar-width-icon, 4.5rem)' : 'var(--sidebar-width, 16rem)'
        }}
      >
        {state === 'collapsed' ? (
          <div className="flex items-center justify-center w-full h-full">
            <Image
              src="/logo.png"
              alt="Wabi Care Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex aspect-square size-8 items-center justify-center flex-shrink-0">
              {/* Enso-style brushstroke logo */}
              <Image
                src="/logo.png"
                alt="Wabi Care Logo"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">Wabi School</span>
          </div>
        )}
      </div>
      
      {/* Collapse button outside the logo box */}
      {state === 'collapsed' && (
        <SidebarTrigger className="flex-shrink-0 ml-2" />
      )}
      {state === 'expanded' && (
        <SidebarTrigger className="flex-shrink-0 ml-2" />
      )}

      {/* Breadcrumbs - with padding to match sidebar */}
      <div className="px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard">
              Wabi Care
            </BreadcrumbLink>
          </BreadcrumbItem>
          {(breadcrumbs || []).map((crumb, index) => (
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
      </div>

      {/* Spacer to push right content */}
      <div className="flex-1" />

      {/* Right Side - Search Bar, AI Copilot Button and User Profile */}
      <div className="flex items-center gap-3 px-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-7 pr-7 h-8 text-sm bg-background max-w-xs"
            readOnly
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
            ⌘K
          </span>
        </div>
        {/* AI Copilot Button */}
        <Button
          onClick={toggleChat}
          variant={isExpanded ? "secondary" : "default"}
          className="h-9 gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>AI Copilot</span>
        </Button>

        {/* Wabi Tools Launcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full hover:bg-muted/50 data-[state=open]:bg-muted/70"
            >
              <Grid3X3 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[240px] p-3 shadow-lg"
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Communication */}
              <button
                className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  router.push("/communication")
                }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">Communication</span>
              </button>

              {/* Rewards */}
              <button
                className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  router.push("/rewards")
                }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">Rewards</span>
              </button>

              {/* Parent Portal */}
              <button
                className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  window.open("/parent-portal", "_blank", "noopener,noreferrer")
                }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">Parent Portal</span>
              </button>

              {/* HRMS */}
              <button
                className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  router.push("/hrms")
                }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">HRMS</span>
              </button>

              {/* Email */}
              <button
                className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  router.push("/email")
                }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">Email</span>
              </button>

              {/* Chat */}
              <button
                className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
                onClick={() => {
                  router.push("/chat")
                }}
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs font-medium text-center text-foreground">Chat</span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={
                      user.user_metadata?.avatar_url ||
                      user.user_metadata?.picture
                    }
                    alt={user.user_metadata?.full_name || user.email || "User"}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium">
                    {user.user_metadata?.full_name
                      ? user.user_metadata.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  )
}

