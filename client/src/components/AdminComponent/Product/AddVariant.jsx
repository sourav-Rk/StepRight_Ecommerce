import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSize } from "@/Api/Admin/sizeApi";


const AddVariant = ({ variant, onChange, onDelete }) => {
  const [sizes, setSizes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await getSize();
        setSizes(response.sizes);   
      } catch (error) {
        console.error("Error fetching sizes:", error);
      }
    };

    fetchSizes();
  }, []);

  const handleChange = (field, value) => {
    onChange({ [field]: value });
  };

  return (
    <div className="w-full p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <Select
          value={variant.size}
          onValueChange={(value) => handleChange("size", value)}
        >
          <SelectTrigger className="w-full bg-white">
            <SelectValue placeholder="Select Size" />
          </SelectTrigger>
          <SelectContent>
            {sizes.length > 0 ? (
              sizes.map((size) => (
                <SelectItem key={size._id} value={size.size}>
                  {size.size}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled>No sizes available</SelectItem>
            )}
          </SelectContent>
        </Select>

        <div className="relative">
          <Input
            type="number"
            value={variant.regularPrice}
            onChange={(e) => handleChange("regularPrice", e.target.value)}
            placeholder="Regular Price"
            className="w-full pl-6 bg-white"
          />
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        </div>

        <Input
          type="number"
          value={variant.quantity}
          onChange={(e) => handleChange("quantity", e.target.value)}
          placeholder="Quantity"
          min="0"
          className="w-full bg-white"
        />

        <div className="flex justify-end sm:justify-start lg:justify-end">
          <Button
            variant="destructive"
            size="icon"
            onClick={onDelete}
            className="h-10 w-10 bg-red-100 hover:bg-red-200"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
            <span className="sr-only">Delete variant</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddVariant;


