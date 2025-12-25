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
import { MapPin, Plus, Trash2 } from "lucide-react";
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
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const addresses = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Addresses</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {showForm && (
        <div className="glass rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Address" : "Add New Address"}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <Input {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input {...register("phone")} />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Address Line 1
              </label>
              <Input {...register("addressLine1")} />
              {errors.addressLine1 && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.addressLine1.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Address Line 2 (Optional)
              </label>
              <Input {...register("addressLine2")} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <Input {...register("city")} />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Input {...register("state")} />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Postal Code
                </label>
                <Input {...register("postalCode")} />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isDefault")} />
              <span className="text-sm">Set as default address</span>
            </label>

            <div className="flex gap-3">
              <Button type="submit">
                {editingId ? "Update Address" : "Add Address"}
              </Button>
              <Button
                type="button"
                variant="outline"
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
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
          <h2 className="text-2xl font-bold mb-2">No addresses yet</h2>
          <p className="text-neutral-600 mb-6">
            Add your first address to continue
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="glass rounded-lg p-6">
              {address.isDefault && (
                <span className="inline-block px-2 py-1 bg-black text-white text-xs rounded mb-2">
                  Default
                </span>
              )}
              <p className="font-semibold mb-1">{address.fullName}</p>
              <p className="text-sm text-neutral-600">{address.addressLine1}</p>
              {address.addressLine2 && (
                <p className="text-sm text-neutral-600">
                  {address.addressLine2}
                </p>
              )}
              <p className="text-sm text-neutral-600">
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p className="text-sm text-neutral-600 mb-4">{address.phone}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(address)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(address.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
