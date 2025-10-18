import { Bell, Users, Clipboard, Check, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <Users className="h-5 w-5" />
            <Clipboard className="h-5 w-5" />
            <Check className="h-5 w-5" />
            <Mail className="h-5 w-5" />
            <Search className="h-5 w-5" />
          </div>
          
          <img src={logo} alt="FundingExpert.AI" className="h-20" />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
            Upgrade Now
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-dark">
            Help & Support
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-dark">
            My Account
          </Button>
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-dark">
            Ian (admin)
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
