import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface EditableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageId: string;
  defaultSrc: string;
  containerClassName?: string;
  imageClassName?: string;
}

export function EditableImage({ 
  imageId, 
  defaultSrc, 
  containerClassName = '', 
  imageClassName = '',
  alt, 
  ...props 
}: EditableImageProps) {
  const [src, setSrc] = useState(defaultSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedSrc = localStorage.getItem(`image_${imageId}`);
    if (savedSrc) {
      setSrc(savedSrc);
    }
  }, [imageId]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSrc(base64String);
        localStorage.setItem(`image_${imageId}`, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative group/edit overflow-hidden ${containerClassName}`}>
      <img 
        src={src} 
        alt={alt || 'Image'} 
        className={`w-full h-full object-cover ${imageClassName}`} 
        {...props} 
      />
      
      <div 
        className="absolute inset-0 bg-black/40 opacity-0 group-hover/edit:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-40"
        onClick={handleImageClick}
        title="Изменить фото"
      >
        <div className="bg-quantum-graphite/80 p-3 rounded-full text-quantum-ivory backdrop-blur-sm border border-quantum-rose/10 hover:bg-quantum-rose hover:text-white transition-colors">
          <Camera size={24} />
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
