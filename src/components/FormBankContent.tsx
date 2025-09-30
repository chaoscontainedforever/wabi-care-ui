"use client"

import { useState, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Search, 
  Plus, 
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  FileSpreadsheet,
  FileText,
  File,
  Copy,
  Star,
  Tag,
  Folder,
  ExternalLink,
  MoreHorizontal,
  BarChart3,
  Grid3X3,
  List,
  Table,
  Users,
  Calendar,
  TrendingUp
} from "lucide-react"

// Mock form bank data
const mockForms = [
  {
    id: "1",
    name: "AFLS Basic Living Skills Assessment",
    description: "Comprehensive assessment form for basic living skills including dressing, grooming, bathing, toileting, eating, and sleeping.",
    type: "assessment",
    category: "AFLS",
    fileType: "xlsx",
    size: "2.3 MB",
    uploadDate: "2024-01-10",
    uploadedBy: "Dr. Sarah Wilson",
    downloadCount: 45,
    rating: 4.8,
    tags: ["AFLS", "Basic Living", "Assessment", "Excel"],
    isFavorite: true,
    isTemplate: true
  },
  {
    id: "2",
    name: "VB-MAPP Milestones Assessment",
    description: "Verbal Behavior Milestones Assessment and Placement Program - comprehensive milestone assessment form.",
    type: "assessment",
    category: "VB-MAPP",
    fileType: "docx",
    size: "1.8 MB",
    uploadDate: "2024-01-08",
    uploadedBy: "Ms. Jennifer Adams",
    downloadCount: 32,
    rating: 4.6,
    tags: ["VB-MAPP", "Verbal Behavior", "Milestones", "Word"],
    isFavorite: false,
    isTemplate: true
  },
  {
    id: "3",
    name: "ABLLS-R Skills Tracking Sheet",
    description: "Assessment of Basic Language and Learning Skills - Revised tracking sheet for skill development monitoring.",
    type: "tracking",
    category: "ABLLS",
    fileType: "xlsx",
    size: "3.1 MB",
    uploadDate: "2024-01-05",
    uploadedBy: "Dr. Sarah Wilson",
    downloadCount: 28,
    rating: 4.9,
    tags: ["ABLLS", "Language Skills", "Tracking", "Excel"],
    isFavorite: true,
    isTemplate: true
  },
  {
    id: "4",
    name: "Behavioral Observation Form",
    description: "Custom behavioral observation form for tracking student behavior patterns and interventions.",
    type: "observation",
    category: "Behavioral",
    fileType: "docx",
    size: "856 KB",
    uploadDate: "2024-01-03",
    uploadedBy: "Ms. Sarah Wilson",
    downloadCount: 15,
    rating: 4.4,
    tags: ["Behavior", "Observation", "Custom", "Word"],
    isFavorite: false,
    isTemplate: false
  },
  {
    id: "5",
    name: "Progress Monitoring Template",
    description: "Generic progress monitoring template that can be customized for any skill or goal tracking.",
    type: "template",
    category: "General",
    fileType: "xlsx",
    size: "1.2 MB",
    uploadDate: "2024-01-01",
    uploadedBy: "Dr. Sarah Wilson",
    downloadCount: 67,
    rating: 4.7,
    tags: ["Progress", "Monitoring", "Template", "Excel"],
    isFavorite: true,
    isTemplate: true
  },
  {
    id: "6",
    name: "FAST Functional Assessment",
    description: "Functional Assessment Screening Tool for identifying behavioral functions and developing intervention strategies.",
    type: "assessment",
    category: "Behavioral",
    fileType: "xlsx",
    size: "1.5 MB",
    uploadDate: "2024-01-15",
    uploadedBy: "Dr. Sarah Wilson",
    downloadCount: 23,
    rating: 4.5,
    tags: ["FAST", "Functional Assessment", "Behavior", "Excel"],
    isFavorite: false,
    isTemplate: true
  },
  {
    id: "7",
    name: "Social Skills Checklist",
    description: "Comprehensive checklist for assessing and tracking social skills development in students.",
    type: "tracking",
    category: "General",
    fileType: "docx",
    size: "945 KB",
    uploadDate: "2024-01-12",
    uploadedBy: "Ms. Jennifer Adams",
    downloadCount: 19,
    rating: 4.3,
    tags: ["Social Skills", "Checklist", "Tracking", "Word"],
    isFavorite: false,
    isTemplate: false
  },
  {
    id: "8",
    name: "Communication Assessment Form",
    description: "Detailed form for assessing communication skills including receptive and expressive language abilities.",
    type: "assessment",
    category: "General",
    fileType: "xlsx",
    size: "2.1 MB",
    uploadDate: "2024-01-18",
    uploadedBy: "Dr. Sarah Wilson",
    downloadCount: 31,
    rating: 4.6,
    tags: ["Communication", "Language", "Assessment", "Excel"],
    isFavorite: true,
    isTemplate: true
  }
]

interface FormUpload {
  name: string
  description: string
  category: string
  type: string
  tags: string[]
  file?: File
}

function FormBankContent() {
  // Form Bank state
  const [formSearchTerm, setFormSearchTerm] = useState("")
  const [formFilterCategory, setFormFilterCategory] = useState<string>("all")
  const [formFilterType, setFormFilterType] = useState<string>("all")
  const [isFormUploadDialogOpen, setIsFormUploadDialogOpen] = useState(false)
  const [isFormCreateDialogOpen, setIsFormCreateDialogOpen] = useState(false)
  const [formUpload, setFormUpload] = useState<FormUpload>({
    name: "",
    description: "",
    category: "",
    type: "",
    tags: []
  })
  const [favoriteForms, setFavoriteForms] = useState<string[]>(["1", "3", "5", "8"])
  const [viewFormat, setViewFormat] = useState<"cards" | "list" | "table">("cards")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewContent, setPreviewContent] = useState<string>("")
  const [previewTitle, setPreviewTitle] = useState<string>("")
  const [previewType, setPreviewType] = useState<"text" | "excel">("text")
  const [excelData, setExcelData] = useState<any[]>([])
  const [excelHeaders, setExcelHeaders] = useState<string[]>([])

  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(formSearchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(formSearchTerm.toLowerCase()) ||
                         form.tags.some(tag => tag.toLowerCase().includes(formSearchTerm.toLowerCase()))
    const matchesCategory = formFilterCategory === "all" || form.category === formFilterCategory
    const matchesType = formFilterType === "all" || form.type === formFilterType
    return matchesSearch && matchesCategory && matchesType
  })

  const handleFormUpload = () => {
    // In a real app, this would upload to a server
    console.log("Form uploaded:", formUpload)
    setIsFormUploadDialogOpen(false)
    setFormUpload({
      name: "",
      description: "",
      category: "",
      type: "",
      tags: []
    })
  }

  const handleFormCreate = () => {
    // In a real app, this would create a new form
    console.log("Form created:", formUpload)
    setIsFormCreateDialogOpen(false)
    setFormUpload({
      name: "",
      description: "",
      category: "",
      type: "",
      tags: []
    })
  }

  const handleFormDownload = (formId: string, format: 'excel' | 'doc') => {
    // In a real app, this would download the form in the specified format
    console.log(`Downloading form ${formId} as ${format}`)
  }

  const handleToggleFavorite = (formId: string) => {
    setFavoriteForms(prev => 
      prev.includes(formId) 
        ? prev.filter(id => id !== formId)
        : [...prev, formId]
    )
  }

  const handlePreview = async (formId: string, formName: string) => {
    try {
      const form = mockForms.find(f => f.id === formId)
      const isExcelFile = form?.fileType === 'xlsx' || form?.fileType === 'xls'
      
      // Map form IDs to sample documents
      const documentMap: { [key: string]: { csv: string, summary: string } } = {
        "1": { 
          csv: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_AFLS_-_Basic___Updated.csv",
          summary: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_AFLS_-_Basic___Updated_summary.txt"
        },
        "2": { 
          csv: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_VB_-_Milestones.csv",
          summary: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_VB_-_Milestones_summary.txt"
        },
        "3": { 
          csv: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_ABLLS.csv",
          summary: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_ABLLS_summary.txt"
        },
        "4": { 
          csv: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_FAST.csv",
          summary: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_FAST_summary.txt"
        },
        "7": { 
          csv: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_AFLS_-_Community_Updated.csv",
          summary: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_AFLS_-_Community_Updated_summary.txt"
        },
        "8": { 
          csv: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_VB_-_Barriers.csv",
          summary: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_VB_-_Barriers_summary.txt"
        },
        "9": { 
          csv: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_Tracking_Lvl_1.csv",
          summary: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_Tracking_Lvl_1_summary.txt"
        },
        "10": { 
          csv: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_AFLS_-_Home_Updated.csv",
          summary: "ExcelAssessmentResultsCompilationof9scoringgridAFLSABLLSVBMAPP-1_AFLS_-_Home_Updated_summary.txt"
        }
      }

      const documentInfo = documentMap[formId] || documentMap["1"]
      
      setPreviewTitle(`Preview: ${formName}`)
      setPreviewContent("Loading document preview...")
      setIsPreviewOpen(true)
      setPreviewType(isExcelFile ? "excel" : "text")

      // Simulate API call delay
      setTimeout(() => {
        if (isExcelFile && documentInfo.csv) {
          // Generate Excel-like data for preview
          const excelPreviewData = generateExcelPreviewData(formId, formName)
          setExcelHeaders(excelPreviewData.headers)
          setExcelData(excelPreviewData.rows)
          setPreviewContent("")
        } else {
          // Show text preview for non-Excel files
          const sampleContent = `
# ${formName}

## Document Preview

This is a preview of the assessment form "${formName}". 

### Document Information:
- **Type**: Assessment Form
- **Category**: ${form?.category || 'General'}
- **Format**: ${form?.fileType?.toUpperCase() || 'PDF'}
- **Size**: ${form?.size || '2.3 MB'}

### Sample Content:
Based on the ${form?.category || 'assessment'} category, this form contains:

1. **Assessment Items**: Various skill-based evaluation criteria
2. **Scoring Guidelines**: Detailed instructions for scoring each item
3. **Progress Tracking**: Methods to track student progress over time
4. **Data Collection**: Structured format for recording observations

### Key Features:
- ✅ Standardized assessment protocol
- ✅ Evidence-based evaluation criteria  
- ✅ Comprehensive scoring system
- ✅ Progress monitoring capabilities
- ✅ Data export functionality

### Usage Instructions:
1. Review the assessment items before administration
2. Follow the scoring guidelines precisely
3. Record all observations accurately
4. Use the progress tracking features to monitor development
5. Export data for reporting and analysis

*This is a preview of the document. The full document contains detailed assessment protocols, scoring rubrics, and data collection templates.*
          `
          setPreviewContent(sampleContent)
        }
      }, 1000)
    } catch (error) {
      console.error('Error loading preview:', error)
      setPreviewContent("Error loading document preview. Please try again.")
    }
  }

  const generateExcelPreviewData = (formId: string, formName: string) => {
    // Generate realistic Excel preview data based on form type
    const form = mockForms.find(f => f.id === formId)
    
    if (form?.category === "AFLS") {
      return {
        headers: ["Item", "Skill Area", "Description", "Score", "Date", "Notes"],
        rows: [
          ["TL41", "Toileting", "Independently uses toilet", "4", "2024-01-15", "Mastered"],
          ["TL40", "Toileting", "Washes hands after toileting", "4", "2024-01-15", "Mastered"],
          ["TL39", "Toileting", "Flushes toilet", "4", "2024-01-15", "Mastered"],
          ["HS39", "Home Skills", "Makes bed independently", "3", "2024-01-14", "In progress"],
          ["HS38", "Home Skills", "Cleans room", "3", "2024-01-14", "In progress"],
          ["HS37", "Home Skills", "Sets table", "2", "2024-01-13", "Learning"],
          ["HS36", "Home Skills", "Clears table", "2", "2024-01-13", "Learning"],
          ["HS35", "Home Skills", "Loads dishwasher", "1", "2024-01-12", "Introduced"],
          ["HS34", "Home Skills", "Unloads dishwasher", "1", "2024-01-12", "Introduced"],
          ["HS33", "Home Skills", "Sweeps floor", "0", "2024-01-11", "Not started"]
        ]
      }
    } else if (form?.category === "VB-MAPP") {
      return {
        headers: ["Milestone", "Domain", "Age Range", "Score", "Date", "Tester"],
        rows: [
          ["15", "Mand", "Level 3", "4", "2024-01-15", "Dr. Smith"],
          ["14", "Tact", "Level 3", "4", "2024-01-15", "Dr. Smith"],
          ["13", "Listener", "Level 3", "3", "2024-01-15", "Dr. Smith"],
          ["12", "VP/MTS", "Level 3", "3", "2024-01-15", "Dr. Smith"],
          ["11", "Play", "Level 3", "2", "2024-01-15", "Dr. Smith"],
          ["10", "Social", "Level 3", "2", "2024-01-15", "Dr. Smith"],
          ["9", "Reading", "Level 3", "1", "2024-01-15", "Dr. Smith"],
          ["8", "Writing", "Level 3", "1", "2024-01-15", "Dr. Smith"],
          ["7", "LRFFC", "Level 3", "0", "2024-01-15", "Dr. Smith"],
          ["6", "IV", "Level 3", "0", "2024-01-15", "Dr. Smith"]
        ]
      }
    } else if (form?.category === "ABLLS") {
      return {
        headers: ["Section", "Item", "Description", "Score", "Date", "Notes"],
        rows: [
          ["A", "A1", "Cooperation and Reinforcer Effectiveness", "4", "2024-01-15", "Mastered"],
          ["A", "A2", "Visual Performance", "4", "2024-01-15", "Mastered"],
          ["A", "A3", "Receptive Language", "3", "2024-01-15", "In progress"],
          ["A", "A4", "Imitation", "3", "2024-01-15", "In progress"],
          ["A", "A5", "Vocal Imitation", "2", "2024-01-15", "Learning"],
          ["A", "A6", "Requests", "2", "2024-01-15", "Learning"],
          ["A", "A7", "Labeling", "1", "2024-01-15", "Introduced"],
          ["A", "A8", "Intraverbals", "1", "2024-01-15", "Introduced"],
          ["A", "A9", "Spontaneous Vocalizations", "0", "2024-01-15", "Not started"],
          ["A", "A10", "Syntax and Grammar", "0", "2024-01-15", "Not started"]
        ]
      }
    } else {
      // Default Excel preview
      return {
        headers: ["Column A", "Column B", "Column C", "Column D", "Column E"],
        rows: [
          ["Item 1", "Data 1", "Value 1", "Score 1", "Date 1"],
          ["Item 2", "Data 2", "Value 2", "Score 2", "Date 2"],
          ["Item 3", "Data 3", "Value 3", "Score 3", "Date 3"],
          ["Item 4", "Data 4", "Value 4", "Score 4", "Date 4"],
          ["Item 5", "Data 5", "Value 5", "Score 5", "Date 5"]
        ]
      }
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'xlsx':
        return <FileSpreadsheet className="h-8 w-8 text-green-600" />
      case 'docx':
        return <FileText className="h-8 w-8 text-blue-600" />
      default:
        return <File className="h-8 w-8 text-gray-600" />
    }
  }

  // List View Component
  const ListView = () => (
    <div className="space-y-2">
      {filteredForms.map((form) => (
        <div 
          key={form.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getFileIcon(form.fileType)}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{form.name}</h3>
              <p className="text-xs text-muted-foreground">{form.description}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {form.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {form.type}
                </Badge>
                {form.isTemplate && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                    Template
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                <span>{form.uploadedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{form.uploadDate}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Download className="h-3 w-3" />
                <span>{form.downloadCount} downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{form.rating}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleToggleFavorite(form.id)}
              className="p-1"
            >
              <Star className={`h-4 w-4 ${favoriteForms.includes(form.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
            </Button>
            <Button size="sm" variant="ghost" className="p-1">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )

  // Table View Component
  const TableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Form</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Category</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Type</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Uploaded By</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Date</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Downloads</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Rating</th>
            <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredForms.map((form) => (
            <tr 
              key={form.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(form.fileType)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{form.name}</div>
                    <div className="text-xs text-muted-foreground">{form.description}</div>
                    {form.isTemplate && (
                      <Badge variant="outline" className="text-xs text-green-600 border-green-200 mt-1">
                        Template
                      </Badge>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className="text-xs">
                  {form.category}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Badge variant="secondary" className="text-xs">
                  {form.type}
                </Badge>
              </td>
              <td className="py-3 px-4 text-sm">{form.uploadedBy}</td>
              <td className="py-3 px-4 text-sm">{form.uploadDate}</td>
              <td className="py-3 px-4 text-sm">{form.downloadCount}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                  <span className="text-sm">{form.rating}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleFavorite(form.id)}
                    className="p-1"
                  >
                    <Star className={`h-3 w-3 ${favoriteForms.includes(form.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </Button>
                  <Button size="sm" variant="ghost" className="p-1">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  // Calculate statistics
  const totalForms = mockForms.length
  const totalDownloads = mockForms.reduce((sum, form) => sum + form.downloadCount, 0)
  const averageRating = mockForms.reduce((sum, form) => sum + form.rating, 0) / mockForms.length
  const templateForms = mockForms.filter(form => form.isTemplate).length

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessment Form Bank</h1>
            <p className="text-sm text-gray-600 mt-1">Upload, create, and manage assessment forms for your team</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Format Controls */}
            <div className="flex items-center border border-gray-200 rounded-lg p-1">
              <Button
                variant={viewFormat === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFormat("cards")}
                className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewFormat === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFormat("list")}
                className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewFormat === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewFormat("table")}
                className="w-8 h-8 p-0 flex items-center justify-center min-w-8"
              >
                <Table className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Dialog open={isFormUploadDialogOpen} onOpenChange={setIsFormUploadDialogOpen} suppressHydrationWarning>
              <DialogTrigger asChild suppressHydrationWarning>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Form
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" suppressHydrationWarning>
                <DialogHeader>
                  <DialogTitle>Upload Assessment Form</DialogTitle>
                  <DialogDescription>
                    Upload an Excel or Word document to add it to the form bank
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="formName">Form Name</Label>
                    <Input
                      id="formName"
                      value={formUpload.name}
                      onChange={(e) => setFormUpload(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter form name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="formDescription">Description</Label>
                    <Textarea
                      id="formDescription"
                      value={formUpload.description}
                      onChange={(e) => setFormUpload(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the form and its purpose"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="formCategory">Category</Label>
                      <Select value={formUpload.category} onValueChange={(value) => setFormUpload(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AFLS">AFLS</SelectItem>
                          <SelectItem value="VB-MAPP">VB-MAPP</SelectItem>
                          <SelectItem value="ABLLS">ABLLS</SelectItem>
                          <SelectItem value="Behavioral">Behavioral</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="formType">Type</Label>
                      <Select value={formUpload.type} onValueChange={(value) => setFormUpload(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="tracking">Tracking</SelectItem>
                          <SelectItem value="observation">Observation</SelectItem>
                          <SelectItem value="template">Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="formFile">Upload File</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload Excel (.xlsx) or Word (.docx) file</p>
                      <Input
                        id="formFile"
                        type="file"
                        accept=".xlsx,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFormUpload(prev => ({ ...prev, file }))
                          }
                        }}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsFormUploadDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleFormUpload}>
                      Upload Form
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isFormCreateDialogOpen} onOpenChange={setIsFormCreateDialogOpen} suppressHydrationWarning>
              <DialogTrigger asChild suppressHydrationWarning>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" suppressHydrationWarning>
                <DialogHeader>
                  <DialogTitle>Create New Assessment Form</DialogTitle>
                  <DialogDescription>
                    Create a new assessment form from scratch
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="createFormName">Form Name</Label>
                    <Input
                      id="createFormName"
                      value={formUpload.name}
                      onChange={(e) => setFormUpload(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter form name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="createFormDescription">Description</Label>
                    <Textarea
                      id="createFormDescription"
                      value={formUpload.description}
                      onChange={(e) => setFormUpload(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the form and its purpose"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="createFormCategory">Category</Label>
                      <Select value={formUpload.category} onValueChange={(value) => setFormUpload(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AFLS">AFLS</SelectItem>
                          <SelectItem value="VB-MAPP">VB-MAPP</SelectItem>
                          <SelectItem value="ABLLS">ABLLS</SelectItem>
                          <SelectItem value="Behavioral">Behavioral</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="createFormType">Type</Label>
                      <Select value={formUpload.type} onValueChange={(value) => setFormUpload(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="assessment">Assessment</SelectItem>
                          <SelectItem value="tracking">Tracking</SelectItem>
                          <SelectItem value="observation">Observation</SelectItem>
                          <SelectItem value="template">Template</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsFormCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleFormCreate}>
                      Create Form
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:scale-105 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Forms</p>
                  <p className="text-2xl font-bold">{totalForms}</p>
                </div>
                <Folder className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold">{totalDownloads}</p>
                </div>
                <Download className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Templates</p>
                  <p className="text-2xl font-bold">{templateForms}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="hover:scale-105 transition-all duration-200 cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                </div>
                <Star className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Card noHover>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Assessment Forms</CardTitle>
              <CardDescription>Browse and manage your assessment form library</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search forms..."
                  value={formSearchTerm}
                  onChange={(e) => setFormSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={formFilterCategory} onValueChange={setFormFilterCategory}>
                <SelectTrigger className="w-32" suppressHydrationWarning>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="AFLS">AFLS</SelectItem>
                  <SelectItem value="VB-MAPP">VB-MAPP</SelectItem>
                  <SelectItem value="ABLLS">ABLLS</SelectItem>
                  <SelectItem value="Behavioral">Behavioral</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formFilterType} onValueChange={setFormFilterType}>
                <SelectTrigger className="w-32" suppressHydrationWarning>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="tracking">Tracking</SelectItem>
                  <SelectItem value="observation">Observation</SelectItem>
                  <SelectItem value="template">Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewFormat === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForms.map((form) => (
              <Card key={form.id} className="hover:scale-105 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-200 cursor-pointer group">
                <CardContent className="p-5">
                  {/* Header with icon and title */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getFileIcon(form.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base leading-tight mb-2">{form.name}</h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {form.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {form.type}
                          </Badge>
                          {form.isTemplate && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                              Template
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleFavorite(form.id)}
                        className="p-1"
                      >
                        <Star className={`h-4 w-4 ${favoriteForms.includes(form.id) ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                      </Button>
                      <Button size="sm" variant="ghost" className="p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {form.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {form.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {form.tags.length > 3 && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        +{form.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  {/* Metadata */}
                  <div className="space-y-1.5 mb-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uploaded by:</span>
                      <span className="font-medium text-gray-700">{form.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium text-gray-700">{form.uploadDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span className="font-medium text-gray-700">{form.downloadCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium text-gray-700 flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        {form.rating}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 text-xs"
                        onClick={() => handlePreview(form.id, form.name)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="px-2">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => handleFormDownload(form.id, 'excel')}
                      >
                        <FileSpreadsheet className="h-3 w-3 mr-1" />
                        Excel
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => handleFormDownload(form.id, 'doc')}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Word
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          )}

          {viewFormat === "list" && <ListView />}
          {viewFormat === "table" && <TableView />}
          
          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Forms Found</h3>
              <p className="text-gray-600 mb-6">No forms match your current search and filter criteria.</p>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={() => setIsFormUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Form
                </Button>
                <Button onClick={() => setIsFormCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Form
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen} suppressHydrationWarning>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" suppressHydrationWarning>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {previewTitle}
              {previewType === "excel" && (
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Excel Format
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              {previewType === "excel" 
                ? "Excel spreadsheet preview with sample data" 
                : "Document preview and information"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh]">
            {previewType === "excel" ? (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Excel Spreadsheet Preview - Showing first 10 rows
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {excelHeaders.map((header, index) => (
                          <th key={index} className="px-3 py-2 text-left font-medium text-gray-900 border-r last:border-r-0">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {excelData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="px-3 py-2 border-r last:border-r-0">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-900">{cell}</span>
                                {cellIndex === 3 && (cell === "4" || cell === "3") && (
                                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                    cell === "4" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                  }`}>
                                    {cell === "4" ? "Mastered" : "In Progress"}
                                  </span>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
                  <strong>Note:</strong> This is a preview of the Excel data. The full spreadsheet contains additional rows, 
                  formulas, and formatting. Download the complete file to access all features.
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {previewContent}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download Full Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default memo(FormBankContent)
