import addressDB from "../../Models/addressSchema.js";
import { refreshTokenDecoder } from "../../utils/jwtToken/decodeRefreshToken.js";
import { errorHandler } from "../../Middleware/error.js";

//to add address
export const addAddress = async (req, res, next) => {
  const formData = req.body;
  const id = refreshTokenDecoder(req);

  try {
    const newAddress = new addressDB({ ...formData, userId: id });
    await newAddress.save();
    return res.status(200).json({ message: "New Address added successfully" });
  } catch (error) {
    return next(
      errorHandler(500, "something went wrong when adding new address")
    );
  }
};

//edit address
export const editAddress = async (req, res, next) => {
  const addressId = req.params.id;
  const formData = req.body;

  try {
    const updateAddress = await addressDB.updateOne(
      { _id: addressId },
      { $set: formData }
    );

    if (updateAddress.modifiedCount === 0)
      return res.status(400).json({ message: "No changes were made" });

    return res.status(200).json({ message: "address update successfully" });
  } catch (error) {
    return next(errorHandler(500, "something went wrong please try again"));
  }
};

//to get all addresses
export const getAddresses = async (req, res, next) => {
  try {
    const id = refreshTokenDecoder(req);
    const addresses = await addressDB.find({ userId: id });
    if (!addresses) {
      return next(errorHandler(404, "addresses not found"));
    }
    return res
      .status(200)
      .json({ message: "addresses fetched successfully", addresses });
  } catch (error) {
    return next(errorHandler(500, "something went wrong please try again"));
  }
};

//to get a specific address
export const getAddress = async (req, res, next) => {
  try {
    const addressId = req.params.id;

    const address = await addressDB.findOne({ _id: addressId });

    if (!address) {
      return next(errorHandler(404, "addrress not fouund"));
    }

    return res
      .status(200)
      .json({ message: "address fetched successfully", address });
  } catch (error) {
    return next(errorHandler(500, "something went wrong!please try again"));
  }
};

//to delete address
export const deleteAddress = async (req, res, next) => {
  const addressId = req.params.id;
  try {
    const address = await addressDB.findOne({ _id: addressId });

    if (address.isDefault)
      return next(errorHandler(400, "You cannot delete the default address"));

    const deleteAddress = await addressDB.deleteOne({ _id: addressId });
    if (deleteAddress.deletedCount === 0)
      return next(errorHandler(404, "Address not found or already deleted"));

    return res.status(200).json({ message: "address deleted successfully" });
  } catch (error) {
    return next(errorHandler(500, "something went wrong!please try again"));
  }
};

//to set the address as default
export const setDefaultAddress = async (req, res, next) => {
  const addressId = req.params.id;
  try {
    //address to be set as default
    const targetAddress = await addressDB.findById(addressId);
    if (!targetAddress) return next(errorHandler(404, "Address not found"));

    await addressDB.updateMany(
      { userId: targetAddress.userId },
      { isDefault: false }
    );

    await addressDB.updateOne({ _id: addressId }, { isDefault: true });

    return res.status(200).json({ message: "Address set as default" });
  } catch (error) {
    return next(errorHandler(500, "something went wrong!Please try again"));
  }
};
