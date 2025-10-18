import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TodaysSchedule = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Today's Schedule:</h3>
          <p className="text-sm text-muted-foreground">{currentDate}</p>
        </div>
        <Button variant="link" className="text-primary p-0 h-auto text-sm">
          Manage Schedule
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        You have nothing scheduled today
      </p>
    </Card>
  );
};

export default TodaysSchedule;
