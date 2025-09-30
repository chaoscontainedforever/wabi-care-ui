import { IEPGoalsPage } from "@/components/IEPGoalsPage"
import ClientOnly from "@/components/ClientOnly"

export default function Page() {
  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen">
          <div className="w-19rem bg-gray-100"></div>
          <div className="flex-1 p-4">
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-80 bg-gray-100 border-l"></div>
        </div>
      }
    >
      <IEPGoalsPage />
    </ClientOnly>
  )
}
