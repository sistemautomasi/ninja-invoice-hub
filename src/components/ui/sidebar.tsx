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
}

export const Sidebar = ({ navigation }: SidebarProps) => {
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