import { useState, useEffect } from "react";
import { Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SetupSidebar from "@/components/SetupSidebar";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const TIME_ZONES = [
  { value: "America/New_York", label: "(GMT -5:00) Eastern Time" },
  { value: "America/Chicago", label: "(GMT -6:00) Central Time" },
  { value: "America/Denver", label: "(GMT -7:00) Mountain Time" },
  { value: "America/Los_Angeles", label: "(GMT -8:00) Pacific Time" },
  { value: "America/Anchorage", label: "(GMT -9:00) Alaska Time" },
  { value: "Pacific/Honolulu", label: "(GMT -10:00) Hawaii Time" },
];

const MyCompany = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company_name: "",
    website: "",
    time_zone: "America/Los_Angeles",
    mailing_address: "",
    apt_suite_unit: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States",
    phone: "",
    fax: "",
    sender_name: "",
    sender_email: "",
    invoice_company_name: "",
  });

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("company_profile")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfileId(data.id);
        setFormData({
          company_name: data.company_name || "",
          website: data.website || "",
          time_zone: data.time_zone || "America/Los_Angeles",
          mailing_address: data.mailing_address || "",
          apt_suite_unit: data.apt_suite_unit || "",
          city: data.city || "",
          state: data.state || "",
          zip_code: data.zip_code || "",
          country: data.country || "United States",
          phone: data.phone || "",
          fax: data.fax || "",
          sender_name: data.sender_name || "",
          sender_email: data.sender_email || "",
          invoice_company_name: data.invoice_company_name || "",
        });
      }
    } catch (error) {
      console.error("Error loading company profile:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (profileId) {
        const { error } = await supabase
          .from("company_profile")
          .update(formData)
          .eq("id", profileId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("company_profile")
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        if (data) setProfileId(data.id);
      }

      toast({
        title: "Success",
        description: "Company profile saved successfully",
      });
    } catch (error) {
      console.error("Error saving company profile:", error);
      toast({
        title: "Error",
        description: "Failed to save company profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SetupSidebar />
      
      <div className="flex-1">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center gap-3 mb-6">
            <h1 className="text-3xl font-bold">My Company Profile</h1>
            <Button variant="link" className="text-primary">
              <ExternalLink className="h-4 w-4 mr-1" />
              Quick Video
            </Button>
          </div>

          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Please fill in all the details on this page, so the appropriate details will appear for your clients and affiliates.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  placeholder="Demello Inc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="www.demelloinc.com"
                />
                {formData.website && (
                  <a 
                    href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Check URL
                  </a>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time_zone">Time Zone</Label>
                <Select value={formData.time_zone} onValueChange={(value) => handleChange("time_zone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {TIME_ZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mailing_address">Mailing Address *</Label>
                <Input
                  id="mailing_address"
                  value={formData.mailing_address}
                  onChange={(e) => handleChange("mailing_address", e.target.value)}
                  placeholder="555 Anton Boulevard"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apt_suite_unit">Apt, Suite, Unit, etc, (optional)</Label>
                <Input
                  id="apt_suite_unit"
                  value={formData.apt_suite_unit}
                  onChange={(e) => handleChange("apt_suite_unit", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Costa Mesa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code">Zip Code *</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => handleChange("zip_code", e.target.value)}
                  placeholder="92626"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="(949) 943-2124"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fax">Fax</Label>
                <Input
                  id="fax"
                  type="tel"
                  value={formData.fax}
                  onChange={(e) => handleChange("fax", e.target.value)}
                  placeholder="(949) 398-9715"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Automated notifications are sent from the account holder's name and email address. Or you may designate a different name (or a company name) and email below for all notifications sent.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sender_name">Sender Name</Label>
                  <Input
                    id="sender_name"
                    value={formData.sender_name}
                    onChange={(e) => handleChange("sender_name", e.target.value)}
                    placeholder="Ian Suite"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sender_email">Sender Email</Label>
                  <Input
                    id="sender_email"
                    type="email"
                    value={formData.sender_email}
                    onChange={(e) => handleChange("sender_email", e.target.value)}
                    placeholder="wccmanagement@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invoice_company_name">Name/Company</Label>
                  <Input
                    id="invoice_company_name"
                    value={formData.invoice_company_name}
                    onChange={(e) => handleChange("invoice_company_name", e.target.value)}
                    placeholder="Demello Inc."
                  />
                  <p className="text-xs text-muted-foreground">
                    The name or company that your client invoices should be payable to
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-start pt-4">
              <Button type="submit" disabled={loading} className="px-8">
                {loading ? "Saving..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyCompany;
