"use client"

import dynamic from "next/dynamic"

const AllStudentsPage = dynamic(() => import("@/components/AllStudentsPage").then(mod => ({ default: mod.AllStudentsPage })), {
  loading: () => <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>
})

export default function Students() {
  return <AllStudentsPage />
}
