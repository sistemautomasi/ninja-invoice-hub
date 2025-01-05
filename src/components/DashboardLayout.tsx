import { useState } from "react";
import { Menu, X, LayoutDashboard, Package, ClipboardList, Settings, BoxIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarBranding } from "@/components/ui/sidebar/SidebarBranding";
import { SidebarNavItem } from "@/components/ui/sidebar/SidebarNavItem";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BoxIcon, label: "Products", href: "/products" },
    { icon: Package, label: "Submit Order", href: "/submit-order" },
    { icon: ClipboardList, label: "Order List", href: "/order-list" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-all duration-300",
          isCollapsed && "w-16",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarBranding isCollapsed={isCollapsed} />
        
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-6 hidden h-8 w-8 items-center justify-center rounded-full border bg-background shadow-sm lg:flex"
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {sidebarItems.map((item) => (
            <SidebarNavItem
              key={item.href}
              {...item}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border bg-background shadow-sm lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Main content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isCollapsed ? "lg:pl-16" : "lg:pl-64",
          "pt-16 lg:pt-0"
        )}
      >
        <div className="container p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;