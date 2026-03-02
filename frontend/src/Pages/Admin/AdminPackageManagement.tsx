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
    category: 'Wedding' as const,
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
        className="bg-gray-800 p-8 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6">
          {editingId ? 'Edit Package' : 'Create New Package'}
        </h2>

        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-600/20 border border-green-600 text-green-200 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as any })
              }
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
            >
              <option value="Wedding">Wedding</option>
              <option value="Birthday">Birthday</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Price ($) *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Photos Included *</label>
            <input
              type="number"
              value={formData.photosIncluded}
              onChange={(e) =>
                setFormData({ ...formData, photosIncluded: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Features (comma-separated) *</label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Full day coverage, Professional editing, Online gallery"
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Thumbnail URL</label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-500 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-600 disabled:opacity-50 transition"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Package' : 'Create Package'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-700 text-white px-6 py-2 rounded font-bold hover:bg-gray-600 transition"
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
        className="bg-gray-800 p-8 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-6">All Packages ({packages.length})</h2>

        {loading ? (
          <p className="text-gray-400">Loading packages...</p>
        ) : packages.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No packages created yet</p>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-700 p-6 rounded-lg border border-gray-600 hover:border-yellow-500 transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-sm text-gray-400">Title</p>
                    <p className="font-bold text-lg">{pkg.title}</p>
                    <p className="text-xs text-yellow-400">{pkg.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Price & Photos</p>
                    <p className="font-bold">${pkg.price}</p>
                    <p className="text-xs text-gray-400">{pkg.photosIncluded} photos</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-sm line-clamp-2">{pkg.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 px-3 py-2 rounded text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/40 px-3 py-2 rounded text-sm transition"
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
