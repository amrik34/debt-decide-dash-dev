import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RecentLoginActivity = () => {
  const loginHistory = [
    {
      user: "wccmanagement@gmail.com",
      ipAddress: "72.39.47.11",
      accessType: "Browser",
      login: "10/14/2025 10:32 AM",
      logout: "-",
      location: "-",
    },
    {
      user: "wccmanagement@gmail.com",
      ipAddress: "98.36.224.25",
      accessType: "Browser",
      login: "09/23/2025 10:22 PM",
      logout: "-",
      location: "-",
    },
    {
      user: "wccmanagement@gmail.com",
      ipAddress: "68.5.181.207",
      accessType: "Browser",
      login: "09/23/2025 10:10 PM",
      logout: "-",
      location: "-",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Login Activity</h3>
      
      <p className="text-sm text-muted-foreground mb-4">
        If you notice any unusual activity you do not recognize:{" "}
        <a href="#" className="text-primary hover:underline">
          change your password
        </a>{" "}
        to protect your account or contact customer care for additional help. For security of your account and client data, IDs and passwords cannot be shared and cannot be logged in from 2 locations or devices simultaneously.
      </p>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Access Type</TableHead>
              <TableHead>Login</TableHead>
              <TableHead>Logout</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loginHistory.map((entry, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{entry.user}</TableCell>
                <TableCell>{entry.ipAddress}</TableCell>
                <TableCell>{entry.accessType}</TableCell>
                <TableCell>{entry.login}</TableCell>
                <TableCell>{entry.logout}</TableCell>
                <TableCell>{entry.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button variant="link" className="text-primary p-0 h-auto mt-4">
        View Full History
      </Button>
    </Card>
  );
};

export default RecentLoginActivity;
