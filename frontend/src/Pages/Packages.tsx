import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllPackages } from '../api';
import { useAuth } from '../context/AuthContext';

interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
  photosIncluded: number;
  category: 'Wedding' | 'Birthday' | 'Outdoor';
  features: string[];
  thumbnailUrl?: string;
}

const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
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

    fetchPackages();
  }, []);

  const handleBooking = (packageId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${packageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading packages...</div>
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
        <h1 className="text-5xl font-bold mb-4 text-center">Our Packages</h1>
        <p className="text-center text-gray-400 mb-16 text-lg">
          Choose the perfect package for your special moment
        </p>

        {error && (
          <div className="bg-red-600/20 text-red-200 p-4 rounded mb-8 text-center">
            {error}
          </div>
        )}

        {packages.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            No packages available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/20 transition duration-300"
              >
                {pkg.thumbnailUrl && (
                  <img
                    src={pkg.thumbnailUrl}
                    alt={pkg.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="mb-2 inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">
                    {pkg.category}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-gray-300 mb-4 min-h-16">{pkg.description}</p>

                  <div className="bg-gray-700 rounded p-4 mb-4">
                    <p className="text-gray-300 text-sm mb-2">
                      ✓ {pkg.photosIncluded} Photos Included
                    </p>
                    {pkg.features.map((feature, i) => (
                      <p key={i} className="text-gray-300 text-sm mb-1">
                        ✓ {feature}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <p className="text-3xl font-bold text-yellow-400">
                      ${pkg.price}
                    </p>
                    <button
                      onClick={() => handleBooking(pkg._id)}
                      className="bg-yellow-500 text-black px-6 py-2 rounded font-bold hover:bg-yellow-600 transition"
                    >
                      Book Now
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

export default PackagesPage;
