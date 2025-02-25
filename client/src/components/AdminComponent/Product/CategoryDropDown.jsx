import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {getCategoryDropDown} from '@/Api/Admin/productApi.js'

const CategoryDropdown = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryDropDown();
        setCategories(response.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const selectedLabel = categories.find(cat => cat._id === selectedCategory)?.name;

  return (
    <div className="space-y-2">
      <Label>Category</Label>
      <Select value={selectedCategory} onValueChange={(value) => onSelectCategory(value)}>
        <SelectTrigger>
          <SelectValue>
            {selectedLabel || "Select Category"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryDropdown;
