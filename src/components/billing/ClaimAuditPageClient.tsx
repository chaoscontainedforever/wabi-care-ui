"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  User,
  Calendar,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Edit
} from "lucide-react"
import PageLayout from "@/components/PageLayout"
import { useBilling } from "@/hooks/useBilling"

// Mock CPT codes mapping
const CPT_CODES = {
  "ABA_DISCRETE_TRIAL": { code: "97153", description: "Adaptive behavior treatment by protocol" },
  "ABA_GROUP": { code: "97154", description: "Group adaptive behavior treatment" },
  "ABA_PARENT_TRAINING": { code: "97155", description: "Adaptive behavior treatment with protocol modification" },
  "ABA_ASSESSMENT": { code: "97151", description: "Behavior identification assessment" },
  "ABA_SUPERVISION": { code: "97156", description: "Family adaptive behavior treatment guidance" },
}

// Mock authorization data
const AUTHORIZATION_DATA = {
  "Alex Johnson": { 
    authNumber: "AUTH001", 
    unitsRemaining: 45, 
    expiresDate: "2024-12-31",
    cptCodes: ["97153", "97154", "97155"]
  },
  "Sarah Williams": { 
    authNumber: "AUTH002", 
    unitsRemaining: 32, 
    expiresDate: "2024-11-15",
    cptCodes: ["97153", "97155"]
  },
  "Michael Chen": { 
    authNumber: "AUTH003", 
    unitsRemaining: 28, 
    expiresDate: "2024-10-30",
    cptCodes: ["97153", "97154"]
  },
}

export default function ClaimAuditPageClient() {
  const { claims, loading } = useBilling()
  const [selectedClaims, setSelectedClaims] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [auditResults, setAuditResults] = useState<any[]>([])

  // Process claims for audit
  const processedClaims = useMemo(() => {
    return claims.map(claim => {
      const sessionDuration = 30 // Mock duration in minutes
      const units = Math.ceil(sessionDuration / 30) // 30 min = 1 unit
      const cptCode = CPT_CODES["ABA_DISCRETE_TRIAL"] // Default mapping
      const authData = AUTHORIZATION_DATA[claim.student_name]
      
      // Pre-validation checks
      const errors = []
      const warnings = []
      
      if (!authData) {
        errors.push("No authorization found")
      } else {
        if (!authData.cptCodes.includes(cptCode.code)) {
          errors.push(`CPT code ${cptCode.code} not authorized`)
        }
        if (authData.unitsRemaining < units) {
          errors.push(`Insufficient units remaining (${authData.unitsRemaining} < ${units})`)
        }
        if (new Date(authData.expiresDate) < new Date()) {
          errors.push("Authorization expired")
        }
      }
      
      if (units > 2) {
        warnings.push("High unit count - verify session duration")
      }
      
      return {
        ...claim,
        cptCode: cptCode.code,
        cptDescription: cptCode.description,
        units,
        sessionDuration,
        authData,
        errors,
        warnings,
        status: errors.length > 0 ? "error" : warnings.length > 0 ? "warning" : "valid"
      }
    })
  }, [claims])

  // Filter claims based on search and status
  const filteredClaims = useMemo(() => {
    return processedClaims.filter(claim => {
      const matchesSearch = claim.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           claim.cptCode.includes(searchTerm) ||
                           claim.authData?.authNumber?.includes(searchTerm)
      
      const matchesStatus = filterStatus === "all" || claim.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }, [processedClaims, searchTerm, filterStatus])

  const handleSelectClaim = (claimId: string) => {
    setSelectedClaims(prev => 
      prev.includes(claimId) 
        ? prev.filter(id => id !== claimId)
        : [...prev, claimId]
    )
  }

  const handleSelectAll = () => {
    if (selectedClaims.length === filteredClaims.length) {
      setSelectedClaims([])
    } else {
      setSelectedClaims(filteredClaims.map(claim => claim.id))
    }
  }

  const handleExportCSV = () => {
    const selectedClaimsData = processedClaims.filter(claim => selectedClaims.includes(claim.id))
    
    const csvHeaders = [
      "Student Name",
      "Session Date", 
      "CPT Code",
      "Units",
      "Duration (min)",
      "Auth Number",
      "Status",
      "Errors",
      "Warnings"
    ]
    
    const csvRows = selectedClaimsData.map(claim => [
      claim.student_name,
      claim.session_date,
      claim.cptCode,
      claim.units,
      claim.sessionDuration,
      claim.authData?.authNumber || "",
      claim.status,
      claim.errors.join("; "),
      claim.warnings.join("; ")
    ])
    
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `claim-audit-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Valid</Badge>
      case "warning":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Warning</Badge>
      case "error":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const stats = useMemo(() => {
    const total = processedClaims.length
    const valid = processedClaims.filter(c => c.status === "valid").length
    const warnings = processedClaims.filter(c => c.status === "warning").length
    const errors = processedClaims.filter(c => c.status === "error").length
    
    return { total, valid, warnings, errors }
  }, [processedClaims])

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Claim Audit</h1>
            <p className="text-muted-foreground">Auto-extract billing data and validate insurance claims</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={handleExportCSV}
              disabled={selectedClaims.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV ({selectedClaims.length})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by student, CPT code, or auth number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Claims</SelectItem>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="warning">Warnings</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Claims Audit Results</CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedClaims.length === filteredClaims.length && filteredClaims.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label className="text-sm">Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                Loading claims...
              </div>
            ) : (
              <div className="space-y-4">
                {filteredClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedClaims.includes(claim.id)}
                          onCheckedChange={() => handleSelectClaim(claim.id)}
                        />
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{claim.student_name}</h3>
                            {getStatusBadge(claim.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {claim.session_date}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              {claim.cptCode} - {claim.cptDescription}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {claim.units} units ({claim.sessionDuration} min)
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${claim.amount}
                            </div>
                          </div>
                          {claim.authData && (
                            <div className="text-sm text-muted-foreground">
                              Auth: {claim.authData.authNumber} | 
                              Units Remaining: {claim.authData.unitsRemaining} | 
                              Expires: {claim.authData.expiresDate}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    {/* Errors and Warnings */}
                    {(claim.errors.length > 0 || claim.warnings.length > 0) && (
                      <div className="mt-3 pt-3 border-t">
                        {claim.errors.map((error, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-red-600 mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            {error}
                          </div>
                        ))}
                        {claim.warnings.map((warning, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-yellow-600 mb-1">
                            <AlertTriangle className="h-4 w-4" />
                            {warning}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {filteredClaims.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No claims found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
