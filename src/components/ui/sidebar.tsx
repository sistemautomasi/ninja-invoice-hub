import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { SidebarBranding } from "./sidebar/SidebarBranding";
import { ScrollArea } from "./scroll-area";
import { LayoutDashboard, ClipboardList, ShoppingCart, DollarSign, BarChart3, FileText, Link2, Settings } from "lucide-react";

const navigation = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/products", label: "Products", icon: ShoppingCart },
  { href: "/costs", label: "Costs", icon: DollarSign },
  { href: "/advertising", label: "Advertising", icon: BarChart3 },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/integrations", label: "Integrations", icon: Link2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <div className="flex h-full flex-col gap-2">
      <SidebarBranding isCollapsed={false} />
      <ScrollArea className="flex-1 overflow-auto">
        <div className="flex flex-col gap-1 p-2">
          {navigation.map((item) => (
            <SidebarNavItem key={item.href} {...item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};