
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ImageCarousel = () => {
  const navigate = useNavigate();
  const images = [
    "/martin-katler-Y4fKN-RlMV4-unsplash.jpg",
    "/domino-studio-164_6wVEHfI-unsplash.jpg",
    "/usama-akram-kP6knT7tjn4-unsplash.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotation functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  // Handlers for changing slides
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-full aspect-[16/9] bg-cover bg-center"
               style={{ backgroundImage: `url(${images[currentIndex]})` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
              <div className="text-white p-6 md:p-10 max-w-md">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="text-2xl md:text-3xl font-bold mb-2"
                >
                  {currentIndex === 0 ? "New Collection" : currentIndex === 1 ? "Summer Styles" : "Exclusive Deals"}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-sm md:text-base mb-4 opacity-90"
                >
                  {currentIndex === 0 
                    ? "Discover our latest arrivals designed for modern lifestyle" 
                    : currentIndex === 1 
                    ? "Light fabrics and vibrant colors for the season" 
                    : "Limited time offers on premium selections"}
                </motion.p>
                {currentIndex === 0 && (
                  <motion.button
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/shop-all")}
                    className="bg-white text-black px-6 py-3 rounded shadow hover:text-red-500 transition duration-300"
                  >
                    Explore Now
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <button
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/60 p-2 rounded-full shadow-md z-10 hover:bg-white transition-all duration-300"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="text-gray-800" size={20} />
      </button>

      <button
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/60 p-2 rounded-full shadow-md z-10 hover:bg-white transition-all duration-300"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="text-gray-800" size={20} />
      </button>

      {/* Pagination indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentIndex === index 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;