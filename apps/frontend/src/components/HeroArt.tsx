import React from 'react';

export default function HeroArt() {
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-art-svg">
      <defs>
        <radialGradient id="radial1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
        </radialGradient>
        <linearGradient id="linear1" x1="0" y1="0" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3"/>
          <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
      </defs>
      <ellipse cx="75" cy="75" rx="68" ry="40" fill="url(#radial1)"/>
      <ellipse cx="75" cy="85" rx="48" ry="18" fill="url(#linear1)" opacity="0.7"/>
      <circle cx="75" cy="60" r="28" fill="#fff" fillOpacity="0.7"/>
      <circle cx="75" cy="60" r="18" fill="url(#linear1)" opacity="0.9">
        <animate attributeName="r" values="18;24;18" dur="2.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="75" cy="60" r="8" fill="#3b82f6" opacity="0.7">
        <animate attributeName="r" values="8;13;8" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <ellipse cx="110" cy="38" rx="10" ry="4" fill="#a5b4fc" opacity="0.5">
        <animate attributeName="cx" values="110;120;110" dur="3s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="40" cy="40" rx="7" ry="3" fill="#a5b4fc" opacity="0.4">
        <animate attributeName="cx" values="40;30;40" dur="3.2s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  );
}
