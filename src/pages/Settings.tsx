import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { TeamSettings } from "@/components/settings/TeamSettings";
import { CurrencySettings } from "@/components/settings/CurrencySettings";
import { Users } from "lucide-react";

const Settings = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
        Settings
      </h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full flex flex-wrap gap-2">
          <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
          <TabsTrigger value="team" className="flex-1 flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
          <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
          <TabsTrigger value="appearance" className="flex-1">Appearance</TabsTrigger>
          <TabsTrigger value="currency" className="flex-1">Currency</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="team">
          <TeamSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings />
        </TabsContent>

        <TabsContent value="currency">
          <CurrencySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;