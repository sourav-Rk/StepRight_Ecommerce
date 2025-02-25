
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { addSize } from "@/Api/Admin/sizeApi.js"
import { message } from "antd"
import "antd/dist/reset.css"; 

const  AddSize = () => {
  const [sizes, setSizes] = useState([])
  const [newSize, setNewSize] = useState("")

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!newSize.trim()){
    message.error("Size cannot be empty");
    return;
    }
    try{
         const response = await addSize(newSize);
         message.success(response.message);
         setSizes([...sizes, newSize.trim().toUpperCase()]);
         setNewSize("");
        }
        catch(error){
          message.error(error?.message || "Error in adding size")
        }
    
  }


  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove))
  }

  return (

<div className="flex justify-center items-start min-h-screen pt-16 mt-10">
  <div className="w-96 p-4 bg-white rounded-lg shadow-sm border border-black.">
    <h2 className="text-lg font-semibold mb-4">Add Sizes</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="size-input"></Label>
        <div className="flex space-x-2">
          <Input
            id="size-input"
            type="text"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            placeholder="Enter size"
            className="flex-grow"
          />
          <Button type="submit" size="sm" >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Size</span>
          </Button>
        </div>
      </div>
    </form>
  </div>
</div>
  )
}

export default AddSize

