import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreditReportEditFormProps {
  reportId: string;
  reportData: any;
  onSave: () => void;
}

const CreditReportEditForm = ({ reportId, reportData, onSave }: CreditReportEditFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ...reportData,
    personal_info: reportData.personal_info || {},
    fico_scores: reportData.fico_scores || {},
    summary: reportData.summary || {}
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const bureaus = ['transunion', 'experian', 'equifax'];

  // Field mapping for validation and display
  const fieldLabels = {
    name: "Full Name",
    date_of_birth: "Date of Birth",
    ssn: "SSN",
    current_addresses: "Current Address(es)",
    previous_addresses: "Previous Address(es)",
    employers: "Employer(s)",
    phone_numbers: "Phone Number(s)"
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    bureaus.forEach(bureau => {
      const bureauData = formData.personal_info[bureau];
      if (!bureauData?.name) {
        errors.push(`${bureau}: Name is required`);
      }
      if (!bureauData?.date_of_birth) {
        errors.push(`${bureau}: Date of Birth is required`);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleFieldChange = (bureau: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [bureau]: {
          ...prev.personal_info[bureau],
          [field]: value
        }
      }
    }));
  };

  const handleScoreChange = (bureau: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      fico_scores: {
        ...prev.fico_scores,
        [bureau]: {
          ...prev.fico_scores[bureau],
          [field]: value
        }
      }
    }));
  };

  const handleSummaryChange = (bureau: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      summary: {
        ...prev.summary,
        [bureau]: {
          ...prev.summary[bureau],
          [field]: value
        }
      }
    }));
  };

  const handleReset = () => {
    setFormData({
      ...reportData,
      personal_info: reportData.personal_info || {},
      fico_scores: reportData.fico_scores || {},
      summary: reportData.summary || {}
    });
    setValidationErrors([]);
    toast({
      title: "Form Reset",
      description: "All changes have been reverted to original values",
    });
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Failed",
        description: "Please correct the highlighted errors before saving",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('credit_reports')
        .update({
          personal_info: formData.personal_info,
          fico_scores: formData.fico_scores,
          summary: formData.summary,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Credit report data saved successfully",
      });

      onSave();
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save credit report data",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Card className="bg-destructive/10 border-destructive p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <h4 className="font-semibold text-destructive mb-2">Validation Errors:</h4>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, idx) => (
                  <li key={idx} className="text-sm text-destructive">{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Original
        </Button>
      </div>

      {/* Personal Information Form */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bureaus.map(bureau => (
            <div key={bureau} className="space-y-4">
              <div className="bg-muted p-2 rounded">
                <h4 className="font-semibold text-center capitalize">{bureau}</h4>
              </div>

              <div>
                <Label htmlFor={`${bureau}-name`}>Name *</Label>
                <Input
                  id={`${bureau}-name`}
                  value={formData.personal_info[bureau]?.name || ''}
                  onChange={(e) => handleFieldChange(bureau, 'name', e.target.value)}
                  className={validationErrors.some(e => e.includes(`${bureau}: Name`)) ? 'border-destructive' : ''}
                />
              </div>

              <div>
                <Label htmlFor={`${bureau}-dob`}>Date of Birth *</Label>
                <Input
                  id={`${bureau}-dob`}
                  type="date"
                  value={formData.personal_info[bureau]?.date_of_birth || ''}
                  onChange={(e) => handleFieldChange(bureau, 'date_of_birth', e.target.value)}
                  className={validationErrors.some(e => e.includes(`${bureau}: Date of Birth`)) ? 'border-destructive' : ''}
                />
              </div>

              <div>
                <Label htmlFor={`${bureau}-ssn`}>SSN</Label>
                <Input
                  id={`${bureau}-ssn`}
                  value={formData.personal_info[bureau]?.ssn || ''}
                  onChange={(e) => handleFieldChange(bureau, 'ssn', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                />
              </div>

              <div>
                <Label htmlFor={`${bureau}-address`}>Current Address(es)</Label>
                <Textarea
                  id={`${bureau}-address`}
                  value={
                    Array.isArray(formData.personal_info[bureau]?.current_addresses)
                      ? formData.personal_info[bureau].current_addresses.map((a: any) => 
                          `${a.street}, ${a.city}, ${a.state} ${a.zip}`
                        ).join('\n')
                      : ''
                  }
                  onChange={(e) => {
                    const addresses = e.target.value.split('\n').map(line => {
                      const parts = line.split(',').map(p => p.trim());
                      return {
                        street: parts[0] || '',
                        city: parts[1] || '',
                        state: parts[2]?.split(' ')[0] || '',
                        zip: parts[2]?.split(' ')[1] || ''
                      };
                    });
                    handleFieldChange(bureau, 'current_addresses', addresses);
                  }}
                  placeholder="One address per line"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor={`${bureau}-employers`}>Employer(s)</Label>
                <Textarea
                  id={`${bureau}-employers`}
                  value={
                    Array.isArray(formData.personal_info[bureau]?.employers)
                      ? formData.personal_info[bureau].employers.join('\n')
                      : ''
                  }
                  onChange={(e) => handleFieldChange(bureau, 'employers', e.target.value.split('\n'))}
                  placeholder="One employer per line"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Credit Scores Form */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Credit Scores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bureaus.map(bureau => (
            <div key={bureau} className="space-y-4">
              <div className="bg-muted p-2 rounded">
                <h4 className="font-semibold text-center capitalize">{bureau}</h4>
              </div>

              <div>
                <Label htmlFor={`${bureau}-score`}>FICO Score</Label>
                <Input
                  id={`${bureau}-score`}
                  type="number"
                  value={formData.fico_scores[bureau]?.score || ''}
                  onChange={(e) => handleScoreChange(bureau, 'score', parseInt(e.target.value))}
                  min="300"
                  max="850"
                />
              </div>

              <div>
                <Label htmlFor={`${bureau}-rank`}>Rank</Label>
                <Input
                  id={`${bureau}-rank`}
                  value={formData.fico_scores[bureau]?.rank || ''}
                  onChange={(e) => handleScoreChange(bureau, 'rank', e.target.value)}
                  placeholder="e.g., Good, Excellent"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Form */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bureaus.map(bureau => (
            <div key={bureau} className="space-y-4">
              <div className="bg-muted p-2 rounded">
                <h4 className="font-semibold text-center capitalize">{bureau}</h4>
              </div>

              <div>
                <Label htmlFor={`${bureau}-total`}>Total Accounts</Label>
                <Input
                  id={`${bureau}-total`}
                  type="number"
                  value={formData.summary[bureau]?.total_accounts || ''}
                  onChange={(e) => handleSummaryChange(bureau, 'total_accounts', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor={`${bureau}-open`}>Open Accounts</Label>
                <Input
                  id={`${bureau}-open`}
                  type="number"
                  value={formData.summary[bureau]?.open_accounts || ''}
                  onChange={(e) => handleSummaryChange(bureau, 'open_accounts', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor={`${bureau}-delinquent`}>Delinquent</Label>
                <Input
                  id={`${bureau}-delinquent`}
                  type="number"
                  value={formData.summary[bureau]?.delinquent || ''}
                  onChange={(e) => handleSummaryChange(bureau, 'delinquent', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor={`${bureau}-balances`}>Total Balances</Label>
                <Input
                  id={`${bureau}-balances`}
                  value={formData.summary[bureau]?.balances || ''}
                  onChange={(e) => handleSummaryChange(bureau, 'balances', e.target.value)}
                  placeholder="$0"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Extraction Metadata */}
      {reportData.extraction_metadata && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Auto-Extracted</Badge>
            <span className="text-sm text-muted-foreground">
              Extracted {new Date(reportData.extraction_metadata.extracted_at).toLocaleString()}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreditReportEditForm;