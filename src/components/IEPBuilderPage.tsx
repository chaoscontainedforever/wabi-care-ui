import { memo } from "react"
import { IEPBuilderContent } from "./IEPBuilderContent"
import { PageLayout } from "./PageLayout"

export const IEPBuilderPage = memo(function IEPBuilderPage() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "IEP Management", href: "/iep" },
        { label: "IEP Builder" }
      ]}
      title="IEP Builder"
    >
      <IEPBuilderContent />
    </PageLayout>
  )
})
