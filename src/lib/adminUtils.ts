import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function handleBulkAction(
  type: 'delete' | 'approve' | 'publish' | 'unpublish',
  ids: string[],
  entity: 'testimonials' | 'leads' | 'projects'
): Promise<void> {
  try {
    let updateData: Record<string, unknown>;

    switch (type) {
      case 'delete':
        await supabase.from(entity).delete().in('id', ids);
        break;
      case 'approve':
        if (entity === 'testimonials') {
          updateData = { approved: true, approved_at: new Date().toISOString() };
          await supabase.from(entity).update(updateData).in('id', ids);
        }
        break;
      case 'publish':
        if (entity === 'projects') {
          updateData = { is_published: true };
          await supabase.from(entity).update(updateData).in('id', ids);
        }
        break;
      case 'unpublish':
        if (entity === 'projects') {
          updateData = { is_published: false };
          await supabase.from(entity).update(updateData).in('id', ids);
        }
        break;
      default:
        throw new Error(`Unsupported bulk action type: ${type}`);
    }

    console.log(`Bulk action '${type}' completed for ${entity}: ${ids.length} items affected`);
  } catch (error) {
    console.error(`Error performing bulk action on ${entity}:`, error);
    throw error;
  }
}

// Export utilities
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export async function exportToCSV(data: unknown[], filename: string): Promise<Blob> {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return blob;
}

export async function exportToPDF(data: unknown[], title: string): Promise<Blob> {
  const doc = new jsPDF();
  doc.text(title, 14, 20);
  if (data.length > 0) {
    const headers = Object.keys(data[0] as Record<string, unknown>);
    const body = data.map(row => headers.map(header => (row as Record<string, unknown>)[header] || ''));
    (doc as any).autoTable({
      head: [headers],
      body,
      startY: 30,
    });
  }
  const pdfBlob = doc.output('blob');
  const link = document.createElement('a');
  const url = URL.createObjectURL(pdfBlob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${title}.pdf`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return pdfBlob;
}
