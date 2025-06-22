import * as React from 'react';

interface ImgThumbnailProps {
  img: Promise<ArrayBuffer> | null;
  className?: string;
}

const ImgThumbnail: React.FC<ImgThumbnailProps> = ({ img, className = '' }) => {
  const [status, setStatus] = React.useState<'loading'|'loaded'|'error'>('loading');
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!img) {
      setStatus('error');
      return;
    }

    const controller = new AbortController();
    let objectUrl: string | null = null;

    const loadImage = async () => {
      try {
        setStatus('loading');
        const buffer = await img;
        
        if (controller.signal.aborted) return;
        if (!buffer) throw new Error('Invalid image data');

        const blob = new Blob([buffer], { type: 'image/jpeg' });
        objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);
        setStatus('loaded');
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Image loading failed:', error);
          setStatus('error');
        }
      }
    };

    loadImage();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [img]);

  if (status === 'error') return <div className={`GA-img-error ${className}`}>Image load failed</div>;
  if (status === 'loading') return <div className={`GA-img-loading ${className}`}>Loading...</div>;

  return (
    <div className={`GA-img-container ${className}`}>
      <img 
        src={imgSrc!} 
        className="GA-img-thumbnail" 
        alt="Thumbnail"
      />
    </div>
  );
};

export default ImgThumbnail;
