"use client";

import { ReactNode, useRef } from "react";
import "./Infinite-Slider.css";

interface InfiniteSliderProps {
  children: ReactNode;
  duration?: number;
  reverse?: boolean;
}

const InfiniteSlider = ({
  children,
  duration = 30,
  reverse = false,
}: InfiniteSliderProps) => {
  return (
    <div className="infinite-slider-wrapper">
      <div
        className={`infinite-slider-track ${reverse ? "reverse" : ""}`}
        style={{ "--duration": `${duration}s` } as React.CSSProperties}
      >
        {/* We clone the children 4 times to ensure seamless looping
            regardless of how many items are present */}
        <div className="infinite-slider-set" aria-hidden="false">
          {children}
        </div>
        <div className="infinite-slider-set" aria-hidden="true">
          {children}
        </div>
        <div className="infinite-slider-set" aria-hidden="true">
          {children}
        </div>
        <div className="infinite-slider-set" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfiniteSlider;
