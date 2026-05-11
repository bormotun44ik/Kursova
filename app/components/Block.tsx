import type { ReactNode } from "react";

export default function Block({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bl-block ${className}`} data-label={label}>
      {children}
    </div>
  );
}
