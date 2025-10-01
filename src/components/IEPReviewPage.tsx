import { memo } from "react"
import IEPReviewContent from "./IEPReviewContent"
import { PageLayout } from "./PageLayout"

export function IEPReviewPage() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "IEP Management", href: "/iep" },
        { label: "IEP Review" }
      ]}
      title="IEP Review"
    >
      <IEPReviewContent />
    </PageLayout>
  )
}

export default memo(IEPReviewPage)
