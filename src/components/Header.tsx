import { Calendar, Globe, Archive } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              FF Events
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={!isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className="gap-2 h-8"
              >
                <Calendar className="w-4 h-4" />
                Events
              </Button>
            </Link>
            <Link to="/history">
              <Button
                variant={isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className="gap-2 h-8"
              >
                <Archive className="w-4 h-4" />
                Archive
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Nav */}
          <div className="flex sm:hidden gap-1">
            <Link to="/">
              <Button variant={!isHistoryPage ? "secondary" : "ghost"} size="icon" className="h-8 w-8">
                <Calendar className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/history">
              <Button variant={isHistoryPage ? "secondary" : "ghost"} size="icon" className="h-8 w-8">
                <Archive className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-[120px] sm:w-[150px] h-8">
              <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue>
                {selectedRegionData?.code || "Region"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem
                  key={region.code}
                  value={region.code}
                >
                  <span className="font-medium">{region.code}</span>
                  <span className="text-muted-foreground ml-2">— {region.name}</span>
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
