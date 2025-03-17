import ProductDB from "../../Models/productSchema.js";
import cartDB from "../../Models/cartSchema.js";
import { refreshTokenDecoder } from "../../utils/jwtToken/decodeRefreshToken.js";
import { errorHandler } from "../../Middleware/error.js";
import wishListDB from "../../Models/wishListSchema.js";

//to add items to the cart
export const addToCart = async (req, res, next) => {
  try {
    const userId = refreshTokenDecoder(req);

    const { productId, size } = req.body;

    if (!productId || !size)
      return next(errorHandler(400, "Product and size are required"));

    //finding the product
    const product = await ProductDB.findById(productId);
    if (!product) return next(errorHandler(404, "Product not found"));

    //finding the variant
    const variant = product.variants.find((v) => v.size === size);
    if (!variant)
      return next(
        errorHandler(404, "The selected size is not available for this product")
      );
    if (variant.quantity < 1)
      return next(errorHandler(404, "The size is out of stock"));

    //finds the cart for the user or create a new one
    let cart = await cartDB.findOne({ userId });

    if (!cart) {
      cart = new cartDB({
        userId,
        items: [],
      });
    }

    const existingProduct = cart?.items?.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingProduct) {
      if (existingProduct.quantity < 5) {
        //updates the quantity
        const newQuantity = existingProduct.quantity + 1;
        if (newQuantity > variant.quantity)
          return next(
            errorHandler(400, "cannot add more than available stock")
          );
        existingProduct.quantity = newQuantity;
      } else {
        return next(errorHandler(400, "Cannot add more than 5"));
      }
    } else {
      cart.items.push({
        product: productId,
        size,
        quantity: 1,
        price: variant.salePrice,
      });
    }

    await cart.save();

    await wishListDB.updateOne(
      { user: userId },
      { $pull: { products: { productId, size } } }
    );

    return res
      .status(200)
      .json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.log("Error in adding to cart", error);
    return next(errorHandler(500, "something went wrong . please try again"));
  }
};

//to get the cart items
export const getCartProducts = async (req, res, next) => {
  try {
    const userId = refreshTokenDecoder(req);

    const cartProducts = await cartDB
      .findOne({ userId })
      .populate("items.product");

    if (!cartProducts)
      return next(errorHandler(404, "You havent added any items to the cart"));

    return res
      .status(200)
      .json({ message: "Cart products fetched successfully", cartProducts });
  } catch (error) {
    return next(errorHandler(500, "something went wrong ! Please try again"));
  }
};

//remove cart item
export const removeCartItem = async (req, res, next) => {
  try {
    const userId = refreshTokenDecoder(req);
    const { itemId } = req.params;

    const cart = await cartDB.findOne({ userId });
    if (!cart) return next(errorHandler(404, "Cart not found"));

    //find the index of the item in the cart
    const item = cart.items.find((i) => i._id.toString() === itemId);
    if (!item) return next(errorHandler(404, "Item not found in the cart"));

    cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
    await cart.save();

    return res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    return next(errorHandler(500, "Internal server error ! Please try again"));
  }
};

//update cart items quantity
export const updateCartItemQuantity = async (req, res, next) => {
  try {
    const userId = refreshTokenDecoder(req);
    const { itemId } = req.params;
    const { change } = req.body;

    //validate change is -1 or 1
    if (typeof change !== "number" || (change !== 1 && change !== -1)) {
      return next(errorHandler(400, "Change value must be either 1 or -1"));
    }

    const cart = await cartDB.findOne({ userId });
    if (!cart) return next(errorHandler(404, "cart not found"));

    //find the cart items
    const item = cart.items.id(itemId);
    if (!item) return next(errorHandler(404, "item not found in the cart"));

    const product = await ProductDB.findById(item.product);
    if (!product) return next(errorHandler(404, "product not found"));

    //finding tje variant by the size stored in the cart item
    const variant = product.variants.find((v) => v.size === item.size);
    if (!variant) return next(errorHandler(404, "variant not found"));

    const newQuantity = item.quantity + change;
    if (newQuantity < 1)
      return next(errorHandler(400, "Quantity must be atleast one"));
    if (newQuantity > 5)
      return next(errorHandler(400, "You can only buy a quantity of 5"));
    if (newQuantity > variant.quantity)
      return next(
        errorHandler(400, "Requested quantity exceeds available stock")
      );

    //update the cart item quantity
    item.quantity = newQuantity;
    await cart.save();

    return res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.error("Error updating cart item quantity", error);
    return next(errorHandler(500, "Something went wrong! Please try again"));
  }
};

//proceed to checkout
export const proceedToCheckout = async (req, res, next) => {
  try {
    const userId = refreshTokenDecoder(req);
    if (!userId) return next(errorHandler(401, "unauthorized"));

    const cart = await cartDB.findOne({ userId }).populate("items.product");

    if (!cart) return next(errorHandler(404, "Cart not found"));

    return res.status(200).json({ cart });
  } catch (error) {
    return next(errorHandler(500, "Something went wrong!Please try again"));
  }
};
