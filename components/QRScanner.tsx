'use client';

import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

export default function QRScanner() {
  const [scannedData, setScannedData] = useState('')

  const handleScan = async (data: string | null) => {
    if (data) {
      setScannedData(data)
      try {
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scannedData: data })
        })
        if (response.ok) {
          alert('QR code scan recorded successfully!')
        } else {
          alert('Failed to record QR code scan.')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('An error occurred while recording the scan.')
      }
    }
  }

  const handleError = (err: Error) => {
    console.error(err)
  }

  return (
    <div>
      <QrReader
        onResult={(result, error) => {
          if (result) {
            handleScan(result?.getText())
          }
          if (error) {
            handleError(error)
          }
        }}
        constraints={{ facingMode: 'environment' }}
      />
      <p>Scanned Data: {scannedData}</p>
    </div>
  )
}