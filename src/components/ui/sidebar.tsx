import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { SidebarBranding } from "./sidebar/SidebarBranding";
import { ScrollArea } from "./scroll-area";

const navigation = [
  { path: "/", label: "Dashboard", icon: "dashboard" },
  { path: "/orders", label: "Orders", icon: "orders" },
  { path: "/products", label: "Products", icon: "products" },
  { path: "/costs", label: "Costs", icon: "costs" },
  { path: "/advertising", label: "Advertising", icon: "advertising" },
  { path: "/invoices", label: "Invoices", icon: "invoices" },
  { path: "/integrations", label: "Integrations", icon: "integrations" },
  { path: "/settings", label: "Settings", icon: "settings" },
];

export const Sidebar = () => {
  return (
    <div className="flex h-full flex-col gap-2">
      <SidebarBranding />
      <ScrollArea className="flex-1 overflow-auto">
        <div className="flex flex-col gap-1 p-2">
          {navigation.map((item) => (
            <SidebarNavItem key={item.path} {...item} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};