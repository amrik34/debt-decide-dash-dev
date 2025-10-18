import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Circle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const GenerateLetters = () => {
  const { id } = useParams();
  const [letterType, setLetterType] = useState("");

  const workflowSteps = [
    { id: 1, label: "Import/Audit", completed: true, link: `/clients/${id}/import-audit` },
    { id: 2, label: "Tag/Save", completed: true, link: "#" },
    { id: 3, label: "Generate Letters", completed: false, active: true, link: "#" },
    { id: 4, label: "Print/Send", completed: false, link: "#" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Secondary Navigation */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            <Link to={`/clients/${id}`}>
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                Dashboard
              </Button>
            </Link>
            <Link to={`/clients/${id}/import-audit`}>
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                <span className="mr-2">🔵</span>
                Import/Audit
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              <span className="mr-2">🔵</span>
              Tag Pending Report
            </Button>
            <Button variant="default" size="sm" className="whitespace-nowrap">
              <span className="mr-2">🔵</span>
              Generate Letters
            </Button>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              <span className="mr-2">🔵</span>
              Send Letters
            </Button>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              Letters & Status
            </Button>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              Dispute Items
            </Button>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              Educate
            </Button>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              Messages
            </Button>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              Invoices
            </Button>
            <Button variant="ghost" size="sm" className="whitespace-nowrap">
              Activity
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-bold">Dispute Wizard (Sample Client)</h1>
          <Button variant="outline" size="sm" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            Quick video
          </Button>
        </div>

        <p className="text-muted-foreground mb-4">
          Build a dispute letter by either selecting saved dispute items or adding new items manually.
        </p>

        <p className="text-muted-foreground mb-8">
          You can edit or update saved items in the{" "}
          <Link to="#" className="text-primary hover:underline">
            Dispute Items
          </Link>{" "}
          page. New clients should begin with a Round 1 Dispute.
        </p>

        {/* Progress Workflow */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    step.completed
                      ? "bg-primary border-primary"
                      : step.active
                      ? "bg-primary border-primary"
                      : "bg-muted border-muted"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                  ) : step.active ? (
                    <span className="text-2xl font-bold text-primary-foreground">{step.id}</span>
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <span className="text-sm mt-2 whitespace-nowrap">{step.label}</span>
              </div>
              {index < workflowSteps.length - 1 && (
                <div className="w-24 h-0.5 bg-muted mx-2 mb-6" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Choose Letter Type */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Step 1: Choose Letter Type</h2>
          
          <RadioGroup value={letterType} onValueChange={setLetterType} className="space-y-4">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="round1" id="round1" />
              <Label htmlFor="round1" className="cursor-pointer">
                Round 1 <span className="italic text-muted-foreground">Basic Dispute</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="round2" id="round2" />
              <Label htmlFor="round2" className="cursor-pointer">
                Round 2+ <span className="italic text-muted-foreground">All Other Letters</span>
              </Label>
            </div>
          </RadioGroup>

          <div className="mt-6 text-right">
            <Link to="#" className="text-primary hover:underline text-sm">
              Generate a letter (with no dispute items)
            </Link>
          </div>
        </Card>

        {/* Step 2: Add Dispute Items */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Step 2: Add Dispute Items</h2>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              To ensure your disputes are taken seriously and not rejected by the credit bureaus, 
              we advise limiting the number of dispute items to 5 per month per bureau (unless it 
              involves identity theft with a police report).
            </p>
          </div>

          {/* This section will be populated with dispute items */}
          <div className="mt-6 text-center py-8 border-2 border-dashed border-muted rounded-lg">
            <p className="text-muted-foreground">
              Select a letter type above to begin adding dispute items
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GenerateLetters;
