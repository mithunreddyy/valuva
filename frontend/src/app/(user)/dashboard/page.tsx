"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-neutral-600">Manage your account information</p>
      </div>

      <div className="glass rounded-lg p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name
              </label>
              <Input defaultValue={user.firstName} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <Input defaultValue={user.lastName} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input defaultValue={user.email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input defaultValue={user.phone || ""} />
          </div>

          <Button type="submit">Save Changes</Button>
        </form>
      </div>
    </div>
  );
}
