import React from "react";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white text-black py-16 px-8">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Left Column: Text */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-4xl font-extrabold">
          Elevate Every Step with StepRight
          </h2>
          <p className="text-black leading-relaxed">
            
            Discover our latest collection of sneakers, high-tops, and running shoes designed to empower your journey—one stride at a time.
          </p>
          <button onClick={()=>navigate("/shop-all")} className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-all duration-300">
            SHOP
          </button>
        </div>

        {/* Right Column: Image */}
        <div className="md:w-96 ml-28">
          <img
            src="https://docsneakers.in/cdn/shop/products/Picsart_23-04-06_12-38-31-264.jpg?v=1680778562&width=360"
            alt="Sneaker Showcase"
            className="w-full h-auto object-cover rounded-lg shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
