'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSystemSettings, updateSystemSetting } from "@/app/actions/system-settings";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export function ApiSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    k780_appkey: '',
    k780_sign: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSystemSettings();
      setSettings({
        k780_appkey: data.k780_appkey || '',
        k780_sign: data.k780_sign || '',
      });
    } catch (error) {
      toast.error("加载设置失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateSystemSetting('k780_appkey', settings.k780_appkey);
      await updateSystemSetting('k780_sign', settings.k780_sign);
      toast.success("设置已保存");
    } catch (error) {
      toast.error("保存设置失败");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="k780_appkey">NowAPI AppKey</Label>
          <Input
            id="k780_appkey"
            value={settings.k780_appkey}
            onChange={(e) => setSettings({ ...settings, k780_appkey: e.target.value })}
            placeholder="请输入 AppKey"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="k780_sign">NowAPI Sign</Label>
          <Input
            id="k780_sign"
            type="password"
            value={settings.k780_sign}
            onChange={(e) => setSettings({ ...settings, k780_sign: e.target.value })}
            placeholder="请输入 Sign"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              保存设置
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
