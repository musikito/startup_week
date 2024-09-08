'use client'

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCodeComponentProps {
  value: string;
}

export default function QRCodeComponent({ value }: QRCodeComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        value,
        { width: 300, margin: 2 },
        (error) => {
          if (error) console.error('Error generating QR code', error)
        }
      )
    }
  }, [value])

  return <canvas ref={canvasRef} />
}