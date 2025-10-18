import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Filter, LayoutGrid, Download, Printer, Search, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Clients = () => {
  const [showTutorial, setShowTutorial] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const clients = [
    {
      id: "1",
      name: "Sample Client",
      teamMembers: "Ian Suite",
      referredBy: "Sample A",
      added: "9/24/25",
      startDate: "1/3/13",
      lastLogin: "-",
      onboardingStage: "-",
      status: "Client",
      billingPlatform: "N/A",
    },
    {
      id: "2",
      name: "Sample Lead",
      teamMembers: "Ian Suite",
      referredBy: "Sample A",
      added: "9/24/25",
      startDate: "1/3/13",
      lastLogin: "-",
      onboardingStage: "-",
      status: "Lead",
      billingPlatform: "N/A",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {showTutorial && (
          <Card className="bg-muted border-primary/20 p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-background">
                    Video Tutorial
                  </Badge>
                  <h2 className="text-xl font-bold">
                    Get Started With Adding Clients & Leads
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  This page lists all of your customers (clients, leads, etc). Use Filters, Table Search and our built in sort feature to locate the customer or customers you want. Click a client's name to access records and the 3-dot menu on the right to access edit, delete and Plan Actions options. To learn the system, use your{" "}
                  <a href="#" className="text-primary hover:underline">
                    Sample Client
                  </a>
                  .
                </p>
              </div>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowTutorial(false)}
                className="text-primary"
              >
                Hide
              </Button>
            </div>
          </Card>
        )}

        <h1 className="text-3xl font-bold mb-6">Clients</h1>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Quick Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  <SelectItem value="active">Active Clients</SelectItem>
                  <SelectItem value="leads">Leads Only</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Button variant="outline" size="sm">
                <LayoutGrid className="h-4 w-4 mr-2" />
                Density
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Import/Export
              </Button>

              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Table Search"
                  className="pl-9 w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead / Client
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Team Members</TableHead>
                  <TableHead>Referred By</TableHead>
                  <TableHead>Added ↓</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Onboarding Stage</TableHead>
                  <TableHead>Client Status</TableHead>
                  <TableHead>Billing Platform</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <Link 
                        to={`/clients/${client.id}`} 
                        className="text-primary hover:underline font-medium"
                      >
                        {client.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <a href="#" className="text-primary hover:underline">
                        {client.teamMembers}
                      </a>
                    </TableCell>
                    <TableCell>{client.referredBy}</TableCell>
                    <TableCell>{client.added}</TableCell>
                    <TableCell>{client.startDate}</TableCell>
                    <TableCell>{client.lastLogin}</TableCell>
                    <TableCell>{client.onboardingStage}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            client.status === "Client" ? "bg-accent" : "bg-primary"
                          }`}
                        />
                        {client.status}
                      </div>
                    </TableCell>
                    <TableCell>{client.billingPlatform}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Plan Actions</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Clients;
