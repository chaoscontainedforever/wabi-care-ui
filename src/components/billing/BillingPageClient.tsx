"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Plus,
  Eye,
  Download,
  Clock
} from "lucide-react"
import { PageLayout } from "@/components/PageLayout"
import { useBilling } from "@/hooks/useBilling"
import Link from "next/link"

export default function BillingPageClient() {
  const { claims, loading } = useBilling()

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const totalClaims = claims.length
    const totalAmount = claims.reduce((sum, claim) => sum + (claim.amount || 0), 0)
    const pendingClaims = claims.filter(claim => claim.status === "pending").length
    const approvedClaims = claims.filter(claim => claim.status === "approved").length
    
    return {
      totalClaims,
      totalAmount,
      pendingClaims,
      approvedClaims,
      approvalRate: totalClaims > 0 ? Math.round((approvedClaims / totalClaims) * 100) : 0
    }
  }, [claims])

  // Recent claims for quick overview
  const recentClaims = useMemo(() => {
    return claims
      .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime())
      .slice(0, 5)
  }, [claims])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "rejected":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Billing Dashboard</h1>
            <p className="text-muted-foreground">Overview of billing operations and claim management</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/billing/claim-audit">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Claim Audit
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Claim
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalClaims}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{metrics.pendingClaims}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.approvalRate}%</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Claim Audit
              </CardTitle>
              <CardDescription>
                Auto-extract billing data and validate insurance claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • CPT code mapping (97153, 97155, etc.)
                </div>
                <div className="text-sm text-muted-foreground">
                  • Unit calculation (30 min = 1 unit)
                </div>
                <div className="text-sm text-muted-foreground">
                  • Pre-validation against authorization
                </div>
                <div className="text-sm text-muted-foreground">
                  • Error flagging and CSV export
                </div>
              </div>
              <Link href="/billing/claim-audit">
                <Button className="w-full mt-4">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Go to Claim Audit
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Student Billing
              </CardTitle>
              <CardDescription>
                Manage individual student billing and payment tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • Individual student accounts
                </div>
                <div className="text-sm text-muted-foreground">
                  • Payment history tracking
                </div>
                <div className="text-sm text-muted-foreground">
                  • Outstanding balance management
                </div>
                <div className="text-sm text-muted-foreground">
                  • Insurance coordination
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                Manage Students
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-600" />
                Reports & Export
              </CardTitle>
              <CardDescription>
                Generate billing reports and export data for accounting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  • Monthly billing summaries
                </div>
                <div className="text-sm text-muted-foreground">
                  • Insurance claim reports
                </div>
                <div className="text-sm text-muted-foreground">
                  • Revenue analytics
                </div>
                <div className="text-sm text-muted-foreground">
                  • CSV/Excel export options
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Claims */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Claims
            </CardTitle>
            <CardDescription>
              Latest billing activity and claim submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
                <span className="ml-2">Loading claims...</span>
              </div>
            ) : recentClaims.length > 0 ? (
              <div className="space-y-3">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{claim.student_name}</h4>
                        {getStatusBadge(claim.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {claim.session_date} • ${claim.amount} • {claim.service_type}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent claims found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

