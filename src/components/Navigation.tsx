import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Clients", path: "/clients" },
  { name: "Schedule", path: "/schedule" },
  { name: "PDF Editor", path: "/pdf-editor" },
  { name: "Billing & Payments", path: "/billing" },
  { name: "Letter Library", path: "/letter-library" },
  { name: "Affiliates", path: "/affiliates" },
  { name: "Creditors / Furnishers", path: "/creditors" },
  { name: "Everything", path: "/everything" },
  { name: "Setup", path: "/my-company" },
];

const Navigation = () => {
  return (
    <nav className="bg-primary-dark text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors hover:bg-primary",
                  isActive && "bg-primary"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
