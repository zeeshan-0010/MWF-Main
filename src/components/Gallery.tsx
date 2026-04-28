import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { GalleryImage } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Expand, 
  MapPin, 
  Calendar as CalendarIcon,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'gallery'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GalleryImage[];
      
      // Fallback with mock data
      if (docs.length === 0) {
        setImages([
          {
            id: '1',
            url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
            caption: 'Plantation Drive at City Park',
            category: 'Environment',
            createdAt: new Date()
          },
          {
            id: '2',
            url: 'https://images.unsplash.com/photo-1489424197754-57215c95ca32?auto=format&fit=crop&w=800&q=80',
            caption: 'Food distribution in rural sectors',
            category: 'Relief',
            createdAt: new Date()
          },
          {
            id: '3',
            url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
            caption: 'New batch of notebooks for schools',
            category: 'Education',
            createdAt: new Date()
          },
          {
            id: '4',
            url: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80',
            caption: 'Medical camp with visiting doctors',
            category: 'Health',
            createdAt: new Date()
          },
          {
            id: '5',
            url: 'https://images.unsplash.com/photo-1541976590-713df544f158?auto=format&fit=crop&w=800&q=80',
            caption: 'Blanket distribution during winter',
            category: 'Relief',
            createdAt: new Date()
          },
          {
            id: '6',
            url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
            caption: 'Skill development workshop for women',
            category: 'Education',
            createdAt: new Date()
          }
        ]);
      } else {
        setImages(docs);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="w-full py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Camera className="text-brand-green" size={24} />
            <span className="text-xs font-black text-brand-green uppercase tracking-[0.4em]">Impact Gallery</span>
          </div>
          <h2 className="text-4xl font-extrabold text-brand-blue tracking-tight mb-4">Foundation in Action</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Visual records of our fieldwork and the lives we touch every day. Transparency through every frame.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className="relative aspect-square rounded-[2rem] overflow-hidden group cursor-pointer border border-gray-100 shadow-sm"
            >
              <img 
                src={image.url} 
                alt={image.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white text-sm font-bold mb-2">{image.caption}</p>
                <div className="flex items-center gap-3 text-[10px] text-white/70 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><CalendarIcon size={10} /> 2024</span>
                  <span className="w-1 h-1 bg-white/30 rounded-full" />
                  <span className="text-brand-green">{image.category}</span>
                </div>
              </div>
              <div className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand size={16} className="text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedIndex !== null && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedIndex(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              
              <div className="relative w-full max-w-5xl aspect-video md:aspect-auto md:max-h-[85vh] flex flex-col items-center">
                <button 
                  onClick={() => setSelectedIndex(null)}
                  className="absolute -top-12 right-0 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                >
                  <X size={24} />
                </button>

                <motion.img 
                  key={images[selectedIndex].id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  src={images[selectedIndex].url}
                  alt={images[selectedIndex].caption}
                  className="w-full max-h-[70vh] object-contain rounded-3xl shadow-2xl mb-6"
                />

                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{images[selectedIndex].caption}</h3>
                  <p className="text-brand-green font-bold uppercase tracking-widest text-[10px]">{images[selectedIndex].category}</p>
                </div>

                {/* Navigation */}
                <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
