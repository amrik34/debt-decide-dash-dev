import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SetupSidebar from "@/components/SetupSidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, DollarSign } from "lucide-react";

const AffiliatePaymentsAffiliates = () => {
  const [activeAffiliates, setActiveAffiliates] = useState<any[]>([]);
  const [inactiveAffiliates, setInactiveAffiliates] = useState<any[]>([]);
  const [selectedAffiliates, setSelectedAffiliates] = useState<string[]>([]);
  const [filter, setFilter] = useState("all");
  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAffiliates();
  }, []);

  const loadAffiliates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const active = data?.filter((a) => a.status === "active") || [];
      const inactive = data?.filter((a) => a.status === "inactive") || [];

      setActiveAffiliates(active);
      setInactiveAffiliates(inactive);
    } catch (error: any) {
      toast({
        title: "Error loading affiliates",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAffiliate = (id: string) => {
    setSelectedAffiliates((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  const handleMarkAsPaid = () => {
    if (selectedAffiliates.length === 0) {
      toast({
        title: "No affiliates selected",
        description: "Please select at least one affiliate to mark as paid.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Payment recorded",
      description: `Marked ${selectedAffiliates.length} affiliate(s) as paid.`,
    });
    setSelectedAffiliates([]);
  };

  const paginateData = (data: any[], page: number) => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  };

  const totalActivePages = Math.ceil(activeAffiliates.length / rowsPerPage);
  const totalInactivePages = Math.ceil(inactiveAffiliates.length / rowsPerPage);

  return (
    <div className="flex min-h-screen w-full">
      <SetupSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold mb-4">Affiliate Payments</h1>
          
          <p className="text-muted-foreground mb-6">
            Affiliates are the quickest way to grow and scale your business. Affiliates are often real estate, auto and finance professionals who refer clients to you. 
            Click below to set commission options and record payments for each of your affiliates. Credit Repair Cloud does not make payments for you, but you can record payments here below. 
            To see an overview of revenue from affiliates, visit your{" "}
            <Link to="/affiliate-stats" className="text-primary hover:underline">
              Affiliate Stats Dashboard
            </Link>
            .
          </p>

          <Tabs defaultValue="active-inactive" className="mb-6">
            <TabsList>
              <TabsTrigger value="active-inactive">Active/Inactive Affiliates</TabsTrigger>
              <TabsTrigger value="commission-settings" asChild>
                <Link to="/my-company/affiliate-payments/commission-settings">
                  Global Commission Settings
                </Link>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active-inactive" className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Click "Record Payment" to the right of the affiliate's name to see the affiliate's list of clients for due payments.
                </p>
              </div>

              {/* Active Affiliates Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Active Affiliates</h2>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAsPaid}
                      disabled={selectedAffiliates.length === 0}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Mark as Paid
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Filter</span>
                      <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="due">Due Payments</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Click "Record Payment" to the right of the affiliate's name to see the affiliate's list of clients for due payments.
                </p>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Affiliate Name</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>To Be Paid</TableHead>
                        <TableHead>Last Payment</TableHead>
                        <TableHead>Minimum Balance</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : paginateData(activeAffiliates, activePage).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginateData(activeAffiliates, activePage).map((affiliate) => (
                          <TableRow key={affiliate.id}>
                            <TableCell>
                              <Checkbox
                                checked={selectedAffiliates.includes(affiliate.id)}
                                onCheckedChange={() => toggleSelectAffiliate(affiliate.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <Link to={`/affiliates/${affiliate.id}`} className="text-primary hover:underline">
                                {affiliate.affiliate_name || `${affiliate.first_name} ${affiliate.last_name}`}
                              </Link>
                            </TableCell>
                            <TableCell>$0</TableCell>
                            <TableCell>$0</TableCell>
                            <TableCell>$0</TableCell>
                            <TableCell>$100</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="link" size="sm" className="text-primary">
                                  Record Payment
                                </Button>
                                <Button variant="link" size="sm" className="text-primary">
                                  Settings
                                </Button>
                                <Button variant="link" size="sm" className="text-primary">
                                  History
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {activeAffiliates.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Rows per page:</span>
                      <Select value={rowsPerPage.toString()} onValueChange={(v) => setRowsPerPage(parseInt(v))}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {(activePage - 1) * rowsPerPage + 1}-{Math.min(activePage * rowsPerPage, activeAffiliates.length)} of {activeAffiliates.length}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                          disabled={activePage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActivePage((p) => Math.min(totalActivePages, p + 1))}
                          disabled={activePage === totalActivePages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Inactive Affiliates Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Inactive Affiliates</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Click "Record Payment" to the right of the affiliate's name to see the affiliate's list of clients for due payments.
                </p>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Affiliate Name</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>To Be Paid</TableHead>
                        <TableHead>Last Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : paginateData(inactiveAffiliates, inactivePage).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            No records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginateData(inactiveAffiliates, inactivePage).map((affiliate) => (
                          <TableRow key={affiliate.id}>
                            <TableCell>
                              <Link to={`/affiliates/${affiliate.id}`} className="text-primary hover:underline">
                                {affiliate.affiliate_name || `${affiliate.first_name} ${affiliate.last_name}`}
                              </Link>
                            </TableCell>
                            <TableCell>$0</TableCell>
                            <TableCell>$0</TableCell>
                            <TableCell>$0</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {inactiveAffiliates.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Rows per page:</span>
                      <Select value={rowsPerPage.toString()} onValueChange={(v) => setRowsPerPage(parseInt(v))}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {inactiveAffiliates.length > 0 ? `${(inactivePage - 1) * rowsPerPage + 1}-${Math.min(inactivePage * rowsPerPage, inactiveAffiliates.length)} of ${inactiveAffiliates.length}` : '0-0 of 0'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInactivePage((p) => Math.max(1, p - 1))}
                          disabled={inactivePage === 1 || inactiveAffiliates.length === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInactivePage((p) => Math.min(totalInactivePages, p + 1))}
                          disabled={inactivePage === totalInactivePages || inactiveAffiliates.length === 0}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AffiliatePaymentsAffiliates;
