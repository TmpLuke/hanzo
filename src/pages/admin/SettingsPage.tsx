import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Settings, CreditCard, Globe, Bell, Shield, Palette,
  Save, Key, Link, Mail, Percent, Webhook
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // General
    siteName: "Hanzo",
    siteDescription: "Premium digital products for content creators",
    supportEmail: "petyaiscute@gmail.com",

    // Payment - Sellhub
    sellhubApiKey: "sk_live_••••••••••••••••",
    sellhubWebhookSecret: "whsec_••••••••••••••••",
    platformFee: 2.5,

    // Notifications
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,

    // Discord - from env
    discordWebhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL || "",

    // Security
    twoFactorEnabled: false,
    ipWhitelist: "",

    // Appearance
    maintenanceMode: false,
    showAnnouncement: true,
    announcementText: "WINTER & CHRISTMAS SALE IS HERE! Use Coupon Code: HANZO10 for 10% OFF EVERYTHING!",
    holidayMode: "none",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings' as any)
          .select('*')
          .limit(1)
          .maybeSingle();

        let loadedSettings;
        
        if (error) {
          console.error("Error fetching settings:", error);
          // Use default settings
          loadedSettings = settings;
        } else if (data) {
          console.log('Loaded settings from DB:', data);
          loadedSettings = {
            siteName: data.site_name || "Hanzo",
            siteDescription: data.site_description || "Premium digital products for content creators",
            supportEmail: data.support_email || "petyaiscute@gmail.com",
            sellhubApiKey: data.sellhub_api_key || "sk_live_••••••••••••••••",
            sellhubWebhookSecret: data.sellhub_webhook_secret || "whsec_••••••••••••••••",
            platformFee: data.platform_fee || 2.5,
            emailNotifications: data.email_notifications ?? true,
            orderAlerts: data.order_alerts ?? true,
            lowStockAlerts: data.low_stock_alerts ?? true,
            twoFactorEnabled: data.two_factor_enabled ?? false,
            ipWhitelist: data.ip_whitelist || "",
            maintenanceMode: data.maintenance_mode ?? false,
            showAnnouncement: data.show_announcement ?? true,
            announcementText: data.announcement_text || "WINTER & CHRISTMAS SALE IS HERE! Use Coupon Code: HANZO10 for 10% OFF EVERYTHING!",
            holidayMode: data.holiday_mode || "none",
            discordWebhookUrl: import.meta.env.VITE_DISCORD_WEBHOOK_URL || "",
          };
        } else {
          // No data, use defaults
          loadedSettings = settings;
        }
        
        setSettings(loadedSettings);
        
        // Always save to localStorage for immediate use
        localStorage.setItem('announcementSettings', JSON.stringify({
          showAnnouncement: loadedSettings.showAnnouncement,
          announcementText: loadedSettings.announcementText
        }));
        localStorage.setItem('maintenanceMode', JSON.stringify({
          enabled: loadedSettings.maintenanceMode
        }));
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);



  const saveSettingsToDb = async (newSettings: any) => {
    try {
      console.log('Attempting to save all settings');
      
      const payload = {
        site_name: newSettings.siteName,
        site_description: newSettings.siteDescription,
        support_email: newSettings.supportEmail,
        sellhub_api_key: newSettings.sellhubApiKey,
        sellhub_webhook_secret: newSettings.sellhubWebhookSecret,
        platform_fee: newSettings.platformFee,
        email_notifications: newSettings.emailNotifications,
        order_alerts: newSettings.orderAlerts,
        low_stock_alerts: newSettings.lowStockAlerts,
        two_factor_enabled: newSettings.twoFactorEnabled,
        ip_whitelist: newSettings.ipWhitelist,
        maintenance_mode: newSettings.maintenanceMode,
        show_announcement: newSettings.showAnnouncement,
        announcement_text: newSettings.announcementText,
        holiday_mode: newSettings.holidayMode,
      };

      // Get existing row
      const { data: existingRows, error: selectError } = await supabase
        .from('admin_settings' as any)
        .select('id')
        .limit(1);

      if (selectError) {
        console.error('Select error:', selectError);
        toast.error(`Failed to fetch settings: ${selectError.message}`);
        return;
      }

      console.log('Existing rows:', existingRows);

      if (existingRows && existingRows.length > 0) {
        console.log('Updating existing row:', existingRows[0].id);
        const { data, error } = await supabase
          .from('admin_settings' as any)
          .update(payload)
          .eq('id', existingRows[0].id)
          .select();
        
        if (error) {
          console.error('Update error:', error);
          toast.error(`Failed to save settings: ${error.message}`);
          return;
        }
        console.log('Update successful:', data);
      } else {
        console.log('Inserting new row');
        const { data, error } = await supabase
          .from('admin_settings' as any)
          .insert([payload])
          .select();
        
        if (error) {
          console.error('Insert error:', error);
          toast.error(`Failed to save settings: ${error.message}`);
          return;
        }
        console.log('Insert successful:', data);
      }

      toast.success("Settings saved successfully!");
    } catch (err: any) {
      console.error("Error saving settings:", err);
      toast.error("Failed to save settings");
    }
  };

  const handleSave = (section: string) => {
    saveSettingsToDb(settings);
    
    // Save to localStorage for immediate use
    if (section === "Appearance") {
      localStorage.setItem('announcementSettings', JSON.stringify({
        showAnnouncement: settings.showAnnouncement,
        announcementText: settings.announcementText
      }));
      localStorage.setItem('maintenanceMode', JSON.stringify({
        enabled: settings.maintenanceMode
      }));
      
      // Dispatch both storage and custom event
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('announcementUpdate'));
      
      if (settings.maintenanceMode) {
        toast.success("Maintenance mode enabled! The site is now in maintenance mode.");
      } else {
        toast.success("Settings saved! Check the homepage to see changes.");
      }
    }
  };

  const saveHolidayMode = async (mode: string) => {
    console.log('Saving holiday mode:', mode);
    const newSettings = { ...settings, holidayMode: mode };
    setSettings(newSettings);
    await saveSettingsToDb(newSettings);
  };

  const saveDiscordWebhook = async () => {
    toast.info("Discord webhook is configured in your .env file");
    toast.success("To update it, edit the VITE_DISCORD_WEBHOOK_URL in your .env file");
  };

  const testDiscordWebhook = async () => {
    if (!settings.discordWebhookUrl) {
      toast.error("Please enter a webhook URL first");
      return;
    }

    try {
      const response = await fetch(settings.discordWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Hanzo Store",
          embeds: [
            {
              title: "🧪 Test Notification",
              description: "This is a test notification from your Hanzo Marketplace!",
              color: 0x00ff00,
              fields: [
                {
                  name: "Status",
                  value: "✅ Webhook is working correctly!",
                },
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: "Hanzo Marketplace",
              },
            },
          ],
        }),
      });

      if (response.ok) {
        toast.success("Test notification sent! Check your Discord channel.");
      } else {
        toast.error("Failed to send test notification. Check your webhook URL.");
      }
    } catch (error) {
      toast.error("Error sending test notification");
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">General Settings</h2>
              <p className="text-sm text-muted-foreground">Basic store information</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Site Description</Label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                rows={2}
              />
            </div>
            <Button onClick={() => handleSave("General")} className="gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Payment Settings - Sellhub.cx */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Payment Settings</h2>
              <p className="text-sm text-muted-foreground">Configure Sellhub.cx integration</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">S</div>
                <div>
                  <p className="font-medium">Sellhub.cx</p>
                  <p className="text-xs text-primary">Connected</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Key className="w-4 h-4" /> API Key
              </Label>
              <Input
                type="password"
                value={settings.sellhubApiKey}
                onChange={(e) => setSettings({ ...settings, sellhubApiKey: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Link className="w-4 h-4" /> Webhook Secret
              </Label>
              <Input
                type="password"
                value={settings.sellhubWebhookSecret}
                onChange={(e) => setSettings({ ...settings, sellhubWebhookSecret: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Percent className="w-4 h-4" /> Platform Fee (%)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={settings.platformFee}
                onChange={(e) => setSettings({ ...settings, platformFee: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <Button onClick={() => handleSave("Payment")} className="gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Configure alert preferences</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Order Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified for new orders</p>
                </div>
              </div>
              <Switch
                checked={settings.orderAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, orderAlerts: checked })}
              />
            </div>
            <Button onClick={() => handleSave("Notifications")} className="gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Discord Webhook */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Webhook className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Discord Webhook</h2>
              <p className="text-sm text-muted-foreground">Get notified when customers make purchases</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">D</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Discord Integration</p>
                  <p className="text-xs text-muted-foreground mt-1">Receive real-time notifications in your Discord server when someone completes a purchase. Create a webhook in your Discord server settings and paste the URL below.</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Link className="w-4 h-4" /> Webhook URL
              </Label>
              <Input
                type="text"
                value={settings.discordWebhookUrl}
                disabled
                placeholder="Configured in .env file"
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                ✅ Webhook is configured in your .env file (VITE_DISCORD_WEBHOOK_URL)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={testDiscordWebhook}
                className="gap-2"
                disabled={!settings.discordWebhookUrl}
              >
                <Bell className="w-4 h-4" /> Test Webhook
              </Button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Appearance</h2>
              <p className="text-sm text-muted-foreground">Customize store appearance</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">Temporarily disable the store</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium">Show Announcement Banner</p>
                <p className="text-sm text-muted-foreground">Display promotional banner on homepage</p>
              </div>
              <Switch
                checked={settings.showAnnouncement}
                onCheckedChange={(checked) => {
                  const newSettings = { ...settings, showAnnouncement: checked };
                  setSettings(newSettings);
                  // Immediately save to localStorage
                  localStorage.setItem('announcementSettings', JSON.stringify({
                    showAnnouncement: checked,
                    announcementText: settings.announcementText
                  }));
                  window.dispatchEvent(new Event('announcementUpdate'));
                  toast.success(checked ? "Banner enabled!" : "Banner disabled!");
                }}
              />
            </div>
            {settings.showAnnouncement && (
              <div className="space-y-2">
                <Label>Announcement Text</Label>
                <Textarea
                  value={settings.announcementText}
                  onChange={(e) => {
                    const newSettings = { ...settings, announcementText: e.target.value };
                    setSettings(newSettings);
                    
                    // Update localStorage immediately as user types
                    localStorage.setItem('announcementSettings', JSON.stringify({
                      showAnnouncement: settings.showAnnouncement,
                      announcementText: e.target.value
                    }));
                    window.dispatchEvent(new Event('announcementUpdate'));
                  }}
                  rows={2}
                  placeholder="Enter your announcement text here..."
                />
              </div>
            )}

            <Button onClick={() => handleSave("Appearance")} className="gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
            
            {/* Test Banner Button */}
            <Button 
              variant="outline" 
              onClick={() => {
                const testSettings = {
                  showAnnouncement: settings.showAnnouncement,
                  announcementText: settings.announcementText
                };
                localStorage.setItem('announcementSettings', JSON.stringify(testSettings));
                window.dispatchEvent(new Event('storage'));
                toast.success(`Banner ${settings.showAnnouncement ? 'enabled' : 'disabled'}! Check the homepage.`);
              }}
              className="gap-2"
            >
              Test Banner Now
            </Button>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="p-5 border-b border-border bg-muted/30 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">Protect your admin account</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactorEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })}
              />
            </div>
            <div className="space-y-2">
              <Label>IP Whitelist (Optional)</Label>
              <Textarea
                value={settings.ipWhitelist}
                onChange={(e) => setSettings({ ...settings, ipWhitelist: e.target.value })}
                placeholder="Enter IP addresses, one per line"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">Leave empty to allow all IPs</p>
            </div>
            <Button onClick={() => handleSave("Security")} className="gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div >
  );
}
