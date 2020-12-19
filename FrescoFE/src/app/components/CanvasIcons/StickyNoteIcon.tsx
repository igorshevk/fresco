import React from 'react';

export function StickyNoteIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M19,3 L4.99,3 C3.89,3 3,3.9 3,5 L3.01,19 C3.01,20.1 3.9,21 5,21 L15,21 L21,15 L21,5 C21,3.9 20.1,3 19,3 Z M14,19.5 L14,14 L19.5,14 L14,19.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}
