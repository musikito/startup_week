declare module 'qrcode' {
    export function toCanvas(
      canvas: HTMLCanvasElement,
      text: string,
      callback: (error: Error | null) => void
    ): void;
  
    export function toCanvas(
      canvas: HTMLCanvasElement,
      text: string,
      options: object,
      callback: (error: Error | null) => void
    ): void;
  
    // Add other methods you use from the qrcode library
  }