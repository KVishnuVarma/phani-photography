import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '../Components/ThemeToggle';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate email send
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700 px-4 sm:px-6 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-primary-700 dark:text-primary-300">Get In Touch</h1>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-primary-800 dark:text-neutral-50">Contact Us</h1>
          <p className="text-primary-600 dark:text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have an inquiry about our services or want to book your session, feel free to reach out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          {[
            {
              icon: '📍',
              title: 'Location',
              details: 'Photography Studio Address',
              text: 'City, State 12345',
            },
            {
              icon: '📞',
              title: 'Phone',
              details: 'Call Us',
              text: '+1 (555) 123-4567',
            },
            {
              icon: '📧',
              title: 'Email',
              details: 'Email Us',
              text: 'hello@photography.com',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 sm:p-8 text-center border border-neutral-200 dark:border-neutral-700"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-primary-800 dark:text-neutral-50">{item.title}</h3>
              <p className="text-primary-600 dark:text-neutral-400 text-sm mb-1">{item.details}</p>
              <p className="text-neutral-900 dark:text-neutral-200 font-semibold">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 sm:p-8 lg:p-12 border border-neutral-200 dark:border-neutral-700"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-primary-800 dark:text-neutral-50">Send us a Message</h2>

          {submitted && (
            <div className="bg-green-500/10 dark:bg-green-500/20 border border-green-500/30 dark:border-green-500/50 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-6">
              Thank you! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition"
                  placeholder="Booking Inquiry"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-primary-700 dark:text-neutral-300 mb-2 font-semibold text-sm">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2.5 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-lg border border-neutral-300 dark:border-neutral-600 focus:border-primary-500 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition resize-none"
                placeholder="Tell us about your project..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition text-base sm:text-lg"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-800 dark:bg-neutral-950 text-neutral-400 dark:text-neutral-500 px-4 sm:px-6 md:px-8 py-8 sm:py-12 border-t border-neutral-700 dark:border-neutral-800 mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm sm:text-base">&copy; 2024 Photography Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
