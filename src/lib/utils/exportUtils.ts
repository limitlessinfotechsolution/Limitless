import { ExportFormat } from '@/types';

/**
 * Converts data to CSV format
 * @param data Array of objects to convert to CSV
 * @returns CSV string
 */
export function exportToCSV(data: any[]): string {
  if (!data || data.length === 0) return '';
  
  // Get all unique keys from the data
  const keys = Array.from(
    new Set(data.flatMap(obj => Object.keys(obj)))
  );
  
  // Create header row
  const header = keys.join(',');
  
  // Create data rows
  const rows = data.map(obj => {
    return keys.map(key => {
      const value = obj[key];
      // Handle special characters and quotes
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
}

/**
 * Converts data to JSON format
 * @param data Array of objects to convert to JSON
 * @returns JSON string
 */
export function exportToJSON(data: any[]): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Converts data to PDF format (simplified implementation)
 * @param data Array of objects to convert to PDF
 * @param title Title for the PDF document
 * @returns Blob containing PDF data
 */
export function exportToPDF(data: any[], title: string): Blob {
  // This is a simplified implementation
  // In a real application, you would use a library like jsPDF or pdfmake
  
  // Create a simple text representation
  let content = `${title}\n\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  data.forEach((item, index) => {
    content += `Record ${index + 1}:\n`;
    Object.entries(item).forEach(([key, value]) => {
      content += `  ${key}: ${value}\n`;
    });
    content += '\n';
  });
  
  return new Blob([content], { type: 'application/pdf' });
}

/**
 * Triggers download of data in specified format
 * @param data Data to export
 * @param format Export format
 * @param filename Name of the file to download
 */
export function downloadExport(data: any[], format: ExportFormat, filename: string): void {
  let content: string | Blob;
  let mimeType: string;
  let fileExtension: string;
  
  switch (format) {
    case ExportFormat.CSV:
      content = exportToCSV(data);
      mimeType = 'text/csv';
      fileExtension = 'csv';
      break;
    case ExportFormat.JSON:
      content = exportToJSON(data);
      mimeType = 'application/json';
      fileExtension = 'json';
      break;
    case ExportFormat.PDF:
      content = exportToPDF(data, filename);
      mimeType = 'application/pdf';
      fileExtension = 'pdf';
      break;
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
  
  // Ensure filename has correct extension
  if (!filename.endsWith(`.${fileExtension}`)) {
    filename = `${filename}.${fileExtension}`;
  }
  
  // Create and trigger download
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}