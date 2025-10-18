import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface ParsedField {
  name: string;
  value: string;
  type: 'text' | 'textarea' | 'checkbox' | 'select';
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  options?: string[];
}

export interface ParsedPdfData {
  fields: ParsedField[];
  pageCount: number;
  metadata: {
    title?: string;
    author?: string;
    subject?: string;
  };
}

export async function parsePdfFile(file: File): Promise<ParsedPdfData> {
  try {
    console.log('Starting PDF parsing for:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    console.log('ArrayBuffer size:', arrayBuffer.byteLength);

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      disableAutoFetch: true,
      disableStream: true
    });
    const pdf: PDFDocumentProxy = await loadingTask.promise;
    console.log('PDF loaded successfully, pages:', pdf.numPages);

    const fields: ParsedField[] = [];
    const pageCount = pdf.numPages;

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const annotations = await page.getAnnotations();
      const viewport = page.getViewport({ scale: 1 });

      for (const annotation of annotations) {
        if (annotation.fieldType) {
          const rect = annotation.rect || [0, 0, 100, 20];

          fields.push({
            name: annotation.fieldName || `field_${pageNum}_${fields.length}`,
            value: annotation.fieldValue || '',
            type: getFieldType(annotation.fieldType),
            x: rect[0],
            y: viewport.height - rect[3],
            width: rect[2] - rect[0],
            height: rect[3] - rect[1],
            pageNumber: pageNum,
            options: annotation.options || undefined,
          });
        }
      }

      if (annotations.length === 0 && textContent.items.length > 0) {
        const items = textContent.items as any[];
        items.forEach((item, index) => {
          if (item.str && item.str.trim()) {
            const transform = item.transform;
            const x = transform[4];
            const y = viewport.height - transform[5];

            fields.push({
              name: `text_field_${pageNum}_${index}`,
              value: item.str,
              type: 'text',
              x: x,
              y: y - item.height,
              width: item.width || 150,
              height: item.height || 20,
              pageNumber: pageNum,
            });
          }
        });
      }
    }

    const metadata = await pdf.getMetadata();
    const info = metadata.info as any;

    return {
      fields,
      pageCount,
      metadata: {
        title: info?.Title,
        author: info?.Author,
        subject: info?.Subject,
      },
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF: ${error.message}`);
    }
    throw new Error('Failed to parse PDF file. Please ensure the file is valid and not password-protected.');
  }
}

function getFieldType(fieldType: string): 'text' | 'textarea' | 'checkbox' | 'select' {
  switch (fieldType?.toLowerCase()) {
    case 'tx':
    case 'text':
      return 'text';
    case 'ch':
    case 'choice':
      return 'select';
    case 'btn':
    case 'checkbox':
      return 'checkbox';
    default:
      return 'text';
  }
}
