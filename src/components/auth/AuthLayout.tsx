import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-luxury overflow-hidden relative">
      {/* Luxury Background Layers */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background/98 to-muted/3" />
      
      {/* Sophisticated Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.8) 1px, transparent 0),
            radial-gradient(circle at 20px 20px, hsl(var(--secondary) / 0.4) 1px, transparent 0)
          `,
          backgroundSize: '60px 60px, 40px 40px'
        }}
      />
      
      {/* Premium Ambient Lights */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-secondary/4 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="fixed top-1/3 right-1/6 w-64 h-64 bg-primary/3 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Luxury Content Container */}
      <div className="relative z-10 animate-fade-in">
        {children}
      </div>
    </div>
  );
};