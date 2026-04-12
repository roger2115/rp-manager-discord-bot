import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all transform hover:scale-105';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg shadow-primary-500/30',
    secondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-500 hover:to-secondary-600 text-white shadow-lg shadow-secondary-500/30',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
