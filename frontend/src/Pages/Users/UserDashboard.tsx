import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const UserDashboard: React.FC = () => {
  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 600], [0, -200]);
  const scaleImage = useTransform(scrollY, [0, 600], [1.2, 1.4]); // Slow zoom
  const yText = useTransform(scrollY, [0, 600], [0, -60]);
  

  return (
    <div className="w-full font-sans text-white bg-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full h-[100vh] overflow-hidden">
        {/* Parallax Background Image with Zoom */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center z-0 brightness-[.3]"
          style={{
            backgroundImage: "url('/phani.jpg')",
            y: yImage,
            scale: scaleImage,
          }}
        />

        {/* Dust Particle Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="w-full h-full relative overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/50 blur-sm"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: Math.random(),
                }}
                animate={{
                  y: ["0%", "100%"],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10 + Math.random() * 10,
                  ease: "easeInOut",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Text */}
        <motion.div
          style={{ y: yText }}
          className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Capture Magic, Make It Last Forever.
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-2xl mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Cinematic wedding stories, timeless moments, and vibrant portraits.
          </motion.p>
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500 transition cursor-pointer">
              Book a Session
            </button>
            <button className="px-6 py-2 border border-white rounded hover:bg-white hover:text-black transition cursor-pointer">
              Explore Gallery
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section */}
      <motion.section
        className="bg-white text-black px-6 md:px-16 py-20"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Our Signature Services
        </h2>
        <p className="text-center text-gray-700 max-w-2xl mx-auto mb-12">
          From traditional weddings to cinematic outdoor shoots, we craft each frame with heart.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Wedding Photography", img: "/wed.jpg" },
            { title: "Outdoor Portraits", img: "/outdoor.jpg" },
            { title: "Event Coverage", img: "/event.jpg" },
          ].map((service, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img src={service.img} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{service.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default UserDashboard;
