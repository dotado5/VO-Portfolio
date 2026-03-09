import "./index.css";
import PhotoCard from "../Photo-Card";
import gallery from "@public/assets/gallery.png";
import Image from "next/image";

const PhotoSection = () => {
  return (
    <div className="photo-section">
      <h1 className="my-photo">
        <Image src={gallery} alt="gallery" />
        MY PHOTO GALLERY
      </h1>

      <div className="photos">
        {Array.from({ length: 5 }).map((_, index) => (
          <PhotoCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default PhotoSection;
