"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/use-admin";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import type { User } from "@/types";
import { Search, Users } from "lucide-react";
import { useState } from "react";

export default function AdminCustomersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("createdAt_desc");

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 20,
    search: searchQuery || undefined,
    sort: sortBy as
      | "createdAt_desc"
      | "createdAt_asc"
      | "name_asc"
      | "name_desc"
      | "email_asc"
      | "email_desc",
  });

  const updateStatus = useUpdateUserStatus();

  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      await updateStatus.mutateAsync({ userId, isActive });
      toast({
        title: "Success",
        description: `User ${
          isActive ? "activated" : "deactivated"
        } successfully`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const users = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
      <div className="container-luxury">
        {/* Header */}
        <div className="mb-6 border-b border-[#e5e5e5] pb-5">
          <h1 className="text-2xl sm:text-3xl font-medium tracking-normal mb-1.5">
            Customers Management
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Manage all customer accounts
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#e5e5e5] p-4 rounded-[12px] mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-[10px] h-10 text-sm"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full rounded-[10px] h-10 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt_desc">Newest First</SelectItem>
                <SelectItem value="createdAt_asc">Oldest First</SelectItem>
                <SelectItem value="name_asc">Name A-Z</SelectItem>
                <SelectItem value="name_desc">Name Z-A</SelectItem>
                <SelectItem value="email_asc">Email A-Z</SelectItem>
                <SelectItem value="email_desc">Email Z-A</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-neutral-500 font-medium flex items-center">
              Total: {data?.meta?.total || 0} customers
            </div>
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-[12px]">
            <Users className="h-16 w-16 mx-auto mb-6 text-neutral-300" />
            <p className="text-base font-medium tracking-normal text-neutral-600">
              No customers found
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white border border-[#e5e5e5] rounded-[12px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#fafafa] border-b border-[#e5e5e5]">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                        Joined
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium tracking-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: User) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#e5e5e5] hover:bg-[#fafafa] transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium tracking-normal">
                            {user.firstName} {user.lastName}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-sm text-neutral-600 font-medium">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-xs text-neutral-600 font-medium">
                          {user.phone || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 text-xs font-medium tracking-normal rounded-[6px] ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-neutral-600 font-medium">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(user.id, !user.isActive)
                            }
                            className="rounded-[8px] h-8 text-xs"
                            disabled={updateStatus.isPending}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
