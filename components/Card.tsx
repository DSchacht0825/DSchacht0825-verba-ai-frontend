'use client';

import React from 'react';

interface CardProps {
  title: string;
  description: string;
  icon?: string;
  backgroundImage?: string;
  className?: string;
  variant?: 'default' | 'feature' | 'pricing' | 'security';
  children?: React.ReactNode;
}

export default function Card({ 
  title, 
  description, 
  icon, 
  backgroundImage, 
  className = '', 
  variant = 'default',
  children 
}: CardProps) {
  const baseClasses = "relative overflow-hidden rounded-2xl transition-all duration-300";
  
  const variantClasses = {
    default: "bg-white shadow-lg hover:shadow-xl transform hover:-translate-y-1",
    feature: "group shadow-xl hover:shadow-2xl transform hover:-translate-y-2",
    pricing: "bg-white shadow-lg hover:shadow-xl transform hover:scale-105",
    security: "bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-xl border border-white/30 shadow-2xl"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Background Image for feature cards */}
      {backgroundImage && variant === 'feature' && (
        <>
          <div className="absolute inset-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat transform group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url('${backgroundImage}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/70 to-blue-600/50 group-hover:from-blue-900/95 group-hover:via-blue-800/80 transition-all duration-300"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </>
      )}

      {/* Content */}
      <div className={`relative z-10 p-6 ${variant === 'feature' ? 'h-80 flex flex-col justify-end text-white' : ''}`}>
        {icon && (
          <div className={`text-4xl mb-4 ${variant === 'feature' ? 'text-5xl transform group-hover:scale-110 transition-transform duration-300' : ''}`}>
            {icon}
          </div>
        )}
        
        <h3 className={`text-xl font-semibold mb-2 ${
          variant === 'feature' 
            ? 'text-2xl font-bold group-hover:text-cyan-300 transition-colors duration-300' 
            : variant === 'security' 
            ? 'text-white text-2xl' 
            : 'text-gray-900'
        }`}>
          {title}
        </h3>
        
        <p className={`${
          variant === 'feature' 
            ? 'text-blue-100 leading-relaxed group-hover:text-white transition-colors duration-300' 
            : variant === 'security'
            ? 'text-blue-200 leading-relaxed'
            : 'text-gray-600'
        }`}>
          {description}
        </p>

        {children}
      </div>
    </div>
  );
}