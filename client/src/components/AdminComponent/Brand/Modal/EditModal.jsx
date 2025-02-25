// EditModal.jsx
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { editBrand } from "@/Api/Admin/brandApi";
import { message } from "antd";
import "antd/dist/reset.css"; 

const EditModal = ({ brand, onClose, onSave }) => {
  const [name, setName] = useState("");

 
  useEffect(() => {
    if (brand) {
      setName(brand.name);
    }
  }, [brand]);

  const handleSave = async () => {
    if (!name.trim()) {
      message.error("Brand name is required");
      return;
    }
    try {
  
      const updatedResponse = await editBrand(brand._id,name);
      message.success(updatedResponse.message);
      onSave(updatedResponse.brand);
      onClose();
    } catch (error) {
      message.error(error.message || "Error updating brand");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Brand Name</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update the brand name below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter new brand name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
