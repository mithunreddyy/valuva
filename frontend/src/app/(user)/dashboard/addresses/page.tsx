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
import { MapPin, Plus, Trash2, Edit } from "lucide-react";
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
      <div className="min-h-screen bg-[#fafafa]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const addresses = data?.data || [];

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="container-luxury py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-normal">
                My Addresses
              </h1>
              <p className="text-sm text-neutral-500 font-medium">
                Manage your shipping addresses
              </p>
            </div>
            <Button
              size="lg"
              variant="filled"
              onClick={() => setShowForm(!showForm)}
              className="rounded-[10px]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-luxury py-8 sm:py-12">
        {showForm && (
          <div className="bg-white border border-[#e5e5e5] p-6 sm:p-8 rounded-[12px] mb-6">
            <h2 className="text-2xl font-medium tracking-normal mb-6">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <Input
                    {...register("fullName")}
                    className="rounded-[10px]"
                  />
                  {errors.fullName && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <Input
                    {...register("phone")}
                    className="rounded-[10px]"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Address Line 1
                </label>
                <Input
                  {...register("addressLine1")}
                  className="rounded-[10px]"
                />
                {errors.addressLine1 && (
                  <p className="text-red-600 text-xs mt-1 font-medium">
                    {errors.addressLine1.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Address Line 2 (Optional)
                </label>
                <Input
                  {...register("addressLine2")}
                  className="rounded-[10px]"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    {...register("city")}
                    className="rounded-[10px]"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <Input
                    {...register("state")}
                    className="rounded-[10px]"
                  />
                  {errors.state && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Postal Code
                  </label>
                  <Input
                    {...register("postalCode")}
                    className="rounded-[10px]"
                  />
                  {errors.postalCode && (
                    <p className="text-red-600 text-xs mt-1 font-medium">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("isDefault")}
                  className="w-4 h-4 border border-[#e5e5e5] rounded-[4px]"
                />
                <span className="text-sm font-medium tracking-normal">
                  Set as default address
                </span>
              </label>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  size="lg"
                  variant="filled"
                  className="rounded-[10px]"
                >
                  {editingId ? "Update Address" : "Add Address"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="rounded-[10px]"
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
          <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-[12px]">
            <MapPin className="h-16 w-16 mx-auto mb-6 text-neutral-300" />
            <h2 className="text-2xl sm:text-3xl font-medium tracking-normal mb-4">
              No addresses yet
            </h2>
            <p className="text-sm text-neutral-500 font-medium mb-6">
              Add your first address to continue
            </p>
            <Button
              size="lg"
              variant="filled"
              onClick={() => setShowForm(true)}
              className="rounded-[10px]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] hover:border-[#0a0a0a] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {address.isDefault && (
                      <span className="inline-block px-2 py-1 bg-[#0a0a0a] text-[#fafafa] text-xs font-medium rounded-[6px] mb-3">
                        Default
                      </span>
                    )}
                    <p className="text-base font-medium tracking-normal mb-2">
                      {address.fullName}
                    </p>
                    <p className="text-sm text-neutral-600 font-medium">
                      {address.addressLine1}
                    </p>
                    {address.addressLine2 && (
                      <p className="text-sm text-neutral-600 font-medium">
                        {address.addressLine2}
                      </p>
                    )}
                    <p className="text-sm text-neutral-600 font-medium">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-neutral-600 font-medium mb-2">
                      {address.country}
                    </p>
                    <p className="text-sm text-neutral-600 font-medium">
                      Phone: {address.phone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-[#e5e5e5]">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(address)}
                    className="rounded-[8px]"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(address.id)}
                    className="rounded-[8px] text-red-600 hover:text-red-700 hover:border-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
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
