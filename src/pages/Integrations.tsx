import { useState } from "react";
import { Link2, ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Integrations = () => {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);

  const handleWebhookTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast("Please enter a webhook URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(webhookUrl);
    } catch (e) {
      toast("Please enter a valid URL");
      return;
    }

    setIsLoading(true);
    console.log("Triggering webhook:", webhookUrl);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          event: "test_connection",
          source: window.location.origin,
        }),
      });

      if (response.ok) {
        toast("Webhook test successful! The endpoint responded correctly.");
      } else {
        toast(`Webhook test failed. Status: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast("Failed to reach the webhook endpoint. Please verify the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookUrl(e.target.value);
    setShowSave(e.target.value.length > 0);
  };

  const handleSave = () => {
    try {
      new URL(webhookUrl);
      toast("Webhook URL saved successfully");
      setShowSave(false);
    } catch (e) {
      toast("Please enter a valid URL before saving");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
          Integrations
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Generic Webhook Integration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Webhook Integration
            </CardTitle>
            <CardDescription>
              Connect your application with any service that supports webhooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWebhookTest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="webhook"
                    placeholder="Enter your webhook URL"
                    value={webhookUrl}
                    onChange={handleUrlChange}
                  />
                  {showSave && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSave}
                      title="Save webhook URL"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://zapier.com/blog/what-are-webhooks/", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn More
            </Button>
            <Button 
              size="sm"
              onClick={handleWebhookTest}
              disabled={isLoading}
            >
              {isLoading ? "Testing..." : "Test Connection"}
            </Button>
          </CardFooter>
        </Card>

        {/* Zapier Integration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Zapier
            </CardTitle>
            <CardDescription>
              Connect with thousands of apps through Zapier's automation platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Create Zaps to automate your workflows and connect with multiple services at once.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => window.open("https://zapier.com/apps/webhook/integrations", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect with Zapier
            </Button>
          </CardFooter>
        </Card>

        {/* Placeholder for future integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Coming Soon
            </CardTitle>
            <CardDescription>
              More integrations are coming soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We're working on adding more integrations to help you connect with your favorite services.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Integrations;