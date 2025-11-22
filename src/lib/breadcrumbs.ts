export type BreadcrumbItem = {
  label: string
  href?: string
}

// Navigation structure matching app-sidebar.tsx
const navigationData = {
  platform: [
    { title: "Dashboard", url: "/dashboard" },
    {
      title: "Students",
      url: "/student-overview",
      items: [
        { title: "Student Overview", url: "/student-overview" },
      ],
    },
    {
      title: "Data Collection",
      url: "/goal-data-2",
    },
    {
      title: "Scheduling",
      url: "/calendar",
    },
    {
      title: "IEP Management",
      url: "/iep-review",
    },
  ],
  reportsAndTools: [
    {
      title: "Reports",
      url: "/reports",
    },
    { title: "Tasks", url: "/tasks" },
    {
      title: "Settings",
      url: "/settings",
    },
  ],
}

/**
 * Generate breadcrumbs dynamically based on the current pathname
 * by looking up the navigation structure
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const studentPathLabels: Record<string, string> = {
    "/students": "Student Overview",
    "/students/new": "Student Intake",
  }

  if (pathname === "/students" || pathname.startsWith("/students/")) {
    const label = studentPathLabels[pathname] ?? pathname.split("/").filter(Boolean).slice(1).pop()?.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") ?? "Students"
    return [
      { label: "Students", href: "/student-overview" },
      { label },
    ]
  }

  const allItems = [...navigationData.platform, ...navigationData.reportsAndTools]
  const breadcrumbs: BreadcrumbItem[] = []

  // Find the matching item in the navigation structure
  for (const item of allItems) {
    // Check if pathname matches the main item URL
    if (pathname === item.url || pathname.startsWith(item.url + '/')) {
      breadcrumbs.push({ label: item.title, href: item.url })

      // If the item has sub-items, check if we're on a sub-item page
      if (item.items) {
        for (const subItem of item.items) {
          if (pathname === subItem.url || pathname.startsWith(subItem.url)) {
            breadcrumbs.push({ label: subItem.title })
            break
          }
        }
      }
      break
    }
  }

  // If no match found, generate from pathname
  if (breadcrumbs.length === 0) {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length > 0) {
      // Capitalize and format segment names
      const lastSegment = segments[segments.length - 1]
      const label = lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      breadcrumbs.push({ label })
    }
  }

  return breadcrumbs
}

