import { Zap, Globe, History } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-lg gold-gradient shadow-lg group-hover:scale-105 transition-transform">
              <Zap className="w-7 h-7 text-primary-foreground" />
              <div className="absolute inset-0 rounded-lg gold-gradient opacity-50 blur-lg group-hover:opacity-75 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-display tracking-wider gold-text leading-none">
                FREE FIRE
              </h1>
              <span className="text-xs font-semibold text-muted-foreground tracking-[0.3em] uppercase">
                Events Tracker
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={!isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className="gap-2 font-semibold text-base h-10 px-4"
              >
                <Zap className="w-4 h-4" />
                Events
              </Button>
            </Link>
            <Link to="/history">
              <Button
                variant={isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className="gap-2 font-semibold text-base h-10 px-4"
              >
                <History className="w-4 h-4" />
                Archive
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Nav */}
          <div className="flex sm:hidden gap-1">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Zap className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost" size="icon">
                <History className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-[140px] sm:w-[180px] bg-secondary/50 border-border/50 hover:bg-secondary hover:border-primary/30 transition-all font-semibold">
              <Globe className="w-4 h-4 mr-2 text-primary" />
              <SelectValue>
                {selectedRegionData
                  ? `${selectedRegionData.code}`
                  : "Region"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50">
              {regions.map((region) => (
                <SelectItem
                  key={region.code}
                  value={region.code}
                  className="hover:bg-primary/10 cursor-pointer font-medium"
                >
                  <span className="text-primary font-bold">{region.code}</span>
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
