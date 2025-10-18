import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface CreditAccount {
  accountName: string;
  apr: number;
  limit: number;
  balance: number;
}

const Educate = () => {
  const { id } = useParams();
  const [selectedMonth, setSelectedMonth] = useState("October");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [accounts, setAccounts] = useState<CreditAccount[]>([
    { accountName: "", apr: 0, limit: 0, balance: 0 },
    { accountName: "", apr: 0, limit: 0, balance: 0 },
    { accountName: "", apr: 0, limit: 0, balance: 0 },
    { accountName: "", apr: 0, limit: 0, balance: 0 },
    { accountName: "", apr: 0, limit: 0, balance: 0 },
    { accountName: "", apr: 0, limit: 0, balance: 0 },
    { accountName: "", apr: 0, limit: 0, balance: 0 },
    { accountName: "", apr: 0, limit: 0, balance: 0 },
  ]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = ["2023", "2024", "2025", "2026"];

  const updateAccount = (index: number, field: keyof CreditAccount, value: string | number) => {
    const newAccounts = [...accounts];
    newAccounts[index] = {
      ...newAccounts[index],
      [field]: typeof value === "string" ? value : Number(value) || 0
    };
    setAccounts(newAccounts);
  };

  const calculateRatio = (limit: number, balance: number) => {
    if (limit === 0) return 0;
    return ((balance / limit) * 100).toFixed(0);
  };

  const totalLimit = accounts.reduce((sum, acc) => sum + acc.limit, 0);
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const availableCredit = totalLimit - totalBalance;
  const overallRatio = totalLimit > 0 ? ((totalBalance / totalLimit) * 100).toFixed(2) : "0.00";

  const pieData = [
    { name: "Available Credit Limit", value: availableCredit > 0 ? availableCredit : 100 },
    { name: "Current Balance", value: totalBalance > 0 ? totalBalance : 0 },
  ];

  const COLORS = ["#60a5fa", "#ef4444"];

  return (
    <div className="min-h-screen bg-background">
      {/* Secondary Navigation */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            <Link to={`/clients/${id}`}>
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to={`/clients/${id}/import-audit`}>
              <Button variant="ghost" size="sm">
                <span className="mr-2">🔵</span>
                Import/Audit
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <span className="mr-2">🔵</span>
              Tag Pending Report
            </Button>
            <Link to={`/clients/${id}/generate-letters`}>
              <Button variant="ghost" size="sm">
                <span className="mr-2">🔵</span>
                Generate Letters
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <span className="mr-2">🔵</span>
              Send Letters
            </Button>
            <Button variant="ghost" size="sm">Letters & Status</Button>
            <Link to={`/clients/${id}/dispute-items`}>
              <Button variant="ghost" size="sm">Dispute Items</Button>
            </Link>
            <Link to={`/clients/${id}/educate`}>
              <Button variant="default" size="sm">Educate</Button>
            </Link>
            <Button variant="ghost" size="sm">Messages</Button>
            <Link to={`/clients/${id}/invoice`}>
              <Button variant="ghost" size="sm">Invoices</Button>
            </Link>
            <Button variant="ghost" size="sm">Activity</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs defaultValue="debts" className="mb-8">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="debts">Client's Outstanding Debts</TabsTrigger>
            <TabsTrigger value="expenses">Client's Expenses</TabsTrigger>
            <TabsTrigger value="calculators">Calculators</TabsTrigger>
          </TabsList>

          <TabsContent value="debts" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Debt Information */}
              <div>
                <h1 className="text-3xl font-bold mb-6">Client's Debts (Sample Client)</h1>
                
                <div className="space-y-4 mb-8">
                  <p className="text-sm text-muted-foreground">
                    If your client carries high credit card (revolving) debt, they should be aware of what their finance
                    (APR) charges are for each account and you might want to suggest that they focus on paying down
                    the accounts with the highest interest (APR) rate first. This will save them the most money.
                  </p>

                  <p className="text-sm text-muted-foreground">
                    A higher FICO score will qualify your client for a lower interest rate (APR). Maxing out credit cards
                    looks bad to the Credit Bureaus and lowers a credit score. If your clients carry high credit card
                    balances, here is a trick that will often boost a score considerably (and quickly): Instruct the client to
                    pay all of their credit cards down to where the balance owed (B2AC) is below 25-30% of the available
                    limit.
                  </p>

                  <p className="text-sm text-muted-foreground">
                    In this form on the right, enter the client's account balances, credit limits and APR interest rates. It
                    will calculate their total debt and "balance-to-available-limit"
                    (B2AC) ratio, to show what they need to focus on for maximum results.
                  </p>

                  <p className="text-sm text-muted-foreground">
                    To maximize a score, instruct your client to keep the "balance-to-available-limit" ratio below 25-30%.
                  </p>
                </div>

                {/* Pie Chart */}
                <Card className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry: any) => {
                          const dataValue = entry.payload.value;
                          return `${value} (${dataValue.toFixed(2)})`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center text-sm mt-4">
                    Ratio: {overallRatio > "30" ? "Poor" : "Good"}, {overallRatio}%
                  </p>
                </Card>
              </div>

              {/* Right Column - Credit Accounts Table */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Client's Credit Accounts</h2>
                
                <Card className="p-6">
                  {/* Month/Year Selection */}
                  <div className="flex items-center gap-4 mb-6">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button className="bg-green-600 hover:bg-green-700">Submit</Button>
                  </div>

                  {/* Accounts Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-2 text-sm font-semibold">Account/Card</th>
                          <th className="text-center py-3 px-2 text-sm font-semibold">Apr</th>
                          <th className="text-center py-3 px-2 text-sm font-semibold">Limit</th>
                          <th className="text-center py-3 px-2 text-sm font-semibold">Balance</th>
                          <th className="text-center py-3 px-2 text-sm font-semibold">Ratio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accounts.map((account, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-2">
                              <Input
                                value={account.accountName}
                                onChange={(e) => updateAccount(index, "accountName", e.target.value)}
                                placeholder="Account name"
                                className="w-full"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center justify-center gap-1">
                                <Input
                                  type="number"
                                  value={account.apr || ""}
                                  onChange={(e) => updateAccount(index, "apr", e.target.value)}
                                  placeholder="0"
                                  className="w-16 text-center"
                                />
                                <span className="text-sm">%</span>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                value={account.limit || ""}
                                onChange={(e) => updateAccount(index, "limit", e.target.value)}
                                placeholder="0"
                                className="w-20 text-center"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                value={account.balance || ""}
                                onChange={(e) => updateAccount(index, "balance", e.target.value)}
                                placeholder="0"
                                className="w-20 text-center"
                              />
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span className="text-sm font-medium">
                                {calculateRatio(account.limit, account.balance)} %
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Save Button */}
                  <div className="mt-6 flex justify-end">
                    <Button className="bg-green-600 hover:bg-green-700 px-8">
                      Save
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Client's Expenses (Sample Client)</h1>
              
              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <div className="text-blue-600 mt-0.5">ℹ️</div>
                <p className="text-sm text-blue-900">
                  For 30 days have your clients write down what they spend each day. This will show them very clearly where they can cut back
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Expenses */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Daily Expenses</h2>
                  <Card className="p-6">
                    <div className="space-y-6">
                      {/* Date Picker */}
                      <div>
                        <Input 
                          type="date" 
                          defaultValue="2025-10-14"
                          className="w-full"
                        />
                      </div>

                      {/* Daily Expense Entries */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm font-semibold pb-2">
                          <div>Expense Type</div>
                          <div>Amount</div>
                        </div>
                        
                        {[...Array(8)].map((_, index) => (
                          <div key={index} className="grid grid-cols-2 gap-4">
                            <Input placeholder="" className="w-full" />
                            <Input type="number" placeholder="$ 0" className="w-full" />
                          </div>
                        ))}
                        
                        <div className="border-t pt-4 grid grid-cols-2 gap-4 items-center">
                          <div className="text-lg font-semibold">Total:</div>
                          <div className="text-lg font-semibold">$ 0</div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="mt-6 flex justify-end">
                        <Button className="bg-green-600 hover:bg-green-700 px-8">
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Monthly Expenses */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Monthly Expenses</h2>
                  <Card className="p-6">
                    <div className="space-y-6">
                      {/* Month/Year Selection */}
                      <div className="flex items-center gap-4">
                        <Select defaultValue="October">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((month) => (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select defaultValue="2025">
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button className="bg-green-600 hover:bg-green-700">Submit</Button>
                      </div>

                      {/* Monthly Expense Categories */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm font-semibold pb-2">
                          <div>Expense Type</div>
                          <div>Amount</div>
                        </div>
                        
                        {[
                          "Auto: Fuel",
                          "Auto: Insurance",
                          "Auto: Maintenance/Repairs",
                          "Auto: Payment",
                          "Cable/Satellite",
                          "Cell phone(s)",
                          "Child support/Alimony",
                          "Childcare",
                          "Clothing",
                          "Credit cards",
                          "Dining",
                          "Doctor/Prescriptions",
                          "Education Expenses",
                          "Electric Bill",
                          "Entertainment",
                          "Gas Bill",
                          "Gifts",
                          "Groceries/Sundries",
                          "Health Insurance",
                          "Home Insurance",
                          "Internet",
                          "Laundry/Dry cleaning",
                          "Life Insurance",
                          "Other",
                          "Personal Care",
                          "Pet Expenses",
                          "Rent/Mortgage",
                          "Student loans",
                          "Taxes",
                          "Utilities",
                          "Water/Sewer"
                        ].map((expense, index) => (
                          <div key={index} className="grid grid-cols-2 gap-4 items-center">
                            <div className="text-sm">{expense}</div>
                            <Input type="number" placeholder="$ 0" className="w-full" />
                          </div>
                        ))}
                        
                        <div className="border-t pt-4 grid grid-cols-2 gap-4 items-center">
                          <div className="text-lg font-semibold">Total:</div>
                          <div className="text-lg font-semibold">$ 0</div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="mt-6 flex justify-end">
                        <Button className="bg-green-600 hover:bg-green-700 px-8">
                          Save
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calculators">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold">Calculators (Sample Client)</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Credit Card Payoff Calculator */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-3">Credit Card Payoff Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Figure out the monthly payment or time length to pay down credit card debt.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm mb-2 block">
                        Card Balance <span className="text-red-500">*</span>
                      </label>
                      <Input type="number" placeholder="Enter amount" />
                    </div>
                    
                    <div>
                      <label className="text-sm mb-2 block">
                        Interest Rate <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input type="number" placeholder="Enter rate" className="pr-8" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground my-2">or</div>
                    
                    <div>
                      <label className="text-sm mb-2 block">
                        Monthly Payment <span className="text-red-500">*</span>
                      </label>
                      <Input type="number" placeholder="Enter payment" />
                    </div>
                    
                    <div>
                      <label className="text-sm mb-2 block">
                        Months Until Debt Free <span className="text-red-500">*</span>
                      </label>
                      <Input type="number" placeholder="Enter months" />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button className="bg-green-600 hover:bg-green-700">Calculate</Button>
                      <Button variant="outline">Reset</Button>
                    </div>
                  </div>
                </Card>

                {/* Mortgage Calculator */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-3">Mortgage Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Calculate the monthly payment and interest of a mortgage.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm mb-2 block">
                        Loan Amount <span className="text-red-500">*</span>
                      </label>
                      <Input type="number" placeholder="Enter amount" />
                    </div>
                    
                    <div>
                      <label className="text-sm mb-2 block">
                        Interest Rate <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input type="number" placeholder="Enter rate" className="pr-8" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm mb-2 block">
                        Number of Years <span className="text-red-500">*</span>
                      </label>
                      <Input type="number" placeholder="Enter years" />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button className="bg-green-600 hover:bg-green-700">Calculate</Button>
                      <Button variant="outline">Reset</Button>
                    </div>
                  </div>
                </Card>

                {/* Savings Calculator */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-3">Savings Calculator</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Calculate the monthly amount needed to reach a savings goal.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm mb-2 block">
                        Loan Amount <span className="text-red-500">*</span>
                      </label>
                      <Input type="number" placeholder="Enter amount" />
                    </div>
                    
                    <div>
                      <label className="text-sm mb-2 block">
                        Amount Already Saved <span className="text-red-500">*</span>
                      </label>
                      <Input type="number" placeholder="Enter amount" />
                    </div>
                    
                    <div>
                      <label className="text-sm mb-2 block">
                        Interest Rate <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input type="number" placeholder="Enter rate" className="pr-8" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm mb-2 block">
                        Years to Save <span className="text-red-500">*</span>
                      </label>
                      <Input type="number" placeholder="Enter years" />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button className="bg-green-600 hover:bg-green-700">Calculate</Button>
                      <Button variant="outline">Reset</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Educate;
