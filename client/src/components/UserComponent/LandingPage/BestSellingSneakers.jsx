    // import React, { useEffect, useState } from 'react';
    // import ProductCard from '../Product/ProductCard';
    // import { getSneakers } from '@/Api/User/productApi';
    // import { useNavigate } from 'react-router-dom';



    // const BestSellingSneakers = () => {
      
    //   const navigate = useNavigate()

    //   const [items, setItems] = useState([])

    //   useEffect(() =>{
    //     const fetchProduct = async () =>{
    //       try{
    //         const response = await getSneakers();
    //         setItems(response.products)
    //       }
    //       catch(error){
    //         console.log("error in fetching sneakers",error)
    //       }
    //     }
    //     fetchProduct()
    //   },[]);

        
    //   return (
    //     <div className="w-full bg-white px-4 py-8 md:px-6 lg:px-8">
    //       {/* Heading */}
    //       <h2 className="text-3xl text-center md:text-4xl font-bold text-black mb-16 mt-12 hover:text-green-400">
    //         Best Selling Sneakers
    //       </h2>

    //       {/* Product Grid */}
    //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-10 gap-y-20 ml-14">
    //         {items.map((product, index) => (
    //           <div key={index}
    //           onClick={() => navigate(`/product-detail/${product._id}`)}
    //           >
    //           <ProductCard
    //               id={product._id}
    //               name={product.name}
    //               regularPrice={product.variants[0].regularPrice} 
    //               salePrice={product.variants[0].salePrice}
    //               rating={product.averageRating} 
    //               imageUrl={product.images[0]}
    //               variants={product.variants} 
    //             />
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   );
    // };

    // export default BestSellingSneakers;


    import React, { useEffect, useState } from 'react';
    import ProductCard from '../Product/ProductCard';
    import { getSneakers } from '@/Api/User/productApi';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    
    const BestSellingSneakers = () => {
      const navigate = useNavigate();
      const [items, setItems] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
    
      useEffect(() => {
        const fetchProduct = async () => {
          try {
            setIsLoading(true);
            const response = await getSneakers();
            setItems(response.products);
          } catch (error) {
            console.log("error in fetching sneakers", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchProduct();
      }, []);
    
      return (
        <div className="w-full bg-white px-4 py-8 md:px-6 lg:px-8">
          {/* Heading */}
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl text-center md:text-4xl font-bold text-black mb-16 mt-12"
          >
            Best Selling Sneakers
          </motion.h2>
    
          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center my-20">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20 ml-14">
              {items.map((product, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => navigate(`/product-detail/${product._id}`)}
                  className="cursor-pointer transform transition duration-300 hover:scale-105"
                >
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    regularPrice={product.variants[0].regularPrice} 
                    salePrice={product.variants[0].salePrice}
                    rating={product.averageRating} 
                    imageUrl={product.images[0]}
                    variants={product.variants} 
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          {/* "See All" button */}
          {!isLoading && items.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex justify-center mt-16"
            >
              <button 
                onClick={() => navigate('/shop-all')}
                className="px-8 py-3 border border-black text-black font-medium transition-colors duration-300 hover:bg-black hover:text-white"
              >
                See All
              </button>
            </motion.div>
          )}
        </div>
      );
    };
    
    export default BestSellingSneakers;