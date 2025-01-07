import { useState } from "react";
import { Link2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Integrations = () => {
  const [zapierWebhook, setZapierWebhook] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleZapierTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zapierWebhook) {
      toast("Error: Please enter your Zapier webhook URL");
      return;
    }

    setIsLoading(true);
    console.log("Triggering Zapier webhook:", zapierWebhook);

    try {
      await fetch(zapierWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });

      toast("Request sent to Zapier. Please check your Zap's history to confirm it was triggered.");
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast("Error: Failed to trigger the Zapier webhook. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
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
        {/* Zapier Integration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Zapier
            </CardTitle>
            <CardDescription>
              Connect your application with thousands of apps through Zapier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleZapierTest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <Input
                  id="webhook"
                  placeholder="Enter your Zapier webhook URL"
                  value={zapierWebhook}
                  onChange={(e) => setZapierWebhook(e.target.value)}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://zapier.com/apps/webhook/integrations", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Learn More
            </Button>
            <Button 
              size="sm"
              onClick={handleZapierTest}
              disabled={isLoading}
            >
              Test Connection
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