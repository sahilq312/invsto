import React from 'react';

interface BackgroundSVGProps {
  isDarkMode: boolean;
}

const BackgroundSVG: React.FC<BackgroundSVGProps> = ({ isDarkMode }) => {
  const fillColor = isDarkMode ? '#293356' : '#F1F5FE';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1920"
      height="459"
      className="absolute top-0 left-0 w-full h-auto"
      preserveAspectRatio="xMidYMid slice"
      style={{ zIndex: 0, transition: 'fill 0.3s ease' }}
    >
      <path
        fill={fillColor}
        fillRule="evenodd"
        d="M0 0h2440v449H191.5C85.737 449 0 363.263 0 257.5V0z"
      />
    </svg>
  );
};

export default BackgroundSVG;