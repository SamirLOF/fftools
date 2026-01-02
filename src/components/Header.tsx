import { Flame, Globe, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const regions = [
  { code: "SG", name: "Singapore" },
  { code: "BD", name: "Bangladesh" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "TH", name: "Thailand" },
  { code: "VN", name: "Vietnam" },
  { code: "BR", name: "Brazil" },
];

interface HeaderProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const Header = ({ selectedRegion, onRegionChange }: HeaderProps) => {
  const selectedRegionData = regions.find((r) => r.code === selectedRegion);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg fire-gradient">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold fire-text">Free Fire Events</h1>
        </div>

        <Select value={selectedRegion} onValueChange={onRegionChange}>
          <SelectTrigger className="w-[180px] bg-secondary border-border hover:bg-muted transition-colors">
            <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue>
              {selectedRegionData
                ? `${selectedRegionData.code} - ${selectedRegionData.name}`
                : "Select Region"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {regions.map((region) => (
              <SelectItem
                key={region.code}
                value={region.code}
                className="hover:bg-muted cursor-pointer"
              >
                {region.code} - {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default Header;
