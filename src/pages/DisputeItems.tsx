import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { X, CheckCircle, XCircle, PlayCircle, Edit, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DisputeItem {
  id: string;
  credit_report_id: string;
  item_type: string;
  item_data: any;
  bureau: string;
  status: string;
  reason: string | null;
  instructions: string | null;
  created_at: string;
}

const DisputeItems = () => {
  const { id } = useParams();
  const [showBanner, setShowBanner] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "report">("list");
  const [disputeItems, setDisputeItems] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { value: "keep", label: "Keep", icon: XCircle, color: "text-red-600" },
    { value: "verified", label: "Verified", icon: XCircle, color: "text-red-600" },
    { value: "positive", label: "Positive", icon: CheckCircle, color: "text-green-600" },
    { value: "deleted", label: "Deleted", icon: CheckCircle, color: "text-green-600" },
    { value: "repaired", label: "Repaired", icon: CheckCircle, color: "text-green-600" },
    { value: "in dispute", label: "In Dispute", icon: PlayCircle, color: "text-yellow-600" },
  ];

  useEffect(() => {
    fetchDisputeItems();
  }, [id]);

  const fetchDisputeItems = async () => {
    try {
      setLoading(true);
      
      // First get all credit reports for this client
      const { data: reports, error: reportsError } = await supabase
        .from("credit_reports")
        .select("id")
        .eq("client_id", id || "");

      if (reportsError) throw reportsError;

      if (!reports || reports.length === 0) {
        setDisputeItems([]);
        return;
      }

      // Get all dispute items for these reports
      const reportIds = reports.map(r => r.id);
      const { data: items, error: itemsError } = await supabase
        .from("dispute_items")
        .select("*")
        .in("credit_report_id", reportIds)
        .order("created_at", { ascending: false });

      if (itemsError) throw itemsError;

      setDisputeItems(items || []);
    } catch (error: any) {
      console.error("Error fetching dispute items:", error);
      toast.error("Failed to load dispute items");
    } finally {
      setLoading(false);
    }
  };

  // Group items by creditor/furnisher
  const groupedItems = disputeItems.reduce((acc, item) => {
    const creditorName = item.item_data?.company || item.item_data?.name || "Unknown Creditor";
    if (!acc[creditorName]) {
      acc[creditorName] = {
        creditor: creditorName,
        items: []
      };
    }
    acc[creditorName].items.push(item);
    return acc;
  }, {} as Record<string, { creditor: string; items: DisputeItem[] }>);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "deleted":
      case "repaired":
      case "positive":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "verified":
      case "keep":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "in dispute":
        return <PlayCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getBureauColor = (bureau: string) => {
    switch (bureau.toLowerCase()) {
      case "equifax":
        return "text-red-600";
      case "experian":
        return "text-blue-600";
      case "transunion":
        return "text-blue-400";
      default:
        return "text-foreground";
    }
  };

  const updateItemStatus = async (itemId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("dispute_items")
        .update({ status: newStatus })
        .eq("id", itemId);

      if (error) throw error;

      // Update local state
      setDisputeItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, status: newStatus } : item
        )
      );

      toast.success("Status updated successfully");
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Secondary Navigation */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            <Link to={`/clients/${id}`}>
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to={`/clients/${id}/import-audit`}>
              <Button variant="ghost" size="sm">
                <span className="mr-2">🔵</span>
                Import/Audit
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <span className="mr-2">🔵</span>
              Tag Pending Report
            </Button>
            <Link to={`/clients/${id}/generate-letters`}>
              <Button variant="ghost" size="sm">
                <span className="mr-2">🔵</span>
                Generate Letters
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <span className="mr-2">🔵</span>
              Send Letters
            </Button>
            <Button variant="ghost" size="sm">Letters & Status</Button>
            <Button variant="default" size="sm">Dispute Items</Button>
            <Button variant="ghost" size="sm">Educate</Button>
            <Button variant="ghost" size="sm">Messages</Button>
            <Button variant="ghost" size="sm">Invoices</Button>
            <Button variant="ghost" size="sm">Activity</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        {showBanner && (
          <Card className="p-6 mb-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Get Started With Updating Credit Items Manually</h3>
                <p className="text-sm text-muted-foreground">
                  This page lists all credit report items you've saved or imported for this client. View this page in{" "}
                  <button className="text-primary underline">List View</button> or{" "}
                  <button className="text-primary underline">Report View</button>. To create a dispute letter for any of these items,{" "}
                  <button className="text-primary underline">run Wizard 3</button> and choose "Add Saved Item." When you save a dispute letter in Wizard 3, status of the item automatically changes to "In Dispute."
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBanner(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </Button>
            </div>
          </Card>
        )}

        <h1 className="text-3xl font-bold mb-6">All Dispute Items (Sample Client)</h1>

        {/* View Toggle and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode("list")}
            >
              📋 List View
            </Button>
            <Button
              variant={viewMode === "report" ? "default" : "outline"}
              onClick={() => setViewMode("report")}
            >
              📄 Report View
            </Button>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            + Add New Item
          </Button>
        </div>

        {/* Info Text */}
        <p className="text-sm text-muted-foreground mb-6">
          Here are all credit report items you've saved or imported for this client. View this page in{" "}
          <button className="text-primary underline">List View</button> or{" "}
          <button className="text-primary underline">Report View</button>. To create a dispute letter for any of these items,{" "}
          <button className="text-primary underline">run the Dispute Wizard</button> and choose "Add Saved Item." When you "save" a dispute letter in Wizard 3, the status of the item automatically changes to "In Dispute." When a bureau has deleted or changed status of an item, you can certainly import again, but it's faster to update an item's status manually on this page. Click the pencil icons below to update the status for each item.{" "}
          <button className="text-primary underline">See video demo</button>. To view any letters you have already saved for this client, visit{" "}
          <button className="text-primary underline">this Client's Dashboard</button> and choose{" "}
          <button className="text-primary underline">"Client's Saved Letters."</button>
        </p>

        {/* Dispute Items Content */}
        {loading ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">Loading dispute items...</p>
          </Card>
        ) : disputeItems.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">No dispute items found for this client.</p>
          </Card>
        ) : viewMode === "list" ? (
          // List View
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Creditor/Furnisher</TableHead>
                  <TableHead className="w-[250px]">Account #</TableHead>
                  <TableHead>Dispute Items</TableHead>
                  <TableHead className="text-center">
                    <span className="text-red-600 font-bold">EQUIFAX</span>
                  </TableHead>
                  <TableHead className="text-center">
                    <span className="text-blue-600 font-bold">Experian</span>
                  </TableHead>
                  <TableHead className="text-center">
                    <span className="text-blue-400 font-bold">TransUnion</span>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.values(groupedItems).map((group, groupIndex) => {
                  // Get items by bureau
                  const equifaxItem = group.items.find(i => i.bureau.toLowerCase() === "equifax");
                  const experianItem = group.items.find(i => i.bureau.toLowerCase() === "experian");
                  const transunionItem = group.items.find(i => i.bureau.toLowerCase() === "transunion");
                  
                  // Get account numbers
                  const getAccountNumber = (item: DisputeItem | undefined) => {
                    if (!item) return "";
                    return item.item_data?.accountNumber || item.item_data?.account || "";
                  };

                  // Get dispute description
                  const getDisputeDescription = () => {
                    const firstItem = group.items[0];
                    return firstItem.reason || firstItem.item_data?.description || "Dispute item";
                  };

                  return (
                    <TableRow key={groupIndex}>
                      <TableCell className="font-medium">{group.creditor}</TableCell>
                      <TableCell className="text-sm">
                        {equifaxItem && (
                          <div>Equifax: {getAccountNumber(equifaxItem)}</div>
                        )}
                        {experianItem && (
                          <div>Experian: {getAccountNumber(experianItem)}</div>
                        )}
                        {transunionItem && (
                          <div>Transunion: {getAccountNumber(transunionItem)}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{getDisputeDescription()}</TableCell>
                      <TableCell className="text-center">
                        {equifaxItem && (
                          <div className="flex flex-col items-center gap-1">
                            {getStatusIcon(equifaxItem.status)}
                            <span className="text-xs">{getStatusText(equifaxItem.status)}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {experianItem && (
                          <div className="flex flex-col items-center gap-1">
                            {getStatusIcon(experianItem.status)}
                            <span className="text-xs">{getStatusText(experianItem.status)}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {transunionItem && (
                          <div className="flex flex-col items-center gap-1">
                            {getStatusIcon(transunionItem.status)}
                            <span className="text-xs">{getStatusText(transunionItem.status)}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          ⋮
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        ) : (
          // Report View
          <div className="space-y-8">
            <h2 className="text-xl font-semibold">Items Entered Manually</h2>
            
            {Object.values(groupedItems).map((group, groupIndex) => {
              const equifaxItem = group.items.find(i => i.bureau.toLowerCase() === "equifax");
              const experianItem = group.items.find(i => i.bureau.toLowerCase() === "experian");
              const transunionItem = group.items.find(i => i.bureau.toLowerCase() === "transunion");

              const renderBureauColumn = (item: DisputeItem | undefined, bureauName: string, bureauColor: string) => {
                // Always render column, even if no data
                const hasData = !!item;

                return (
                  <div className="flex-1 p-4 border-l first:border-l-0">
                    <div className="flex items-center justify-center gap-2 mb-4 font-bold">
                      {bureauName === "EQUIFAX" && <span className="text-red-600">{bureauName}</span>}
                      {bureauName === "Experian" && <span className="text-blue-600">{bureauName}</span>}
                      {bureauName === "TransUnion" && <span className="text-blue-400">{bureauName}</span>}
                    </div>
                    
                    {hasData ? (
                      <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Account Name</span>
                          <span className="font-medium">{item.item_data?.company || item.item_data?.name || group.creditor}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-muted-foreground">Account Number</span>
                          <span>{item.item_data?.accountNumber || item.item_data?.account || "N/A"}</span>
                        </div>
                        
                        {item.item_data?.accountType && (
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Account Type</span>
                            <span>{item.item_data.accountType}</span>
                          </div>
                        )}
                        
                        {item.item_data?.accountStatus && (
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Account Status</span>
                            <span>{item.item_data.accountStatus}</span>
                          </div>
                        )}
                        
                        {item.item_data?.monthlyPayment && (
                          <div className="grid grid-cols-2 gap-2">
                            <span className="text-muted-foreground">Monthly Payment</span>
                            <span>{item.item_data.monthlyPayment}</span>
                          </div>
                        )}
                        
                        <Button variant="link" className="p-0 h-auto text-primary">
                          More
                        </Button>
                        
                        <div className="pt-4 border-t">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <span className="text-muted-foreground">Status</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                                  <div className="flex items-center gap-2">
                                    {getStatusIcon(item.status)}
                                    <span className={`font-medium ${
                                      item.status.toLowerCase() === "deleted" || 
                                      item.status.toLowerCase() === "repaired" || 
                                      item.status.toLowerCase() === "positive" 
                                        ? "text-green-600" 
                                        : item.status.toLowerCase() === "verified" || 
                                          item.status.toLowerCase() === "keep"
                                        ? "text-red-600"
                                        : "text-blue-600"
                                    }`}>
                                      {getStatusText(item.status)}
                                    </span>
                                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="w-48 bg-card">
                                {statusOptions.map((status) => {
                                  const StatusIcon = status.icon;
                                  return (
                                    <DropdownMenuItem
                                      key={status.value}
                                      onClick={() => updateItemStatus(item.id, status.value)}
                                      className="cursor-pointer"
                                    >
                                      <StatusIcon className={`h-4 w-4 mr-2 ${status.color}`} />
                                      <span className={status.color}>{status.label}</span>
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          {item.reason && (
                            <div className="grid grid-cols-2 gap-2">
                              <span className="text-muted-foreground">Reason</span>
                              <span className="text-sm">{item.reason}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                        No data
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <Card key={groupIndex} className="overflow-hidden">
                  <div className="bg-muted/50 p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{group.creditor}</h3>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-sm text-muted-foreground">Creditor/Furnisher</span>
                    </div>
                  </div>
                  
                  <div className="flex divide-x">
                    {renderBureauColumn(equifaxItem, "EQUIFAX", "text-red-600")}
                    {renderBureauColumn(experianItem, "Experian", "text-blue-600")}
                    {renderBureauColumn(transunionItem, "TransUnion", "text-blue-400")}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputeItems;
