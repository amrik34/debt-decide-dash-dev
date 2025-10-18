import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const BusinessStatus = () => {
  const data = [
    { month: "May 25", clients: 0.3 },
    { month: "Jun 25", clients: 0.3 },
    { month: "Jul 25", clients: 0.3 },
    { month: "Aug 25", clients: 0.6 },
    { month: "Sep 25", clients: 0.9 },
    { month: "Oct 25", clients: 1.2 },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Business Status</h3>
        <Button variant="link" className="text-primary p-0 h-auto text-sm">
          View Dashboard
        </Button>
      </div>
      
      <div className="mb-4">
        <Button variant="link" className="text-primary p-0 h-auto text-sm">
          Active Clients ▼
        </Button>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            stroke="#888"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#888"
            domain={[0, 1.5]}
          />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey="clients" 
            stroke="#82ca9d" 
            fill="#c8e6c9"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default BusinessStatus;
