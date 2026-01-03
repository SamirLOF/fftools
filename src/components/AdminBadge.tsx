import { motion } from "framer-motion";
import { Shield, BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminBadgeProps {
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  isPremium?: boolean;
}

const AdminBadge = ({ size = "md", showTooltip = true, isPremium = false }: AdminBadgeProps) => {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const containerSizeClasses = {
    sm: "gap-0.5",
    md: "gap-1",
    lg: "gap-1.5",
  };

  const badge = (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className={`inline-flex items-center ${containerSizeClasses[size]}`}
    >
      {isPremium && (
        <BadgeCheck 
          className={`${sizeClasses[size]} text-primary fill-primary/20`}
        />
      )}
      <Shield 
        className={`${sizeClasses[size]} text-amber-500 fill-amber-500/20`}
      />
    </motion.div>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">
          {isPremium ? "Premium Admin" : "Administrator"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AdminBadge;
