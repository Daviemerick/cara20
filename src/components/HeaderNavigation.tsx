import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard,
  BarChart3,
  Users,
  Calendar,
  Settings,
  LogOut,
  Crown
} from "lucide-react";
import nexusLogoFull from "@/assets/nexus-logo-full.png";

const HeaderNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard"
    },
    { 
      path: "/analise", 
      label: "Análise", 
      icon: BarChart3,
      active: location.pathname === "/analise"
    },
    { 
      path: "/clients", 
      label: "Clientes", 
      icon: Users,
      active: location.pathname === "/clients"
    },
    { 
      path: "/calendar", 
      label: "Calendário", 
      icon: Calendar,
      active: location.pathname === "/calendar"
    },
    { 
      path: "/settings", 
      label: "Configurações", 
      icon: Settings,
      active: location.pathname === "/settings"
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/30">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative">
              <img src={nexusLogoFull} alt="NEXUS Intelligence" className="h-24 w-auto object-contain" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={item.active ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={`h-10 px-4 hover:bg-transparent hover:text-inherit ${item.active ? '!bg-primary !text-black' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="h-10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNavigation;