"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBillingClaims } from "@/hooks/useBilling"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, CheckCircle, AlertTriangle } from "lucide-react"
import type { ViewMode } from "@/components/ui/view-mode-toggle"

interface BillingWorkspaceProps {
  variant?: "sheet" | "full"
  open?: boolean
  onOpenChange?: (open: boolean) => void
  viewMode?: ViewMode
}

export function BillingWorkspace({ variant = "sheet", open = false, onOpenChange, viewMode = "table" }: BillingWorkspaceProps) {
  const { claims, loading } = useBillingClaims()
  const [activeTab, setActiveTab] = useState("pending")

  const pendingClaims = claims.filter(claim => claim.status === "pending")
  const flaggedClaims = claims.filter(claim => claim.status === "flagged")
  const readyClaims = claims.filter(claim => claim.status === "ready")

  const workspaceTabs = (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="flagged">Flagged</TabsTrigger>
        <TabsTrigger value="ready">Ready to Export</TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="pt-4">
        <BillingTable loading={loading} claims={pendingClaims} emptyMessage="No pending claims." />
      </TabsContent>
      <TabsContent value="flagged" className="pt-4">
        <BillingTable loading={loading} claims={flaggedClaims} emptyMessage="No flagged claims." />
      </TabsContent>
      <TabsContent value="ready" className="pt-4">
        <BillingTable loading={loading} claims={readyClaims} emptyMessage="No ready claims yet." />
        {readyClaims.length > 0 && (
          <Button className="mt-4">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        )}
      </TabsContent>
    </Tabs>
  )

  const referenceCard = (
    <Card className="border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">CPT Mapping Reference</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p><Badge variant="outline">97153</Badge> Adaptive behavior treatment by protocol – RBT sessions.</p>
        <p><Badge variant="outline">97155</Badge> Adaptive behavior treatment with protocol modification – BCBA supervision.</p>
        <p><Badge variant="outline">97156</Badge> Family adaptive behavior treatment guidance.</p>
      </CardContent>
    </Card>
  )

  if (variant === "full") {
    return (
      <div className="rounded-xl border border-muted bg-card shadow-sm p-6 space-y-6">
        {viewMode === "table" && workspaceTabs}
        {viewMode !== "table" && (
          <div className={viewMode === "cards" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "space-y-3"}>
            {(activeTab === "pending" ? pendingClaims : activeTab === "flagged" ? flaggedClaims : readyClaims).map((claim) => (
              <Card key={claim.id} className="border border-muted/60">
                <CardHeader className={viewMode === "cards" ? "pb-3" : "pb-2"}>
                  <CardTitle className="text-lg font-semibold text-foreground">{claim.student_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{new Date(claim.session_date).toLocaleString()}</p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">CPT</span>
                    <span>{claim.cpt_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Units</span>
                    <span>{claim.units}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-foreground">Amount</span>
                    <span>${claim.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant={claim.status === "flagged" ? "destructive" : claim.status === "ready" ? "secondary" : "outline"}>
                      {claim.status === "ready" ? "Ready" : claim.status === "flagged" ? "Flagged" : "Pending"}
                    </Badge>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {referenceCard}
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange ?? (() => {})}>
      <SheetContent side="right" className="max-w-5xl mx-auto w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Smart Billing Workspace</SheetTitle>
          <SheetDescription>
            Review claim data, validate CPT mappings, and prepare exports for your billing workflow.
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pb-6 space-y-4">
          {workspaceTabs}
          {referenceCard}
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface BillingTableProps {
  loading: boolean
  claims: ReturnType<typeof useBillingClaims>["claims"]
  emptyMessage: string
}

function BillingTable({ loading, claims, emptyMessage }: BillingTableProps) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading claims…</p>
  }

  if (claims.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Session Date</TableHead>
          <TableHead>CPT</TableHead>
          <TableHead>Units</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.map((claim) => (
          <TableRow key={claim.id}>
            <TableCell>{claim.student_name}</TableCell>
            <TableCell>{new Date(claim.session_date).toLocaleDateString()}</TableCell>
            <TableCell>{claim.cpt_code}</TableCell>
            <TableCell>{claim.units}</TableCell>
            <TableCell>
              {claim.status === "ready" ? (
                <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" /> Ready</Badge>
              ) : claim.status === "flagged" ? (
                <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" /> Flagged</Badge>
              ) : (
                <Badge variant="outline">Pending</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">${claim.amount.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
