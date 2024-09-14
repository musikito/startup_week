'use client'

import { useState, useRef, useEffect } from 'react'
import jsQR from 'jsqr'
import { motion } from 'framer-motion'
import { Camera, CheckCircle2, List, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface QRCode {
  id: string;
  data: string;
  timestamp: number;
}

export default function QRCodeScanner() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [savedCodes, setSavedCodes] = useState<QRCode[]>([])
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const storedCodes = localStorage.getItem('qrCodes')
    if (storedCodes) {
      setSavedCodes(JSON.parse(storedCodes))
    }
  }, [])

  const startScanning = async () => {
    setScanning(true)
    setResult(null)
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current!.play()
          requestAnimationFrame(scanQRCode)
        }
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access the camera. Please make sure you have given permission and try again.')
      setScanning(false)
    }
  }

  const stopScanning = () => {
    setScanning(false)
    const stream = videoRef.current?.srcObject as MediaStream
    stream?.getTracks().forEach(track => track.stop())
  }

  const scanQRCode = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQR(imageData.data, imageData.width, imageData.height)
          if (code) {
            setResult(code.data)
            stopScanning()
            saveQRCodeData(code.data)
          } else if (scanning) {
            requestAnimationFrame(scanQRCode)
          }
        }
      } else if (scanning) {
        requestAnimationFrame(scanQRCode)
      }
    }
  }

  const saveQRCodeData = (data: string) => {
    const newCode: QRCode = {
      id: Date.now().toString(),
      data,
      timestamp: Date.now(),
    }
    const updatedCodes = [...savedCodes, newCode]
    setSavedCodes(updatedCodes)
    localStorage.setItem('qrCodes', JSON.stringify(updatedCodes))
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">QR Code Scanner</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
            {scanning && (
              <>
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
                <motion.div
                  className="absolute inset-0 border-4 border-white rounded-lg"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}
            {!scanning && !result && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {result ? (
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <p className="font-semibold">QR Code Scanned Successfully!</p>
              <p className="text-sm text-gray-500">{result}</p>
              <Button onClick={() => { setResult(null); setScanning(false); }} className="mt-4">
                Scan Another Code
              </Button>
            </div>
          ) : (
            <Button onClick={scanning ? stopScanning : startScanning} className="w-full">
              {scanning ? 'Stop Scanning' : 'Start Scanning'}
              <Camera className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                View Saved Codes
                <List className="ml-2 h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Saved QR Codes</DialogTitle>
              </DialogHeader>
              <div className="max-h-[60vh] overflow-y-auto">
                {savedCodes.length > 0 ? (
                  savedCodes.map((code) => (
                    <div key={code.id} className="border-b py-2">
                      <p className="font-semibold">{code.data}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(code.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No saved QR codes yet.</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}