import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  style?: React.CSSProperties;
}

function Card({ children, title, style }: CardProps) {
  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      ...style,
    }}>
      {title && <h3 style={{ marginBottom: '1rem' }}>{title}</h3>}
      {children}
    </div>
  );
}

export default Card;