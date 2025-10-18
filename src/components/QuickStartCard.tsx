import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickStartCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  number?: number;
}

const QuickStartCard = ({ icon: Icon, title, description, color = "text-primary", number }: QuickStartCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="flex items-start gap-4">
        {number ? (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
            {number}
          </div>
        ) : (
          <div className={`${color} group-hover:scale-110 transition-transform flex-shrink-0`}>
            <Icon className="h-8 w-8" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};

export default QuickStartCard;
