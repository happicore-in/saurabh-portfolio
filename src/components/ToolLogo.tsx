import React from 'react';

interface ToolLogoProps {
  name: string;
  className?: string;
  size?: number;
}

export const ToolLogo: React.FC<ToolLogoProps> = ({ name, className = 'w-6 h-6', size }) => {
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Figma
  if (normalized.includes('figma')) {
    return (
      <svg
        viewBox="0 0 38 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
      </svg>
    );
  }

  // Canva
  if (normalized.includes('canva')) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <defs>
          <linearGradient id="canva_comp_grad" x1="10%" y1="10%" x2="90%" y2="90%">
            <stop offset="0%" stopColor="#00C4CC"/>
            <stop offset="50%" stopColor="#2D72D9"/>
            <stop offset="100%" stopColor="#7D2AE8"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#canva_comp_grad)"/>
        <path d="M60.8 28.5c-4.2 0-8.5 2.1-12.4 5.9-6.4 6.3-10.4 15.6-10.4 24.3 0 8.8 4.6 14.1 11.5 14.1 8.8 0 14.2-6.5 14.2-7.1 0-.5-.4-.9-.9-.9-.3 0-.6.1-.8.3-4.2 5.1-9.2 6.5-12.2 6.5-5.6 0-9.2-4.1-9.2-11.7 0-9.4 5.8-21.6 13.9-27.1 3.2-2.1 6.1-2.7 8.3-2.7 4.2 0 6.6 2.3 6.6 5.8 0 3.7-2.6 8.5-7.5 14.3-.4.5-.3 1.1.2 1.5.5.4 1.1.3 1.5-.2 5.3-6.3 8.3-11.8 8.3-16.1-.1-4.7-3.5-7.8-10.6-6.7z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Adobe Premiere Pro
  if (normalized.includes('premiere') || normalized === 'pr') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <rect width="100" height="100" rx="22" fill="#00005B"/>
        <text
          x="50%"
          y="67%"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="50"
          fontWeight="800"
          fill="#9999FF"
          textAnchor="middle"
          letterSpacing="-1.5"
        >
          Pr
        </text>
      </svg>
    );
  }

  // CapCut
  if (normalized.includes('capcut') || normalized.includes('capcaut')) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <rect width="100" height="100" rx="22" fill="#000000"/>
        <path d="M22 35C22 32.7909 23.7909 31 26 31H68C71.3 31 73 35.1 70.7 37.5L53.5 54H26C23.7909 54 22 52.2091 22 50V35Z" fill="#FFFFFF"/>
        <path d="M78 65C78 67.2091 76.2091 69 74 69H32C28.7 69 27 64.9 29.3 62.5L46.5 46H74C76.2091 46 78 47.7909 78 50V65Z" fill="#FFFFFF"/>
      </svg>
    );
  }

  // Adobe Photoshop
  if (normalized.includes('photoshop') || normalized === 'ps') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <rect width="100" height="100" rx="22" fill="#001E36"/>
        <text
          x="50%"
          y="67%"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="50"
          fontWeight="800"
          fill="#31A8FF"
          textAnchor="middle"
          letterSpacing="-1.5"
        >
          Ps
        </text>
      </svg>
    );
  }

  // Alight Motion
  if (normalized.includes('alight') || normalized.includes('alightmotion')) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <rect width="100" height="100" rx="22" fill="#131927"/>
        <path d="M50 18C67.6731 18 82 32.3269 82 50C82 52.7614 79.7614 55 77 55C74.2386 55 72 52.7614 72 50C72 37.8497 62.1503 28 50 28C37.8497 28 28 37.8497 28 50C28 62.1503 37.8497 72 50 72C52.7614 72 55 74.2386 55 77C55 79.7614 52.7614 82 50 82C32.3269 82 18 67.6731 18 50C18 32.3269 32.3269 18 50 18Z" fill="#00FFA3"/>
        <path d="M50 34C58.8366 34 66 41.1634 66 50C66 52.7614 63.7614 55 61 55C58.2386 55 56 52.7614 56 50C56 46.6863 53.3137 44 50 44C46.6863 44 44 46.6863 44 50C44 53.3137 46.6863 56 50 56C52.7614 56 55 58.2386 55 61C55 63.7614 52.7614 66 50 66C41.1634 66 34 58.8366 34 50C34 41.1634 41.1634 34 50 34Z" fill="#00FFA3" opacity="0.9"/>
        <circle cx="50" cy="73" r="3" fill="#00FFA3"/>
      </svg>
    );
  }

  // HTML5
  if (normalized.includes('html')) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <path d="M22 6h4.5v4.2h3.5V6h4.5v12h-4.5v-4.5h-3.5V18H22V6zm14 0h12v3.4h-3.8V18h-4.4V9.4H36V6zm14 0h4.2l3.4 5.6 3.4-5.6h4.2V18h-4V11.2l-3.6 5.8h-0.2L48 11.2V18h-4V6zm18 0h4.4v8.6h5.8V18H68V6z" fill="#E34F26"/>
        <path d="M16 22l6.8 68 27.2 7.5 27.2-7.5L84 22H16z" fill="#E34F26"/>
        <path d="M50 93.8l23.5-6.5L79.6 28H50v65.8z" fill="#EF652A"/>
        <path d="M50 41.5h12.8l-.9 10.5H50v8.6h11.2l-1 11.5-10.2 2.8v9l17.7-4.9.4-4.5 2-22.5.3-3.6.6-6.9H50v-0.5z" fill="#FFFFFF"/>
        <path d="M50 41.5H37.2l.3 3.6.6 6.9H50v-8.6H38.2l.8 9.3 11 3v-8.9l-.3.1-6.1-1.6-.4-4.5H50v-4.2z" fill="#EBEBEB"/>
        <path d="M50 50.6v8.6H38.5l.8 9.3 10.7 3v8.9l-17.7-4.9-1.2-13.8-.3-3.4-.6-6.9-.3-3.4h20.1v2.6z" fill="#EBEBEB"/>
      </svg>
    );
  }

  // CSS3 / Tailwind
  if (normalized.includes('css')) {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <path d="M25 6h12v3.6h-7.8v2.4h7.8V18H25v-3.6h7.8V12H25V6zm15 0h12v3.6h-7.8v2.4h7.8V18H40v-3.6h7.8V12H40V6zm15 0h12v3.6h-7.8v2.4h7.8V18H55v-3.6h7.8V12H55V6z" fill="#1572B6"/>
        <path d="M16 22l6.8 68 27.2 7.5 27.2-7.5L84 22H16z" fill="#1572B6"/>
        <path d="M50 93.8l23.5-6.5L79.6 28H50v65.8z" fill="#33A9DC"/>
        <path d="M50 41.5h12.8l-.9 10.5H50v8.6h11.2l-1 11.5-10.2 2.8v9l17.7-4.9.4-4.5 2-22.5.3-3.6.6-6.9H50v-0.5z" fill="#FFFFFF"/>
        <path d="M50 41.5H37.2l.3 3.6.6 6.9H50v-8.6H38.2l.4 4.5H50v-4.2z" fill="#EBEBEB"/>
        <path d="M50 60.6v8.6h-5.9l-.4-4.5h-8.9l.8 9.3 14.4 3.9v8.9l-17.7-4.9-.7-8.4-.5-5.4-.3-3.4h19.2v-4.1z" fill="#EBEBEB"/>
      </svg>
    );
  }

  // JavaScript
  if (normalized.includes('javascript') || normalized === 'js') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
      >
        <path d="M36 6h4.5v8.5c0 2-1.5 3-3.6 3h-2.5v-3.5h1.8c.6 0 .8-.3.8-.8V6zm11 0h12v3.6h-7.8v2.4h7.8V18H47v-3.6h7.8V12H47V6z" fill="#E5A228"/>
        <path d="M16 22l6.8 68 27.2 7.5 27.2-7.5L84 22H16z" fill="#E5A228"/>
        <path d="M50 93.8l23.5-6.5L79.6 28H50v65.8z" fill="#F7DF1E"/>
        <path d="M37 68.5c1.4.9 3.2 1.5 5.1 1.5 3 0 4.9-1.5 4.9-4.2v-17h-5.2v16.8c0 1.2-.5 1.7-1.4 1.7-.8 0-1.7-.4-2.2-.8l-1.2 2z" fill="#000000"/>
        <path d="M53 65.6c1.6 1 3.7 1.7 5.8 1.7 3.5 0 5.4-1.7 5.4-4.1 0-2.3-1.4-3.5-4.5-4.7-4-1.5-6.5-3.6-6.5-7.3 0-4.1 3.4-7.1 8.6-7.1 2.4 0 4.2.6 5.5 1.3l-1.3 3.6c-1-.6-2.5-1.1-4.3-1.1-3 0-4.6 1.6-4.6 3.4 0 2.1 1.4 3.1 4.7 4.4 4.3 1.7 6.4 3.8 6.4 7.6 0 4.4-3.4 7.4-9.3 7.4-2.7 0-5.1-.8-6.6-1.7l1.4-3.8z" fill="#000000"/>
      </svg>
    );
  }

  // Fallback
  return (
    <span className="font-mono text-sm font-bold text-white uppercase">
      {name.slice(0, 2)}
    </span>
  );
};
