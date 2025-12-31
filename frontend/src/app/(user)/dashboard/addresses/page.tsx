"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/hooks/use-addresses";
import { Address } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(6, "Valid postal code is required"),
  country: z.string().optional().default("India"),
  isDefault: z.boolean().optional().default(false),
});

type AddressForm = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const { data, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "India",
      isDefault: false,
    },
  });

  const onSubmit = async (formData: AddressForm) => {
    const addressData = {
      ...formData,
      country: formData.country || "India",
      isDefault: formData.isDefault ?? false,
    };
    if (editingId) {
      await updateAddress.mutateAsync({ id: editingId, data: addressData });
    } else {
      await createAddress.mutateAsync(addressData);
    }
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    reset(address);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-40 rounded-[12px]" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-[16px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const addresses = data?.data || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="container-luxury py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-[0.95]">
                My Addresses
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-normal">
                Manage your shipping addresses
              </p>
            </div>
            <Button
              size="sm"
              variant="filled"
              onClick={() => setShowForm(!showForm)}
              className="rounded-[12px] gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Address
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-6 sm:py-8">
        {showForm && (
          <div className="bg-white border border-[#e5e5e5] p-4 rounded-[16px] mb-4">
            <h2 className="text-sm font-medium tracking-normal mb-3">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Full Name
                  </label>
                  <Input
                    {...register("fullName")}
                    className="h-9 rounded-[12px] border-[#e5e5e5] text-xs"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-[10px] mt-1 font-medium">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Phone
                  </label>
                  <Input
                    {...register("phone")}
                    className="h-9 rounded-[12px] border-[#e5e5e5] text-xs"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-[10px] mt-1 font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Address Line 1
                </label>
                <Input
                  {...register("addressLine1")}
                  className="h-9 rounded-[12px] border-[#e5e5e5] text-xs"
                />
                {errors.addressLine1 && (
                  <p className="text-red-600 text-[10px] mt-1 font-medium">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5">
                  Address Line 2 (Optional)
                </label>
                <Input
                  {...register("addressLine2")}
                  className="h-9 rounded-[12px] border-[#e5e5e5] text-xs"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    City
                  </label>
                  <Input
                    {...register("city")}
                    className="h-9 rounded-[12px] border-[#e5e5e5] text-xs"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-[10px] mt-1 font-medium">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    State
                  </label>
                  <Input
                    {...register("state")}
                    className="h-9 rounded-[12px] border-[#e5e5e5] text-xs"
                  />
                  {errors.state && (
                    <p className="text-red-600 text-[10px] mt-1 font-medium">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5">
                    Postal Code
                  </label>
                  <Input
                    {...register("postalCode")}
                    className="h-9 rounded-[12px] border-[#e5e5e5] text-xs"
                  />
                  {errors.postalCode && (
                    <p className="text-red-600 text-[10px] mt-1 font-medium">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("isDefault")}
                  className="w-3.5 h-3.5 border border-[#e5e5e5] rounded-[6px]"
                />
                <span className="text-xs font-normal tracking-normal">
                  Set as default address
                </span>
              </label>

              <div className="flex gap-2.5 pt-1.5">
                <Button
                  type="submit"
                  size="sm"
                  variant="filled"
                  className="rounded-[12px] h-9 text-xs"
                >
                  {editingId ? "Update Address" : "Add Address"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-[12px] h-9 text-xs border-[#e5e5e5]"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="text-center py-12 bg-white border border-[#e5e5e5] rounded-[16px]">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
            <h2 className="text-xl sm:text-2xl font-light tracking-tight leading-[0.95] mb-2">
              No addresses yet
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-normal mb-4">
              Add your first address to continue
            </p>
            <Button
              size="sm"
              variant="filled"
              onClick={() => setShowForm(true)}
              className="rounded-[12px] gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Address
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white border border-[#e5e5e5] p-4 rounded-[16px] hover:border-[#0a0a0a] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    {address.isDefault && (
                      <span className="inline-block px-2 py-0.5 bg-[#0a0a0a] text-[#fafafa] text-[10px] font-medium rounded-[8px] mb-2">
                        Default
                      </span>
                    )}
                    <p className="text-xs font-medium tracking-normal mb-1.5">
                      {address.fullName}
                    </p>
                    <p className="text-xs text-neutral-400 font-normal">
                      {address.addressLine1}
                    </p>
                    {address.addressLine2 && (
                      <p className="text-xs text-neutral-400 font-normal">
                        {address.addressLine2}
                      </p>
                    )}
                    <p className="text-xs text-neutral-400 font-normal">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-xs text-neutral-400 font-normal mb-1.5">
                      {address.country}
                    </p>
                    <p className="text-xs text-neutral-400 font-normal">
                      Phone: {address.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-[#e5e5e5]">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(address)}
                    className="rounded-[10px] h-8 text-xs gap-1.5 border-[#e5e5e5]"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(address.id)}
                    className="rounded-[10px] h-8 text-xs text-red-600 hover:text-red-700 hover:border-red-600 border-[#e5e5e5]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
