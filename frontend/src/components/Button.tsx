'use client';

import { cn } from "@/lib/utils";

interface ButtonProps {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button = ({ className, disabled= false, onClick, children }: ButtonProps) => {
  return (
    <button
      className={cn(
        "px-10 py-3 rounded-xl font-semibold text-white text-lg transition-all",
        "bg-green-700 hover:bg-green-600 active:bg-green-800",
        "shadow-md hover:shadow-lg active:shadow-sm",
        "disabled:bg-gray-400 disabled:cursor-not-allowed",
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
