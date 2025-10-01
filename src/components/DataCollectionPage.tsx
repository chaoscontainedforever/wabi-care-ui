import { memo, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import DataCollectionContent from "./DataCollectionContentFixed"
import { PageLayout } from "./PageLayout"

export const DataCollectionPage = memo(function DataCollectionPage() {
  const searchParams = useSearchParams()
  const preselectedStudent = useMemo(() => searchParams?.get("student") || null, [searchParams])
  
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Data Collection", href: "/data-collection" },
        { label: "AFLS Assessment" }
      ]}
      title="Data Collection"
    >
      <DataCollectionContent preselectedStudentId={preselectedStudent} />
    </PageLayout>
  )
})
