import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from '../../api';
import { motion } from 'framer-motion';

interface Package {
  _id: string;
  title: string;
  category: 'Wedding' | 'Birthday' | 'Outdoor';
  price: number;
  photosIncluded: number;
  description: string;
  features: string[];
  thumbnailUrl?: string;
}

const AdminPackageManagement: React.FC = () => {
  const { token } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Wedding' as 'Wedding' | 'Birthday' | 'Outdoor',
    price: 0,
    photosIncluded: 0,
    description: '',
    features: '',
    thumbnailUrl: '',
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const data = await getAllPackages();
      setPackages(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Wedding',
      price: 0,
      photosIncluded: 0,
      description: '',
      features: '',
      thumbnailUrl: '',
    });
    setEditingId(null);
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      title: pkg.title,
      category: pkg.category,
      price: pkg.price,
      photosIncluded: pkg.photosIncluded,
      description: pkg.description,
      features: pkg.features.join(', '),
      thumbnailUrl: pkg.thumbnailUrl || '',
    });
    setEditingId(pkg._id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const packageData = {
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        photosIncluded: Number(formData.photosIncluded),
        description: formData.description,
        features: formData.features.split(',').map((f) => f.trim()),
        thumbnailUrl: formData.thumbnailUrl,
      };

      if (editingId) {
        await updatePackage(editingId, packageData, token);
        setSuccess('Package updated successfully!');
      } else {
        await createPackage(packageData, token);
        setSuccess('Package created successfully!');
      }

      await fetchPackages();
      resetForm();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (packageId: string) => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      await deletePackage(packageId, token);
      setSuccess('Package deleted successfully!');
      await fetchPackages();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to delete package');
    }
  };

  return (
    <div className="space-y-8">
      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-300 font-serif">
          {editingId ? 'Edit Package' : 'Create New Package'}
        </h2>

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

        <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setFormData({ ...formData, category: e.target.value as any })
              }
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Price ($) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div>
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Photos Included *</label>
            <input
              type="number"
              value={formData.photosIncluded}
              onChange={(e) =>
                setFormData({ ...formData, photosIncluded: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Features (comma-separated) *</label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Full day coverage, Professional editing, Online gallery"
              rows={3}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold">Thumbnail URL</label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white rounded border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-primary-600 text-white px-6 py-2 rounded font-bold hover:bg-primary-700 dark:hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Package' : 'Create Package'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white px-6 py-2 rounded font-bold hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      {/* Packages List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-neutral-800 p-8 rounded-lg border border-neutral-200 dark:border-neutral-700"
      >
        <h2 className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-300 font-serif">All Packages ({packages.length})</h2>

        {loading ? (
          <p className="text-neutral-600 dark:text-neutral-400">Loading packages...</p>
        ) : packages.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">No packages created yet</p>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-neutral-50 dark:bg-neutral-700 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Title</p>
                    <p className="font-bold text-lg text-neutral-900 dark:text-white">{pkg.title}</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400">{pkg.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Price & Photos</p>
                    <p className="font-bold text-neutral-900 dark:text-white">${pkg.price}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">{pkg.photosIncluded} photos</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Description</p>
                    <p className="text-sm line-clamp-2 text-neutral-900 dark:text-neutral-300">{pkg.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 bg-primary-600/20 text-primary-600 dark:text-primary-400 hover:bg-primary-600/40 px-3 py-2 rounded text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="flex-1 bg-red-600/20 text-red-600 dark:text-red-400 hover:bg-red-600/40 px-3 py-2 rounded text-sm transition"
                    >
                      Delete
                    </button>
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

export default AdminPackageManagement;
