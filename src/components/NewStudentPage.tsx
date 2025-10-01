import NewStudentContent from "./NewStudentContent"
import { PageLayout } from "@/components/PageLayout"

export function NewStudentPage() {
  return (
    <PageLayout
      breadcrumbs={[
        { label: "Students", href: "/students" },
        { label: "Student Intake" }
      ]}
    >
      <NewStudentContent />
    </PageLayout>
  )
}
