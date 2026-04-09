import React, { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, Check, X, Upload } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';

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
  const { auth } = usePage().props;
  const isAdmin = auth?.is_admin;
  
  const [src, setSrc] = useState(defaultSrc);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSrc, setTempSrc] = useState(defaultSrc);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedSrc = localStorage.getItem(`image_${imageId}`);
    if (savedSrc) {
      setSrc(savedSrc);
      setTempSrc(savedSrc);
    }
  }, [imageId]);

  const handleImageClick = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempSrc(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUploading(true);
    // Имитируем сохранение
    setTimeout(() => {
        setSrc(tempSrc);
        localStorage.setItem(`image_${imageId}`, tempSrc);
        setUploading(false);
        setIsEditing(false);
    }, 1000);
  };

  return (
    <div className={`relative group/edit overflow-hidden ${containerClassName}`}>
      <img 
        src={src} 
        alt={alt || 'Image'} 
        className={`w-full h-full object-cover transition-transform duration-700 ${imageClassName} ${isAdmin ? 'group-hover/edit:scale-105' : ''}`} 
        {...props} 
      />
      
      {isAdmin && (
        <div 
          className="absolute inset-0 bg-black/40 opacity-0 group-hover/edit:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-40"
          onClick={handleImageClick}
          title="Нажмите, чтобы изменить изображение"
        >
          <div className="bg-quantum-graphite/80 p-4 rounded-full text-quantum-ivory backdrop-blur-md border border-white/10 hover:bg-quantum-amber hover:text-quantum-emerald transition-all transform scale-90 group-hover/edit:scale-100">
            <Camera size={24} />
          </div>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-quantum-graphite border border-white/10 rounded-[32px] p-8 w-full max-w-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-quantum-ivory font-syne uppercase tracking-tight">Изменение изображения</h3>
                <button onClick={() => setIsEditing(false)} className="text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-quantum-ivory/40 text-center">Текущее</p>
                    <div className="aspect-square rounded-2xl overflow-hidden border border-white/5">
                        <img src={src} className="w-full h-full object-cover opacity-50" alt="Current" />
                    </div>
                </div>
                <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-quantum-amber text-center">Новое (предпросмотр)</p>
                    <div className="aspect-square rounded-2xl overflow-hidden border border-quantum-amber/30 relative">
                        <img src={tempSrc} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                            <Upload size={32} className="text-white mb-2" />
                            <span className="text-xs font-bold uppercase text-white">Загрузить файл</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-quantum-ivory font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                    Отмена
                </button>
                <button
                    onClick={handleSave}
                    disabled={uploading || tempSrc === src}
                    className="flex-1 py-4 rounded-xl bg-quantum-amber text-quantum-emerald font-bold uppercase tracking-widest text-xs hover:bg-quantum-amber/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    <span>Сохранить изменения</span>
                </button>
            </div>

            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
          </div>
        </div>
      )}
    </div>
  );
}
