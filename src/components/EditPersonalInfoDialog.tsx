import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditPersonalInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  bureau: string;
  field: string;
  currentValue: any;
  onSave: () => void;
}

const EditPersonalInfoDialog = ({
  open,
  onOpenChange,
  reportId,
  bureau,
  field,
  currentValue,
  onSave,
}: EditPersonalInfoDialogProps) => {
  const { toast } = useToast();
  const [value, setValue] = useState(
    typeof currentValue === 'object' ? JSON.stringify(currentValue, null, 2) : currentValue || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Fetch current report data
      const { data: report, error: fetchError } = await supabase
        .from('credit_reports')
        .select('personal_info')
        .eq('id', reportId)
        .single();

      if (fetchError) throw fetchError;

      // Update the specific field
      const updatedPersonalInfo: Record<string, any> = (report?.personal_info as Record<string, any>) || {};
      
      // Parse value if it's JSON format (for addresses)
      let parsedValue: any = value;
      if (field === 'current_addresses' || field === 'previous_addresses' || field === 'employers') {
        try {
          parsedValue = JSON.parse(value);
        } catch {
          // If not valid JSON, treat as array of strings
          parsedValue = value.split('\n').filter((line: string) => line.trim());
        }
      }

      if (!updatedPersonalInfo[bureau]) {
        updatedPersonalInfo[bureau] = {};
      }
      updatedPersonalInfo[bureau][field] = parsedValue;

      // Save to database
      const { error: updateError } = await supabase
        .from('credit_reports')
        .update({ personal_info: updatedPersonalInfo })
        .eq('id', reportId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });

      onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating personal info:', error);
      toast({
        title: "Error",
        description: "Failed to update personal information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fieldLabels: Record<string, string> = {
    name: "Name",
    also_known_as: "Also Known As",
    former: "Former",
    date_of_birth: "Date of Birth",
    current_addresses: "Current Addresses",
    previous_addresses: "Previous Addresses",
    employers: "Employers",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Edit {fieldLabels[field]} ({bureau})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            {field === 'current_addresses' || field === 'previous_addresses' || field === 'employers' ? (
              <Textarea
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={8}
                className="font-mono text-sm"
                placeholder={field === 'employers' ? "EMPLOYER 1\nEMPLOYER 2" : "Format as JSON array or one per line"}
              />
            ) : (
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
            {(field === 'current_addresses' || field === 'previous_addresses') && (
              <p className="text-xs text-muted-foreground">
                You can paste JSON or enter one address per line
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPersonalInfoDialog;
