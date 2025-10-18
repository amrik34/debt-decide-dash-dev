import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadCreditReportDialog from "@/components/UploadCreditReportDialog";

const ImportAudit = () => {
  const { id } = useParams();
  const [showTutorial, setShowTutorial] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

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

  const progressSteps = [
    { number: 1, label: "Import/Audit", active: true },
    { number: 2, label: "Tag/Save", active: false },
    { number: 3, label: "Generate Letters", active: false },
    { number: 4, label: "Print/Send", active: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Secondary Navigation */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {secondaryTabs.map((tab) => (
              tab.id === "dashboard" ? (
                <Link key={tab.id} to={`/clients/${id}`}>
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
                  variant={tab.id === "import" ? "default" : "ghost"}
                  size="sm"
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
        {/* Video Tutorial Banner */}
        {showTutorial && (
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-primary/20 p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 relative">
                <div className="w-64 h-40 bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 250'%3E%3Crect fill='%23333' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='20'%3ECredit Report%3C/text%3E%3C/svg%3E"
                    alt="Video preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded">
                  Simple Audit Announcement (ne... 2:47
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  Simple Audit (Credit Analysis)
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Simple Audit is the ultimate sales tool for a potential client considering your services. With 1 click it creates an in-depth credit analysis report for your client showing items affecting the score and next steps. Our default template will automatically fill in each client's name and your company information with no editing needed. You can modify it or add your own templates, but we recommend not making any changes at all.
                </p>
                <Button 
                  variant="link" 
                  className="text-primary p-0 h-auto"
                  onClick={() => setShowTutorial(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </Card>
        )}

        <h1 className="text-3xl font-bold mb-6">Simple Audit (Credit Analysis)</h1>

        {/* Tabs */}
        <Tabs defaultValue="simple-audit" className="mb-8">
          <TabsList className="grid w-full max-w-xl grid-cols-2">
            <TabsTrigger value="import">
              <FileText className="h-4 w-4 mr-2" />
              Import Credit Report
            </TabsTrigger>
            <TabsTrigger value="simple-audit">
              <FileText className="h-4 w-4 mr-2" />
              Simple Audit (Credit Analysis)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="mt-8">
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Import credit reports to get started
                  </p>
                </div>
                <Button className="bg-accent hover:bg-accent/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Import Credit Report
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="simple-audit" className="mt-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-8 mb-12">
              {progressSteps.map((step, index) => (
                <div key={step.number} className="flex items-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        step.active ? 'bg-primary' : 'bg-blue-300'
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className={`text-sm ${step.active ? 'font-semibold' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-300" />
                  )}
                </div>
              ))}
            </div>

            {/* Empty State */}
            <Card className="p-12">
              <div className="max-w-md mx-auto text-center">
                <div className="mb-6">
                  <FileText className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    You must have a credit report imported to run simple audit.
                  </p>
                </div>
                <Button 
                  className="bg-accent hover:bg-accent/90"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Import Credit Report
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <UploadCreditReportDialog 
          open={showUploadDialog} 
          onOpenChange={setShowUploadDialog} 
        />
      </div>
    </div>
  );
};

export default ImportAudit;
