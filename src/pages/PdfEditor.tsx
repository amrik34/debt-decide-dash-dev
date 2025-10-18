import { useState } from 'react';
import { PdfUploader } from '@/components/PdfUploader';
import { EditablePdfForm } from '@/components/EditablePdfForm';
import { parsePdfFile, ParsedPdfData } from '@/lib/pdfParser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileEdit } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfEditor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedPdfData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    console.log('File selected:', file.name, file.type, file.size);
    setIsLoading(true);
    setError(null);

    try {
      if (!file.type || file.type !== 'application/pdf') {
        throw new Error('Please upload a valid PDF file');
      }

      if (file.size > 50 * 1024 * 1024) {
        throw new Error('File size too large. Please upload a PDF smaller than 50MB');
      }

      const data = await parsePdfFile(file);
      console.log('Parsing complete, fields found:', data.fields.length);
      setParsedData(data);
      setSelectedFile(file);
    } catch (err) {
      console.error('File selection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing the PDF';
      setError(errorMessage);
      setParsedData(null);
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (updatedFields: Record<string, string>) => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      Object.entries(updatedFields).forEach(([fieldName, value]) => {
        try {
          const field = form.getField(fieldName);
          if (field) {
            if ('setText' in field) {
              (field as any).setText(value);
            }
          }
        } catch (e) {
          console.warn(`Could not update field ${fieldName}:`, e);
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${selectedFile.name}`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export PDF. The PDF may not support field updates.');
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-7xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileEdit className="h-8 w-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">PDF Editor</CardTitle>
                <CardDescription>
                  Upload a PDF file to edit its contents in an interactive form
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!parsedData ? (
              <PdfUploader
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                error={error}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {parsedData.metadata.title || selectedFile?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {parsedData.fields.length} fields detected · {parsedData.pageCount} page(s)
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setParsedData(null);
                      setSelectedFile(null);
                      setError(null);
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    Upload Different File
                  </button>
                </div>

                {selectedFile && (
                  <EditablePdfForm
                    pdfFile={selectedFile}
                    parsedData={parsedData}
                    onExport={handleExport}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
