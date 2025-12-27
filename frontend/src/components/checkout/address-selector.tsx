"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Note: RadioGroup component requires @radix-ui/react-radio-group
// For now, using a simple div-based implementation
import { Address } from "@/types";
import { MapPin, Plus } from "lucide-react";
import Link from "next/link";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (addressId: string) => void;
  type: "shipping" | "billing";
}

/**
 * Address Selector Component
 * Allows users to select an address for shipping or billing
 */
export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  type,
}: AddressSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {type === "shipping" ? "Shipping Address" : "Billing Address"}
          </CardTitle>
          <Link href="/dashboard/addresses">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-600 mb-4">
              No addresses found. Please add an address to continue.
            </p>
            <Link href="/dashboard/addresses">
              <Button>Add Address</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => (
              <label
                key={address.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition hover:border-black"
                style={{
                  borderColor:
                    selectedAddressId === address.id ? "black" : "#e5e5e5",
                }}
              >
                <input
                  type="radio"
                  name={`${type}-address`}
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => onSelect(address.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="rounded bg-black px-2 py-0.5 text-xs text-white">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {address.city}, {address.state} {address.postalCode}
                  </p>
                  <p className="text-sm text-neutral-600">{address.country}</p>
                  <p className="text-sm text-neutral-600 mt-1">
                    Phone: {address.phone}
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
