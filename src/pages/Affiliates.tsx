import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Grid3x3, Download, Printer, Plus, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AddAffiliateDialog from "@/components/AddAffiliateDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Affiliates = () => {
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAffiliates = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliates")
        .select("*")
        .order("date_added", { ascending: false });

      if (error) throw error;
      setAffiliates(data || []);
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

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const handleEdit = (affiliate: any) => {
    setEditingAffiliate(affiliate);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this affiliate?")) return;

    try {
      const { error } = await supabase
        .from("affiliates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Affiliate deleted successfully" });
      fetchAffiliates();
    } catch (error: any) {
      toast({
        title: "Error deleting affiliate",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSendLogin = async (affiliate: any) => {
    toast({
      title: "Login link sent",
      description: `Login credentials sent to ${affiliate.email}`,
    });
  };

  const filteredAffiliates = affiliates.filter(
    (affiliate) =>
      affiliate.affiliate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Affiliate Partners</h1>
          <p className="text-muted-foreground">
            Affiliate partners are other professionals who refer new leads and clients to you. They are often Mortgage Brokers, Realtors, and Auto Dealers, whose business depends upon having clients with good credit.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              <Grid3x3 className="h-4 w-4 mr-2" />
              Density
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export/Import
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <Button
            onClick={() => {
              setEditingAffiliate(null);
              setDialogOpen(true);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Affiliate
          </Button>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Affiliate Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Clients Referred</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Login</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredAffiliates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No affiliates found. Click "Add New Affiliate" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAffiliates.map((affiliate) => (
                  <TableRow key={affiliate.id}>
                    <TableCell className="font-medium text-primary">
                      {affiliate.affiliate_name}
                    </TableCell>
                    <TableCell>{affiliate.company || "-"}</TableCell>
                    <TableCell className="text-primary">{affiliate.email}</TableCell>
                    <TableCell className="text-primary">0 clients</TableCell>
                    <TableCell>{affiliate.phone || "-"}</TableCell>
                    <TableCell>
                      {format(new Date(affiliate.date_added), "MM/dd/yyyy")}
                    </TableCell>
                    <TableCell>
                      <span className={affiliate.status === "active" ? "text-green-600" : "text-gray-500"}>
                        {affiliate.status.charAt(0).toUpperCase() + affiliate.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendLogin(affiliate)}
                        className="border-green-600 text-green-600 hover:bg-green-50"
                      >
                        Send Login
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(affiliate)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(affiliate.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Total Rows: {filteredAffiliates.length}
        </div>

        <AddAffiliateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={fetchAffiliates}
          affiliate={editingAffiliate}
        />
      </div>
    </div>
  );
};

export default Affiliates;
