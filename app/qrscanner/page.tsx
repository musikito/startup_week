"use client";

import React, { useState, useRef } from "react";
import  {QrReader}  from "react-qr-reader";


function Scan() {
    const [scannedData, setScannedData] = useState('');
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
      <div>
        <QrReader
          constraints={{ facingMode: 'environment' }}
          onResult={(result:any, error:any) => {
            if (result) {
                handleScan(result?.getText());
            }
            if (error) {
                handleError(error);
            }
          }}
        />
        <p>{scannedData}</p>
      </div>
    </div>
  );
}

export default Scan;
