import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SecuritySettings = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Password</h3>
            <Button
              variant="outline"
              onClick={() => navigate("/forgot-password")}
              className="w-full md:w-auto"
            >
              Change Password
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 mb-2">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline" className="w-full md:w-auto">Enable 2FA</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};