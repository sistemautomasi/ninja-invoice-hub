import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive }: SidebarItemProps) => (
  <Link
    to={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
      isActive ? "bg-primary text-white" : "hover:bg-gray-100"
    )}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Package, label: "Submit Order", href: "/submit-order" },
    { icon: ClipboardList, label: "Order List", href: "/order-list" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r",
          sidebarOpen ? "w-64" : "w-16",
          "md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            {sidebarOpen && <h1 className="text-xl font-bold">SubmitNinja</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
                isActive={location.pathname === item.href}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "transition-all duration-200 ease-in-out",
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        )}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;