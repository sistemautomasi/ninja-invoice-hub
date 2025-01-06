import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Settings,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Link2,
} from "lucide-react";

const icons = {
  dashboard: LayoutDashboard,
  orders: ClipboardList,
  products: ShoppingCart,
  costs: DollarSign,
  advertising: BarChart3,
  invoices: FileText,
  integrations: Link2,
  settings: Settings,
};

interface SidebarNavItemProps {
  path: string;
  label: string;
  icon: keyof typeof icons;
}

export const SidebarNavItem = ({ path, label, icon }: SidebarNavItemProps) => {
  const location = useLocation();
  const Icon = icons[icon];
  const isActive = location.pathname === path;

  return (
    <Link to={path}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2",
          isActive && "bg-muted"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Button>
    </Link>
  );
};