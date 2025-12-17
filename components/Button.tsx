import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden font-medium rounded-2xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 py-4 px-6 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-500 hover:to-indigo-500",
    secondary: "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/5 shadow-none"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};