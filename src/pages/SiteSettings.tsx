import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shimmer } from "@/components/ui/shimmer";

interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  contact_email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  about_content: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function SiteSettings() {
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .maybeSingle();

      console.log("Fetching site settings:", data);

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to fetch site settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isSignedIn) {
      fetchSettings();
    }
  }, [isSignedIn, fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .update({
          site_title: settings.site_title,
          site_description: settings.site_description,
          hero_title: settings.hero_title,
          hero_subtitle: settings.hero_subtitle,
          contact_email: settings.contact_email,
          github_url: settings.github_url,
          linkedin_url: settings.linkedin_url,
          twitter_url: settings.twitter_url,
          about_content: settings.about_content,
        })
        .eq("id", settings.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Site settings updated successfully!",
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update site settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SiteSettings, value: string) => {
    if (settings) {
      setSettings({ ...settings, [field]: value });
    }
  };

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Shimmer className="h-8 w-8 rounded-full" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Settings Found</h2>
          <p className="text-muted-foreground">
            Site settings have not been initialized.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage your website's global configuration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic information about your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_title">Site Title</Label>
                  <Input
                    id="site_title"
                    value={settings.site_title}
                    onChange={(e) =>
                      handleInputChange("site_title", e.target.value)
                    }
                    placeholder="My Portfolio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={settings.site_description || ""}
                  onChange={(e) =>
                    handleInputChange("site_description", e.target.value)
                  }
                  placeholder="A modern portfolio website"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Content for your homepage hero section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title || ""}
                  onChange={(e) =>
                    handleInputChange("hero_title", e.target.value)
                  }
                  placeholder="Welcome to My Portfolio"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Input
                  id="hero_subtitle"
                  value={settings.hero_subtitle || ""}
                  onChange={(e) =>
                    handleInputChange("hero_subtitle", e.target.value)
                  }
                  placeholder="I create amazing digital experiences"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Your social media and portfolio links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub URL</Label>
                  <Input
                    id="github_url"
                    value={settings.github_url || ""}
                    onChange={(e) =>
                      handleInputChange("github_url", e.target.value)
                    }
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={settings.linkedin_url || ""}
                    onChange={(e) =>
                      handleInputChange("linkedin_url", e.target.value)
                    }
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_url">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    value={settings.twitter_url || ""}
                    onChange={(e) =>
                      handleInputChange("twitter_url", e.target.value)
                    }
                    placeholder="https://twitter.com/username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>Content for your about section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="about_content">About Content</Label>
                <Textarea
                  id="about_content"
                  value={settings.about_content || ""}
                  onChange={(e) =>
                    handleInputChange("about_content", e.target.value)
                  }
                  placeholder="Tell visitors about yourself and your work..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Shimmer className="h-4 w-4 rounded-full mr-2" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
