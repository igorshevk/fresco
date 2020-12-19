import React from 'react';

export function TriangleShapeIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M12,2 L22,22 L2,22 L12,2 Z M12,6.471 L5.235,20 L18.764,20 L12,6.471 Z"
        fill="currentColor"
      />
    </svg>
  );
}
