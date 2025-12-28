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
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e5e5e5] p-4 sm:p-6">
            <h2 className="flex items-center text-base sm:text-lg font-medium tracking-normal text-[#0a0a0a]">
              <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Shopping Cart ({cart?.itemCount || 0})
            </h2>
            <button
              onClick={handleClose}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-[16px] hover:bg-[#fafafa] transition-colors"
              aria-label="Close cart"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {!cart || cart.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center space-y-5 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] bg-[#fafafa] border border-[#e5e5e5] flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-neutral-300" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-medium text-[#0a0a0a]">
                    Your cart is empty
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    Add items to get started
                  </p>
                </div>
                <Link
                  href="/shop"
                  onClick={handleClose}
                  className="rounded-[16px] bg-[#0a0a0a] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#e5e5e5] last:border-0"
                  >
                    {/* Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 border border-[#e5e5e5] rounded-[16px] overflow-hidden bg-[#fafafa] flex-shrink-0">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback to a default product icon or empty state
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                          <span className="text-neutral-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={handleClose}
                        className="text-xs sm:text-sm font-medium text-[#0a0a0a] hover:opacity-70 transition-opacity line-clamp-1 mb-1"
                      >
                        {item.product.name}
                      </Link>

                      <div className="mb-2 flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-neutral-500 font-medium">
                        <span>Size: {item.variant.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          Color: {item.variant.color}
                          {item.variant.colorHex && (
                            <span
                              className="inline-block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-[#e5e5e5]"
                              style={{ backgroundColor: item.variant.colorHex }}
                            />
                          )}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 sm:gap-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[#e5e5e5] rounded-[16px] overflow-hidden">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-[#fafafa] transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>
                          <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium text-[#0a0a0a]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-[#fafafa] transition-colors disabled:opacity-50"
                            disabled={item.quantity >= item.variant.stock}
                          >
                            <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm font-medium text-[#0a0a0a]">
                            ₹{item.subtotal}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-red-600 hover:bg-red-50 transition-all rounded-[16px]"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
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
            <div className="border-t border-[#e5e5e5] p-4 sm:p-6 bg-[#fafafa]">
              <div className="mb-4 sm:mb-5 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-neutral-500">
                  Subtotal:
                </span>
                <span className="text-base sm:text-lg font-medium text-[#0a0a0a]">
                  ₹{cart.subtotal}
                </span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  href="/checkout"
                  onClick={handleClose}
                  className="block w-full rounded-[16px] bg-[#0a0a0a] py-2.5 sm:py-3 text-center text-xs sm:text-sm font-medium text-white hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full rounded-[16px] border border-[#e5e5e5] bg-white py-2.5 sm:py-3 text-center text-xs sm:text-sm font-medium text-[#0a0a0a] hover:bg-[#fafafa] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
