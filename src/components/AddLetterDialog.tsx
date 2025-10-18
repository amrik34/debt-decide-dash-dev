import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PlayCircle } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface AddLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  letter?: any;
}

const AddLetterDialog = ({ open, onOpenChange, onSuccess, letter }: AddLetterDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showPlaceholders, setShowPlaceholders] = useState(false);
  
  const [formData, setFormData] = useState({
    letter_title: letter?.letter_title || "",
    category: letter?.category || "",
    status: letter?.status || "active",
    ai_eligible: letter?.ai_eligible ?? true,
    content: letter?.content || "",
  });

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const placeholders = [
    "{client_first_name}",
    "{client_last_name}",
    "{client_address}",
    "{client_city}",
    "{client_state}",
    "{client_zip}",
    "{creditor_name}",
    "{account_number}",
    "{bureau_name}",
    "{dispute_reason}",
    "{current_date}",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (letter) {
        const { error } = await supabase
          .from("letters")
          .update(formData)
          .eq("id", letter.id);

        if (error) throw error;
        toast({ title: "Letter updated successfully" });
      } else {
        const { error } = await supabase
          .from("letters")
          .insert([formData]);

        if (error) throw error;
        toast({ title: "Letter added successfully" });
      }

      onSuccess();
      onOpenChange(false);
      setFormData({
        letter_title: "",
        category: "Default",
        status: "active",
        ai_eligible: true,
        content: "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Letter</DialogTitle>
        </DialogHeader>

        {showTutorial && (
          <div className="mb-4 bg-muted p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      Video Tutorial
                    </span>
                    <h3 className="font-semibold">Get Started With Your Letter Library</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These letter templates with parameters are used by the Dispute Wizard. Never type client or creditor information directly into these templates, modifying templates may prevent them from functioning. To generate a dispute letter for a client: 1) Go to <span className="text-primary cursor-pointer">Clients</span> 2) Log into a client&apos;s dashboard 3) Run the Dispute Wizard.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTutorial(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Hide
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Default">Default</SelectItem>
                  <SelectItem value="Credit Bureau Letters">Credit Bureau Letters</SelectItem>
                  <SelectItem value="Creditor Letters">Creditor Letters</SelectItem>
                  <SelectItem value="Collection Letters">Collection Letters</SelectItem>
                </SelectContent>
              </Select>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => toast({ title: "Feature coming soon" })}
              >
                Manage template category
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="letter_title">Letter Title *</Label>
              <Input
                id="letter_title"
                value={formData.letter_title}
                onChange={(e) => setFormData({ ...formData, letter_title: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPlaceholders(!showPlaceholders)}
            >
              View Placeholders
            </Button>
          </div>

          {showPlaceholders && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Available Placeholders</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Click on any placeholder to copy it to your clipboard
              </p>
              <div className="grid grid-cols-3 gap-2">
                {placeholders.map((placeholder) => (
                  <button
                    key={placeholder}
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(placeholder);
                      toast({ title: "Copied to clipboard", description: placeholder });
                    }}
                    className="text-sm px-3 py-2 bg-background hover:bg-accent rounded border text-left"
                  >
                    {placeholder}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Letter Content</Label>
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              modules={modules}
              className="bg-background"
              placeholder="Type here..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="ai_eligible"
              checked={formData.ai_eligible}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, ai_eligible: checked as boolean })
              }
            />
            <Label htmlFor="ai_eligible" className="cursor-pointer font-normal">
              AI Eligible
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Saving..." : "New Letter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLetterDialog;
