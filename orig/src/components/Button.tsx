import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center font-medium transition-all duration-300 overflow-hidden group",
        "active:scale-[0.98]",
        {
          'bg-quantum-amber text-quantum-emerald hover:bg-quantum-amber/90 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]': variant === 'primary',
          'bg-quantum-rose text-quantum-emerald hover:bg-quantum-rose/90 shadow-[0_10px_20px_rgba(0,0,0,0.2)]': variant === 'secondary',
          'bg-transparent border border-quantum-rose text-quantum-rose hover:border-quantum-amber hover:text-quantum-amber': variant === 'outline',
          'px-4 py-2 text-sm rounded-lg': size === 'sm',
          'px-8 py-4 text-base rounded-xl': size === 'md',
          'px-12 py-5 text-lg rounded-2xl w-full md:w-auto': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {/* Hover glow effect */}
      <span className="absolute inset-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-inherit"></span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
