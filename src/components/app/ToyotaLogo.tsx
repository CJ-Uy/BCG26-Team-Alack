"use client";

export function ToyotaLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse
        cx="50"
        cy="35"
        rx="48"
        ry="33"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <ellipse
        cx="50"
        cy="35"
        rx="20"
        ry="33"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <line
        x1="2"
        y1="35"
        x2="98"
        y2="35"
        stroke="currentColor"
        strokeWidth="3.5"
      />
    </svg>
  );
}
