import React from 'react';

export function RectangleShapeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21,3 L21,21 L3,21 L3,3 L21,3 Z M19,5 L5,5 L5,19 L19,19 L19,5 Z"
        fill="currentColor"
      />
    </svg>
  );
}
