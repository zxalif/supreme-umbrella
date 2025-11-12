import type { Opportunity } from '@/types/opportunity';
import type { KeywordSearch } from '@/types/keyword-search';

/**
 * Export utilities for CSV and PDF generation
 */

/**
 * Export opportunities to CSV
 */
export function exportToCSV(
  opportunities: Opportunity[],
  filename: string = 'opportunities.csv'
): void {
  if (opportunities.length === 0) {
    alert('No data to export');
    return;
  }

  // CSV headers
  const headers = [
    'Title',
    'Source',
    'Status',
    'Total Score',
    'Relevance Score',
    'Urgency Score',
    'Budget',
    'Timeline',
    'Location',
    'Created At',
    'Updated At',
    'URL',
  ];

  // Convert opportunities to CSV rows
  const rows = opportunities.map(opp => {
    const extractedInfo = opp.extracted_info || {};
    return [
      escapeCSV(opp.title || 'N/A'),
      escapeCSV(opp.source || 'N/A'),
      escapeCSV(opp.status),
      opp.total_score?.toString() || '0',
      opp.relevance_score?.toString() || '0',
      opp.urgency_score?.toString() || '0',
      escapeCSV(extractedInfo.budget?.toString() || 'N/A'),
      escapeCSV(extractedInfo.timeline || 'N/A'),
      escapeCSV(extractedInfo.location || 'N/A'),
      new Date(opp.created_at).toLocaleString(),
      new Date(opp.updated_at).toLocaleString(),
      escapeCSV(opp.url || 'N/A'),
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export analytics data to CSV
 */
export function exportAnalyticsToCSV(
  opportunities: Opportunity[],
  keywordSearches: KeywordSearch[],
  filename: string = 'analytics.csv'
): void {
  // Summary data
  const summary = [
    ['Metric', 'Value'],
    ['Total Opportunities', opportunities.length.toString()],
    ['New Opportunities', opportunities.filter(o => o.status === 'new').length.toString()],
    ['Contacted', opportunities.filter(o => o.status === 'contacted').length.toString()],
    ['Applied', opportunities.filter(o => o.status === 'applied').length.toString()],
    ['Won', opportunities.filter(o => o.status === 'won').length.toString()],
    ['Lost', opportunities.filter(o => o.status === 'lost').length.toString()],
    ['Active Keyword Searches', keywordSearches.filter(s => s.enabled).length.toString()],
    ['Total Keyword Searches', keywordSearches.length.toString()],
    ['Average Score', (opportunities.reduce((sum, o) => sum + (o.total_score || 0), 0) / opportunities.length || 0).toFixed(2)],
  ];

  const csvContent = summary.map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export to PDF using browser print functionality
 */
export function exportToPDF(
  elementId: string,
  filename: string = 'report.pdf'
): void {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('Element not found for PDF export');
    return;
  }

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            padding: 20px;
            color: #1f2937;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #e5e7eb;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f3f4f6;
            font-weight: 600;
          }
          @media print {
            body { margin: 0; }
            @page { margin: 1cm; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

/**
 * Escape CSV special characters
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Generate PDF-friendly HTML from opportunities
 */
export function generatePDFHTML(
  opportunities: Opportunity[],
  title: string = 'Opportunities Report'
): string {
  const now = new Date().toLocaleString();
  
  let html = `
    <div style="font-family: Arial, sans-serif;">
      <h1 style="color: #1f2937; margin-bottom: 10px;">${title}</h1>
      <p style="color: #6b7280; margin-bottom: 30px;">Generated on ${now}</p>
      
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Title</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Source</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Status</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Score</th>
            <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: left;">Created</th>
          </tr>
        </thead>
        <tbody>
  `;

  opportunities.forEach(opp => {
    html += `
      <tr>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${escapeHTML(opp.title || 'N/A')}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${escapeHTML(opp.source || 'N/A')}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${opp.status}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${opp.total_score || 0}</td>
        <td style="border: 1px solid #e5e7eb; padding: 8px;">${new Date(opp.created_at).toLocaleDateString()}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  return html;
}

function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

