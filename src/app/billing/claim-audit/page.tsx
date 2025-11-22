import { Metadata } from "next"
import { Suspense } from "react"
import ClaimAuditPageClient from "@/components/billing/ClaimAuditPageClient"

export const metadata: Metadata = {
  title: "Claim Audit - Wabi Care",
  description: "Auto-extract billing data and audit insurance claims",
}

export default function ClaimAuditPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ClaimAuditPageClient />
    </Suspense>
  )
}
