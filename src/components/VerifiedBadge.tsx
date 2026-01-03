import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

const VerifiedBadge = ({ size = "md", showTooltip = true }: VerifiedBadgeProps) => {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const badge = (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      className="inline-flex"
    >
      <BadgeCheck 
        className={`${sizeClasses[size]} text-primary fill-primary/20`}
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
        <p className="text-xs">Premium Verified</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default VerifiedBadge;
