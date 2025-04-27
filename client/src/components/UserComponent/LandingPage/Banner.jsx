// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Banner = () => {
//   const navigate = useNavigate();
//   return (
//     <section className="bg-white text-black py-16 px-8">
//       <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
//         {/* Left Column: Text */}
//         <div className="md:w-1/2 space-y-6">
//           <h2 className="text-4xl md:text-4xl font-extrabold">
//           Elevate Every Step with StepRight
//           </h2>
//           <p className="text-black leading-relaxed">
            
//             Discover our latest collection of sneakers, high-tops, and running shoes designed to empower your journey—one stride at a time.
//           </p>
//           <button onClick={()=>navigate("/shop-all")} className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-all duration-300">
//             SHOP
//           </button>
//         </div>

//         {/* Right Column: Image */}
//         <div className="md:w-96 ml-28">
//           <img
//             src="https://docsneakers.in/cdn/shop/products/Picsart_23-04-06_12-38-31-264.jpg?v=1680778562&width=360"
//             alt="Sneaker Showcase"
//             className="w-full h-auto object-cover rounded-lg shadow-xl"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Banner;


import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Banner = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-gradient-to-br from-white to-gray-100 text-black py-16 px-8 overflow-hidden">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Left Column: Text */}
        <motion.div 
          className="md:w-1/2 space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
              Elevate Every Step with StepRight
            </h2>
          </motion.div>
          
          <motion.p 
            className="text-gray-700 leading-relaxed text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Discover our latest collection of sneakers, high-tops, and running shoes designed to empower your journey—one stride at a time.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button 
              onClick={() => navigate("/shop-all")} 
              className="bg-black text-white py-3 px-8 rounded-full font-medium tracking-wide shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SHOP NOW
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="inline-block"
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </motion.svg>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Column: Image */}
        <motion.div 
          className="md:w-96 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute -z-10 w-full h-full rounded-full bg-gradient-to-tr from-gray-200 to-white -top-10 -right-10"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          
          <motion.div 
            className="absolute -z-10 w-32 h-32 rounded-full bg-gray-100 -bottom-5 -left-5"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          {/* Main image with custom shadow and floating animation */}
          <motion.div
            className="relative z-10"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="https://docsneakers.in/cdn/shop/products/Picsart_23-04-06_12-38-31-264.jpg?v=1680778562&width=360"
              alt="Sneaker Showcase"
              className="w-full h-auto object-cover rounded-lg shadow-2xl"
            />
            
            {/* Reflection effect */}
            <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-black/10 blur-xl rounded-full -z-10" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;