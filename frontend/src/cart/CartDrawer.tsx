import { useAppDispatch, useAppSelector } from "@/store";
import {
  closeCart,
  removeCartItem,
  updateCartItem,
} from "@/store/slices/cartSlice";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const { cart, isOpen } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => dispatch(closeCart());

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeCartItem(itemId));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="flex items-center text-lg font-semibold">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shopping Cart ({cart?.itemCount || 0})
            </h2>
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {!cart || cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900">
                  Your cart is empty
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Add items to get started
                </p>
                <Link
                  href="/products"
                  onClick={handleClose}
                  className="mt-4 rounded-lg bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    {/* Image */}
                    <Image
                      src={item.product.image || "/placeholder.png"}
                      alt={item.product.name}
                      className="h-24 w-24 rounded object-cover"
                    />

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={handleClose}
                        className="font-medium hover:text-blue-600"
                      >
                        {item.product.name}
                      </Link>

                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <span>Size: {item.variant.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Color: {item.variant.color}
                          {item.variant.colorHex && (
                            <span
                              className="inline-block h-3 w-3 rounded-full border"
                              style={{ backgroundColor: item.variant.colorHex }}
                            />
                          )}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 rounded border">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-gray-100"
                            disabled={item.quantity >= item.variant.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            ₹{item.subtotal}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items.length > 0 && (
            <div className="border-t p-4">
              <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>₹{cart.subtotal}</span>
              </div>
              <Link
                href="/checkout"
                onClick={handleClose}
                className="block w-full rounded-lg bg-black py-3 text-center font-medium text-white hover:bg-gray-800"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={handleClose}
                className="mt-2 block w-full rounded-lg border py-3 text-center font-medium hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
