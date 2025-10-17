import { Metadata } from "next"
import SessionReportingPageClient from "@/components/session-reporting/SessionReportingPageClient"

export const metadata: Metadata = {
  title: "Session Reporting - Wabi Care",
  description: "Create and edit session reports with dynamic graphs and export capabilities",
}

export default function SessionReportingPage() {
  return <SessionReportingPageClient />
}
