import type { ReactNode } from "react";
import "./Card.css";

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

function Card({ children, title, className = "" }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </div>
  );
}

export default Card;