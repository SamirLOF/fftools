import { Hexagon, Globe, Archive, Sparkles } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/90 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg cursed-gradient group-hover:scale-110 transition-transform">
              <Hexagon className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-display tracking-wider infinity-text leading-none">
                FF EVENTS
              </h1>
              <span className="text-[10px] font-bold text-muted-foreground tracking-widest">
                JJK STYLE
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={!isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className={`gap-2 font-bold h-8 px-3 text-sm ${!isHistoryPage ? 'bg-primary/20 text-primary border border-primary/30' : ''}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Events
              </Button>
            </Link>
            <Link to="/history">
              <Button
                variant={isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className={`gap-2 font-bold h-8 px-3 text-sm ${isHistoryPage ? 'bg-secondary/20 text-secondary border border-secondary/30' : ''}`}
              >
                <Archive className="w-3.5 h-3.5" />
                Archive
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Nav */}
          <div className="flex sm:hidden gap-1">
            <Link to="/">
              <Button variant="ghost" size="icon" className={`h-8 w-8 ${!isHistoryPage ? 'text-primary' : ''}`}>
                <Sparkles className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost" size="icon" className={`h-8 w-8 ${isHistoryPage ? 'text-secondary' : ''}`}>
                <Archive className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-[110px] sm:w-[140px] h-8 bg-muted/50 border-primary/30 hover:bg-muted hover:border-primary/50 transition-all font-bold text-sm">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <SelectValue>
                {selectedRegionData?.code || "Region"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-xl border-primary/30">
              {regions.map((region) => (
                <SelectItem
                  key={region.code}
                  value={region.code}
                  className="hover:bg-primary/10 cursor-pointer font-semibold text-sm"
                >
                  <span className="text-primary font-bold">{region.code}</span>
                  <span className="text-muted-foreground ml-1.5">— {region.name}</span>
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
