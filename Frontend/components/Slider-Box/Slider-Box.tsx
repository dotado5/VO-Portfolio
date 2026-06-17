import "./Slider-Box.css";

interface SliderBoxProps {
  color?: string;
  imageUrl?: string;
}

const SliderBox = ({ color, imageUrl }: SliderBoxProps) => {
  return (
    <div
      className={`sliderBox ${color || ""}`}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Slider Item"
          className="sliderBox-img"
        />
      ) : (
        <div className="sliderBox-placeholder" />
      )}
    </div>
  );
};

export default SliderBox;
