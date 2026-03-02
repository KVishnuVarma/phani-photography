import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGalleryImages, uploadImage, deleteImage } from '../../api';
import { motion } from 'framer-motion';

interface GalleryImage {
  _id: string;
  imageUrl: string;
  caption?: string;
  uploadedAt: string;
}

const AdminGalleryManagement: React.FC = () => {
  const { token } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await getGalleryImages();
      setImages(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!formData.imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await uploadImage(formData.imageUrl, formData.caption, token);
      setSuccess('Image uploaded successfully!');
      setFormData({ imageUrl: '', caption: '' });
      await fetchImages();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteImage(imageId, token);
      setSuccess('Image deleted successfully!');
      await fetchImages();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-300 font-serif">Upload New Image</h2>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-600 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600/20 border border-green-600 text-green-600 dark:text-green-400 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Image URL *</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Caption</label>
            <textarea
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Add a description for this image..."
              rows={3}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-primary-600 text-white px-6 py-2 rounded font-bold hover:bg-primary-700 dark:hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-300 font-serif">Gallery Images ({images.length})</h2>

        {images.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">No images in gallery yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-100 dark:bg-neutral-700 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary-500/20 dark:hover:shadow-primary-500/20 transition border border-neutral-200 dark:border-neutral-700"
              >
                <img
                  src={image.imageUrl}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/400x300?text=Image+Error';
                  }}
                />
                <div className="p-4">
                  {image.caption && (
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3 line-clamp-2">{image.caption}</p>
                  )}
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="w-full bg-red-600/20 text-red-600 dark:text-red-400 hover:bg-red-600/40 px-3 py-2 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminGalleryManagement;
