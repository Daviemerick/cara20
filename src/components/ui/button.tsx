import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-smooth",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-smooth",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-smooth",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-smooth",
        link: "text-primary underline-offset-4 hover:underline transition-smooth",
        premium: "btn-premium text-primary-foreground font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98]",
        luxury: "btn-secondary text-secondary-foreground font-bold tracking-tight hover:scale-[1.02] active:scale-[0.98]",
        glass: "glass-card text-foreground hover:bg-glass-hover border border-glass-border backdrop-blur-xl transition-elegant",
        gradient: "bg-gradient-to-r from-primary via-primary/80 to-secondary/20 text-primary-foreground font-bold tracking-tight hover:from-primary/90 hover:via-primary/70 hover:to-secondary/30 glow-primary transition-premium",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 py-2 text-xs",
        lg: "h-14 rounded-xl px-8 py-4 text-base",
        xl: "h-16 rounded-2xl px-10 py-5 text-lg",
        icon: "h-12 w-12",
        "icon-sm": "h-10 w-10",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
