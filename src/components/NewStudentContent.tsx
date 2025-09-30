"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { StudentService, TeacherService } from "@/lib/services"
import { useTeachers } from "@/hooks/useSupabase"
import { 
  User, 
  Save,
  ArrowLeft,
  Calendar,
  GraduationCap,
  Users,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus
} from "lucide-react"

interface StudentForm {
  firstName: string
  lastName: string
  studentId: string
  dateOfBirth: string
  grade: string
  disability: string
  school: string
  teacherId: string
  parentName: string
  parentPhone: string
  parentEmail: string
  address: string
  city: string
  state: string
  zipCode: string
  emergencyContact: string
  emergencyPhone: string
  medicalInfo: string
  notes: string
  profilePictureUrl: string | null
}

export function NewStudentContent() {
  const router = useRouter()
  const { teachers, loading: teachersLoading } = useTeachers()
  
  const [formData, setFormData] = useState<StudentForm>({
    firstName: "",
    lastName: "",
    studentId: "",
    dateOfBirth: "",
    grade: "",
    disability: "",
    school: "",
    teacherId: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalInfo: "",
    notes: "",
    profilePictureUrl: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: keyof StudentForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || 
        !formData.grade || !formData.disability || !formData.school || !formData.teacherId ||
        formData.teacherId === "loading" || formData.teacherId === "no-teachers") {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError(null)
    
    try {
      // Calculate age from date of birth
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      
      // Create student data
      const studentData = {
        name: `${formData.firstName} ${formData.lastName}`,
        student_id: formData.studentId || generateStudentId(),
        grade: formData.grade,
        disability: formData.disability,
        age: age,
        school: formData.school,
        teacher_id: formData.teacherId,
        profile_picture_url: formData.profilePictureUrl
      }

      // Save to database
      const newStudent = await StudentService.create(studentData)
      
      setSuccess(true)
      console.log("Student created successfully:", newStudent)
      
      // Redirect to students list after a short delay
      setTimeout(() => {
        router.push("/students")
      }, 2000)
      
    } catch (err) {
      console.error("Failed to create student:", err)
      console.error("Error details:", JSON.stringify(err, null, 2))
      setError(err instanceof Error ? err.message : "Failed to create student. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateStudentId = () => {
    const firstName = formData.firstName.slice(0, 2).toUpperCase()
    const lastName = formData.lastName.slice(0, 2).toUpperCase()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${firstName}${lastName}${randomNum}`
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/students")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
              <p className="text-sm text-gray-600 mt-1">Create a new student profile and IEP record</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} size="sm">
              {isSubmitting ? (
                <CheckCircle className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Creating..." : "Create Student"}
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-medium text-blue-600">1</span>
            </div>
            <span>Student Information</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-400">2</span>
            </div>
            <span>Parent/Guardian</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-400">3</span>
            </div>
            <span>IEP Setup</span>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Student created successfully!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">Redirecting to students list...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Error</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Student Information
              </CardTitle>
              <CardDescription>Basic information about the student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              {/* Profile Picture Upload */}
              <ImageUpload
                onImageUploaded={(url) => handleInputChange("profilePictureUrl", url)}
                onImageRemoved={() => handleInputChange("profilePictureUrl", "")}
                currentImageUrl={formData.profilePictureUrl}
                disabled={isSubmitting}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => handleInputChange("studentId", e.target.value)}
                      placeholder="Auto-generated"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleInputChange("studentId", generateStudentId())}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade">Grade *</Label>
                  <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
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
                <div>
                  <Label htmlFor="disability">Primary Disability *</Label>
                  <Select value={formData.disability} onValueChange={(value) => handleInputChange("disability", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select disability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Autism Spectrum Disorder">Autism Spectrum Disorder</SelectItem>
                      <SelectItem value="ADHD">ADHD</SelectItem>
                      <SelectItem value="Learning Disability">Learning Disability</SelectItem>
                      <SelectItem value="Speech and Language Impairment">Speech and Language Impairment</SelectItem>
                      <SelectItem value="Intellectual Disability">Intellectual Disability</SelectItem>
                      <SelectItem value="Emotional Disturbance">Emotional Disturbance</SelectItem>
                      <SelectItem value="Other Health Impairment">Other Health Impairment</SelectItem>
                      <SelectItem value="Multiple Disabilities">Multiple Disabilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="school">School *</Label>
                  <Input
                    id="school"
                    value={formData.school}
                    onChange={(e) => handleInputChange("school", e.target.value)}
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <Label htmlFor="teacher">Teacher *</Label>
                  <Select value={formData.teacherId} onValueChange={(value) => handleInputChange("teacherId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachersLoading ? (
                        <SelectItem value="loading" disabled>Loading teachers...</SelectItem>
                      ) : teachers.length === 0 ? (
                        <SelectItem value="no-teachers" disabled>No teachers found</SelectItem>
                      ) : (
                        teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name} - {teacher.school}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="medicalInfo">Medical Information</Label>
                <Textarea
                  id="medicalInfo"
                  value={formData.medicalInfo}
                  onChange={(e) => handleInputChange("medicalInfo", e.target.value)}
                  placeholder="Enter any relevant medical information"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parent/Guardian Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parent/Guardian Information
              </CardTitle>
              <CardDescription>Contact information for parents or guardians</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => handleInputChange("parentName", e.target.value)}
                  placeholder="Enter parent or guardian name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentPhone">Phone Number *</Label>
                  <Input
                    id="parentPhone"
                    value={formData.parentPhone}
                    onChange={(e) => handleInputChange("parentPhone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="parentEmail">Email Address *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={(e) => handleInputChange("parentEmail", e.target.value)}
                    placeholder="parent@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Enter emergency contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    placeholder="(555) 987-6543"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Student
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Import from Excel
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add to Group
              </Button>
            </CardContent>
          </Card>

          {/* Form Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Form Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Student Information</span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Parent Information</span>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">IEP Setup</span>
                <AlertCircle className="h-4 w-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">
                Required fields are marked with an asterisk (*). Make sure to fill out all required information before saving.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Help Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
