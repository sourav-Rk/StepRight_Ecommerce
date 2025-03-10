

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCategoriesToDisplay } from "@/Api/User/productApi"


// Static images mapping for categories
const categoryImages = {
  "Sneaker": "/domino-studio-164_6wVEHfI-unsplash.jpg",
  "High Tops": "/martin-katler-Y4fKN-RlMV4-unsplash.jpg",
  "Running Shoe": "/usama-akram-kP6knT7tjn4-unsplash.jpg",
};

const CollectionsSection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesToDisplay();
        setCategories(response.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-white px-4 py-12 md:px-6 lg:px-8">
      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-black mb-12">
        Collections
      </h2>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div 
            key={category._id} // Use category._id as key
            className="group relative overflow-hidden cursor-pointer"
            onClick={() => navigate(`/category/${category._id}`)} // Navigate using category ID
          >
            {/* Image Container */}
            <div className="aspect-square overflow-hidden">
            <img
              src={categoryImages[category.name] || "/images/default.jpg"} // Use static image or fallback
              alt={category.name} // Use category name as alt text
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center justify-between text-white">
                <h3 className="text-2xl font-bold">
                  {category.name} {/* Display category name */}
                </h3>
                <ArrowRight 
                  className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-2"
                />
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionsSection;
