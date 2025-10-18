import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const Invoice = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    clientName: "Ali Aamir",
    telephone: "(414) 469-0784",
    email: "alia@fedtec.com",
    lastFourSS: "6635",
    creditAccount: "MyScore IQ",
    username: "alia@fedtec.com",
    password: "Kobe2023?",
    referredBy: "Amir Karbasi",
    timeStarted: "12:18 PM",
    timeCompleted: "12:23 PM",
    completedBy: "Adrian",
    date: "10-02-2025",
  });

  const [checkboxes, setCheckboxes] = useState({
    avaKikoff: false,
    beforeFile: false,
    needTaxes: false,
    creditKarma: false,
    onMonday: false,
    referrals: false,
    needTradelines: false,
    haveCorporation: false,
    newClient: false,
    initialedFTS: false,
  });

  const [items, setItems] = useState([
    { type: "NAMES/AKA's TO COME OFF:", count: 0, price: 0 },
    { type: "ADDRESSES TO COME OFF:", count: 8, price: 2400 },
    { type: "EMPLOYERS TO COME OFF:", count: 2, price: 600 },
    { type: "INQUIRIES TO COME OFF:", count: 0, price: 0 },
  ]);

  const [keepAccounts, setKeepAccounts] = useState([
    { creditor: "Discover Acct # XXXX XXXX XXXX 4015", accountNumber: "XXXXXXXXXXXX4015", units: 300 },
    { creditor: "Barclay", accountNumber: "XXXXXXXXXXXX7632", units: 300 },
    { creditor: "Bank of America", accountNumber: "XXXXXXXXXXXX7235", units: 300 },
  ]);

  const totalUnits = items.reduce((sum, item) => sum + item.price, 0);
  const subtotal = totalUnits;
  const discount50 = subtotal * 0.5;
  const afterDiscount = subtotal - discount50;
  const savings25 = afterDiscount * 0.25;
  const inHouseFinance = afterDiscount - (afterDiscount * 0.15);
  const oneTimePayment = afterDiscount - savings25;

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
              <Button variant="ghost" size="sm">Educate</Button>
            </Link>
            <Button variant="ghost" size="sm">Messages</Button>
            <Button variant="default" size="sm">Invoices</Button>
            <Button variant="ghost" size="sm">Activity</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">First Time Summary Invoice</h1>
          <Button className="bg-green-600 hover:bg-green-700">
            Save Invoice
          </Button>
        </div>

        {/* Document Preparation Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">DOCUMENT PREPARATIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.avaKikoff}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, avaKikoff: checked as boolean})}
              />
              <label className="text-sm">Ava, Kikoff, Chime & Self before starting their file</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.beforeFile}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, beforeFile: checked as boolean})}
              />
              <label className="text-sm">Before starting their file?</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.needTaxes}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, needTaxes: checked as boolean})}
              />
              <label className="text-sm">Need the Taxes?</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.creditKarma}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, creditKarma: checked as boolean})}
              />
              <label className="text-sm">Credit Karma, Experian, IDIQ & Fico</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.referrals}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, referrals: checked as boolean})}
              />
              <label className="text-sm">Filled out 5 Referrals to get 50% discount</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.needTradelines}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, needTradelines: checked as boolean})}
              />
              <label className="text-sm">Do they need tradelines</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.haveCorporation}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, haveCorporation: checked as boolean})}
              />
              <label className="text-sm">Do they have Corporation</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.newClient}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, newClient: checked as boolean})}
              />
              <label className="text-sm">New client</label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                checked={checkboxes.initialedFTS}
                onCheckedChange={(checked) => setCheckboxes({...checkboxes, initialedFTS: checked as boolean})}
              />
              <label className="text-sm">Did you initial the FTS?</label>
            </div>
          </div>
        </Card>

        {/* Client Information */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold block mb-2">Client Name</label>
              <Input 
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Telephone</label>
              <Input 
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Email</label>
              <Input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Date</label>
              <Input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Last 4 of SS</label>
              <Input 
                maxLength={4}
                value={formData.lastFourSS}
                onChange={(e) => setFormData({...formData, lastFourSS: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Credit Account</label>
              <Input 
                value={formData.creditAccount}
                onChange={(e) => setFormData({...formData, creditAccount: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">User Name</label>
              <Input 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Password</label>
              <Input 
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Referred by</label>
              <Input 
                value={formData.referredBy}
                onChange={(e) => setFormData({...formData, referredBy: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Time Started</label>
              <Input 
                value={formData.timeStarted}
                onChange={(e) => setFormData({...formData, timeStarted: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Time/Date Completed</label>
              <Input 
                value={formData.timeCompleted}
                onChange={(e) => setFormData({...formData, timeCompleted: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-semibold block mb-2">Completed By</label>
              <Input 
                value={formData.completedBy}
                onChange={(e) => setFormData({...formData, completedBy: e.target.value})}
              />
            </div>
          </div>
        </Card>

        {/* Pricing Summary */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Items to Remove</h2>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-3 font-semibold">Sl No</th>
                  <th className="text-left p-3 font-semibold">Current Credit Scores As Of</th>
                  <th className="text-center p-3 font-semibold">Count</th>
                  <th className="text-center p-3 font-semibold">Price</th>
                  <th className="text-center p-3 font-semibold">Initials</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">
                      <Input 
                        type="number"
                        value={item.count}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].count = Number(e.target.value);
                          newItems[index].price = Number(e.target.value) * 300;
                          setItems(newItems);
                        }}
                        className="w-20 text-center"
                      />
                    </td>
                    <td className="p-3 text-center">${item.price.toFixed(2)}</td>
                    <td className="p-3">
                      <Input className="w-24" placeholder="______" />
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 font-bold">
                  <td className="p-3" colSpan={2}>TOTAL:</td>
                  <td className="p-3 text-center">{items.reduce((sum, item) => sum + item.count, 0)}</td>
                  <td className="p-3 text-center">${totalUnits.toFixed(2)}</td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="text-sm mb-2">
              There are 3 major bureaus Transunion, Experian & Equifax & we fight with all 3 which is why you see it multiplied by 3.
            </p>
            <p className="text-sm">
              Even if the account is not there we still remove it from the database & Cyber space.
            </p>
          </div>

          {/* Pricing Options */}
          <div className="space-y-4">
            <div className="border-2 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">SUBTOTAL after 50% discount</span>
                <span className="text-xl font-bold">${afterDiscount.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-2 border-blue-500 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">Client Discount - In house Finance</p>
                  <p className="text-sm text-muted-foreground">(50% Down and Weekly Payments)</p>
                  <p className="text-sm font-semibold">50% OFF + 15% OFF = 65% OFF</p>
                </div>
                <span className="text-xl font-bold">${inHouseFinance.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <label className="text-sm font-semibold">INITIALS:</label>
                <Input className="w-32" placeholder="______" />
              </div>
            </div>

            <div className="border-2 border-green-500 bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">ONE TIME PAYMENT - PAYMENT IN FULL</p>
                  <p className="text-sm text-muted-foreground">(THIS WEEK ONLY)</p>
                  <p className="text-sm font-semibold">50% OFF + 25% OFF = 75% OFF</p>
                </div>
                <span className="text-xl font-bold">${oneTimePayment.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <label className="text-sm font-semibold">INITIALS:</label>
                <Input className="w-32" placeholder="______" />
              </div>
            </div>
          </div>
        </Card>

        {/* Keep Accounts */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Keep Accounts to Take off</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left p-3 font-semibold">Sl No</th>
                  <th className="text-left p-3 font-semibold">Creditor</th>
                  <th className="text-left p-3 font-semibold">Account Number</th>
                  <th className="text-center p-3 font-semibold">TOTAL UNITS: 3x100</th>
                </tr>
              </thead>
              <tbody>
                {keepAccounts.map((account, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">
                      <input
                        type="text"
                        value={account.creditor}
                        className="w-full bg-transparent border-none outline-none"
                        onChange={(e) => {
                          const newAccounts = [...keepAccounts];
                          newAccounts[index].creditor = e.target.value;
                          setKeepAccounts(newAccounts);
                        }}
                      />
                    </td>
                    <td className="py-3">
                      <input
                        type="text"
                        value={account.accountNumber}
                        className="w-full bg-transparent border-none outline-none"
                        onChange={(e) => {
                          const newAccounts = [...keepAccounts];
                          newAccounts[index].accountNumber = e.target.value;
                          setKeepAccounts(newAccounts);
                        }}
                      />
                    </td>
                    <td className="p-3 text-center">{account.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setKeepAccounts([...keepAccounts, { creditor: "", accountNumber: "", units: 300 }])}
          >
            Add Account
          </Button>
        </Card>

        {/* Footer Notes */}
        <Card className="p-6">
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Important Notes:</p>
            <p>• Credit Karma does not report from Experian so prices may be subject to change.</p>
            <p>• This is your First Time Summary. Please Initial next to Initials stating you understand this.</p>
            <p>• If a new keep item comes on your file we will have to create a new FTS (First Time Summary) and new invoice.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Invoice;