// ImageCarousel.jsx
import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ImageCarousel = () => {
  const navigate = useNavigate()
  const images = [
    "/martin-katler-Y4fKN-RlMV4-unsplash.jpg",
    "/domino-studio-164_6wVEHfI-unsplash.jpg", 
    "/usama-akram-kP6knT7tjn4-unsplash.jpg",    
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  // Handlers for changing slides
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-[200vh] overflow-auto">
      {/* Slides */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Overlay button only on the first slide */}
      
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <button onClick={() => navigate("/shop-all")} className="bg-white text-black px-6 py-3 rounded shadow hover:text-red-500 cursor-pointer   transition">
              Explore Now
            </button>
          </div>
       
        </div>
      ))}

      {/* Bottom bar with pagination and arrows */}
      <div className="absolute bottom-0 left-0 w-full h-14 bg-neutral-800 bg-opacity-5 text-white flex items-center justify-center gap-6">
        {/* Previous button */}
        <button
          onClick={prevSlide}
          className="flex items-center justify-center hover:text-gray-300 p-2"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Next button */}
        <button
          onClick={nextSlide}
          className="flex items-center justify-center hover:text-gray-300 p-2"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

export default ImageCarousel
