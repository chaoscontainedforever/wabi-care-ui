"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, Link, Trash2, Plus, Cloud, FolderOpen } from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  source: 'upload' | 'onedrive' | 'googledrive'
  url?: string
  file?: File
}

interface SupportingDocumentsData {
  documents: Document[]
}

interface SupportingDocumentsStepProps {
  data: SupportingDocumentsData
  onUpdate: (data: SupportingDocumentsData) => void
}

const DOCUMENT_TYPES = [
  'Assessment Report',
  'Medical Records',
  'Psychological Evaluation',
  'Speech Therapy Report',
  'Occupational Therapy Report',
  'Physical Therapy Report',
  'Behavioral Assessment',
  'Academic Testing',
  'Teacher Observations',
  'Other'
]

export default function SupportingDocumentsStep({ data, onUpdate }: SupportingDocumentsStepProps) {
  const [newDocumentType, setNewDocumentType] = useState('')
  const [newDocumentName, setNewDocumentName] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const addDocument = (document: Document) => {
    onUpdate({
      documents: [...data.documents, document]
    })
  }

  const removeDocument = (documentId: string) => {
    onUpdate({
      documents: data.documents.filter(doc => doc.id !== documentId)
    })
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: newDocumentType || 'Other',
      source: 'upload',
      file: file
    }
    
    addDocument(newDoc)
    setNewDocumentType('')
    setNewDocumentName('')
    setIsUploading(false)
  }

  const handleOneDriveLink = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: newDocumentName || 'OneDrive Document',
      type: newDocumentType || 'Other',
      source: 'onedrive',
      url: 'https://onedrive.live.com/...'
    }
    
    addDocument(newDoc)
    setNewDocumentType('')
    setNewDocumentName('')
  }

  const handleGoogleDriveLink = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: newDocumentName || 'Google Drive Document',
      type: newDocumentType || 'Other',
      source: 'googledrive',
      url: 'https://drive.google.com/...'
    }
    
    addDocument(newDoc)
    setNewDocumentType('')
    setNewDocumentName('')
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'onedrive':
        return <Cloud className="h-4 w-4 text-blue-600" />
      case 'googledrive':
        return <Cloud className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'onedrive':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">OneDrive</Badge>
      case 'googledrive':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Google Drive</Badge>
      default:
        return <Badge variant="secondary">Uploaded</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Document */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Supporting Document
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={newDocumentType} onValueChange={setNewDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentName">Document Name</Label>
              <Input
                id="documentName"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Upload Method</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload from Computer'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOneDriveLink}
                  disabled={!newDocumentType}
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  Link OneDrive
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoogleDriveLink}
                  disabled={!newDocumentType}
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  Link Google Drive
                </Button>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          <Alert>
            <FolderOpen className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> OneDrive and Google Drive integrations are currently in development. 
              For now, these will create placeholder links that can be updated later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Supporting Documents ({data.documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p>No supporting documents added yet.</p>
              <p className="text-sm">Add documents using the form above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getSourceIcon(document.source)}
                    <div>
                      <p className="font-medium text-sm">{document.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{document.type}</span>
                        {getSourceBadge(document.source)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {document.url && (
                      <Button variant="ghost" size="sm">
                        <Link className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocument(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Types Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Common Document Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Assessment Reports</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Psychological evaluations</li>
                <li>• Academic testing results</li>
                <li>• Speech/language assessments</li>
                <li>• Occupational therapy reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Medical Records</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Doctor's notes</li>
                <li>• Medication records</li>
                <li>• Physical therapy reports</li>
                <li>• Behavioral assessments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
