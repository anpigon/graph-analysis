import * as React from 'react';

interface ImgThumbnailProps {
  img: Promise<ArrayBuffer> | null;
}

const ImgThumbnail: React.FC<ImgThumbnailProps> = ({ img }) => {
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!img) return;

    img.then(buffer => {
      if (!buffer) return;
      
      const blob = new Blob([buffer]);
      const url = URL.createObjectURL(blob);
      setImgSrc(url);
      
      return () => URL.revokeObjectURL(url);
    });
  }, [img]);

  if (!imgSrc) return null;

  return (
    <img 
      src={imgSrc} 
      className="GA-img-thumbnail" 
      alt="Thumbnail" 
      style={{ maxWidth: '50px', maxHeight: '50px' }}
    />
  );
};

export default ImgThumbnail;
