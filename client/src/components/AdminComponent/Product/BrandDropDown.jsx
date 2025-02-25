import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {  getBrandsDropDown } from "@/Api/Admin/productApi.js"; 

const BrandDropdown = ({ selectedBrand, onSelectBrand }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getBrandsDropDown();
        setBrands(response.brands);
      } catch (error) {
        console.error("Error fetching brands", error);
      }
    };
    fetchBrands();
  }, []);

  const selectedLabel = brands.find(brand => brand._id === selectedBrand)?.name;

  return (
    <div className="space-y-2">
      <Label>Brand</Label>
      <Select value={selectedBrand} onValueChange={onSelectBrand}>
        <SelectTrigger>
          <SelectValue>
            {selectedLabel || "Select brand"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {brands.map((brand) => (
            <SelectItem key={brand._id} value={brand._id}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BrandDropdown;
