import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGalleryImages } from '../api';
import ThemeToggle from '../Components/ThemeToggle';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption?: string;
  uploadedAt: string;
}

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getGalleryImages();
        setImages(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex items-center justify-center">
        <div className="text-2xl">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-neutral-50/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-400">Gallery</h1>
          <ThemeToggle />
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 text-center text-primary-700 dark:text-primary-400">Our Gallery</h1>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12 sm:mb-16 text-base sm:text-lg">
          Explore our stunning collection of photography
        </p>

        {error && (
          <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/50 text-red-700 dark:text-red-300 p-4 rounded-lg mb-8 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center text-neutral-600 dark:text-neutral-400 py-16 sm:py-20">
            No images in gallery yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg shadow-md dark:shadow-lg"
              >
                <img
                  src={image.imageUrl}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-primary-700/40 dark:bg-neutral-950/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    {image.caption && <p className="text-base sm:text-lg font-semibold">{image.caption}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GalleryPage;
