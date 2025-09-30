"use client"

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, X, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  onImageUploaded: (url: string) => void
  onImageRemoved: () => void
  currentImageUrl?: string | null
  disabled?: boolean
}

export function ImageUpload({ 
  onImageUploaded, 
  onImageRemoved, 
  currentImageUrl, 
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('student-photos')
        .upload(fileName, file)

      if (error) {
        throw error
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('student-photos')
        .getPublicUrl(fileName)

      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onImageRemoved()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Profile Picture</div>
      
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          {/* Image Preview */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-2">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClick}
                disabled={disabled || isUploading}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>{isUploading ? 'Uploading...' : 'Upload Photo'}</span>
              </Button>
              
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveImage}
                  disabled={disabled || isUploading}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  <span>Remove</span>
                </Button>
              )}
            </div>
            
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP, or GIF. Max 5MB.
            </p>
          </div>
        </div>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
