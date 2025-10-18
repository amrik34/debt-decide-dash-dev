import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Upload } from "lucide-react";

interface AddAffiliateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  affiliate?: any;
}

const AddAffiliateDialog = ({ open, onOpenChange, onSuccess, affiliate }: AddAffiliateDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(affiliate?.avatar_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    first_name: affiliate?.first_name || "",
    last_name: affiliate?.last_name || "",
    email: affiliate?.email || "",
    phone: affiliate?.phone || "",
    phone_ext: affiliate?.phone_ext || "",
    phone_mobile: affiliate?.phone_mobile || "",
    company: affiliate?.company || "",
    company_website: affiliate?.company_website || "",
    status: affiliate?.status || "active",
    assigned_to: affiliate?.assigned_to || "",
    fax: affiliate?.fax || "",
    add_to_master_list: affiliate?.add_to_master_list || false,
    notes: affiliate?.notes || "",
    mailing_address: affiliate?.mailing_address || "",
    city: affiliate?.city || "",
    state: affiliate?.state || "",
    zip_code: affiliate?.zip_code || "",
    country: affiliate?.country || "United States",
    portal_access: affiliate?.portal_access || false,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('affiliate-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('affiliate-images')
        .getPublicUrl(filePath);

      setAvatarUrl(data.publicUrl);
      toast({ title: "Image uploaded successfully" });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const affiliateData = {
        ...formData,
        affiliate_name: `${formData.first_name} ${formData.last_name}`.trim(),
        avatar_url: avatarUrl || null,
      };

      if (affiliate) {
        const { error } = await supabase
          .from("affiliates")
          .update(affiliateData)
          .eq("id", affiliate.id);

        if (error) throw error;
        toast({ title: "Affiliate updated successfully" });
      } else {
        const { error } = await supabase
          .from("affiliates")
          .insert([affiliateData]);

        if (error) throw error;
        toast({ title: "Affiliate added successfully" });
      }

      onSuccess();
      onOpenChange(false);
      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        phone_ext: "",
        phone_mobile: "",
        company: "",
        company_website: "",
        status: "active",
        assigned_to: "",
        fax: "",
        add_to_master_list: false,
        notes: "",
        mailing_address: "",
        city: "",
        state: "",
        zip_code: "",
        country: "United States",
        portal_access: false,
      });
      setAvatarUrl("");
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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{affiliate ? "Edit" : "Add New"} Affiliate</DialogTitle>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mb-4">
          Affiliate partners are other professionals who refer new leads and clients to you. They are often Mortgage Brokers, Realtors, and Auto Dealers, whose business depends upon having clients with good credit.
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Affiliate Image */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Affiliate Image</Label>
            <div className="flex flex-col items-center gap-3">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Affiliate" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="link"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="text-primary"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? "Uploading..." : "Upload/Edit Image"}
              </Button>
            </div>
          </div>

          {/* Primary Contact Info */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Primary Contact Info</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_ext">Ext. (Optional)</Label>
                <Input
                  id="phone_ext"
                  value={formData.phone_ext}
                  onChange={(e) => setFormData({ ...formData, phone_ext: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_mobile">Phone (Mobile)</Label>
                <Input
                  id="phone_mobile"
                  value={formData.phone_mobile}
                  onChange={(e) => setFormData({ ...formData, phone_mobile: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_website">Company Website</Label>
                <Input
                  id="company_website"
                  value={formData.company_website}
                  onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                  placeholder="https://"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Additional Details</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assigned_to">Assigned To</Label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fax">Fax</Label>
                <Input
                  id="fax"
                  value={formData.fax}
                  onChange={(e) => setFormData({ ...formData, fax: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="add_to_master_list"
                checked={formData.add_to_master_list}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, add_to_master_list: checked as boolean })
                }
              />
              <Label htmlFor="add_to_master_list" className="cursor-pointer font-normal">
                Add to master contact list
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Internal)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="Add internal notes about this affiliate..."
              />
            </div>
          </div>

          {/* Mailing Address */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Mailing Address</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mailing_address">Mailing Address</Label>
                <Input
                  id="mailing_address"
                  value={formData.mailing_address}
                  onChange={(e) => setFormData({ ...formData, mailing_address: e.target.value })}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="AR">Arkansas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="IN">Indiana</SelectItem>
                    <SelectItem value="IA">Iowa</SelectItem>
                    <SelectItem value="KS">Kansas</SelectItem>
                    <SelectItem value="KY">Kentucky</SelectItem>
                    <SelectItem value="LA">Louisiana</SelectItem>
                    <SelectItem value="ME">Maine</SelectItem>
                    <SelectItem value="MD">Maryland</SelectItem>
                    <SelectItem value="MA">Massachusetts</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                    <SelectItem value="MN">Minnesota</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="MO">Missouri</SelectItem>
                    <SelectItem value="MT">Montana</SelectItem>
                    <SelectItem value="NE">Nebraska</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="NH">New Hampshire</SelectItem>
                    <SelectItem value="NJ">New Jersey</SelectItem>
                    <SelectItem value="NM">New Mexico</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="ND">North Dakota</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="OK">Oklahoma</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="RI">Rhode Island</SelectItem>
                    <SelectItem value="SC">South Carolina</SelectItem>
                    <SelectItem value="SD">South Dakota</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="UT">Utah</SelectItem>
                    <SelectItem value="VT">Vermont</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="WV">West Virginia</SelectItem>
                    <SelectItem value="WI">Wisconsin</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Portal Access */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Portal Access?</Label>
            <div className="flex items-center space-x-3">
              <Switch
                id="portal_access"
                checked={formData.portal_access}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, portal_access: checked })
                }
              />
              <Label htmlFor="portal_access" className="cursor-pointer font-normal">
                {formData.portal_access ? "On" : "Off"}
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : affiliate ? "Update" : "Add"} Affiliate
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAffiliateDialog;
