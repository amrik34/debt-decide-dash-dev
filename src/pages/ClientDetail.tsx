import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Mail, Phone, Plus, Download, Trash2, Info, CheckCircle2, Circle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const ClientDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("dashboard");

  const scoreData = [
    { date: "11/29/2012", equifax: 735, experian: 740, transunion: 738 },
    { date: "10/01/2012", equifax: 650, experian: 649, transunion: 652 },
    { date: "09/03/2012", equifax: 550, experian: 552, transunion: 551 },
    { date: "08/01/2012", equifax: 450, experian: 451, transunion: 452 },
  ];

  const chartData = [
    { month: "Aug 1", score: 450 },
    { month: "Sep 3", score: 550 },
    { month: "Oct 1", score: 650 },
    { month: "Nov 29", score: 735 },
  ];

  const secondaryTabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "import", label: "Import/Audit", icon: true },
    { id: "tag", label: "Tag Pending Report", icon: true },
    { id: "generate", label: "Generate Letters", icon: true },
    { id: "send", label: "Send Letters", icon: true },
    { id: "status", label: "Letters & Status" },
    { id: "dispute", label: "Dispute Items" },
    { id: "educate", label: "Educate" },
    { id: "messages", label: "Messages" },
    { id: "invoices", label: "Invoices" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Secondary Navigation */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {secondaryTabs.map((tab) => (
              tab.id === "import" ? (
                <Link key={tab.id} to={`/clients/${id}/import-audit`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {tab.icon && <span className="mr-2">🔵</span>}
                    {tab.label}
                  </Button>
                </Link>
              ) : tab.id === "generate" ? (
                <Link key={tab.id} to={`/clients/${id}/generate-letters`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {tab.icon && <span className="mr-2">🔵</span>}
                    {tab.label}
                  </Button>
                </Link>
              ) : tab.id === "dispute" ? (
                <Link key={tab.id} to={`/clients/${id}/dispute-items`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {tab.label}
                  </Button>
                </Link>
              ) : tab.id === "educate" ? (
                <Link key={tab.id} to={`/clients/${id}/educate`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {tab.label}
                  </Button>
                </Link>
              ) : tab.id === "invoices" ? (
                <Link key={tab.id} to={`/clients/${id}/invoice`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {tab.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="whitespace-nowrap"
                >
                  {tab.icon && <span className="mr-2">🔵</span>}
                  {tab.label}
                </Button>
              )
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sample Client</h1>

        {/* Client Info Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-3xl">📱</span>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Client doesn't have a credit monitoring account yet? Send them an invite to Credit Hero Score so you can import/audit for this client.
                </p>
                <div className="flex items-center gap-4 mb-2">
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                    Client
                  </Badge>
                  <a href="mailto:sample@client.com" className="flex items-center gap-2 text-primary hover:underline text-sm">
                    <Mail className="h-4 w-4" />
                    sample@client.com
                  </a>
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    (310) 333-3333
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="#" className="text-primary hover:underline text-sm">
                    View Client Agreement
                  </a>
                  <a href="#" className="text-muted-foreground text-sm flex items-center gap-1">
                    🔒 View Credit Hero Score Account
                  </a>
                </div>
              </div>
            </div>

            <Button variant="outline">Send Invite</Button>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Link to={`/clients/${id}/import-audit`}>
              <Button className="bg-accent hover:bg-accent/90">
                Import/Audit
              </Button>
            </Link>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
              Run Dispute Wizard
            </Button>
            <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
              Send Secure Message
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scores Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Scores</h2>
            
            <div className="mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 font-bold">EQUIFAX</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold">Experian</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold">TransUnion</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scoreData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.date}</TableCell>
                      <TableCell>{row.equifax}</TableCell>
                      <TableCell>{row.experian}</TableCell>
                      <TableCell>{row.transunion}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis domain={[300, 800]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>

            <p className="text-sm text-muted-foreground mt-4">
              Start Date: 01/03/2013
            </p>

            <Button variant="link" className="text-primary p-0 h-auto mt-2">
              Add/Edit Scores
            </Button>
          </Card>

          {/* Tasks Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>

            <Tabs defaultValue="team" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="team">Team Tasks</TabsTrigger>
                <TabsTrigger value="client">Client Tasks</TabsTrigger>
              </TabsList>
              <TabsContent value="team" className="mt-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  No internal tasks for this Client
                </p>
                <Button variant="link" className="text-primary p-0 h-auto w-full">
                  View Completed Team Tasks
                </Button>
              </TabsContent>
              <TabsContent value="client" className="mt-4">
                <p className="text-sm text-muted-foreground text-center py-8">
                  No client tasks for this Client
                </p>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Dispute Status Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Dispute Status</h2>
            
            <div className="flex items-center gap-2 mb-6">
              <Button variant="outline" size="sm">
                View Dispute Items
              </Button>
              <Button variant="outline" size="sm">
                Import Credit Reports
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-around mb-4">
                  <span className="text-red-600 font-bold text-sm">EQUIFAX</span>
                  <span className="text-blue-600 font-bold text-sm">Experian</span>
                  <span className="text-blue-400 font-bold text-sm">TransUnion</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-200 rounded" />
                      <span>Unspecified</span>
                    </div>
                    <div className="flex gap-8">
                      <span>0</span>
                      <span>0</span>
                      <span>0</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span>Positive</span>
                    </div>
                    <div className="flex gap-8">
                      <span>1</span>
                      <span>2</span>
                      <span>1</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 rounded" />
                      <span>Deleted</span>
                    </div>
                    <div className="flex gap-8">
                      <span>0</span>
                      <span>2</span>
                      <span>0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span>Repaired</span>
                    </div>
                    <div className="flex gap-8">
                      <span>0</span>
                      <span>1</span>
                      <span>4</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span>Updated</span>
                    </div>
                    <div className="flex gap-8">
                      <span>0</span>
                      <span>0</span>
                      <span>0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-400 rounded" />
                      <span>In Dispute</span>
                    </div>
                    <div className="flex gap-8">
                      <span>3</span>
                      <span>2</span>
                      <span>0</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-400 rounded" />
                      <span>Verified</span>
                    </div>
                    <div className="flex gap-8">
                      <span>2</span>
                      <span>1</span>
                      <span>1</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-pink-500 rounded" />
                      <span>Keep</span>
                    </div>
                    <div className="flex gap-8">
                      <span>1</span>
                      <span>1</span>
                      <span>1</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-400 rounded" />
                      <span>Bureau Letters</span>
                    </div>
                    <div className="flex gap-8">
                      <span>0</span>
                      <span>0</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-48 h-48 relative">
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="#22c55e" 
                      strokeWidth="10"
                      strokeDasharray="188.4"
                      strokeDashoffset="97"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">47%</span>
                  </div>
                </div>
                <Progress value={47} className="w-full mt-4" />
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="keep">Keep</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex flex-col gap-2">
                <Button variant="link" className="text-primary p-0 h-auto justify-start">
                  Client's Saved Letters
                </Button>
                <Button variant="link" className="text-primary p-0 h-auto justify-start">
                  Document Storage
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Furnisher Letters: 0
              </p>
            </div>
          </Card>

          {/* Notes Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Notes</h2>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Click to add 'notes to yourself' not seen by clients.
              </p>
            </div>
          </Card>

          {/* Documents Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Documents</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Checkbox id="doc-1" />
                  <label htmlFor="doc-1" className="text-sm cursor-pointer">
                    Client Agreement
                  </label>
                </div>
                <Button variant="link" className="text-primary p-0 h-auto" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Checkbox id="doc-2" checked />
                  <label htmlFor="doc-2" className="text-sm cursor-pointer">
                    Photo ID Copy
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Checkbox id="doc-3" checked />
                  <label htmlFor="doc-3" className="text-sm cursor-pointer">
                    Utility Bill/Proof of Address
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <Checkbox id="doc-4" checked />
                  <label htmlFor="doc-4" className="text-sm cursor-pointer">
                    Social Security Card (optional)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="link" className="text-primary p-0 h-auto mt-4">
              Customize List
            </Button>
          </Card>

          {/* Progress Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Progress</h2>

            <div className="relative">
              <div className="flex items-center justify-between">
                {/* Step 1 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    1
                  </div>
                  <div className="text-xs text-center text-muted-foreground max-w-[80px]">
                    Login Details Sent
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300 -mx-2" />

                {/* Step 2 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="text-xs text-center font-semibold max-w-[80px]">
                    Client Logged In
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300 -mx-2" />

                {/* Step 3 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    3
                  </div>
                  <div className="text-xs text-center text-muted-foreground max-w-[80px]">
                    Agreement Signed
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300 -mx-2" />

                {/* Step 4 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    4
                  </div>
                  <div className="text-xs text-center text-muted-foreground max-w-[80px]">
                    Onboarding Completed
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300 -mx-2" />

                {/* Step 5 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    5
                  </div>
                  <div className="text-xs text-center text-muted-foreground max-w-[80px]">
                    Report Imported
                  </div>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300 -mx-2" />

                {/* Step 6 */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
                    6
                  </div>
                  <div className="text-xs text-center text-muted-foreground max-w-[80px]">
                    Letters Saved
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Contacts Assigned Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Contacts Assigned</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Admin Contact */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Admin</h3>
                <Card className="p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-semibold">
                      R
                    </div>
                    <div>
                      <h4 className="font-semibold">Ian Suite</h4>
                      <p className="text-sm text-muted-foreground">Demello Inc.</p>
                      <a href="#" className="text-sm text-primary hover:underline">
                        website.com
                      </a>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-primary hover:text-primary/80">
                        <Mail className="h-5 w-5" />
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        <Building2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Referred By Contact */}
              <div>
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Referred by</h3>
                <Card className="p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl font-semibold">
                      R
                    </div>
                    <div>
                      <h4 className="font-semibold">Sample Affiliate</h4>
                      <p className="text-sm text-muted-foreground">ABC Mortgage</p>
                      <a href="#" className="text-sm text-primary hover:underline">
                        website.com
                      </a>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="text-primary hover:text-primary/80">
                        <Mail className="h-5 w-5" />
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        <Phone className="h-5 w-5" />
                      </button>
                      <button className="text-primary hover:text-primary/80">
                        <Building2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
