import type { Metadata } from "next"
import AuthorizationsPageClient from "@/components/billing/AuthorizationsPageClient"

export const metadata: Metadata = {
  title: "Authorizations | Wabi Care",
  description: "Monitor insurance authorizations, utilization, and renewal timelines.",
}

export default function AuthorizationsPage() {
  return <AuthorizationsPageClient />
}
