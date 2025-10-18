import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DisputeItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  itemType: string;
  itemData: any;
  bureau: string;
}

const DISPUTE_REASONS = [
  "Choose reason",
  "Sample Reason",
  "The following personal information is incorrect",
  "The following account is not mine",
  "The status is incorrect for the following account",
  "The following information is outdated. I would like it removed from my credit history report",
  "The following inquiry is more than two years old and I would like it removed",
  "The inquiry was not authorized",
  "The following accounts were closed by me and should state that",
  "The following account was a Bankruptcy/Charge-off. Balance should be $0",
  "Mistaken Identity",
  "Identity Theft",
  "Other information I would like changed",
  "This is a duplicate account",
  "The wrong amount is being reported",
  "This is the wrong creditor for this item",
  "Validate Account",
];

const DISPUTE_INSTRUCTIONS = [
  "Choose instructions",
  "Important",
  "Test Reason",
  "Test Maria",
  "Custom instruction 1",
  "Custom instruction 2",
];

const DisputeItemDialog = ({ 
  open, 
  onOpenChange, 
  reportId, 
  itemType, 
  itemData, 
  bureau 
}: DisputeItemDialogProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState("Keep");
  const [reason, setReason] = useState("");
  const [instructions, setInstructions] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!reason || reason === "Choose reason") {
      toast({
        title: "Error",
        description: "Please select a dispute reason",
        variant: "destructive",
      });
      return;
    }

    if (!instructions || instructions === "Choose instructions") {
      toast({
        title: "Error",
        description: "Please select dispute instructions",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('dispute_items')
        .insert({
          credit_report_id: reportId,
          item_type: itemType,
          item_data: itemData,
          status: status.toLowerCase(),
          reason,
          instructions,
          bureau,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Dispute item saved successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving dispute:', error);
      toast({
        title: "Error",
        description: "Failed to save dispute item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Dispute Credit Inquiry</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item Details */}
          {itemData && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="font-semibold">{itemData.company}</div>
              <div className="text-sm text-muted-foreground">{itemData.date}</div>
              <div className="text-sm text-muted-foreground">{itemData.description}</div>
              <div className="mt-2 flex items-center gap-2">
                <Check className="h-4 w-4 text-red-500" />
                <span className="text-sm font-semibold">Bureau: {bureau}</span>
              </div>
            </div>
          )}

          {/* Status Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Status:</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Keep">Keep</SelectItem>
                <SelectItem value="Positive">Positive</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Reason */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm">
                Add Reason:
              </div>
              <div className="flex-1">
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose reason" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {DISPUTE_REASONS.map((r) => (
                      <SelectItem 
                        key={r} 
                        value={r}
                        className={r === "The following personal information is incorrect" ? "bg-primary text-primary-foreground" : ""}
                      >
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="link" className="text-primary">
                Add new reason
              </Button>
            </div>
          </div>

          {/* Add Instructions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm">
                Add Instructions:
              </div>
              <div className="flex-1">
                <Select value={instructions} onValueChange={setInstructions}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose instructions" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISPUTE_INSTRUCTIONS.map((inst) => (
                      <SelectItem key={inst} value={inst}>
                        {inst}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="link" className="text-primary">
                Add new instruction
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Dispute"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeItemDialog;
