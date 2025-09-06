'use client';

import React from 'react';

interface BackgroundSectionProps {
  backgroundImage: string;
  overlay?: string;
  className?: string;
  children: React.ReactNode;
}

export default function BackgroundSection({ 
  backgroundImage, 
  overlay = 'bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-cyan-900/90',
  className = '',
  children 
}: BackgroundSectionProps) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
        <div className={`absolute inset-0 ${overlay}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}