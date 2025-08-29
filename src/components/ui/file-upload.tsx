"use client"

import { useState, useRef } from "react"
import { Upload, X, FileText, FileImage, File, FileVideo, FileAudio, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { filesService } from "@/lib/api/services"

interface UploadedFile {
  url: string
  filename: string
  originalName: string
  size: number
  mimeType: string
}

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void
  uploadedFiles?: UploadedFile[]
  onFileRemove?: (file: UploadedFile) => void
  maxFiles?: number
  acceptedTypes?: string[]
  className?: string
}

export function FileUpload({
  onFilesUploaded,
  uploadedFiles = [],
  onFileRemove,
  maxFiles = 10,
  acceptedTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip', 'rar'],
  className = ""
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return FileImage
    if (mimeType.startsWith('video/')) return FileVideo
    if (mimeType.startsWith('audio/')) return FileAudio
    if (mimeType.includes('pdf')) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const handleFileSelect = async (files: FileList) => {
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const fileArray = Array.from(files)
      const response = await filesService.uploadFiles(fileArray)
      
      if (response.data) {
        onFilesUploaded(response.data)
        setUploadProgress(100)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erreur lors de l\'upload des fichiers')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files)
    }
  }

  const handleRemoveFile = (file: UploadedFile) => {
    if (onFileRemove) {
      onFileRemove(file)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone de drop */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              Glissez-déposez vos fichiers ici
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              ou cliquez pour sélectionner des fichiers
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Types acceptés: {acceptedTypes.join(', ').toUpperCase()}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Sélectionner des fichiers
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.map(type => `.${type}`).join(',')}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Barre de progression */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Upload en cours...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Fichiers uploadés */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Fichiers uploadés ({uploadedFiles.length}/{maxFiles})</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => {
              const FileIcon = getFileIcon(file.mimeType)
              
              return (
                <Card key={index} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileIcon className="w-6 h-6 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {file.originalName || file.filename}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {file.mimeType} • {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {onFileRemove && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(file)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
