import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MessageSquare, Star, Trophy, Camera } from 'lucide-react';
import Navbar from '../Components/Navbar';
import ReviewCard from '../Components/ReviewCard';
import { getAllReviews } from '../api';

const HomePage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden pt-16 flex items-center">
        <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight drop-shadow-2xl text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Capture Magic, <span className="text-primary-300">Make It Last</span> Forever
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-2xl sm:max-w-3xl mb-8 sm:mb-12 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Cinematic wedding stories, timeless moments, and vibrant portraits
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <Link
              to="/packages"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 rounded-lg font-bold transition text-base sm:text-lg w-full sm:w-auto text-center"
            >
              Book a Session
            </Link>
            <Link
              to="/gallery"
              className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-6 sm:px-8 py-3 rounded-lg font-bold transition text-base sm:text-lg w-full sm:w-auto text-center"
            >
              Explore Gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        className="bg-neutral-50 dark:bg-neutral-900 px-4 sm:px-6 md:px-8 py-16 sm:py-24"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase size={36} className="text-primary-700 dark:text-primary-400" />
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-primary-700 dark:text-primary-400">Our Signature Services</h2>
          </div>
          <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12 sm:mb-16 max-w-2xl sm:max-w-3xl mx-auto text-base sm:text-lg">
            From traditional weddings to cinematic outdoor shoots, we craft each frame with heart.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: 'Wedding Photography',
                description: 'Capture your special day with cinematic storytelling',
                icon: '💑',
              },
              {
                title: 'Outdoor Portraits',
                description: 'Stunning outdoor photography in natural light',
                icon: '🌅',
              },
              {
                title: 'Event Coverage',
                description: 'Professional documentation of your important events',
                icon: '🎉',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl dark:hover:shadow-2xl hover:-translate-y-2 transition"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="h-32 sm:h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <span className="text-5xl sm:text-6xl">{service.icon}</span>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-primary-700 dark:text-primary-400">{service.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials/Reviews Section */}
      <motion.section
        className="bg-neutral-100 dark:bg-neutral-900 px-4 sm:px-6 md:px-8 py-16 sm:py-24"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare size={36} className="text-primary-700 dark:text-primary-400" />
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-primary-700 dark:text-primary-400">
              What Our Clients Say
            </h2>
          </div>
          <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12 sm:mb-16 max-w-2xl sm:max-w-3xl mx-auto text-base sm:text-lg">
            Hear from our satisfied clients who have made lasting memories with us
          </p>

          {loadingReviews ? (
            <div className="text-center text-neutral-600 dark:text-neutral-400 py-12">
              <p className="text-lg">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-neutral-600 dark:text-neutral-400 py-12">
              <p className="text-lg">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {reviews.slice(0, 6).map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  onDeleteSuccess={() => {
                    setReviews(reviews.filter((r) => r._id !== review._id));
                  }}
                />
              ))}
            </div>
          )}

          {reviews.length > 6 && (
            <div className="mt-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Showing 6 of {reviews.length} reviews
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="bg-primary-700 dark:bg-neutral-950 text-neutral-50 px-4 sm:px-6 md:px-8 py-16 sm:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12 sm:mb-16">
            <Star size={36} className="text-neutral-50" />
            <h2 className="text-4xl sm:text-5xl font-bold text-center">Why Choose Us?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
            {[
              {
                title: 'Professional Team',
                description: 'Experienced photographers with passion for their craft',
              },
              {
                title: 'Latest Equipment',
                description: 'State-of-the-art cameras and lighting for best quality',
              },
              {
                title: 'Quick Delivery',
                description: 'Fast turnaround time for edited photos and videos',
              },
              {
                title: 'Affordable Packages',
                description: 'Quality photography at competitive prices',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex gap-4 sm:gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl sm:text-4xl text-primary-300 flex-shrink-0">✓</div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-neutral-200 text-sm sm:text-base">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Admin Achievements Section */}
      <motion.section
        className="bg-neutral-100 dark:bg-neutral-900 px-4 sm:px-6 md:px-8 py-16 sm:py-24"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy size={36} className="text-primary-700 dark:text-primary-400" />
            <h2 className="text-4xl sm:text-5xl font-bold text-center text-primary-700 dark:text-primary-400">Admin Achievements</h2>
          </div>
          <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12 sm:mb-16 max-w-2xl sm:max-w-3xl mx-auto text-base sm:text-lg">
            Celebrating our studio's excellence and milestones
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Achievement: Photography Virtuoso */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-600 transition border border-neutral-200 dark:border-neutral-700 text-center"
            >
              <div className="text-5xl sm:text-6xl mb-3">📸</div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-white mb-2">Photography Virtuoso</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Master of all photography styles & techniques
              </p>
            </motion.div>

            {/* Achievement: Wedding Specialist */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-600 transition border border-neutral-200 dark:border-neutral-700 text-center"
            >
              <div className="text-5xl sm:text-6xl mb-3">💒</div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-white mb-2">Wedding Specialist</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                50+ stunning wedding photoshoots completed
              </p>
            </motion.div>

            {/* Achievement: Studio Legend */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-600 transition border border-neutral-200 dark:border-neutral-700 text-center"
            >
              <div className="text-5xl sm:text-6xl mb-3">⭐</div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-white mb-2">Studio Legend</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                100+ happy clients & 95%+ satisfaction rate
              </p>
            </motion.div>

            {/* Achievement: Memory Maker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-2xl hover:border-primary-400 dark:hover:border-primary-600 transition border border-neutral-200 dark:border-neutral-700 text-center"
            >
              <div className="text-5xl sm:text-6xl mb-3">✨</div>
              <h3 className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-white mb-2">Memory Maker</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                1000+ perfect moments captured for eternity
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-primary-600 dark:bg-primary-700 text-white px-4 sm:px-6 md:px-8 py-16 sm:py-24 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-2xl sm:max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <Camera size={40} className="text-white" />
            <h2 className="text-4xl sm:text-5xl font-bold">Ready to Capture Your Moment?</h2>
          </div>
          <p className="text-base sm:text-xl mb-6 sm:mb-8">Browse our packages and book your session today</p>
          <Link
            to="/packages"
            className="inline-block bg-white hover:bg-neutral-100 text-primary-700 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition"
          >
            Get Started
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-primary-700 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-600 px-4 sm:px-6 md:px-8 py-8 sm:py-12 border-t border-neutral-700 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm sm:text-base">&copy; 2024 Photography Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
