import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayCircle, Plus, Search, Heart, Check, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AddLetterDialog from "@/components/AddLetterDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LetterLibrary = () => {
  const { toast } = useToast();
  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLetter, setEditingLetter] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showInfo, setShowInfo] = useState(true);

  const fetchLetters = async () => {
    try {
      let query = supabase
        .from("letters")
        .select("*")
        .order("letter_title", { ascending: true });

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLetters(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading letters",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, [categoryFilter, statusFilter]);

  const handleEdit = (letter: any) => {
    setEditingLetter(letter);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this letter?")) return;

    try {
      const { error } = await supabase
        .from("letters")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Letter deleted successfully" });
      fetchLetters();
    } catch (error: any) {
      toast({
        title: "Error deleting letter",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (letter: any) => {
    try {
      const { error } = await supabase
        .from("letters")
        .update({ is_favorite: !letter.is_favorite })
        .eq("id", letter.id);

      if (error) throw error;
      fetchLetters();
    } catch (error: any) {
      toast({
        title: "Error updating favorite",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredLetters = letters.filter((letter) =>
    letter.letter_title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {showInfo && (
          <div className="mb-6 bg-muted p-6 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded">
                      Video Tutorial
                    </span>
                    <h2 className="text-xl font-semibold">Get Started With Your Letter Library</h2>
                  </div>
                  <p className="text-muted-foreground">
                    These letter templates with parameters are used by the Dispute Wizard. Never type client or creditor information directly into these templates, modifying templates may prevent them from functioning. To generate a dispute letter for a client: 1) Go to <span className="text-primary cursor-pointer">Clients</span> 2) Log into a client's dashboard 3) Run the Dispute Wizard.
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                Hide
              </Button>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Letters</h1>
          <p className="text-muted-foreground">
            These letter templates with parameters are used by the Dispute Wizard. Never type client or creditor information directly into these templates, modifying templates may prevent them from functioning. To generate a dispute letter for a client: 1) Go to <span className="text-primary cursor-pointer">Clients</span> 2) Log into a client's dashboard 3) Run the Dispute Wizard.
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by letter name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category</span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Default">Default</SelectItem>
                  <SelectItem value="Credit Bureau Letters">Credit Bureau Letters</SelectItem>
                  <SelectItem value="Creditor Letters">Creditor Letters</SelectItem>
                  <SelectItem value="Collection Letters">Collection Letters</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Sort Letters
            </Button>
            <Button
              onClick={() => {
                setEditingLetter(null);
                setDialogOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Letter
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Letter Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Eligible</TableHead>
                <TableHead>Favorite</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredLetters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No letters found. Click "Add New Letter" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLetters.map((letter) => (
                  <TableRow key={letter.id}>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleEdit(letter)}
                        className="text-primary hover:underline text-left"
                      >
                        {letter.letter_title}
                      </button>
                    </TableCell>
                    <TableCell>{letter.category}</TableCell>
                    <TableCell>
                      <span className={letter.status === "active" ? "text-green-600" : "text-gray-500"}>
                        {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {letter.ai_eligible && <Check className="h-5 w-5 text-green-600" />}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleFavorite(letter)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            letter.is_favorite ? "fill-red-500 text-red-500" : "text-gray-300"
                          }`}
                        />
                      </button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(letter)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(letter.id)}
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

        <AddLetterDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={fetchLetters}
          letter={editingLetter}
        />
      </div>
    </div>
  );
};

export default LetterLibrary;
