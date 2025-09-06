import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background border border-foreground hover:bg-transparent hover:text-foreground transition-all duration-300",
        primary: "bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary transition-all duration-300",
        emphasize: "bg-[#b62ad4] text-foreground border-[1.5px] border-[#b62ad4] hover:bg-transparent hover:text-[#b62ad4] transition-all duration-300",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        glowRed: 
          "border-red-100 transition-shadow hover:shadow-[inset_0_0_50px_#ffffff22,inset_20px_0_80px_#ff0000dd,inset_20px_0_300px_#ffcc0022,inset_-20px_0_300px_#ff000022,inset_-20px_0_80px_#ffcc00dd,0_0_50px_#ffffff22,-10px_0_30px_#ff0000dd,10px_0_30px_#ffcc00dd]",
        glowBlue: 
          "transition-shadow hover:shadow-[inset_0_0_50px_#ffffff22,inset_20px_0_80px_#0000ffdd,inset_20px_0_300px_#8A2BE222,inset_-20px_0_300px_#0000ff22,inset_-20px_0_80px_#8A2BE2dd,0_0_50px_#ffffff22,-10px_0_30px_#0000ffdd,10px_0_30px_#8A2BE2dd]",
        glowGreen: 
          "transition-shadow hover:shadow-[inset_0_0_50px_#ffffff22,inset_20px_0_80px_#008000dd,inset_20px_0_300px_#90EE9022,inset_-20px_0_300px_#00800022,inset_-20px_0_80px_#90EE90dd,0_0_50px_#ffffff22,-10px_0_30px_#008000dd,10px_0_30px_#90EE90dd]",
        glowWhite: 
          "transition-shadow hover:shadow-[inset_0_0_50px_#ffffff22,inset_20px_0_80px_#ffffff20,inset_20px_0_300px_#ffffff11,inset_-20px_0_300px_#ffffff20,inset_-20px_0_80px_#ffffffcc,0_0_50px_#ffffff11,-10px_0_30px_#ffffffdd,10px_0_30px_#ffffffcc]",
        },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
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
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
