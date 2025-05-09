import { cn } from "@/lib/utils";
import React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    function Input({ className, type, ...props }, ref) {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs rounded-lg px-2.5 py-2 placeholder:text-xs placeholder:text-gray-500 shadow-sm focus:ring-offset-1 focus:ring-[3px] focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-85",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";
