// src/components/LandingPage.tsx
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white font-serif">
      <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Capture <span className="text-yellow-500">Your Perfect Moments</span>
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Professional photography services for weddings, birthdays, and outdoor events
        </p>
        <div className="space-x-4">
          <button className="bg-yellow-500 text-black px-6 py-2 rounded-md hover:bg-yellow-600 transition">
            Book a Session
          </button>
          <button className="border border-white px-6 py-2 rounded-md hover:bg-white hover:text-black transition">
            View Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
