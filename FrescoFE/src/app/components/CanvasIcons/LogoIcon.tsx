import React from 'react';

export function LogoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 15 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        y="11.3137"
        width="16"
        height="4"
        rx="2"
        transform="rotate(-45 0 11.3137)"
        fill="currentColor"
      />
      <rect
        x="4.24261"
        y="15.5564"
        width="10"
        height="4"
        rx="2"
        transform="rotate(-45 4.24261 15.5564)"
        fill="currentColor"
      />
      <rect
        x="8.48529"
        y="19.799"
        width="4"
        height="4"
        rx="2"
        transform="rotate(-45 8.48529 19.799)"
        fill="currentColor"
      />
    </svg>
  );
}
