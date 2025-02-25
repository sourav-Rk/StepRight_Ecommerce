import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addAddress, deleteAddress, editAddress } from "@/Api/User/addressApi";
import { message, Modal } from "antd";
import addressSchema from "@/Validators/addressValidation";

export default function DeliveryAddress({
  addresses,
  selectedAddress,
  setSelectedAddress,
  selectedAddressIndex
}) {

    // State for new address form data
    const [newAddress, setNewAddress] = useState({
      fullname: "",
      email: "",
      buildingname: "",
      landmark: "",
      address: "",
      district: "",
      state: "",
      city: "",
      pincode: ""
    });
    
    const [errors,setErrors] = useState({});

    // Handle changes in the new address form inputs
    const handleNewAddressChange = (e) => {
      const { name, value } = e.target;
      setNewAddress((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    
    //to save new  address
    const handleSaveAddress = async(e) => {

      e.preventDefault();

      setErrors({});

      // Validate input fields
      const { error } = addressSchema.validate(newAddress, { abortEarly: false });
      if (error) {
        const formattedErrors = {};
        error.details.forEach((err) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
        return;
      }

      try{
        const response = await addAddress(newAddress);

        message.success(response.message);

        setNewAddress({
          fullname: "",
          email: "",
          buildingname: "",
          landmark: "",
          address: "",
          district: "",
          state: "",
          city: "",
          pincode: ""
        })
      }
      catch(error){
        console.log("Error saving Address",error);
        message.error(error?.message || "failed to save the address");
      }
    }

    //to delete the address
    const handleDeleteAddress = async(id) => {
       try{
        const response = await deleteAddress(id);
        message.success(response.message);
       }
       catch(error){
         console.log("Error in deleting address",error);
         message.error(error?.message)
       }  
    }

    //confirmation modal for delete
    const confirmDelete = (id) =>{
      Modal.confirm({
        title : "Are you sure ? you want to delete this address",
        content : "This message cannot be undone",
        okText : "Yes",
        cancelText : "No",
        onOk (){
          handleDeleteAddress(id)
        }
      })
    }

  
  //
  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress && selectedAddressIndex) {
      setSelectedAddress(selectedAddressIndex._id);
    }
  }, [addresses, selectedAddress, selectedAddressIndex, setSelectedAddress]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Delivery Address</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle>Add New Address</DialogTitle>
  </DialogHeader>
  <div className="grid gap-2 py-0">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="fullname" className="text-sm font-medium">Full Name</Label>
        <Input 
          id="fullname"
          placeholder="Full Name" 
          name="fullname" 
          value={newAddress.fullname} 
          onChange={handleNewAddressChange} 
        />
        {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
      </div>
      <div>
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <Input 
          id="email"
          placeholder="Email" 
          name="email" 
          value={newAddress.email} 
          onChange={handleNewAddressChange} 
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
    </div>
    <div>
      <Label htmlFor="buildingname" className="text-sm font-medium">Building Name</Label>
      <Input 
        id="buildingname"
        placeholder="Building Name" 
        name="buildingname" 
        value={newAddress.buildingname} 
        onChange={handleNewAddressChange} 
      />
      {errors.buildingname && <p className="text-red-500 text-xs mt-1">{errors.buildingname}</p>}
    </div>
    <div>
      <Label htmlFor="landmark" className="text-sm font-medium">Landmark</Label>
      <Input 
        id="landmark"
        placeholder="Landmark" 
        name="landmark" 
        value={newAddress.landmark} 
        onChange={handleNewAddressChange} 
      />
      {errors.landmark && <p className="text-red-500 text-xs mt-1">{errors.landmark}</p>}
    </div>
    <div>
      <Label htmlFor="address" className="text-sm font-medium">Address</Label>
      <Textarea 
        id="address"
        placeholder="Address" 
        name="address" 
        value={newAddress.address} 
        onChange={handleNewAddressChange} 
      />
      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
    </div>
    <div>
      <Label htmlFor="district" className="text-sm font-medium">District</Label>
      <Input 
        id="district"
        placeholder="District" 
        name="district" 
        value={newAddress.district} 
        onChange={handleNewAddressChange} 
      />
      {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
    </div>
    <div>
      <Label htmlFor="state" className="text-sm font-medium">State</Label>
      <Input 
        id="state"
        placeholder="State" 
        name="state" 
        value={newAddress.state} 
        onChange={handleNewAddressChange} 
      />
      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
    </div>
    <div>
      <Label htmlFor="city" className="text-sm font-medium">City</Label>
      <Input 
        id="city"
        placeholder="City" 
        name="city" 
        value={newAddress.city} 
        onChange={handleNewAddressChange} 
      />
      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
    </div>
    <div>
      <Label htmlFor="pincode" className="text-sm font-medium">Pincode</Label>
      <Input 
        id="pincode"
        placeholder="Pincode" 
        name="pincode" 
        value={newAddress.pincode} 
        onChange={handleNewAddressChange} 
      />
      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
    </div>
    <Button onClick={handleSaveAddress}>Save Address</Button>
  </div>
</DialogContent>

        </Dialog>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAddress}
          onValueChange={setSelectedAddress}
          className="space-y-4"
        >
          {addresses.map((address) => (
            <div
              key={address._id}
              className="flex items-start space-x-4 rounded-lg border p-4 [&:has(:checked)]:bg-muted"
            >
              <RadioGroupItem
                value={address._id}
                id={`address-${address._id}`}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={`address-${address._id}`}
                  className="text-sm font-medium leading-none"
                >
                  {address.fullname}
                </Label>
                <p className="text-sm text-muted-foreground">{address.email}</p>
                <p className="text-sm text-muted-foreground">
                  {address.buildingname}, {address.address}
                </p>
                <p className="text-sm text-muted-foreground">{address.district}</p>
                <p className="text-sm text-muted-foreground">
                  Pincode: {address.pincode}
                </p>
                <p className="text-sm text-muted-foreground">
                  Landmark: {address.landmark}
                </p>
              </div>
              <div className="flex space-x-2">
              
                <Button onClick={() => confirmDelete(address._id)} variant="ghost" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
