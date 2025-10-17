"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UploadCloud, Loader2, CheckCircle } from "lucide-react"

interface DocumentUploadDrawerProps {
  studentId: string | null
}

export function DocumentUploadDrawer({ studentId }: DocumentUploadDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [status, setStatus] = useState<"idle" | "processing" | "complete">("idle")

  const handleUpload = async () => {
    if (!studentId) return
    setIsUploading(true)
    setStatus("processing")
    // TODO: integrate with Supabase storage and OCR pipeline
    setTimeout(() => {
      setIsUploading(false)
      setStatus("complete")
    }, 1500)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <UploadCloud className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </SheetTrigger>
      <SheetContent className="space-y-6">
        <SheetHeader>
          <SheetTitle>Ingest Documents</SheetTitle>
          <SheetDescription>
            Upload PDF, Word, or Excel files to attach to this learner. OCR processing will extract key data automatically.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3">
          <Input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" disabled={!studentId || isUploading} />
          <Button onClick={handleUpload} disabled={!studentId || isUploading} className="w-full">
            {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadCloud className="h-4 w-4 mr-2" />}
            {isUploading ? "Uploading" : "Start Upload"}
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Status</h4>
          <Badge variant="secondary" className="gap-1">
            {status === "complete" ? <CheckCircle className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
            <span className="capitalize">{status}</span>
          </Badge>
          {status === "processing" && (
            <p className="text-xs text-muted-foreground">OCR in progress. This may take up to 2 minutes.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

