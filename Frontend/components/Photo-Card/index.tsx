import "./index.css";

const PhotoCard = ({ imageUrl }: { imageUrl?: string }) => {
  return (
    <div className="photo-card" style={{ overflow: "hidden", position: "relative" }}>
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Gallery image" 
          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      )}
    </div>
  );
};

export default PhotoCard;
