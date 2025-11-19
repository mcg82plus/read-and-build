import React from 'react';
import { AvatarConfig } from '../types';

interface AvatarProps {
  config: AvatarConfig;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ config, className }) => {
  const { skinColor, hairColor, shirtColor, style } = config;

  return (
    <svg
      viewBox="0 0 100 200"
      className={`w-full h-full drop-shadow-xl ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* --- BACK HAIR LAYER (Rendered behind body) --- */}
      {style === 2 && (
        // Pigtails Back Parts - Voluminous and bouncy
        <g>
          <path d="M15 40 C-5 55 -5 85 15 95 C25 100 35 85 28 50" fill={hairColor} />
          <path d="M85 40 C105 55 105 85 85 95 C75 100 65 85 72 50" fill={hairColor} />
        </g>
      )}
      {style === 3 && (
        // Long Hair Back Part - Flowing and Wavy
        <path 
          d="M15 40 C10 60 5 100 10 130 C12 145 25 150 30 135 L30 50 L70 50 L70 135 C75 150 88 145 90 130 C95 100 90 60 85 40 Z" 
          fill={hairColor} 
        />
      )}

      {/* --- BODY LAYER --- */}
      
      {/* Legs/Pants */}
      <rect x="32" y="130" width="16" height="60" rx="4" fill="#2c3e50" />
      <rect x="52" y="130" width="16" height="60" rx="4" fill="#2c3e50" />
      
      {/* Shoes */}
      <path d="M30 190 H48 V195 A5 5 0 0 1 43 200 H35 A5 5 0 0 1 30 195 Z" fill="#333" />
      <path d="M52 190 H70 V195 A5 5 0 0 1 65 200 H57 A5 5 0 0 1 52 195 Z" fill="#333" />

      {/* Arms (Resting at sides) */}
      <path d="M22 75 Q15 100 18 120" stroke={skinColor} strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M78 75 Q85 100 82 120" stroke={skinColor} strokeWidth="12" strokeLinecap="round" fill="none" />

      {/* Body/Shirt */}
      <path
        d="M25 135 L28 70 Q28 60 50 60 Q72 60 72 70 L75 135 H25 Z"
        fill={shirtColor}
      />
      
      {/* Neck */}
      <rect x="42" y="50" width="16" height="15" fill={skinColor} />
      
      {/* --- HEAD GROUP --- */}
      <g>
        {/* Face Shape */}
        <circle cx="50" cy="35" r="25" fill={skinColor} />

        {/* Eyes - Positioned at y=35 */}
        <ellipse cx="40" cy="35" rx="3" ry="4" fill="#333" />
        <ellipse cx="60" cy="35" rx="3" ry="4" fill="#333" />
        
        {/* Sparkle in eyes */}
        <circle cx="41" cy="34" r="1" fill="white" />
        <circle cx="61" cy="34" r="1" fill="white" />
        
        {/* Eyebrows - High enough to be seen (y=26) */}
        <path d="M36 26 Q40 24 44 26" stroke="#333" strokeWidth="1.5" fill="none" />
        <path d="M56 26 Q60 24 64 26" stroke="#333" strokeWidth="1.5" fill="none" />

        {/* Mouth (Smile) */}
        <path d="M40 48 Q50 55 60 48" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />

        {/* Cheeks */}
        <circle cx="35" cy="45" r="4" fill="#FF9999" opacity="0.4" />
        <circle cx="65" cy="45" r="4" fill="#FF9999" opacity="0.4" />
        
        {/* Ears */}
        <path d="M25 35 Q22 35 22 40 Q22 45 25 45 Z" fill={skinColor} />
        <path d="M75 35 Q78 35 78 40 Q78 45 75 45 Z" fill={skinColor} />
      </g>

      {/* --- FRONT HAIR LAYER (Bangs/Top) --- */}
      
      {style === 0 && (
        // Short / Neat
        <g>
          {/* Main Cap */}
          <path d="M20 32 C20 10 35 2 50 2 C65 2 80 10 80 32 C78 20 65 10 50 10 C35 10 22 20 20 32 Z" fill={hairColor} />
          {/* Sideburns */}
          <path d="M22 30 L22 42 L26 38 L26 30 Z" fill={hairColor} />
          <path d="M78 30 L78 42 L74 38 L74 30 Z" fill={hairColor} />
        </g>
      )}

      {style === 1 && (
        // Spiky / Fun
        <g>
           <path d="M20 32 L16 20 L26 24 L32 8 L42 20 L50 4 L58 20 L68 8 L74 24 L84 20 L80 32 C80 18 65 15 50 15 C35 15 20 18 20 32 Z" fill={hairColor} />
        </g>
      )}

      {style === 2 && (
        // Pigtails Front - Cute bangs
        <g>
          <path d="M18 35 C18 10 30 5 50 5 C70 5 82 10 82 35 C75 20 65 18 50 18 C35 18 25 20 18 35 Z" fill={hairColor} />
          {/* Hair Ties */}
          <circle cx="18" cy="45" r="4" fill="#FF6B6B" />
          <circle cx="82" cy="45" r="4" fill="#FF6B6B" />
        </g>
      )}

      {style === 3 && (
        // Long Hair Front - Center Part, tucked behind ears
        <g>
          <path d="M20 35 C20 0 40 0 50 5 C60 0 80 0 80 35 C75 20 65 15 50 25 C35 15 25 20 20 35 Z" fill={hairColor} />
        </g>
      )}
    </svg>
  );
};