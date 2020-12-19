import React from 'react';

export function PlusSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 0H24V24H0V0Z" fill="#D8D8D8" />
      <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
    </svg>
  );
}
