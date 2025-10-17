import { Metadata } from "next"
import ClaimAuditPageClient from "@/components/billing/ClaimAuditPageClient"

export const metadata: Metadata = {
  title: "Claim Audit - Wabi Care",
  description: "Auto-extract billing data and audit insurance claims",
}

export default function ClaimAuditPage() {
  return <ClaimAuditPageClient />
}
