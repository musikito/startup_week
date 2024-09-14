// "use client";

// import React, { useState, useRef } from "react";
// import  {QrReader}  from "react-qr-reader";


// function Scan() {
//     const [scannedData, setScannedData] = useState('');
//     const handleScan = async (data: string | null) => {
//         if (data) {
//           setScannedData(data)
//           try {
//             const response = await fetch('/api/scan', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ scannedData: data })
//             })
//             if (response.ok) {
//               alert('QR code scan recorded successfully!')
//             } else {
//               alert('Failed to record QR code scan.')
//             }
//           } catch (error) {
//             console.error('Error:', error)
//             alert('An error occurred while recording the scan.')
//           }
//         }
//       }
    
//       const handleError = (err: Error) => {
//         console.error(err)
//       }

//   return (
//     <div>
//       <div>
//       <QrReader
//           constraints={{ facingMode: 'environment' }}
//           // delay={500}
//           onError={handleError}
//           onScan={handleScan}
//           // chooseDeviceId={()=>selected}
//           style={{ width: "200px", heigth: "100px" }}
//         />
//         {/* <QrReader
//           constraints={{ facingMode: 'environment' }}
//           style={{ width: "200px", heigth: "100px" }}
//           onResult={(result:any, error:any) => {
//             if (result) {
//                 handleScan(result?.getText());
//             }
//             if (error) {
//                 handleError(error);
//             }
//           }}
//         /> */}
//         <p>{scannedData}</p>
//       </div>
//     </div>
//   );
// }

// export default Scan;

'use client'

import { useState, useRef, useEffect } from 'react'
import jsQR from 'jsqr'
import { motion } from 'framer-motion'
import { Camera, CheckCircle2, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface QRCode {
  id: string;
  data: string;
  timestamp: number;
}

export default function QRCodeScanner() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [savedCodes, setSavedCodes] = useState<QRCode[]>([])
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
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
      requestAnimationFrame(scanQRCode)
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
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code) {
          setResult(code.data)
          stopScanning()
          saveQRCodeData(code.data)
        } else if (scanning) {
          requestAnimationFrame(scanQRCode)
        }
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
          <div className="relative w-full aspect-square rounded-lg overflow-hidden">
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            {scanning && (
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
            )}
          </div>
          {result ? (
            <div className="text-center space-y-2">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <p className="font-semibold">QR Code Scanned Successfully!</p>
              <p className="text-sm text-gray-500">{result}</p>
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