import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Home, Trash2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteAddress, getAddresses, setAsDefault } from "@/Api/User/addressApi";
import { message,Modal } from "antd";

const AddressList = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await getAddresses();
        console.log(response);
        setAddresses(response.addresses);
      } catch (error) {
        console.log(error?.message || error);
      }
    };
    fetchAddresses();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      const response = await deleteAddress(id);
      message.success(response.message);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.log(error?.message);
      message.error(error?.message || "Failed to delete the address");
    }
    
  };

    // Confirmation dialog for deletion
    const confirmDelete = (id) => {
        Modal.confirm({
          title: "Are you sure you want to delete this address?",
          content: "This action cannot be undone.",
          okText: "Yes",
          cancelText: "No",
          onOk() {
            handleDelete(id);
          },
        });
      };

  const handleSetDefault = async (id) => {
    try {
      const response = await setAsDefault(id);
      message.success(response.message);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.log(error?.message);
      message.error(error?.message || "Failed to set default address");
    }
  };

  const AddNewAddressButton = () => (
    <Button
      variant="outline"
      className="h-full min-h-[200px] w-full border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all duration-300"
      onClick={() => navigate("/address/add")}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <PlusCircle className="h-8 w-8" />
        <span className="text-lg font-medium">Add New Address</span>
        <span className="text-sm text-muted-foreground">
          Click to add a new delivery address
        </span>
      </div>
    </Button>
  );

  const AddressCard = ({ address }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/address/${address._id}`);
    };

    return (
      <Card
        onClick={handleClick}
        className="group relative h-56 h- overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary"
      >
        <CardContent className="p-6">
          {address.isDefault ? (
            <span className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs">
              Default
            </span>
          ) : (
          
            <Button
              variant="secondary"
              size="sm"
              className="absolute bottom-4 left-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handleSetDefault(address._id);
              }}
            >
              Set as Default
            </Button>
          )}

          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Home className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{address.fullname}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{address.buildingname}</p>
                <p>{address.address}</p>
                <p>Landmark: {address.landmark}</p>
                <p>{`${address.city}, ${address.state} - ${address.pincode}`}</p>
              </div>
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="absolute bottom-4 right-4 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(address._id);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">My Addresses</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          {addresses.length}{" "}
          {addresses.length === 1 ? "address" : "addresses"} saved
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Address Button */}
        <AddNewAddressButton />

        {/* Address Cards */}
        {addresses.map((address) => (
          <AddressCard key={address._id} address={address} />
        ))}
      </div>
    </div>
  );
};

export default AddressList;
