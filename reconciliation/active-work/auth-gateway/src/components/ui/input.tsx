import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  name: string
  type?: string
  placeholder: string
  required?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, children, ...props }, ref) => {
    return (
      <div className={cn("relative group flex", className)}>
        <input
          type={type}
          className="flex h-14 w-full rounded-md border border-input bg-background/50 px-2.5 pt-1.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-hidden focus:ring-0 peer focus-visible:shadow-[0_0_10px_2px_#ffffff]"
          ref={ref}
          {...props}
          placeholder=""
        />
        <label
          htmlFor={props.name}
          className={`absolute text-md text-font duration-200 transform 
                    -translate-y-[120%] -translate-x-1 scale-[.68] top-1/2 z-10 origin-[0] left-3 
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:-translate-x-0
                    peer-focus:scale-[.70] peer-focus:-translate-y-[125%] px-1 pointer-events-none text-foreground/50 peer-focus:text-foreground peer-focus:-translate-x-1`}
        >
          {props.placeholder}
        </label>
        {children}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
