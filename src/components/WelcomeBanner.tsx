import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const WelcomeBanner = () => {
  return (
    <Card className="bg-muted border-primary/20 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative bg-background rounded-lg shadow-lg p-2">
            <div className="w-32 h-20 bg-muted flex items-center justify-center rounded">
              <Play className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute bottom-0 left-0 bg-foreground/80 text-background text-xs px-2 py-1 rounded-br">
              15:45
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Welcome To Credit Repair Cloud!
            </h2>
            <p className="text-muted-foreground">
              We hope you enjoy your Free Trial. To upgrade now click here. Get started with the{" "}
              <a href="#" className="text-primary hover:underline">Welcome Video</a>, the{" "}
              <a href="#" className="text-primary hover:underline">Guided Tour</a> and learn with your{" "}
              <a href="#" className="text-primary hover:underline">Sample Client</a>. Be sure to read our{" "}
              <a href="#" className="text-primary hover:underline">User Guides</a>. For account changes{" "}
              <a href="#" className="text-primary hover:underline">click here</a>.
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Button variant="link" className="text-primary mt-2 p-0 h-auto">
        Dismiss
      </Button>
    </Card>
  );
};

export default WelcomeBanner;
