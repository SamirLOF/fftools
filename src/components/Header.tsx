import { Calendar, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regions } from "@/services/eventApi";

interface HeaderProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const Header = ({ selectedRegion, onRegionChange }: HeaderProps) => {
  const selectedRegionData = regions.find((r) => r.code === selectedRegion);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-lg font-semibold text-foreground tracking-tight">
            FF Events
          </span>
        </Link>

        <Select value={selectedRegion} onValueChange={onRegionChange}>
          <SelectTrigger className="w-[130px] sm:w-[160px] h-9 bg-secondary/50 border-border/50 rounded-xl">
            <Globe className="w-4 h-4 mr-2 text-primary" />
            <SelectValue>
              {selectedRegionData?.code || "Region"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50">
            {regions.map((region) => (
              <SelectItem
                key={region.code}
                value={region.code}
                className="rounded-lg"
              >
                <span className="font-medium">{region.code}</span>
                <span className="text-muted-foreground ml-2">— {region.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default Header;
