
interface Window {
  html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
}

declare function html2canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement>;
