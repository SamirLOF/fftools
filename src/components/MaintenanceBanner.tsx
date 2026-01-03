import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceSettings {
  enabled: boolean;
  end_time: string | null;
  message: string;
}

const MaintenanceBanner = () => {
  const [maintenance, setMaintenance] = useState<MaintenanceSettings | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    fetchMaintenance();
    
    // Subscribe to changes
    const channel = supabase
      .channel('maintenance-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_settings',
          filter: 'key=eq.maintenance'
        },
        () => {
          fetchMaintenance();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!maintenance?.end_time) {
      setTimeLeft("");
      return;
    }

    const updateCountdown = () => {
      const end = new Date(maintenance.end_time!).getTime();
      const now = Date.now();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ending soon...");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [maintenance?.end_time]);

  const fetchMaintenance = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "maintenance")
      .maybeSingle();

    if (!error && data) {
      setMaintenance(data.value as unknown as MaintenanceSettings);
    }
  };

  if (!maintenance?.enabled) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 shadow-lg"
      >
        <div className="container mx-auto flex items-center justify-center gap-3 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <span>{maintenance.message || "Site is under maintenance"}</span>
          {timeLeft && (
            <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
              <Clock className="w-3 h-3" />
              {timeLeft}
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MaintenanceBanner;
