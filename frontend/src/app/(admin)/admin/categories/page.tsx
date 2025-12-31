"use client";

import { CategoryFormModal } from "@/components/admin/category-form-modal";
import { SubCategoryFormModal } from "@/components/admin/subcategory-form-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-categories";
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api/admin";
import { Category, SubCategory } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit, GripVertical, Plus, Tag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function AdminCategoriesPage() {
  const { data, isLoading } = useCategories();
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<{
    subCategory: SubCategory;
    categoryId: string;
  } | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  const deleteCategory = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  const deleteSubCategory = useMutation({
    mutationFn: (id: string) => adminApi.deleteSubCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Success",
        description: "Subcategory deleted successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to delete subcategory",
        variant: "destructive",
      });
    },
  });

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCreateSubCategory = (categoryId: string) => {
    setEditingSubCategory({
      subCategory: {
        id: "",
        name: "",
        description: "",
        image: "",
        categoryId,
        slug: "",
        isActive: true,
        sortOrder: 0,
      },
      categoryId,
    });
    setEditingSubCategory(null);
    setIsSubCategoryModalOpen(true);
  };

  const handleEditSubCategory = (
    subCategory: SubCategory,
    categoryId: string
  ) => {
    setEditingSubCategory({ subCategory, categoryId });
    setIsSubCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleDeleteSubCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this subcategory?")) {
      deleteSubCategory.mutate(id);
    }
  };

  const categories = data?.data || [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 border-b border-[#e5e5e5] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1 text-[#0a0a0a] leading-[0.95]">
            Categories Management
          </h1>
          <p className="text-xs text-neutral-400 font-normal">
            Manage product categories and subcategories
          </p>
        </div>
        <Button
          onClick={handleCreateCategory}
          size="sm"
          variant="filled"
          className="rounded-[12px] gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-[12px]" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 bg-white border border-[#e5e5e5] rounded-[16px]">
          <Tag className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
          <p className="text-sm font-medium text-neutral-600 mb-2">
            No categories found
          </p>
          <p className="text-xs text-neutral-500 font-normal">
            Create your first category to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category: Category) => (
            <div
              key={category.id}
              className="bg-white border border-[#e5e5e5] rounded-[16px] p-4 hover:border-[#0a0a0a] transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Category Image */}
                {category.image && (
                  <div className="relative w-16 h-16 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] rounded-[12px] flex-shrink-0">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium tracking-normal mb-1">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-neutral-600 font-normal mb-1.5">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-xs text-neutral-500 font-normal">
                        <span>{category._count?.products || 0} products</span>
                        <span>
                          {category.subCategories?.length || 0} subcategories
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="h-7 w-7 p-0 rounded-[8px]"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="h-7 w-7 p-0 rounded-[8px] text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deleteCategory.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="mt-3 pt-3 border-t border-[#e5e5e5]">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-xs font-medium text-[#0a0a0a]">
                        Subcategories
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCreateSubCategory(category.id)}
                        className="rounded-[10px] h-7 text-xs gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </Button>
                    </div>
                    {category.subCategories &&
                    category.subCategories.length > 0 ? (
                      <div className="space-y-1.5">
                        {category.subCategories.map((sub: SubCategory) => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-2.5 bg-[#fafafa] border border-[#e5e5e5] rounded-[10px]"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <GripVertical className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                              {sub.image && (
                                <div className="relative w-8 h-8 border border-[#e5e5e5] overflow-hidden bg-white rounded-[8px] flex-shrink-0">
                                  <Image
                                    src={sub.image}
                                    alt={sub.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-[#0a0a0a] truncate">
                                  {sub.name}
                                </p>
                                {sub.description && (
                                  <p className="text-xs text-neutral-500 truncate font-normal">
                                    {sub.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditSubCategory(sub, category.id)
                                }
                                className="h-6 w-6 p-0 rounded-[8px]"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteSubCategory(sub.id)
                                }
                                className="h-6 w-6 p-0 rounded-[8px] text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deleteSubCategory.isPending}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-500 font-normal text-center py-2">
                        No subcategories yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

        {/* Modals */}
        {isCategoryModalOpen && (
          <CategoryFormModal
            category={editingCategory}
            isOpen={isCategoryModalOpen}
            onClose={() => {
              setIsCategoryModalOpen(false);
              setEditingCategory(null);
            }}
          />
        )}

        {isSubCategoryModalOpen && (
          <SubCategoryFormModal
            subCategory={editingSubCategory?.subCategory}
            categoryId={editingSubCategory?.categoryId || ""}
            isOpen={isSubCategoryModalOpen}
            onClose={() => {
              setIsSubCategoryModalOpen(false);
              setEditingSubCategory(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
