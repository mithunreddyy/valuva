"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api/admin";
import { Category, SubCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Tag } from "lucide-react";
import { useState } from "react";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const createCategory = useMutation({
    mutationFn: (data: Category) => adminApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      setShowForm(false);
      setFormData({ name: "", description: "", image: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCategory.mutateAsync({
      ...formData,
      id: "",
      slug: "",
      isActive: true,
      sortOrder: 0,
    });
  };

  const categories = data?.data || [];

  return (
    <div className="min-h-screen bg-[#fafafa] py-8 sm:py-12 lg:py-16">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#e5e5e5] pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-normal mb-3">
              Categories Management
            </h1>
            <p className="text-sm text-neutral-500 font-medium tracking-normal">
              Manage product categories and subcategories
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="lg"
            className="rounded-[10px]"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Add Category"}
          </Button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] mb-6">
            <h2 className="text-xl font-medium tracking-normal mb-4">
              Create New Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Category name"
                  required
                  className="rounded-[10px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Category description"
                  className="rounded-[10px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image URL
                </label>
                <Input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="Image URL"
                  className="rounded-[10px]"
                />
              </div>
              <Button
                type="submit"
                disabled={createCategory.isPending}
                className="rounded-[10px]"
              >
                {createCategory.isPending ? "Creating..." : "Create Category"}
              </Button>
            </form>
          </div>
        )}

        {/* Categories List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-[12px]">
            <Tag className="h-16 w-16 mx-auto mb-6 text-neutral-300" />
            <p className="text-base font-medium tracking-normal text-neutral-600">
              No categories found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category: Category) => (
              <div
                key={category.id}
                className="bg-white border border-[#e5e5e5] p-6 rounded-[12px] hover:border-[#0a0a0a] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium tracking-normal mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-sm text-neutral-600 mb-2">
                        {category.description}
                      </p>
                    )}
                    <p className="text-xs text-neutral-500">
                      {category._count?.products || 0} products
                    </p>
                  </div>
                </div>
                {category.subCategories &&
                  category.subCategories.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                      <p className="text-xs font-medium text-neutral-500 mb-2">
                        Subcategories:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {category.subCategories.map((sub: SubCategory) => (
                          <span
                            key={sub.id}
                            className="px-2 py-1 bg-[#fafafa] text-xs font-medium rounded-[6px]"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
