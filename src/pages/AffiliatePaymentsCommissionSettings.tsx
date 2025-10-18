import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SetupSidebar from "@/components/SetupSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const AffiliatePaymentsCommissionSettings = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Determine which tab to show based on the route
  const getActiveTab = () => {
    if (location.pathname.includes("/advanced-settings")) {
      return "advanced-settings";
    } else if (location.pathname.includes("/commission-settings")) {
      return "commission-settings";
    }
    return "commission-settings";
  };

  const [formData, setFormData] = useState({
    commission_rate: "",
    lead_client_type: "lead",
    min_balance_payout: "100",
    payment_frequency: "monthly",
    show_earnings_portal: "no",
  });

  // Advanced Commission Settings state
  const [numberOfTiers, setNumberOfTiers] = useState("2");
  const [currentTier, setCurrentTier] = useState(1);
  const [defaultCommissionType, setDefaultCommissionType] = useState("%");
  const [defaultCommissionValue, setDefaultCommissionValue] = useState("40");
  const [customizeProducts, setCustomizeProducts] = useState(false);
  const [commissionLength, setCommissionLength] = useState(false);
  const [variableCommissions, setVariableCommissions] = useState(false);

  // Sample product data
  const [products] = useState([
    { id: 1, name: "AI Employee CRM", price: 497.00, commissionType: "%", commissionValue: "40" },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Commission settings updated successfully",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update commission settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen w-full">
      <SetupSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-4">Affiliate Payments</h1>

          <Tabs value={getActiveTab()} className="mb-6">
            <TabsList>
              <TabsTrigger value="active-inactive" asChild>
                <Link to="/my-company/affiliate-payments/affiliates">
                  Active/Inactive Affiliates
                </Link>
              </TabsTrigger>
              <TabsTrigger value="commission-settings" asChild>
                <Link to="/my-company/affiliate-payments/commission-settings">
                  Global Commission Settings
                </Link>
              </TabsTrigger>
              <TabsTrigger value="advanced-settings" asChild>
                <Link to="/my-company/affiliate-payments/advanced-settings">
                  Advanced Commission Settings
                </Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="commission-settings" className="mt-6">
              <p className="text-sm text-muted-foreground mb-8">
                This commission rate is applied to all affiliates. You can override the rate per affiliate by clicking "Settings" to the right of the affiliate's name.
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Commission Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="commission_rate">Commission Rate</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="commission_rate"
                        type="number"
                        className="pl-7"
                        value={formData.commission_rate}
                        onChange={(e) => handleChange("commission_rate", e.target.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Per text and Lead/Client Type */}
                  <div className="space-y-2">
                    <Label htmlFor="lead_client_type">Lead/Client</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">per</span>
                      <Select
                        value={formData.lead_client_type}
                        onValueChange={(value) => handleChange("lead_client_type", value)}
                      >
                        <SelectTrigger id="lead_client_type" className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lead">Lead</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs text-muted-foreground">(1 time flat payment)</p>
                  </div>

                  {/* Min Balance Required */}
                  <div className="space-y-2">
                    <Label htmlFor="min_balance_payout">Min Balance Required For Payout</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="min_balance_payout"
                        type="number"
                        className="pl-7"
                        value={formData.min_balance_payout}
                        onChange={(e) => handleChange("min_balance_payout", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Payment Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="payment_frequency">Payment Frequency</Label>
                    <Select
                      value={formData.payment_frequency}
                      onValueChange={(value) => handleChange("payment_frequency", value)}
                    >
                      <SelectTrigger id="payment_frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Allow Affiliates To See Earnings */}
                <div className="space-y-3">
                  <Label>Allow Affiliates To See Earnings In Their Portal?</Label>
                  <RadioGroup
                    value={formData.show_earnings_portal}
                    onValueChange={(value) => handleChange("show_earnings_portal", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="earnings_yes" />
                      <Label htmlFor="earnings_yes" className="font-normal cursor-pointer">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="earnings_no" />
                      <Label htmlFor="earnings_no" className="font-normal cursor-pointer">
                        No (recommended)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                  {loading ? "Updating..." : "Update Settings"}
                </Button>
              </form>
            </TabsContent>

            {/* Advanced Commission Settings Tab */}
            <TabsContent value="advanced-settings" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Set Up Multiple Tiers with Custom Commissions</h2>
                </div>

                {/* Number of Tiers */}
                <div className="space-y-2">
                  <Label htmlFor="number_of_tiers" className="text-base">
                    Number of Tiers <span className="text-muted-foreground">(Max 7 tiers)</span>
                  </Label>
                  <Select value={numberOfTiers} onValueChange={setNumberOfTiers}>
                    <SelectTrigger id="number_of_tiers" className="max-w-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} tier{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Enter the number of tiers you want for your affiliate campaign. Leave it at 1 if you don't want multiple tiers.
                  </p>
                </div>

                {/* Tier Navigation */}
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentTier(Math.max(1, currentTier - 1))}
                    disabled={currentTier === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-semibold text-primary">Tier {currentTier}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentTier(Math.min(parseInt(numberOfTiers), currentTier + 1))}
                    disabled={currentTier === parseInt(numberOfTiers)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Default Commission */}
                <div className="space-y-2">
                  <Label className="text-base">
                    Default Commission for All Products <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2 max-w-xs">
                    <Select value={defaultCommissionType} onValueChange={setDefaultCommissionType}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="$">$</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={defaultCommissionValue}
                      onChange={(e) => setDefaultCommissionValue(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Customize Commission by Products */}
                <Collapsible open={customizeProducts} onOpenChange={setCustomizeProducts}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-base font-medium">
                    <ChevronDown className={`h-4 w-4 transition-transform ${customizeProducts ? "" : "-rotate-90"}`} />
                    <span className="text-primary">📦 Customize Commission by Products</span>
                    <span className="ml-2 text-sm bg-primary/10 text-primary rounded-full px-2 py-0.5">
                      {products.length}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 p-4 bg-muted/50 font-medium text-sm">
                        <div>Product Name</div>
                        <div>Commission</div>
                        <div className="text-right">Price</div>
                        <div className="w-8"></div>
                      </div>
                      {products.map((product) => (
                        <div key={product.id} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-4 p-4 border-t items-center">
                          <div>{product.name}</div>
                          <div className="flex gap-2">
                            <Select value={product.commissionType}>
                              <SelectTrigger className="w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="%">%</SelectItem>
                                <SelectItem value="$">$</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input type="number" value={product.commissionValue} className="w-20" />
                          </div>
                          <div className="text-right">${product.price.toFixed(2)}</div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Commission Length */}
                <Collapsible open={commissionLength} onOpenChange={setCommissionLength}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-base">
                    <ChevronDown className={`h-4 w-4 transition-transform ${commissionLength ? "" : "-rotate-90"}`} />
                    <span>Commission Length</span>
                    <span className="ml-2 text-xs bg-primary/10 text-primary rounded px-2 py-0.5">
                      max. 12 charges
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 ml-6">
                    <p className="text-sm text-muted-foreground">Configure how long commissions are paid out.</p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Variable Commissions */}
                <Collapsible open={variableCommissions} onOpenChange={setVariableCommissions}>
                  <CollapsibleTrigger className="flex items-center gap-2 text-base">
                    <ChevronDown className={`h-4 w-4 transition-transform ${variableCommissions ? "" : "-rotate-90"}`} />
                    <span>Variable commissions amount over time</span>
                    <span className="ml-2 text-xs bg-muted text-muted-foreground rounded px-2 py-0.5">
                      No
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 ml-6">
                    <p className="text-sm text-muted-foreground">Set up commissions that vary over time.</p>
                  </CollapsibleContent>
                </Collapsible>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-primary hover:bg-primary/90">Save</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AffiliatePaymentsCommissionSettings;
