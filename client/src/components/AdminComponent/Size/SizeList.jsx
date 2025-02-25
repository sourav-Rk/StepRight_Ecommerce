import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { blockSize, getSize } from "@/Api/Admin/sizeApi";
import ConfirmSwitch from "../Modal/ConfirmSwitch";
import { message } from "antd";
import "antd/dist/reset.css"; 

const SizeList = () => {

    const [sizes, setSizes] = useState([]);

    useEffect(() =>{
        const fetchSizes = async () => {
            try{
                const response = await getSize();
                setSizes(response.sizes);
            }
            catch(error){
                message.error("error in fetching sizes")
            }
        }
        fetchSizes();
    },[]);

      // Handle toggling of size status (block/unblock)
      const handleToggleStatus = async (id, index) => {
        try {
          const response = await blockSize(id);
          const updatedSizes = sizes.map((size, i) =>
            i === index ? { ...size, isActive: !size.isActive } : size
          );
          setSizes(updatedSizes);
        } catch (error) {
          console.error("Error updating size status", error);
          message.error("Error updating size status");
        }
      };
    
  return (
    <div className="w-3/4 p-4 bg-white rounded-lg shadow-sm absolute top-72 right-0">
    <h2 className="text-lg font-semibold mb-4 text-center">Size List</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Sl No</th>
            <th className="px-4 py-2 border">Size</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Toggle</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2 text-center">{index + 1}</td>
              <td className="px-4 py-2 text-center">{item.size}</td>
              <td className="px-4 py-2 text-center">
                {item.isActive ? (
                  <CheckCircle className="w-5 h-5 text-green-500 inline-block" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 inline-block" />
                )}
              </td>
              <td className="px-4 py-2 text-center">
                  <ConfirmSwitch
                    checked={!!item.isActive}
                    name={item.size}
                    onToggle={() => handleToggleStatus(item._id, index)}
                  />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>  
  );
};

export default SizeList;
