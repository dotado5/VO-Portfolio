import { ReactNode } from "react";
import "./Infinite-Slider.css";

interface InfiniteSliderProps {
  children: ReactNode;
  duration?: number;
}

const InfiniteSlider = ({ children, duration = 30 }: InfiniteSliderProps) => {
  return (
    <div className="infinite-slider-container">
      <div
        className="infinite-slider-track"
        style={
          { "--animation-duration": `${duration}s` } as React.CSSProperties
        }
      >
        <div className="infinite-slider-content">{children}</div>
        <div className="infinite-slider-content" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfiniteSlider;
