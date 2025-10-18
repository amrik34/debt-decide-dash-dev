import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PdfUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function PdfUploader({ onFileSelect, isLoading, error }: PdfUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-12 text-center">
          <div className="flex justify-center mb-4">
            {fileName ? (
              <FileText className="h-16 w-16 text-primary" />
            ) : (
              <Upload className="h-16 w-16 text-gray-400" />
            )}
          </div>

          {fileName ? (
            <div className="space-y-2">
              <p className="text-lg font-medium">{fileName}</p>
              <p className="text-sm text-muted-foreground">
                File ready to process
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drag and drop your PDF file here
              </p>
              <p className="text-sm text-muted-foreground">
                or click the button below to browse
              </p>
            </div>
          )}

          <div className="mt-6">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileInput}
              className="hidden"
              id="pdf-upload"
              disabled={isLoading}
            />
            <label htmlFor="pdf-upload">
              <Button
                type="button"
                variant="default"
                disabled={isLoading}
                onClick={() => document.getElementById('pdf-upload')?.click()}
              >
                {isLoading ? 'Processing...' : fileName ? 'Choose Different File' : 'Browse Files'}
              </Button>
            </label>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Only PDF files are accepted
          </p>
        </div>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
