import React from 'react';

export function ShapesIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M15,9 L15,21 L3,21 L3,9 L15,9 Z M15,2 C18.8659932,2 22,5.13400675 22,9 C22,12.5261219 19.3928118,15.4433024 16.0010101,15.9289666 L16,8 L8.07089004,8 C8.55612324,4.60770164 11.4735309,2 15,2 Z"
        fill="currentColor"
      />
    </svg>
  );
}
