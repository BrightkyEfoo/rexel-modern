"use client"

import { Download, FileText, FileImage, File, FileVideo, FileAudio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProductFile {
  id: number
  filename: string
  originalName: string
  url: string
  size: number
  mimeType: string
  isMain?: boolean
}

interface ProductFilesProps {
  files: ProductFile[]
  className?: string
}

export function ProductFiles({ files, className = "" }: ProductFilesProps) {
  // Filtrer les fichiers non-images
  const documentFiles = files.filter(file => 
    file.mimeType && !file.mimeType.startsWith('image/')
  )

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

  const handleDownload = (file: ProductFile) => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.originalName || file.filename
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (documentFiles.length === 0) {
    return (
      <div className={`text-center py-8 text-muted-foreground ${className}`}>
        Aucun document disponible pour ce produit
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {documentFiles.map((file) => {
        const FileIcon = getFileIcon(file.mimeType)
        
        return (
          <Card key={file.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileIcon className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{file.originalName || file.filename}</div>
                    <div className="text-xs text-muted-foreground">
                      {file.mimeType} • {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownload(file)}
                  className="group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
