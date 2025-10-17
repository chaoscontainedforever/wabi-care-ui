"use client"

import { useBillingClaims } from "@/hooks/useBilling"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Receipt, Loader2, AlertTriangle } from "lucide-react"

interface BillingSummaryCardProps {
  onOpenWorkspace: () => void
}

export function BillingSummaryCard({ onOpenWorkspace }: BillingSummaryCardProps) {
  const { claims, loading } = useBillingClaims()
  const pendingCount = claims.filter(c => c.status === "pending").length
  const flaggedCount = claims.filter(c => c.status === "flagged").length

  return (
    <Card className="shadow-none border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span>Smart Billing</span>
          <Badge variant="secondary" className="text-xs">Beta</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-start space-x-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading claims…</span>
              </div>
            ) : (
              <>
                <p><span className="font-semibold text-foreground">{pendingCount}</span> pending submissions</p>
                <p><span className="font-semibold text-foreground">{flaggedCount}</span> flagged for review</p>
              </>
            )}
          </div>
        </div>

        {flaggedCount > 0 && (
          <div className="flex items-center space-x-2 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>Action required: review flagged claims before export.</span>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full" onClick={onOpenWorkspace}>
          Open Billing Workspace
        </Button>
      </CardContent>
    </Card>
  )
}
