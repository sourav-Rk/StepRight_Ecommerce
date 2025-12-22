import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import addressSchema from "@/Validators/addressValidation";
import { addAddress, editAddress, getAddress } from "@/Api/User/addressApi";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";

const AddressForm = ({ name }) => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    buildingname: "",
    landmark: "",
    address: "",
    district: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(!id);

  useEffect(() => {
    if (id) {
      const fetchAddress = async () => {
        try {
          const addressResult = await getAddress(id);
          setFormData(addressResult.address);
          setIsEditing(false); 
        } catch (error) {
          message.error(error?.message);
        }
      };
      fetchAddress();
    }
  }, [id]);

   // Handle input changes
   const handleChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
   
    setErrors((prevErrors) => {
      if (prevErrors[name]) {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      }
      return prevErrors;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validate input fields
    const { error } = addressSchema.validate(formData, { abortEarly: false });
    if (error) {
      const formattedErrors = {};
      error.details.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setLoading(true);
  
    try {
       
      if (id) {
        const response = await editAddress(id, formData);
        message.success(response.message);
      } else {
        //to add  new address
        console.log("Adding new address with Form Data:", formData);
        const response = await addAddress(formData);
        message.success(response.message);
      }
      
      setTimeout(() => {
        navigate("/address");
      }, 500);
      
      setIsEditing(false);
    } catch (error) {
        message.error(error?.message)
        setServerError(error?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-8 mt-0">
      <CardHeader className="flex justify-between items-center">
        <CardTitle className="text-2xl font-bold">{isEditing ? "Edit Address" : name}</CardTitle>
        {id && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditing((prev) => !prev)}
            title="Edit Address"
          >
            <Pencil className="w-5 h-5" />
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Full Name" name="fullname" value={formData.fullname} onChange={handleChange} isEditing={isEditing} errors={errors} />
              <InputField label="Email" name="email" value={formData.email} onChange={handleChange} isEditing={isEditing} errors={errors} type="email" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Address Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Building Name" name="buildingname" value={formData.buildingname} onChange={handleChange} isEditing={isEditing} errors={errors} />
              <InputField label="Landmark" name="landmark" value={formData.landmark} onChange={handleChange} isEditing={isEditing} errors={errors} />
              <InputField label="Street Address" name="address" value={formData.address} onChange={handleChange} isEditing={isEditing} errors={errors} fullWidth />
              <InputField label="District" name="district" value={formData.district} onChange={handleChange} isEditing={isEditing} errors={errors} />
              <InputField label="State" name="state" value={formData.state} onChange={handleChange} isEditing={isEditing} errors={errors} />
              <InputField label="City" name="city" value={formData.city} onChange={handleChange} isEditing={isEditing} errors={errors} />
              <InputField label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} isEditing={isEditing} errors={errors} />
            </div>
          </div>

          {(!id || isEditing) && (
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Saving..." : id ? "Update Address" : "Add Address"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

// Reusable input field component
const InputField = ({ label, name, value, onChange, isEditing, errors, type = "text", fullWidth = false }) => {
  return (
    <div className={`space-y-2 ${fullWidth ? "md:col-span-2" : ""}`}>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={!isEditing}
        className={`${!isEditing ? "cursor-not-allowed opacity-50 hover:cursor-not-allowed" : ""}`}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );
};

export default AddressForm;
