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
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-lg cursed-gradient cursed-glow group-hover:scale-110 transition-transform">
              <Hexagon className="w-7 h-7 text-white" />
              <div className="absolute inset-0 rounded-lg cursed-gradient opacity-60 blur-xl group-hover:opacity-80 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-display tracking-wider infinity-text leading-none">
                JUJUTSU
              </h1>
              <span className="text-xs font-bold text-muted-foreground tracking-[0.25em] uppercase">
                Event Tracker
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={!isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className={`gap-2 font-bold text-base h-10 px-4 ${!isHistoryPage ? 'bg-primary/20 text-primary border border-primary/30' : ''}`}
              >
                <Sparkles className="w-4 h-4" />
                Events
              </Button>
            </Link>
            <Link to="/history">
              <Button
                variant={isHistoryPage ? "secondary" : "ghost"}
                size="sm"
                className={`gap-2 font-bold text-base h-10 px-4 ${isHistoryPage ? 'bg-secondary/20 text-secondary border border-secondary/30' : ''}`}
              >
                <Archive className="w-4 h-4" />
                Archive
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Nav */}
          <div className="flex sm:hidden gap-1">
            <Link to="/">
              <Button variant="ghost" size="icon" className={!isHistoryPage ? 'text-primary' : ''}>
                <Sparkles className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost" size="icon" className={isHistoryPage ? 'text-secondary' : ''}>
                <Archive className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <Select value={selectedRegion} onValueChange={onRegionChange}>
            <SelectTrigger className="w-[140px] sm:w-[180px] bg-muted/50 border-primary/30 hover:bg-muted hover:border-primary/50 transition-all font-bold">
              <Globe className="w-4 h-4 mr-2 text-primary" />
              <SelectValue>
                {selectedRegionData
                  ? `${selectedRegionData.code}`
                  : "Region"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-popover/95 backdrop-blur-xl border-primary/30">
              {regions.map((region) => (
                <SelectItem
                  key={region.code}
                  value={region.code}
                  className="hover:bg-primary/10 cursor-pointer font-semibold"
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
