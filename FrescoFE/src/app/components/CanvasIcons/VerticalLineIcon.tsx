import React from 'react';

export function VerticalLineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="2"
      height="18px"
      viewBox="0 0 1 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 0H1V24H0V0Z" fill="currentColor" />
    </svg>
  );
}
