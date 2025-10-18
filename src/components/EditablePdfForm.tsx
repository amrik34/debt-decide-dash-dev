import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ParsedField, ParsedPdfData } from '@/lib/pdfParser';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface EditablePdfFormProps {
  pdfFile: File;
  parsedData: ParsedPdfData;
  onExport?: (updatedFields: Record<string, string>) => void;
}

interface RenderedPage {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export function EditablePdfForm({ pdfFile, parsedData, onExport }: EditablePdfFormProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [scale, setScale] = useState<number>(1.0);
  const [renderedPages, setRenderedPages] = useState<RenderedPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialValues: Record<string, string> = {};
    parsedData.fields.forEach(field => {
      initialValues[field.name] = field.value;
    });
    setFieldValues(initialValues);
  }, [parsedData]);

  useEffect(() => {
    let isMounted = true;

    const renderPdf = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Rendering PDF:', pdfFile.name);
        const arrayBuffer = await pdfFile.arrayBuffer();
        console.log('Loading PDF document...');

        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          useWorkerFetch: false,
          isEvalSupported: false,
          disableAutoFetch: true,
          disableStream: true
        });
        const pdf: PDFDocumentProxy = await loadingTask.promise;
        console.log('PDF loaded, rendering', pdf.numPages, 'pages');

        const pages: RenderedPage[] = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page: PDFPageProxy = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d') as CanvasRenderingContext2D;

          if (!context) continue;

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport,
          } as any).promise;

          if (isMounted) {
            pages.push({
              pageNumber: pageNum,
              canvas,
              width: viewport.width,
              height: viewport.height,
            });
          }
        }

        if (isMounted) {
          setRenderedPages(pages);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('PDF rendering error:', err);
        if (isMounted) {
          setError('Failed to render PDF. Please try a different file.');
          setIsLoading(false);
        }
      }
    };

    renderPdf();

    return () => {
      isMounted = false;
    };
  }, [pdfFile]);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleExport = () => {
    if (onExport) {
      onExport(fieldValues);
    }
  };

  const renderField = (field: ParsedField, pageWidth: number, pageHeight: number) => {
    const scaleX = pageWidth / 612;
    const scaleY = pageHeight / 792;

    const commonStyle = {
      position: 'absolute' as const,
      left: `${field.x * scaleX * scale}px`,
      top: `${field.y * scaleY * scale}px`,
      width: `${Math.max(field.width * scaleX * scale, 100)}px`,
      height: `${Math.max(field.height * scaleY * scale, 30)}px`,
      fontSize: `${14 * scale}px`,
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            key={field.name}
            value={fieldValues[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={commonStyle}
            className="bg-white/95 border-blue-400 resize-none shadow-sm"
            placeholder={field.name}
          />
        );

      case 'checkbox':
        return (
          <div key={field.name} style={commonStyle} className="flex items-center bg-white/95 rounded border border-blue-400 px-2 shadow-sm">
            <Checkbox
              checked={fieldValues[field.name] === 'true' || fieldValues[field.name] === 'on'}
              onCheckedChange={(checked) => handleFieldChange(field.name, checked ? 'true' : 'false')}
            />
            <span className="ml-2 text-xs truncate">{field.name}</span>
          </div>
        );

      case 'select':
        return (
          <Select
            key={field.name}
            value={fieldValues[field.name] || ''}
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            <SelectTrigger style={commonStyle} className="bg-white/95 border-blue-400 shadow-sm">
              <SelectValue placeholder={field.name} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return (
          <Input
            key={field.name}
            value={fieldValues[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            style={commonStyle}
            className="bg-white/95 border-blue-400 shadow-sm"
            placeholder={field.name}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Rendering PDF...</p>
          <p className="text-sm text-muted-foreground">This may take a moment</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {onExport && (
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        )}
      </div>

      <Card className="overflow-auto max-h-[800px] bg-gray-100">
        <div className="p-8" ref={containerRef}>
          {renderedPages.map((page) => {
            const pageFields = parsedData.fields.filter(
              field => field.pageNumber === page.pageNumber
            );

            return (
              <div
                key={`page_${page.pageNumber}`}
                className="relative mb-8 bg-white shadow-lg mx-auto"
                style={{
                  width: `${page.width * scale}px`,
                  height: `${page.height * scale}px`,
                }}
              >
                <canvas
                  ref={(canvas) => {
                    if (canvas && page.canvas) {
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        canvas.width = page.width * scale;
                        canvas.height = page.height * scale;
                        ctx.scale(scale, scale);
                        ctx.drawImage(page.canvas, 0, 0);
                      }
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="relative w-full h-full pointer-events-auto">
                    {pageFields.map(field => renderField(field, page.width, page.height))}
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded text-sm">
                  Page {page.pageNumber}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
