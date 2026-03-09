import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Package as PackageIcon } from 'lucide-react';
import { getAllPackages } from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../Components/Navbar';

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 flex items-center justify-center">
        <div className="text-2xl">Loading packages...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Navigation */}
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20 pt-24"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <PackageIcon size={36} className="text-primary-700 dark:text-primary-400" />
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-primary-700 dark:text-primary-400">Our Packages</h1>
        </div>
        <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12 sm:mb-16 text-base sm:text-lg">
          Choose the perfect package for your special moment
        </p>

        {error && (
          <div className="bg-red-500/10 dark:bg-red-500/20 border border-red-500/30 dark:border-red-500/50 text-red-700 dark:text-red-300 p-4 rounded-lg mb-8 text-center text-sm sm:text-base">
            {error}
          </div>
        )}

        {packages.length === 0 ? (
          <div className="text-center text-neutral-600 dark:text-neutral-400 py-16 sm:py-20">
            No packages available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl dark:hover:shadow-2xl hover:shadow-primary-500/20 dark:hover:shadow-primary-500/30 transition duration-300"
              >
                {pkg.thumbnailUrl && (
                  <img
                    src={pkg.thumbnailUrl}
                    alt={pkg.title}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                )}
                <div className="p-4 sm:p-6">
                  <div className="mb-2 inline-block px-3 py-1 bg-primary-500/20 dark:bg-primary-500/30 text-primary-700 dark:text-primary-300 rounded text-xs sm:text-sm font-semibold">
                    {pkg.category}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 text-primary-700 dark:text-primary-400">{pkg.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4 min-h-16 text-sm sm:text-base">{pkg.description}</p>

                  <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-3 sm:p-4 mb-4">
                    <p className="text-primary-700 dark:text-neutral-300 text-xs sm:text-sm mb-2 font-semibold">
                      ✓ {pkg.photosIncluded} Photos Included
                    </p>
                    {pkg.features.map((feature, i) => (
                      <p key={i} className="text-primary-700 dark:text-neutral-300 text-xs sm:text-sm mb-1">
                        ✓ {feature}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-6 gap-3">
                    <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                      ${pkg.price}
                    </p>
                    <button
                      onClick={() => handleBooking(pkg._id)}
                      className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white px-4 sm:px-6 py-2 rounded-lg font-bold transition text-sm sm:text-base"
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
