    import React, { useEffect, useState } from 'react';
    import ProductCard from '../Product/ProductCard';
    import { getSneakers } from '@/Api/User/productApi';
    import { useNavigate } from 'react-router-dom';



    const BestSellingSneakers = () => {
      
      const navigate = useNavigate()

      const [items, setItems] = useState([])

      useEffect(() =>{
        const fetchProduct = async () =>{
          try{
            const response = await getSneakers();
            setItems(response.products)
          }
          catch(error){
            console.log("error in fetching sneakers",error)
          }
        }
        fetchProduct()
      },[]);

        
      return (
        <div className="w-full bg-white px-4 py-8 md:px-6 lg:px-8">
          {/* Heading */}
          <h2 className="text-3xl text-center md:text-4xl font-bold text-black mb-16 mt-12 hover:text-green-400">
            Best Selling Sneakers
          </h2>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-10 gap-y-20 ml-14">
            {items.map((product, index) => (
              <div key={index}
              onClick={() => navigate(`/product-detail/${product._id}`)}
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
              </div>
            ))}
          </div>
        </div>
      );
    };

    export default BestSellingSneakers;