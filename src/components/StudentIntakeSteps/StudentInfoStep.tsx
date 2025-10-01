"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface StudentInfoData {
  firstName: string
  lastName: string
  dateOfBirth: string
  grade: string
  school: string
  studentId: string
  parentName: string
  parentEmail: string
  parentPhone: string
  iepDocument?: File
  iepData?: any
}

interface StudentInfoStepProps {
  data: StudentInfoData
  onUpdate: (data: StudentInfoData) => void
}

export default function StudentInfoStep({ data, onUpdate }: StudentInfoStepProps) {
  const [isProcessingIEP, setIsProcessingIEP] = useState(false)
  const [iepProcessingStatus, setIepProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [iepExtractedData, setIepExtractedData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateField = (field: keyof StudentInfoData, value: string | File) => {
    onUpdate({ ...data, [field]: value })
  }

  const handleIEPUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      setIepProcessingStatus('error')
      return
    }

    updateField('iepDocument', file)
    setIsProcessingIEP(true)
    setIepProcessingStatus('processing')

    try {
      // Mock IEP processing - simulate AI reading the document
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock extracted data
      const mockExtractedData = {
        studentName: `${data.firstName || 'John'} ${data.lastName || 'Doe'}`,
        dateOfBirth: data.dateOfBirth || '2015-12-31',
        grade: data.grade || '3rd Grade',
        school: data.school || 'Elementary School',
        parentName: data.parentName || 'Jane Doe',
        parentEmail: data.parentEmail || 'jane.doe@email.com',
        parentPhone: data.parentPhone || '(555) 123-4567',
        goals: [
          {
            title: 'Reading Comprehension',
            description: 'Student will read and comprehend grade-level texts with 80% accuracy',
            domain: 'Reading',
            level: 'Level 2'
          },
          {
            title: 'Math Problem Solving',
            description: 'Student will solve single-step word problems with 75% accuracy',
            domain: 'Math',
            level: 'Level 1'
          }
        ],
        accommodations: [
          'Extended time on tests',
          'Preferential seating',
          'Use of calculator'
        ]
      }

      setIepExtractedData(mockExtractedData)
      setIepProcessingStatus('success')
      
      // Auto-populate form fields with extracted data
      onUpdate({
        ...data,
        iepDocument: file,
        iepData: mockExtractedData,
        firstName: mockExtractedData.studentName.split(' ')[0],
        lastName: mockExtractedData.studentName.split(' ')[1] || '',
        dateOfBirth: mockExtractedData.dateOfBirth,
        grade: mockExtractedData.grade,
        school: mockExtractedData.school,
        parentName: mockExtractedData.parentName,
        parentEmail: mockExtractedData.parentEmail,
        parentPhone: mockExtractedData.parentPhone
      })

    } catch (error) {
      console.error('IEP processing failed:', error)
      setIepProcessingStatus('error')
    } finally {
      setIsProcessingIEP(false)
    }
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      {/* IEP Document Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            IEP Document Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Upload IEP Document</h3>
              <p className="text-sm text-gray-600">
                Upload the student's IEP document to automatically populate form fields
              </p>
              <Button onClick={handleFileUpload} disabled={isProcessingIEP}>
                <Upload className="h-4 w-4 mr-2" />
                {isProcessingIEP ? 'Processing...' : 'Choose File'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleIEPUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* IEP Processing Status */}
          {iepProcessingStatus === 'processing' && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Processing IEP document... This may take a few moments.
              </AlertDescription>
            </Alert>
          )}

          {iepProcessingStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                IEP document processed successfully! Form fields have been auto-populated. Please review and edit as needed.
              </AlertDescription>
            </Alert>
          )}

          {iepProcessingStatus === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Failed to process IEP document. Please ensure the file is a valid PDF or Word document.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Student Information Form */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={data.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="Enter first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={data.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Enter last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade *</Label>
              <Select value={data.grade} onValueChange={(value) => updateField('grade', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pre-K">Pre-K</SelectItem>
                  <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                  <SelectItem value="1st Grade">1st Grade</SelectItem>
                  <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                  <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                  <SelectItem value="4th Grade">4th Grade</SelectItem>
                  <SelectItem value="5th Grade">5th Grade</SelectItem>
                  <SelectItem value="6th Grade">6th Grade</SelectItem>
                  <SelectItem value="7th Grade">7th Grade</SelectItem>
                  <SelectItem value="8th Grade">8th Grade</SelectItem>
                  <SelectItem value="9th Grade">9th Grade</SelectItem>
                  <SelectItem value="10th Grade">10th Grade</SelectItem>
                  <SelectItem value="11th Grade">11th Grade</SelectItem>
                  <SelectItem value="12th Grade">12th Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="school">School *</Label>
              <Input
                id="school"
                value={data.school}
                onChange={(e) => updateField('school', e.target.value)}
                placeholder="Enter school name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={data.studentId}
                onChange={(e) => updateField('studentId', e.target.value)}
                placeholder="Enter student ID"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent/Guardian Information */}
      <Card>
        <CardHeader>
          <CardTitle>Parent/Guardian Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name *</Label>
              <Input
                id="parentName"
                value={data.parentName}
                onChange={(e) => updateField('parentName', e.target.value)}
                placeholder="Enter parent/guardian name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentEmail">Email Address *</Label>
              <Input
                id="parentEmail"
                type="email"
                value={data.parentEmail}
                onChange={(e) => updateField('parentEmail', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentPhone">Phone Number *</Label>
              <Input
                id="parentPhone"
                value={data.parentPhone}
                onChange={(e) => updateField('parentPhone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted IEP Data Preview */}
      {iepExtractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Extracted IEP Data Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Goals Found:</h4>
                <ul className="space-y-1">
                  {iepExtractedData.goals?.map((goal: any, index: number) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {goal.title} ({goal.domain})
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Accommodations:</h4>
                <ul className="space-y-1">
                  {iepExtractedData.accommodations?.map((accommodation: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600">
                      • {accommodation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
