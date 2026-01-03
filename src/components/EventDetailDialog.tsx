import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check, CalendarClock, CalendarCheck, Download, Play, Loader2, Crown, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import { getEventStatus } from "@/services/eventApi";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface EventDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  details?: string;
  link?: string;
}

const EventDetailDialog = ({
  open,
  onOpenChange,
  title,
  image,
  startDate,
  endDate,
  details,
  link,
}: EventDetailDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);
  const [adWatched, setAdWatched] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);
  const status = getEventStatus(startDate, endDate);
  const { isPremium } = useAuth();
  const navigate = useNavigate();

  const copyBannerLink = async () => {
    if (!isPremium) {
      toast.error("Premium feature", {
        description: "Upgrade to Premium to copy banner links!",
        action: {
          label: "Upgrade",
          onClick: () => {
            onOpenChange(false);
            navigate("/pricing");
          }
        }
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(image);
      setCopied(true);
      toast.success("Banner link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  const downloadWithWatermark = async () => {
    setIsDownloading(true);
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = image;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      
      ctx.drawImage(img, 0, 0);
      
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = `bold ${Math.max(img.width / 15, 24)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText("LEAKS OF FF", canvas.width / 2, canvas.height / 2);
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `${title || "banner"}_leaksofff.png`;
      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.click();
      
      toast.success("Banner downloaded with watermark!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download. Try copying the link instead.");
    }
    setIsDownloading(false);
  };

  const downloadWithoutWatermark = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.download = `${title || "banner"}.png`;
      downloadLink.href = url;
      downloadLink.click();
      URL.revokeObjectURL(url);
      toast.success("Banner downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download");
    }
    setIsDownloading(false);
  };

  const watchAd = () => {
    setWatchingAd(true);
    setAdCountdown(7);
    toast.info("Please wait while watching ad...");
    
    setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.log("AdSense error:", e);
      }
    }, 100);
    
    const interval = setInterval(() => {
      setAdCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setWatchingAd(false);
          setAdWatched(true);
          toast.success("Ad completed! You can now download without watermark.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setAdWatched(false);
    }}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border-border/50 bg-card [&>button]:hidden">
        {/* Banner Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted/50">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/700x400?text=Event";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 -mt-8 relative">
          <DialogHeader className="p-0 space-y-0">
            <DialogTitle className="text-xl font-semibold text-foreground leading-tight">
              {title || "Untitled Event"}
            </DialogTitle>
          </DialogHeader>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="p-1.5 rounded-lg bg-primary/20">
                <CalendarClock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Start</p>
                <p className="text-sm font-medium text-foreground">{startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <div className="p-1.5 rounded-lg bg-primary/20">
                <CalendarCheck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">End</p>
                <p className="text-sm font-medium text-foreground">{endDate}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          {details && (
            <div className="p-3 rounded-xl bg-secondary/30 border border-border/50">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Details</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{details}</p>
            </div>
          )}

          {/* Download Options */}
          <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Download Banner</p>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadWithWatermark}
              disabled={isDownloading}
              className="w-full gap-2 rounded-xl border-border/50"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download with Watermark (Free)
            </Button>
            
            {!adWatched ? (
              watchingAd ? (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-primary font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Watching Ad...
                  </div>
                  
                  <div className="w-full min-h-[100px] bg-secondary/50 rounded-lg flex items-center justify-center overflow-hidden">
                    <ins
                      className="adsbygoogle"
                      style={{ display: "block", width: "100%", height: "100px" }}
                      data-ad-client="ca-pub-6771046263927846"
                      data-ad-slot="auto"
                      data-ad-format="auto"
                      data-full-width-responsive="true"
                    />
                  </div>
                  
                  <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-linear"
                      style={{ width: `${((7 - adCountdown) / 7) * 100}%` }}
                    />
                  </div>
                  <p className="text-2xl font-bold text-primary">{adCountdown}s</p>
                  <p className="text-xs text-muted-foreground">Please wait for the ad to complete</p>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={watchAd}
                  className="w-full gap-2 rounded-xl"
                >
                  <Play className="w-4 h-4" />
                  Watch Ad to Download Without Watermark
                </Button>
              )
            ) : (
              <Button
                size="sm"
                onClick={downloadWithoutWatermark}
                disabled={isDownloading}
                className="w-full gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80"
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Download Without Watermark
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={copyBannerLink}
              className={`gap-1.5 flex-1 rounded-xl border-border/50 ${!isPremium ? "opacity-70" : ""}`}
            >
              {isPremium ? (
                copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {copied ? "Copied" : isPremium ? "Copy Banner" : (
                <span className="flex items-center gap-1">
                  Copy Banner
                  <Crown className="w-3 h-3 text-primary" />
                </span>
              )}
            </Button>

            {link && (
              <Button
                size="sm"
                onClick={() => window.open(link, "_blank")}
                className="gap-1.5 flex-1 rounded-xl"
              >
                <ExternalLink className="w-4 h-4" />
                Open Link
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
