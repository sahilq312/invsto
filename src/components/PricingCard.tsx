"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Check, Moon, Sun } from 'lucide-react'
import { colors } from './color';
import BackgroundSVG from './background';

const PricingCard = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [currentStep, setCurrentStep] = useState(2); 
  const [isDarkMode, setIsDarkMode] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const newPrices = [
    { price: 8, pageviews: '10K' },
    { price: 12, pageviews: '50K' },
    { price: 16, pageviews: '100K' },
    { price: 24, pageviews: '500K' },
    { price: 36, pageviews: '1M' }
  ];

  useEffect(() => {
    updateSlider(currentStep / (newPrices.length - 1));
  }, [currentStep]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (sliderRef.current && thumbRef.current && fillRef.current) {
        const percent = currentStep / (newPrices.length - 1);
        const sliderWidth = sliderRef.current.offsetWidth;
        const thumbWidth = thumbRef.current.offsetWidth;
        const maxThumbPosition = sliderWidth - thumbWidth;
        const thumbPosition = percent * maxThumbPosition;
        
        thumbRef.current.style.left = `${thumbPosition + thumbWidth/2}px`;
        fillRef.current.style.width = `${percent * 100}%`;
      }
    });
  }, []);

  const updateSlider = (percent: number) => {
    if (sliderRef.current && thumbRef.current && fillRef.current) {
      const sliderWidth = sliderRef.current.offsetWidth;
      const thumbWidth = thumbRef.current.offsetWidth;
      const maxThumbPosition = sliderWidth - thumbWidth;
      const thumbPosition = percent * maxThumbPosition;
      
      thumbRef.current.style.left = `${thumbPosition + thumbWidth/2}px`;
      fillRef.current.style.width = `${percent * 100}%`;
    }
  };

  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const move = (moveEvent: MouseEvent) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const thumbWidth = thumbRef.current?.offsetWidth || 0;
        let percent = (moveEvent.clientX - rect.left - thumbWidth / 2) / (rect.width - thumbWidth);
        percent = Math.max(0, Math.min(1, percent));
        const newStep = Math.round(percent * (newPrices.length - 1));
        setCurrentStep(newStep);
      }
    };

    const up = () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    move(e.nativeEvent);
  };

  const getPrice = () => {
    let price = newPrices[currentStep].price;
    if (isYearly) {
      price *= 0.75; // 25% discount
    }
    return price.toFixed(2);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? colors.dark : colors.light;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden font-['Manrope',sans-serif]" style={{ backgroundColor: theme.background }}>
      <BackgroundSVG isDarkMode={isDarkMode} />
      <div className="text-center mb-12 relative z-10">
        <div className="relative inline-block">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="146" 
            height="145" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
          >
            <g fill="none" fillRule="evenodd" stroke={theme.secondaryText} opacity="0.25">
              <circle cx="63" cy="82" r="62.5"/>
              <circle cx="105" cy="41" r="40.5"/>
            </g>
          </svg>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 transition-colors duration-300" style={{ color: theme.primaryText }}>
            Simple, traffic-based pricing
          </h1>
        </div>
        <p className="text-[15px] transition-colors duration-300" style={{ color: theme.secondaryText }}>
          Sign-up for our 30-day trial. No credit card required.
        </p>
      </div>

      <div className="rounded-2xl shadow-lg p-8 md:p-12 w-full max-w-[600px] transition-colors duration-300 relative z-10" style={{ backgroundColor: theme.cardBackground }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <h2 className="uppercase tracking-[0.2em] text-sm font-semibold text-center md:text-left transition-colors duration-300" style={{ color: theme.secondaryText }}>
            {newPrices[currentStep].pageviews} Pageviews
          </h2>
          <div className="flex items-center justify-center md:justify-end gap-2 mt-6 md:mt-0">
            <span className="text-4xl font-extrabold transition-colors duration-300" style={{ color: theme.primaryText }}>
              ${getPrice()}
            </span>
            <span className="text-sm transition-colors duration-300" style={{ color: theme.secondaryText }}>/ month</span>
          </div>
        </div>

        <div className="mb-10 relative py-4">
          <div 
            className="w-full h-2 rounded-full cursor-pointer relative"
            ref={sliderRef}
            onMouseDown={handleSliderMouseDown}
            style={{ backgroundColor: theme.sliderBackground }}
          >
            <div 
              className="absolute h-full rounded-full transition-all duration-200 pointer-events-none"
              ref={fillRef}
              style={{ backgroundColor: theme.sliderFill }}
            ></div>
            <div 
              className="absolute w-10 h-10 rounded-full -top-4 transition-all duration-200 cursor-pointer"
              ref={thumbRef}
              style={{ 
                backgroundColor: theme.sliderThumb,
                boxShadow: '0 15px 30px rgba(0,255,231,0.6)',
                transform: 'translateX(-50%)'
              }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-10">
          <span className="text-sm transition-colors duration-300" style={{ color: theme.secondaryText }}>Monthly Billing</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={isYearly} onChange={() => setIsYearly(!isYearly)} className="sr-only peer" />
            <div className="w-12 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all transition-colors duration-300"
                 style={{ backgroundColor: isYearly ? theme.toggleBackgroundActive : theme.toggleBackground }}></div>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm transition-colors duration-300" style={{ color: theme.secondaryText }}>Yearly Billing</span>
            <span className="text-[0.7rem] px-2 py-1 rounded-full font-bold transition-colors duration-300" style={{ color: theme.discountText, backgroundColor: theme.discountBackground }}>
              25% discount
            </span>
          </div>
        </div>

        <hr className="mb-8 transition-colors duration-300" style={{ borderColor: theme.sliderBackground }} />

        <div className="flex flex-col md:flex-row items-center justify-between">
          <ul className="space-y-3 mb-8 md:mb-0">
            <li className="flex items-center gap-4 text-sm transition-colors duration-300" style={{ color: theme.secondaryText }}>
              <Check className="w-4 h-4" style={{ color: theme.sliderThumb }} />
              <span>Unlimited websites</span>
            </li>
            <li className="flex items-center gap-4 text-sm transition-colors duration-300" style={{ color: theme.secondaryText }}>
              <Check className="w-4 h-4" style={{ color: theme.sliderThumb }} />
              <span>100% data ownership</span>
            </li>
            <li className="flex items-center gap-4 text-sm transition-colors duration-300" style={{ color: theme.secondaryText }}>
              <Check className="w-4 h-4" style={{ color: theme.sliderThumb }} />
              <span>Email reports</span>
            </li>
          </ul>
          
          <button 
            className="px-12 py-3 rounded-full text-sm font-bold transition-colors duration-300"
            style={{ backgroundColor: theme.buttonBackground, color: theme.buttonText }}
          >
            Start my trial
          </button>
        </div>
      </div>

      <button
        onClick={toggleDarkMode}
        className="mt-8 p-2 rounded-full transition-colors duration-300"
        style={{ backgroundColor: theme.buttonBackground }}
      >
        {isDarkMode ? <Sun className="w-6 h-6" style={{ color: theme.buttonText }} /> : <Moon className="w-6 h-6" style={{ color: theme.buttonText }} />}
      </button>
    </div>
  );
};

export default PricingCard;

