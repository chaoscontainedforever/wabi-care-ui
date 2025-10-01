import FormBankContent from "./FormBankContent"
import { PageLayout } from "@/components/PageLayout"

export function FormBankPage() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Data Collection", href: "/assessments" },
        { label: "Form Bank" }
      ]}
      title="Form Bank"
    >
      <FormBankContent />
    </PageLayout>
  )
}
