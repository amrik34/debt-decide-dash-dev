import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProgressTracker = () => {
  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">5% Complete!</h3>
        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Progress value={5} className="mb-4" />
      
      <Button variant="link" className="text-primary p-0 h-auto">
        Open My Business Checklist
      </Button>
    </Card>
  );
};

export default ProgressTracker;
