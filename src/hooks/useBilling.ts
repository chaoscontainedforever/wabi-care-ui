import { useState, useCallback, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import { useStudents } from "./useSupabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export type BillingClaim = {
  id: string
  student_name: string
  session_date: string
  cpt_code: string
  units: number
  status: "pending" | "flagged" | "ready" | "approved"
  amount: number
  service_type?: string
}

export type BillingOverview = {
  pendingCount: number
  pendingValue: number
  readyCount: number
  readyValue: number
  auditConfidence: number
  flaggedRate: number
}

export function useBilling() {
  const [claims, setClaims] = useState<BillingClaim[]>([])
  const [loading, setLoading] = useState(true)
  const { students } = useStudents()

  const computeMetrics = (claimsData: BillingClaim[]): BillingOverview => {
    const pending = claimsData.filter((claim) => claim.status === "pending")
    const ready = claimsData.filter((claim) => claim.status === "ready")
    const flagged = claimsData.filter((claim) => claim.status === "flagged")

    const pendingValue = pending.reduce((sum, claim) => sum + claim.amount, 0)
    const readyValue = ready.reduce((sum, claim) => sum + claim.amount, 0)

    const lastTen = [...claimsData]
      .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime())
      .slice(0, 10)

    const readyInLastTen = lastTen.filter((claim) => claim.status === "ready").length
    const auditConfidence = lastTen.length === 0 ? 0 : Math.round((readyInLastTen / lastTen.length) * 100)

    const flaggedRate = claimsData.length === 0 ? 0 : Math.round((flagged.length / claimsData.length) * 100)

    return {
      pendingCount: pending.length,
      pendingValue,
      readyCount: ready.length,
      readyValue,
      auditConfidence,
      flaggedRate,
    }
  }

  const [metrics, setMetrics] = useState<BillingOverview>(() => computeMetrics([]))

  const fetchClaims = useCallback(async () => {
    setLoading(true)
    
    console.log('Billing: Students data:', students)
    console.log('Billing: Students count:', students.length)
    
    // If no students, create some sample data for demonstration
    if (students.length === 0) {
      console.log('Billing: No students found, creating sample data')
      const sampleStudents = [
        { id: '1', name: 'Alex Johnson' },
        { id: '2', name: 'Sarah Williams' },
        { id: '3', name: 'Michael Chen' },
        { id: '4', name: 'Emma Davis' },
        { id: '5', name: 'James Wilson' }
      ]
      
      const mockClaims: BillingClaim[] = sampleStudents.map((student, index) => {
        const sessionDate = new Date()
        sessionDate.setDate(sessionDate.getDate() - (index * 2))
        
        const cptCodes = ["97153", "97155", "97156"]
        const cptCode = cptCodes[index % cptCodes.length]
        const units = Math.floor(Math.random() * 3) + 1
        const baseRate = cptCode === "97153" ? 56.25 : cptCode === "97155" ? 75.00 : 45.00
        const amount = baseRate * units
        
        const serviceTypes = ["ABA Therapy", "Group Session", "Parent Training", "Assessment"]
        const serviceType = serviceTypes[index % serviceTypes.length]
        
        const statuses: ("pending" | "flagged" | "ready" | "approved")[] = ["pending", "pending", "flagged", "ready", "approved"]
        const status = statuses[index % statuses.length]
        
        return {
          id: `claim-${student.id}-${index}`,
          student_name: student.name,
          session_date: sessionDate.toISOString(),
          cpt_code: cptCode,
          units,
          status,
          amount,
          service_type: serviceType,
        }
      })
      
      setClaims(mockClaims)
      setMetrics(computeMetrics(mockClaims))
      setLoading(false)
      return
    }
    
    // Create realistic billing claims based on actual students
    const mockClaims: BillingClaim[] = students.slice(0, 5).map((student, index) => {
      const sessionDate = new Date()
      sessionDate.setDate(sessionDate.getDate() - (index * 2)) // Spread sessions over the last 10 days
      
      // Generate realistic billing data
      const cptCodes = ["97153", "97155", "97156"]
      const cptCode = cptCodes[index % cptCodes.length]
      const units = Math.floor(Math.random() * 3) + 1 // 1-3 units
      const baseRate = cptCode === "97153" ? 56.25 : cptCode === "97155" ? 75.00 : 45.00
      const amount = baseRate * units
      
      const serviceTypes = ["ABA Therapy", "Group Session", "Parent Training", "Assessment"]
      const serviceType = serviceTypes[index % serviceTypes.length]
      
      // Assign realistic statuses
      const statuses: ("pending" | "flagged" | "ready" | "approved")[] = ["pending", "pending", "flagged", "ready", "approved"]
      const status = statuses[index % statuses.length]
      
      return {
        id: `claim-${student.id}-${index}`,
        student_name: student.name,
        session_date: sessionDate.toISOString(),
        cpt_code: cptCode,
        units,
        status,
        amount,
        service_type: serviceType,
      }
    })
    
    setClaims(mockClaims)
    setMetrics(computeMetrics(mockClaims))
    setLoading(false)
  }, [students])

  useEffect(() => {
    if (students.length > 0) {
      fetchClaims()
    }
  }, [fetchClaims, students])

  const { pendingCount, pendingValue, readyCount, readyValue, auditConfidence, flaggedRate } = metrics

  const billingOverview = {
    pendingCount,
    pendingValue,
    readyCount,
    readyValue,
    auditConfidence,
    flaggedRate,
  }

  return { claims, loading, refresh: fetchClaims, billingOverview }
}
