"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AuthorizationService } from "@/lib/services"
import type { BillingClaim } from "./useBilling"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseKey)

const CACHE_TTL = 1000 * 60 * 2 // 2 minutes

interface CacheEntry<T> {
  data?: T
  promise?: Promise<T>
  timestamp: number
}

function createCachedLoader<T>(fetcher: () => Promise<T>, ttlMs = CACHE_TTL) {
  let entry: CacheEntry<T> = { timestamp: 0 }

  const load = async (force = false) => {
    const now = Date.now()
    if (!force && entry.data && now - entry.timestamp < ttlMs) {
      return entry.data
    }

    if (!force && entry.promise) {
      return entry.promise
    }

    const request = fetcher()
      .then((data) => {
        entry = { data, timestamp: Date.now() }
        return data
      })
      .finally(() => {
        entry.promise = undefined
      })

    entry.promise = request
    return request
  }

  const set = (value: T) => {
    entry = { data: value, timestamp: Date.now() }
  }

  const clear = () => {
    entry = { timestamp: 0 }
  }

  return { load, set, clear }
}

const authorizationCache = createCachedLoader(() => AuthorizationService.listAuthorizations())

const FALLBACK_AUTHORIZATIONS = [
  {
    id: "auth-1",
    student_id: "student-1",
    student: { id: "student-1", name: "Alex Johnson", student_id: "AJ001" },
    authorization_number: "AUTH-001",
    payer_name: "BlueCross ABA",
    payer_contact: "claims@bluecross.com",
    service_type: "aba_direct",
    total_units: 120,
    notes: "Initial ABA therapy authorization",
    status: "active",
    effective_on: new Date().toISOString().slice(0, 10),
    expires_on: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25).toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    service: {
      service_key: "aba_direct",
      label: "ABA Direct Therapy",
      default_cpt_code: "97153",
    },
  },
  {
    id: "auth-2",
    student_id: "student-2",
    student: { id: "student-2", name: "Sarah Williams", student_id: "SW002" },
    authorization_number: "AUTH-002",
    payer_name: "Medicaid",
    payer_contact: "medicaid@state.gov",
    service_type: "aba_supervision",
    total_units: 80,
    notes: "Supervision units",
    status: "active",
    effective_on: new Date().toISOString().slice(0, 10),
    expires_on: new Date(Date.now() + 1000 * 60 * 60 * 24 * 55).toISOString().slice(0, 10),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    service: {
      service_key: "aba_supervision",
      label: "ABA Supervision",
      default_cpt_code: "97155",
    },
  },
]

export type AuthorizationWithUsage = {
  id: string
  student_id: string
  student_name: string
  authorization_number: string
  payer_name: string
  payer_contact?: string | null
  service_type: string | null
  service_label?: string
  total_units: number
  units_used: number
  units_remaining: number
  percent_used: number
  status: string
  effective_on: string
  expires_on: string
  days_until_expiry: number
  is_expiring_soon: boolean
  is_expired: boolean
  is_low_units: boolean
  notes?: string | null
}

export type AuthorizationSummary = {
  activeAuthorizations: number
  expiringSoon: number
  expired: number
  lowUnits: number
}

const INCLUDED_STATUSES = new Set(["draft", "pending", "submitted", "ready", "approved", "flagged"])
const LOW_UNIT_THRESHOLD = 0.2
const EXPIRING_WINDOW_DAYS = 30

function diffInDays(futureDate: string) {
  const now = new Date()
  const expires = new Date(futureDate)
  return Math.floor((expires.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

function buildMockAuthorizations() {
  return FALLBACK_AUTHORIZATIONS
}

export function useAuthorizations(claims: BillingClaim[] = []) {
  const [rawAuthorizations, setRawAuthorizations] = useState<AuthorizationWithUsage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const claimsRef = useRef<BillingClaim[]>(claims)

  useEffect(() => {
    claimsRef.current = claims
  }, [claims])

  const claimsSignature = useMemo(() => {
    if (claims.length === 0) return ""
    return claims
      .map((claim) => `${claim.id}:${claim.status}:${claim.units}:${claim.student_id}:${claim.service_type ?? ""}`)
      .sort()
      .join("|")
  }, [claims])

  const loadAuthorizations = useCallback(
    async (force = false) => {
      setLoading(true)
      try {
        let data: any[]
        if (hasSupabaseConfig) {
          data = await authorizationCache.load(force)
        } else {
          data = buildMockAuthorizations()
        }

        if (hasSupabaseConfig) {
          authorizationCache.set(data)
        }

        const snapshot = claimsRef.current

        const normalized = data.map((auth) => {
          const matchingClaims = snapshot.filter((claim) => {
            if (claim.student_id !== auth.student_id) return false
            if (auth.service_type && claim.service_type !== auth.service_type) return false
            return INCLUDED_STATUSES.has(claim.status)
          })

          const unitsUsed = matchingClaims.reduce((sum, claim) => sum + claim.units, 0)
          const unitsRemaining = Math.max(auth.total_units - unitsUsed, 0)
          const percentUsed = auth.total_units === 0 ? 0 : Math.min(100, Math.round((unitsUsed / auth.total_units) * 100))
          const daysUntilExpiry = diffInDays(auth.expires_on)
          const isExpired = daysUntilExpiry < 0
          const isExpiringSoon = !isExpired && daysUntilExpiry <= EXPIRING_WINDOW_DAYS
          const lowUnitThreshold = Math.max(1, Math.round(auth.total_units * LOW_UNIT_THRESHOLD))
          const isLowUnits = unitsRemaining <= lowUnitThreshold

          return {
            id: auth.id,
            student_id: auth.student_id,
            student_name: auth.student?.name ?? "Unknown Student",
            authorization_number: auth.authorization_number,
            payer_name: auth.payer_name,
            payer_contact: auth.payer_contact,
            service_type: auth.service_type,
            service_label: auth.service?.label ?? auth.service_type ?? undefined,
            total_units: auth.total_units,
            units_used: unitsUsed,
            units_remaining: unitsRemaining,
            percent_used: percentUsed,
            status: auth.status,
            effective_on: auth.effective_on,
            expires_on: auth.expires_on,
            days_until_expiry: daysUntilExpiry,
            is_expiring_soon: isExpiringSoon,
            is_expired: isExpired,
            is_low_units: isLowUnits,
            notes: auth.notes,
          }
        })

        setRawAuthorizations(normalized)
        setError(null)
      } catch (err) {
        console.error("Authorizations: failed to load", err)
        setError(err instanceof Error ? err.message : "Failed to load authorizations")
        const snapshot = claimsRef.current
        const fallback = buildMockAuthorizations().map((auth) => {
          const matchingClaims = snapshot.filter((claim) => claim.student_id === auth.student_id)
          const unitsUsed = matchingClaims.reduce((sum, claim) => sum + claim.units, 0)
          const unitsRemaining = Math.max(auth.total_units - unitsUsed, 0)
          const percentUsed = auth.total_units === 0 ? 0 : Math.min(100, Math.round((unitsUsed / auth.total_units) * 100))
          const daysUntilExpiry = diffInDays(auth.expires_on)
          const isExpired = daysUntilExpiry < 0
          const isExpiringSoon = !isExpired && daysUntilExpiry <= EXPIRING_WINDOW_DAYS
          const lowUnitThreshold = Math.max(1, Math.round(auth.total_units * LOW_UNIT_THRESHOLD))
          const isLowUnits = unitsRemaining <= lowUnitThreshold

          return {
            id: auth.id,
            student_id: auth.student_id,
            student_name: auth.student?.name ?? "Unknown Student",
            authorization_number: auth.authorization_number,
            payer_name: auth.payer_name,
            payer_contact: auth.payer_contact,
            service_type: auth.service_type,
            service_label: auth.service?.label ?? auth.service_type ?? undefined,
            total_units: auth.total_units,
            units_used: unitsUsed,
            units_remaining: unitsRemaining,
            percent_used: percentUsed,
            status: auth.status,
            effective_on: auth.effective_on,
            expires_on: auth.expires_on,
            days_until_expiry: daysUntilExpiry,
            is_expiring_soon: isExpiringSoon,
            is_expired: isExpired,
            is_low_units: isLowUnits,
            notes: auth.notes,
          }
        })
        setRawAuthorizations(fallback)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    void loadAuthorizations()
  }, [loadAuthorizations, claimsSignature])

  const summary = useMemo<AuthorizationSummary>(() => {
    const activeAuthorizations = rawAuthorizations.length
    let expiringSoon = 0
    let expired = 0
    let lowUnits = 0

    for (const auth of rawAuthorizations) {
      if (auth.is_expired) {
        expired += 1
      } else {
        if (auth.is_expiring_soon) expiringSoon += 1
        if (auth.is_low_units) lowUnits += 1
      }
    }

    return {
      activeAuthorizations,
      expiringSoon,
      expired,
      lowUnits,
    }
  }, [rawAuthorizations])

  const refresh = useCallback(async () => {
    authorizationCache.clear()
    await loadAuthorizations(true)
  }, [loadAuthorizations])

  return {
    authorizations: rawAuthorizations,
    loading,
    error,
    summary,
    refresh,
  }
}
