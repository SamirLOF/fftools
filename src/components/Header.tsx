import { Flame, Globe, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { regions } from "@/services/eventApi";

interface HeaderProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const Header = ({ selectedRegion, onRegionChange }: HeaderProps) => {
  const location = useLocation();
  const selectedRegionData = regions.find((r) => r.code === selectedRegion);
  const isHistoryPage = location.pathname === "/history";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg fire-gradient">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold fire-text">Free Fire Events</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-2">
            <Link to="/history">
              <Button
                variant={isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <History className="w-4 h-4" />
                History
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile History Link */}
          <Link to="/history" className="sm:hidden">
            <Button variant="ghost" size="icon">
              <History className="w-5 h-5" />
            </Button>
          </Link>

          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-[160px] sm:w-[180px] bg-secondary border-border hover:bg-muted transition-colors">
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
      </div>
    </header>
  );
};

export default Header;
