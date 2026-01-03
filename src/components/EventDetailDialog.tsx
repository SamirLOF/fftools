import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check, CalendarClock, CalendarCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "./StatusBadge";
import { getEventStatus } from "@/services/eventApi";

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
  const status = getEventStatus(startDate, endDate);

  const copyBannerLink = async () => {
    try {
      await navigator.clipboard.writeText(image);
      setCopied(true);
      toast.success("Banner link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden [&>button]:hidden">
        {/* Banner Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/700x400?text=Event";
            }}
          />
          <div className="absolute top-3 left-3">
            <StatusBadge status={status} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <DialogHeader className="p-0 space-y-0">
            <DialogTitle className="text-xl font-semibold text-foreground leading-tight">
              {title || "Untitled Event"}
            </DialogTitle>
          </DialogHeader>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50 border border-border">
              <CalendarClock className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Start Date</p>
                <p className="text-sm font-medium text-foreground">{startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50 border border-border">
              <CalendarCheck className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">End Date</p>
                <p className="text-sm font-medium text-foreground">{endDate}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          {details && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Details</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{details}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={copyBannerLink}
              className="gap-1.5 flex-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy Banner"}
            </Button>

            {link && (
              <Button
                size="sm"
                onClick={() => window.open(link, "_blank")}
                className="gap-1.5 flex-1"
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
