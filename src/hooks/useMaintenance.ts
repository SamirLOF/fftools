import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceSettings {
  enabled: boolean;
  end_time: string | null;
  message: string;
}

export const useMaintenance = () => {
  const [maintenance, setMaintenance] = useState<MaintenanceSettings>({
    enabled: false,
    end_time: null,
    message: "Site is under maintenance"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "maintenance")
      .maybeSingle();

    if (!error && data) {
      setMaintenance(data.value as unknown as MaintenanceSettings);
    }
    setIsLoading(false);
  };

  const updateMaintenance = async (settings: Partial<MaintenanceSettings>) => {
    const newSettings = { ...maintenance, ...settings };
    
    const { error } = await supabase
      .from("site_settings")
      .update({ 
        value: newSettings,
        updated_at: new Date().toISOString()
      })
      .eq("key", "maintenance");

    if (!error) {
      setMaintenance(newSettings);
      return true;
    }
    return false;
  };

  return { maintenance, isLoading, updateMaintenance, refetch: fetchMaintenance };
};
