import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGalleryImages } from '../api';

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white min-h-screen py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-5xl font-bold mb-4 text-center">Our Gallery</h1>
        <p className="text-center text-gray-400 mb-16 text-lg">
          Explore our stunning collection of photography
        </p>

        {error && (
          <div className="bg-red-600/20 text-red-200 p-4 rounded mb-8 text-center">
            {error}
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No images in gallery yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src={image.imageUrl}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    {image.caption && <p className="text-lg font-semibold">{image.caption}</p>}
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
