"use client"

import dynamic from "next/dynamic"

const IEPReviewPage = dynamic(() => import("@/components/IEPReviewPage"), {
  loading: () => <div className="flex items-center justify-center h-screen">Loading...</div>
})

export default function IEPReview() {
  return <IEPReviewPage />
}

