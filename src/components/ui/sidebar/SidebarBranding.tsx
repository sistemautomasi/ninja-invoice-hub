import { cn } from "@/lib/utils";

export interface SidebarBrandingProps {
  isCollapsed: boolean;
}

export const SidebarBranding = ({ isCollapsed }: SidebarBrandingProps) => {
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <span className="text-lg font-bold text-primary-foreground">S</span>
      </div>
      {!isCollapsed && (
        <span className="text-lg font-semibold">SubmitNinja</span>
      )}
    </div>
  );
};