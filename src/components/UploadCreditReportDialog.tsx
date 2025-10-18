import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { parseIdentityIQCreditReport } from "@/lib/advancedCreditReportParser";

interface UploadCreditReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UploadCreditReportDialog = ({ open, onOpenChange }: UploadCreditReportDialogProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate UUID v4 format
  const isUUID = (value: string | undefined) =>
    !!value &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value as string);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(["Uploading file to storage..."]);

    try {
      // Upload file to Supabase Storage first
      const filePath = `${id}/${Date.now()}-${file.name}`;
      console.log('Uploading file to storage:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('credit-reports')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      setUploadProgress(prev => [...prev, "Parsing credit report with advanced OCR..."]);

      let parsedData;
      try {
        console.log('Starting advanced PDF parsing...');
        const creditReportData = await parseIdentityIQCreditReport(file);
        console.log('Parsed credit report data:', creditReportData);

        parsedData = {
          provider: creditReportData.provider,
          reference_number: null,
          report_date: creditReportData.reportDate,
          personal_info: {
            transunion: {
              name: creditReportData.personalInfo.transunion.name,
              date_of_birth: creditReportData.personalInfo.transunion.dateOfBirth,
              current_addresses: creditReportData.personalInfo.transunion.currentAddresses,
              employers: creditReportData.personalInfo.transunion.employers,
              also_known_as: creditReportData.personalInfo.transunion.alsoKnownAs,
              former: creditReportData.personalInfo.transunion.former,
              credit_report_date: creditReportData.personalInfo.transunion.creditReportDate,
              previous_addresses: creditReportData.personalInfo.transunion.previousAddresses,
            },
            experian: {
              name: creditReportData.personalInfo.experian.name,
              date_of_birth: creditReportData.personalInfo.experian.dateOfBirth,
              current_addresses: creditReportData.personalInfo.experian.currentAddresses,
              employers: creditReportData.personalInfo.experian.employers,
              also_known_as: creditReportData.personalInfo.experian.alsoKnownAs,
              former: creditReportData.personalInfo.experian.former,
              credit_report_date: creditReportData.personalInfo.experian.creditReportDate,
              previous_addresses: creditReportData.personalInfo.experian.previousAddresses,
            },
            equifax: {
              name: creditReportData.personalInfo.equifax.name,
              date_of_birth: creditReportData.personalInfo.equifax.dateOfBirth,
              current_addresses: creditReportData.personalInfo.equifax.currentAddresses,
              employers: creditReportData.personalInfo.equifax.employers,
              also_known_as: creditReportData.personalInfo.equifax.alsoKnownAs,
              former: creditReportData.personalInfo.equifax.former,
              credit_report_date: creditReportData.personalInfo.equifax.creditReportDate,
              previous_addresses: creditReportData.personalInfo.equifax.previousAddresses,
            }
          },
          fico_scores: {
            transunion: { score: null },
            experian: { score: null },
            equifax: { score: null }
          },
          summary: {
            transunion: {},
            experian: {},
            equifax: {}
          },
          accounts: [],
          inquiries: []
        };

        setUploadProgress(prev => [...prev, "Data extraction completed successfully"]);
      } catch (parseError) {
        console.error('Advanced parsing error:', parseError);
        setUploadProgress(prev => [...prev, "Using basic data structure - you can edit manually"]);

        parsedData = {
          provider: 'Manual Upload',
          reference_number: null,
          report_date: new Date().toISOString().split('T')[0],
          personal_info: {
            transunion: { name: null, date_of_birth: null, current_addresses: [], employers: [] },
            experian: { name: null, date_of_birth: null, current_addresses: [], employers: [] },
            equifax: { name: null, date_of_birth: null, current_addresses: [], employers: [] }
          },
          fico_scores: {
            transunion: { score: null },
            experian: { score: null },
            equifax: { score: null }
          },
          summary: {
            transunion: {},
            experian: {},
            equifax: {}
          },
          accounts: [],
          inquiries: []
        };
      }

      setUploadProgress(prev => [...prev, "Saving parsed data..."]);

      // Create database record with parsed data
      const payload: any = {
        file_name: file.name,
        file_path: filePath,
        provider: parsedData.provider || 'Unknown',
        reference_number: parsedData.reference_number,
        report_date: parsedData.report_date,
        status: 'pending',
        personal_info: parsedData.personal_info,
        fico_scores: parsedData.fico_scores,
        summary: parsedData.summary,
        accounts: parsedData.accounts || [],
        inquiries: parsedData.inquiries || [],
        // Keep legacy format for backward compatibility
        analysis_data: {
          experian: {
            score: parsedData.fico_scores?.experian?.score,
            name: parsedData.personal_info?.experian?.name,
            yearOfBirth: parsedData.personal_info?.experian?.date_of_birth,
            currentEmployer: parsedData.personal_info?.experian?.employers?.[0],
            previousEmployer: parsedData.personal_info?.experian?.employers?.slice(1).join(', '),
            addresses: parsedData.personal_info?.experian?.current_addresses
          },
          equifax: {
            score: parsedData.fico_scores?.equifax?.score,
            name: parsedData.personal_info?.equifax?.name,
            yearOfBirth: parsedData.personal_info?.equifax?.date_of_birth,
            currentEmployer: parsedData.personal_info?.equifax?.employers?.[0],
            previousEmployer: parsedData.personal_info?.equifax?.employers?.slice(1).join(', '),
            addresses: parsedData.personal_info?.equifax?.current_addresses
          },
          transunion: {
            score: parsedData.fico_scores?.transunion?.score,
            name: parsedData.personal_info?.transunion?.name,
            yearOfBirth: parsedData.personal_info?.transunion?.date_of_birth,
            currentEmployer: parsedData.personal_info?.transunion?.employers?.[0],
            previousEmployer: parsedData.personal_info?.transunion?.employers?.slice(1).join(', '),
            addresses: parsedData.personal_info?.transunion?.current_addresses
          }
        }
      };

      // Only include client_id if the route param is a valid UUID
      if (isUUID(id)) {
        payload.client_id = id;
      }

      console.log('Inserting data into database:', payload);

      const { data: reportData, error: dbError } = await supabase
        .from('credit_reports')
        .insert(payload as any)
        .select()
        .maybeSingle();

      if (dbError) {
        console.error('Database insert error:', dbError);
        throw new Error(`Database insert failed: ${dbError.message}`);
      }

      console.log('Database record created:', reportData);

      toast({
        title: "Success",
        description: "Credit report uploaded and parsed successfully. Review and edit as needed.",
      });

      // Navigate to preview page
      navigate(`/clients/${id}/credit-report/${reportData.id}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload credit report";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isUploading ? (
          <div className="py-8">
            <DialogHeader>
              <DialogTitle>Auto Import Running</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 mt-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="space-y-2 text-center">
                {uploadProgress.map((step, index) => (
                  <p 
                    key={index} 
                    className={index === uploadProgress.length - 1 ? "font-semibold" : "text-muted-foreground"}
                  >
                    {step}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Import Credit Report</DialogTitle>
              <DialogDescription>
                Upload a credit report file to import and analyze
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-8">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UploadCreditReportDialog;
