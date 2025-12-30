import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg'; // Add this line
}

function Button({ children, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const baseStyle = {
    border: 'none',
    borderRadius: '0.25rem',
    cursor: 'pointer',
  };

  const variants = {
    primary: {
      backgroundColor: '#4f46e5',
      color: 'white',
    },
    secondary: {
      backgroundColor: '#6b7280',
      color: 'white',
    },
    danger: {
      backgroundColor: '#dc2626',
      color: 'white',
    },
    success: {
      backgroundColor: '#10b981',
      color: 'white',
    },
  };

  const sizeStyles = {
    sm: {
      padding: '0.3rem 0.6rem',
      fontSize: '0.8rem',
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
    },
    lg: {
      padding: '0.7rem 1.4rem',
      fontSize: '1.2rem',
    },
  };

  return (
    <button 
      style={{ ...baseStyle, ...variants[variant], ...sizeStyles[size] }}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;