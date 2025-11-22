"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Image,
  Video,
  Music,
  Folder,
  Upload,
  Download,
  ExternalLink,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  File,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileSpreadsheet,
  FileType,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Document {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'docx' | 'xlsx' | 'image' | 'video' | 'audio' | 'other'
  size: string
  lastModified: Date
  category: 'IEP' | 'Assessment' | 'Progress Report' | 'Medical' | 'Behavior Plan' | 'Other'
  url?: string
  uploadedBy?: string
}

interface StudentDocumentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentId: string
  studentName: string
}

// Mock documents - in production, these would come from an API
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'IEP_2024_Annual_Review.pdf',
    type: 'pdf',
    size: '2.3 MB',
    lastModified: new Date('2024-01-15'),
    category: 'IEP',
    uploadedBy: 'Dr. Sarah Johnson'
  },
  {
    id: '2',
    name: 'Behavior_Assessment_Q1.pdf',
    type: 'pdf',
    size: '1.8 MB',
    lastModified: new Date('2024-01-10'),
    category: 'Assessment',
    uploadedBy: 'BCBA Smith'
  },
  {
    id: '3',
    name: 'Progress_Report_January.pdf',
    type: 'pdf',
    size: '0.9 MB',
    lastModified: new Date('2024-01-08'),
    category: 'Progress Report',
    uploadedBy: 'RBT Martinez'
  },
  {
    id: '4',
    name: 'Medical_Records_Update.pdf',
    type: 'pdf',
    size: '1.2 MB',
    lastModified: new Date('2024-01-05'),
    category: 'Medical',
    uploadedBy: 'Admin'
  },
  {
    id: '5',
    name: 'Behavior_Intervention_Plan.docx',
    type: 'docx',
    size: '0.5 MB',
    lastModified: new Date('2024-01-03'),
    category: 'Behavior Plan',
    uploadedBy: 'BCBA Smith'
  },
  {
    id: '6',
    name: 'Session_Photos_Jan2024.zip',
    type: 'other',
    size: '5.2 MB',
    lastModified: new Date('2024-01-01'),
    category: 'Progress Report',
    uploadedBy: 'RBT Martinez'
  },
]

const getFileIcon = (type: Document['type']) => {
  switch (type) {
    case 'pdf':
      return <FileText className="h-5 w-5 text-red-500" />
    case 'doc':
    case 'docx':
      return <FileType className="h-5 w-5 text-blue-500" />
    case 'xlsx':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />
    case 'image':
      return <FileImage className="h-5 w-5 text-purple-500" />
    case 'video':
      return <FileVideo className="h-5 w-5 text-pink-500" />
    case 'audio':
      return <FileAudio className="h-5 w-5 text-yellow-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}

const getCategoryColor = (category: Document['category']) => {
  const colors: Record<Document['category'], string> = {
    'IEP': 'bg-blue-100 text-blue-800',
    'Assessment': 'bg-purple-100 text-purple-800',
    'Progress Report': 'bg-green-100 text-green-800',
    'Medical': 'bg-red-100 text-red-800',
    'Behavior Plan': 'bg-orange-100 text-orange-800',
    'Other': 'bg-gray-100 text-gray-800',
  }
  return colors[category] || colors['Other']
}

export function StudentDocumentsModal({
  open,
  onOpenChange,
  studentId,
  studentName,
}: StudentDocumentsModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Document['category'] | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const handleDownload = (doc: Document) => {
    // In production, this would download the actual file
    console.log('Downloading:', doc.name)
    alert(`Downloading ${doc.name}`)
  }

  const handleView = (doc: Document) => {
    // In production, this would open the file in a viewer
    console.log('Viewing:', doc.name)
    if (doc.url) {
      window.open(doc.url, '_blank')
    } else {
      alert(`Opening ${doc.name} in new tab`)
    }
  }

  const categories: Document['category'][] = ['IEP', 'Assessment', 'Progress Report', 'Medical', 'Behavior Plan', 'Other']

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Folder className="h-6 w-6" />
                Documents - {studentName}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage documents for goal design and planning
              </p>
            </div>
            <Button size="sm" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Categories */}
          <div className="w-64 border-r bg-muted/30 p-4">
            <div className="space-y-2">
              <Button
                variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory('all')}
              >
                <Folder className="h-4 w-4 mr-2" />
                All Documents
                <Badge variant="secondary" className="ml-auto">
                  {mockDocuments.length}
                </Badge>
              </Button>
              {categories.map(category => {
                const count = mockDocuments.filter(d => d.category === category).length
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {category}
                    <Badge variant="secondary" className="ml-auto">
                      {count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Documents List/Grid */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                {filteredDocuments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                    <Folder className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No documents found</p>
                    <p className="text-sm">Try adjusting your search or filter</p>
                  </div>
                ) : viewMode === 'list' ? (
                  <div className="space-y-2">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex-shrink-0">
                          {getFileIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>{doc.lastModified.toLocaleDateString()}</span>
                            {doc.uploadedBy && (
                              <>
                                <span>•</span>
                                <span>{doc.uploadedBy}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge className={`text-xs ${getCategoryColor(doc.category)}`}>
                          {doc.category}
                        </Badge>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleView(doc)}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleView(doc)}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownload(doc)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <FileText className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                        onClick={() => handleView(doc)}
                      >
                        <div className="mb-3">
                          {getFileIcon(doc.type)}
                        </div>
                        <p className="font-medium text-sm text-center mb-2 line-clamp-2">{doc.name}</p>
                        <Badge className={`text-xs ${getCategoryColor(doc.category)} mb-2`}>
                          {doc.category}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleView(doc)
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(doc)
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

