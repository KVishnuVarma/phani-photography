import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  return (
    <div className="w-full bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Photography Studio</h1>
          <div className="flex gap-6">
            <Link to="/gallery" className="hover:text-yellow-400 transition">
              Gallery
            </Link>
            <Link to="/packages" className="hover:text-yellow-400 transition">
              Packages
            </Link>
            <Link
              to="/login"
              className="bg-yellow-500 text-black px-6 py-2 rounded hover:bg-yellow-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden pt-16">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-30 z-0"
          style={{ backgroundImage: "url('/phani.jpg')" }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Capture Magic, <span className="text-yellow-400">Make It Last</span> Forever
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Cinematic wedding stories, timeless moments, and vibrant portraits
          </motion.p>
          <motion.div
            className="flex flex-col md:flex-row gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <Link
              to="/packages"
              className="bg-yellow-500 text-black px-8 py-3 rounded font-bold hover:bg-yellow-600 transition text-lg"
            >
              Book a Session
            </Link>
            <Link
              to="/gallery"
              className="border-2 border-white text-white px-8 py-3 rounded font-bold hover:bg-white hover:text-black transition text-lg"
            >
              Explore Gallery
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        className="bg-white text-black px-6 md:px-16 py-24"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center">Our Signature Services</h2>
          <p className="text-center text-gray-700 mb-16 max-w-3xl mx-auto text-lg">
            From traditional weddings to cinematic outdoor shoots, we craft each frame with heart.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                className="bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="h-40 bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                  <span className="text-6xl">{service.icon}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-700">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us */}
      <motion.section
        className="bg-black text-white px-6 md:px-16 py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-16 text-center">Why Choose Us?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                className="flex gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl">✓</div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-yellow-500 text-black px-6 md:px-16 py-24 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6">Ready to Capture Your Moment?</h2>
          <p className="text-xl mb-8">Browse our packages and book your session today</p>
          <Link
            to="/packages"
            className="inline-block bg-black text-yellow-400 px-8 py-4 rounded font-bold text-lg hover:bg-gray-900 transition"
          >
            Get Started
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 px-6 md:px-16 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 Photography Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
