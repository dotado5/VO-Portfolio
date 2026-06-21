import "./index.css";
import PhotoCard from "../Photo-Card";
import folder from "@public/assets/folder.png";
import Image from "next/image";

const PhotoSection = () => {
  return (
    <div className="photo-section">
      <h1 className="my-photo mb-5">
        <Image src={folder} alt="folder" className="w-5 h-5 object-contain" />
        MY PHOTO WALL
      </h1>

      <div className="photos">
        {Array.from({ length: 32 }).map((_, index) => (
          <PhotoCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default PhotoSection;
