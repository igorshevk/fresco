import React from 'react';

export function BorderStyleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray="3 3"
      />
    </svg>
  );
}
