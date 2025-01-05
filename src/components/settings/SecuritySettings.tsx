import { useNavigate } from "react-router-dom";
import { Shield, Key, Smartphone, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const SecuritySettings = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <Key className="w-5 h-5 mt-1 text-gray-500" />
            <div className="flex-1">
              <h3 className="font-medium mb-2">Password</h3>
              <p className="text-sm text-gray-500 mb-3">
                Change your password to keep your account secure
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/forgot-password")}
                className="w-full md:w-auto"
              >
                Change Password
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-start gap-4">
            <Smartphone className="w-5 h-5 mt-1 text-gray-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <Switch />
              </div>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account by requiring a verification code in addition to your password
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-4">
            <Shield className="w-5 h-5 mt-1 text-gray-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Login Notifications</h3>
                <Switch defaultChecked />
              </div>
              <p className="text-sm text-gray-500">
                Receive notifications when someone logs into your account from a new device or browser
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-4">
            <History className="w-5 h-5 mt-1 text-gray-500" />
            <div className="flex-1">
              <h3 className="font-medium mb-2">Login History</h3>
              <p className="text-sm text-gray-500 mb-3">
                Review all devices that have logged into your account
              </p>
              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">Chrome on Windows</p>
                      <p className="text-xs text-gray-500">Last accessed: Today at 2:45 PM</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Current</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">Safari on iPhone</p>
                      <p className="text-xs text-gray-500">Last accessed: Yesterday at 10:30 AM</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-red-600 hover:text-red-700">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};