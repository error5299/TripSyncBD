import React, { useState } from 'react';
import { galleryPhotos } from '../data/initialData';
import { GalleryPhoto } from '../types';
import { Sparkles, MapPin, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const categories = ['সব', 'প্রকৃতি', 'হাওর', 'নৌযাত্রা', 'পাহাড়', 'ভ্রমণের মুহূর্ত'];

  const filteredPhotos = selectedCategory === 'সব'
    ? galleryPhotos
    : galleryPhotos.filter(p => p.category === selectedCategory);

  const openLightbox = (photo: GalleryPhoto) => {
    setActivePhoto(photo);
  };

  const closeLightbox = () => {
    setActivePhoto(null);
  };

  const nextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const prevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-semibold tracking-wide mb-3 border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>দৃশ্যপট ও স্মৃতিমালা</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight font-sans">
            টাঙ্গুয়ার হাওরের দৃশ্যকাব্য
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            ক্যামেরার ফ্রেমে বন্দি হওয়া আমাদের আগের ট্যুরগুলোর কিছু অবিস্মরণীয় মুহূর্ত।
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105 font-black'
                  : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((photo, index) => {
            // Give some items a taller or wider appearance for editorial rhythm
            const isTall = index % 3 === 0;

            return (
              <div
                key={photo.id}
                onClick={() => openLightbox(photo)}
                className={`group relative rounded-3xl overflow-hidden shadow-md cursor-pointer border border-amber-200/60 bg-slate-900 ${
                  isTall ? 'sm:row-span-2 h-[420px] sm:h-full' : 'h-[280px]'
                }`}
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                {/* Floating Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/30">
                    {photo.category}
                  </span>
                </div>

                {/* Expand Icon */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Caption & Location */}
                <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-base sm:text-lg font-bold font-sans">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">
                    {photo.caption}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300 mt-2 font-semibold">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{photo.location}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col rounded-3xl overflow-hidden bg-slate-900 border border-amber-500/20 shadow-2xl">
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[350px] sm:min-h-[480px]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>
            
            <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-400/30">
                    {activePhoto.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    {activePhoto.location}
                  </span>
                </div>
                <h4 className="text-xl font-bold font-sans">{activePhoto.title}</h4>
                <p className="text-sm text-slate-300 mt-1">{activePhoto.caption}</p>
              </div>

              <div className="text-xs text-slate-400">
                ফটোগ্রাফি • টাঙ্গুয়ার হাওর স্মৃতিমালা
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
