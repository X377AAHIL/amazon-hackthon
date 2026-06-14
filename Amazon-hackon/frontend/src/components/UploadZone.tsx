'use client'

import { useRef } from 'react'
import { CloudUpload } from 'lucide-react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      style={{
        border: '2px dashed var(--border)',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer',
        background: 'var(--surface2)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#FF9900'
        ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(255,153,0,0.04)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLDivElement).style.background = 'var(--surface2)'
      }}
    >
      <CloudUpload size={40} color="var(--muted)" style={{ margin: '0 auto 12px' }} />
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
        Drop image here or click to upload
      </div>
      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
        Supports JPG, PNG, WEBP · Max 10MB
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  )
}