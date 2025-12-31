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
    <div className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-[#e5e5e5] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-normal mb-1.5">
              Categories Management
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Manage product categories and subcategories
            </p>
          </div>
          <Button
            onClick={handleCreateCategory}
            size="default"
            variant="filled"
            className="rounded-[10px] h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-[12px]" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-[12px]">
            <Tag className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-sm font-medium text-neutral-600 mb-2">
              No categories found
            </p>
            <p className="text-xs text-neutral-500 font-medium">
              Create your first category to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category: Category) => (
              <div
                key={category.id}
                className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 hover:border-[#0a0a0a] transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Category Image */}
                  {category.image && (
                    <div className="relative w-20 h-20 border border-[#e5e5e5] overflow-hidden bg-[#fafafa] rounded-[10px] flex-shrink-0">
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
                        <h3 className="text-base font-medium tracking-normal mb-1">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-neutral-600 font-medium mb-2">
                            {category.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-neutral-500 font-medium">
                          <span>{category._count?.products || 0} products</span>
                          <span>
                            {category.subCategories?.length || 0} subcategories
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="h-8 w-8 p-0 rounded-[8px]"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="h-8 w-8 p-0 rounded-[8px] text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deleteCategory.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    {/* Subcategories */}
                    <div className="mt-4 pt-4 border-t border-[#e5e5e5]">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-[#0a0a0a]">
                          Subcategories
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateSubCategory(category.id)}
                          className="rounded-[8px] h-8 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Subcategory
                        </Button>
                      </div>
                      {category.subCategories &&
                      category.subCategories.length > 0 ? (
                        <div className="space-y-2">
                          {category.subCategories.map((sub: SubCategory) => (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-3 bg-[#fafafa] border border-[#e5e5e5] rounded-[8px]"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <GripVertical className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                                {sub.image && (
                                  <div className="relative w-10 h-10 border border-[#e5e5e5] overflow-hidden bg-white rounded-[6px] flex-shrink-0">
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
                                    <p className="text-xs text-neutral-500 truncate">
                                      {sub.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 ml-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleEditSubCategory(sub, category.id)
                                  }
                                  className="h-7 w-7 p-0 rounded-[6px]"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteSubCategory(sub.id)
                                  }
                                  className="h-7 w-7 p-0 rounded-[6px] text-red-600 hover:text-red-700 hover:bg-red-50"
                                  disabled={deleteSubCategory.isPending}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-500 font-medium text-center py-3">
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
