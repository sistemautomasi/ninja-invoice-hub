import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  ClipboardList, 
  ShoppingCart, 
  DollarSign, 
  BarChart3, 
  FileText,
  Link2, 
  Settings, 
  LogOut 
} from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast("Error logging out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigation = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ClipboardList },
    { href: "/products", label: "Products", icon: ShoppingCart },
    { href: "/costs", label: "Costs", icon: DollarSign },
    { href: "/advertising", label: "Advertising", icon: BarChart3 },
    { href: "/invoices", label: "Invoices", icon: FileText },
    { href: "/integrations", label: "Integrations", icon: Link2 },
    { href: "/settings", label: "Settings", icon: Settings },
    { 
      href: "#", 
      label: "Logout", 
      icon: LogOut, 
      isLogout: true,
      onClick: handleLogout,
      disabled: isLoading 
    }
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar navigation={navigation} />
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;