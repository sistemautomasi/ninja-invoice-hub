import { SidebarNavItem } from "./sidebar/SidebarNavItem";
import { SidebarBranding } from "./sidebar/SidebarBranding";
import { ScrollArea } from "./scroll-area";
import { LucideIcon } from "lucide-react";

interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  isLogout?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

interface SidebarProps {
  navigation: NavigationItem[];
  isCollapsed?: boolean;
}

export const Sidebar = ({ navigation, isCollapsed = false }: SidebarProps) => {
  return (
    <div className={`flex h-full flex-col gap-2 border-r ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <SidebarBranding isCollapsed={isCollapsed} />
      <ScrollArea className="flex-1 overflow-auto">
        <div className="flex flex-col gap-1 p-2">
          {navigation.map((item) => (
            <SidebarNavItem key={item.href} {...item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};