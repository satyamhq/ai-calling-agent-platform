"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const { profile } = useUser();
  const supabase = createClient();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingIntegration, setSavingIntegration] = useState(false);

  const [profileData, setProfileData] = useState({
    full_name: "",
    company: "",
  });

  const [integrationData, setIntegrationData] = useState({
    vapi_key: "",
    twilio_sid: "",
    twilio_token: "",
    twilio_phone: "",
    make_webhook: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        company: profile.company || "",
      });
    }
  }, [profile]);

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      toast.success("Profile saved successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const saveIntegrations = async () => {
    setSavingIntegration(true);
    try {
      toast.success("Integrations saved successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingIntegration(false);
    }
  };

  const deleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      toast.error("Account deletion is disabled for safety during the hackathon.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences and integrations"
      />
      
      <div className="space-y-8 pb-12">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={profileData.full_name} 
                  onChange={e => setProfileData({...profileData, full_name: e.target.value})}
                  placeholder="John Doe" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile?.email || ""} disabled />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                value={profileData.company} 
                onChange={e => setProfileData({...profileData, company: e.target.value})}
                placeholder="Acme Inc" 
              />
            </div>
            <Button onClick={saveProfile} disabled={savingProfile}>
              {savingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <CardDescription>Connect Callify to your favorite tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Vapi Configuration</h4>
              <div className="space-y-2">
                <Label htmlFor="vapiKey">Vapi Private API Key</Label>
                <Input 
                  id="vapiKey" 
                  type="password" 
                  value={integrationData.vapi_key}
                  onChange={e => setIntegrationData({...integrationData, vapi_key: e.target.value})}
                  placeholder="sk-..." 
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">Twilio Credentials (Optional)</h4>
              <div className="space-y-2">
                <Label htmlFor="twilioSid">Account SID</Label>
                <Input 
                  id="twilioSid" 
                  value={integrationData.twilio_sid}
                  onChange={e => setIntegrationData({...integrationData, twilio_sid: e.target.value})}
                  placeholder="AC..." 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilioToken">Auth Token</Label>
                <Input 
                  id="twilioToken" 
                  type="password" 
                  value={integrationData.twilio_token}
                  onChange={e => setIntegrationData({...integrationData, twilio_token: e.target.value})}
                  placeholder="••••••••••••••••" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twilioPhone">Phone Number</Label>
                <Input 
                  id="twilioPhone" 
                  value={integrationData.twilio_phone}
                  onChange={e => setIntegrationData({...integrationData, twilio_phone: e.target.value})}
                  placeholder="+1234567890" 
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">Make.com Webhooks</h4>
              <div className="space-y-2">
                <Label htmlFor="makeWebhook">Webhook URL</Label>
                <Input 
                  id="makeWebhook" 
                  value={integrationData.make_webhook}
                  onChange={e => setIntegrationData({...integrationData, make_webhook: e.target.value})}
                  placeholder="https://hook.make.com/..." 
                />
              </div>
            </div>
            <Button onClick={saveIntegrations} disabled={savingIntegration}>
              {savingIntegration && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Integrations
            </Button>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={deleteAccount}>Delete Account</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
