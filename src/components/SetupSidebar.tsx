import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Shield,
  Lock,
  Activity,
  Mail,
  Globe,
  UserPlus,
  DollarSign,
  Wrench,
  FileText,
  FileSignature,
  AlertTriangle,
  Bell,
  Users,
  Banknote,
  Megaphone,
  Code,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Roles & Permissions", path: "/my-company/roles", icon: Shield },
  { name: "CRC Marketing Hub Settings", path: "/my-company/marketing", icon: Lock, locked: true },
  { name: "Credit Monitoring Services", path: "/my-company/credit-monitoring", icon: Activity },
  { name: "CloudMail", path: "/my-company/cloudmail", icon: Mail, expandable: true },
  { 
    name: "Client / Affiliate Portal", 
    path: "/my-company/portal", 
    icon: Globe, 
    expandable: true,
    subItems: [
      { name: "My Logo", path: "/my-company/portal/logo" },
      { name: "Details", path: "/my-company/portal/details" },
      { name: "Resources", path: "/my-company/portal/resources" },
      { name: "Credit Info", path: "/my-company/portal/credit-info" },
      { name: "Client's Choice", path: "/my-company/portal/client-choice" },
      { name: "Portal Theme", path: "/my-company/portal/theme" },
      { name: "Client Onboarding & Tasks", path: "/my-company/portal/onboarding" },
    ]
  },
  { 
    name: "Affiliate Payments", 
    path: "/my-company/affiliate-payments", 
    icon: Banknote, 
    expandable: true,
    subItems: [
      { name: "Active/Inactive Affiliates", path: "/my-company/affiliate-payments/affiliates" },
      { name: "Global Commission Settings", path: "/my-company/affiliate-payments/commission-settings" },
      { name: "Advanced Commission Settings", path: "/my-company/affiliate-payments/advanced-settings" },
    ]
  },
  { name: "Self Service Client Signup", path: "/my-company/self-service", icon: UserPlus },
  { name: "Billing & Payments", path: "/my-company/billing", icon: DollarSign, expandable: true },
  { name: "Website Tools", path: "/my-company/website-tools", icon: Wrench, expandable: true },
  { name: "Simple Audit Settings", path: "/my-company/audit", icon: FileText, expandable: true },
  { name: "Client Agreement Options", path: "/my-company/agreements", icon: FileSignature },
  { name: "Digital Signature Records", path: "/my-company/signatures", icon: FileSignature },
  { name: "Dispute Options", path: "/my-company/dispute-options", icon: AlertTriangle, expandable: true },
  { name: "Automated Notifications", path: "/my-company/notifications", icon: Bell, expandable: true },
  { name: "Lead/Client Statuses", path: "/my-company/statuses", icon: Users, expandable: true },
  { name: "Active Campaign", path: "/my-company/campaign", icon: Megaphone, expandable: true },
  { name: "API & Automations", path: "/my-company/api", icon: Code, expandable: true },
];

const SetupSidebar = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  return (
    <aside className="w-64 bg-muted/30 border-r min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-muted-foreground mb-4">Company Settings</h2>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.expandable ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">{item.name}</span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        expandedItems.includes(item.name) && "rotate-90"
                      )}
                    />
                  </button>
                  {expandedItems.includes(item.name) && item.subItems && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.name}
                          to={subItem.path}
                          end
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors",
                              isActive && "bg-primary text-primary-foreground hover:bg-primary"
                            )
                          }
                        >
                          <span>{subItem.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.name}</span>
                  {item.locked && <Lock className="h-3 w-3" />}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SetupSidebar;
