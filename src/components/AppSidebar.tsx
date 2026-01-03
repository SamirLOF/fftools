import { Calendar, Info, CreditCard, Sparkles, Menu, LogIn } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { title: "Events", url: "/", icon: Calendar },
  { title: "Explore Tools", url: "/tools", icon: Sparkles },
  { title: "About", url: "/about", icon: Info },
  { title: "Pricing", url: "/pricing", icon: CreditCard },
  { title: "Login", url: "/login", icon: LogIn },
];

const AppSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-3 left-3 z-50 lg:hidden h-9 w-9 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50"
      >
        <Menu className="w-4 h-4" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-card/50 backdrop-blur-xl border-r border-border/50 transition-transform duration-300 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8 px-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground tracking-tight">
                FF Events
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Game Tracker</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/15 text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive && "text-primary")} />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground text-center">
              Credit <span className="text-primary font-medium">LEAKS OF FF</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;