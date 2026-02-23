import { useState } from 'react'

import { api } from '../api/client'
import { getAccessToken } from '../auth/tokenStorage'

export default function CsvUpload({ endpoint, demoCsvContent, demoCsvFilename }) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setMessage('')

    const token = getAccessToken()
    console.log('CsvUpload: token present?', !!token, 'endpoint', endpoint)
    if (token) {
      console.log('CsvUpload: token (first 20 chars):', token.substring(0, 20) + '...')
    } else {
      console.warn('CsvUpload: No token found in localStorage!')
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post(`${endpoint}csv-upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { created, skipped } = res.data
      let msg = `Success: ${created.length} rows created.`
      if (skipped && skipped.length > 0) {
        msg += ` Skipped ${skipped.length} duplicates.`
        console.log('Skipped rows:', skipped)
      }
      setMessage(msg)
    } catch (err) {
      console.error('CsvUpload error:', err.response)
      const detail = err?.response?.data?.detail || 'Upload failed'
      setMessage(`Error: ${detail}`)
    } finally {
      setUploading(false)
      // Reset file input
      e.target.value = ''
    }
  }

  function downloadDemo() {
    const blob = new Blob([demoCsvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = demoCsvFilename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mb-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium hover:bg-indigo-400 cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload CSV'}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
        <button
          type="button"
          onClick={downloadDemo}
          className="rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/15"
        >
          Download Demo CSV
        </button>
      </div>
      {message && (
        <div className={`text-sm ${message.startsWith('Error') ? 'text-red-300' : 'text-green-300'}`}>
          {message}
        </div>
      )}
    </div>
  )
}
