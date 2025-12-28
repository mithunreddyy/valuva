"use client";

import { HomepageSectionFormModal } from "@/components/admin/homepage-section-form-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/services/api/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  Edit,
  GripVertical,
  LayoutDashboard,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";

interface HomepageSection {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  content?: HomepageSection["config"];
  isActive: boolean;
  sortOrder: number;
  config: Record<string, unknown>;
}

export default function AdminHomepagePage() {
  const queryClient = useQueryClient();
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-homepage-sections"],
    queryFn: async () => {
      const response = await adminApi.getHomepageSections();
      return response.data;
    },
  });

  const deleteSection = useMutation({
    mutationFn: (id: string) => adminApi.deleteHomepageSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homepage-sections"] });
      toast({
        title: "Success",
        description: "Section deleted successfully",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to delete section",
        variant: "destructive",
      });
    },
  });

  const toggleSection = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateHomepageSection(id, { isActive } as HomepageSection),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-homepage-sections"] });
      toast({
        title: "Success",
        description: "Section status updated",
      });
    },
    onError: (error: AxiosError) => {
      toast({
        title: "Error",
        description:
          (error.response?.data as { message: string })?.message ||
          "Failed to update section",
        variant: "destructive",
      });
    },
  });

  const handleCreate = () => {
    setEditingSection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (section: HomepageSection) => {
    setEditingSection(section);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      deleteSection.mutate(id);
    }
  };

  const sections = (data?.data || []) as HomepageSection[];

  return (
    <div className="min-h-screen bg-[#fafafa] py-6 sm:py-8">
      <div className="container-luxury">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-[#e5e5e5] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium tracking-normal mb-1.5">
              Homepage Sections
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Manage homepage content sections
            </p>
          </div>
          <Button
            onClick={handleCreate}
            size="default"
            variant="filled"
            className="rounded-[10px] h-10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Sections List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-[12px]" />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-16 bg-white border border-[#e5e5e5] rounded-[12px]">
            <LayoutDashboard className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
            <p className="text-sm font-medium text-neutral-600 mb-2">
              No sections found
            </p>
            <p className="text-xs text-neutral-500 font-medium">
              Create your first homepage section
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-white border border-[#e5e5e5] rounded-[12px] p-5 hover:border-[#0a0a0a] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <GripVertical className="h-5 w-5 text-neutral-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-[#0a0a0a]">
                          {section.title}
                        </h3>
                        <span className="px-2 py-0.5 bg-[#fafafa] text-xs font-medium text-neutral-600 rounded-[6px]">
                          {section.type}
                        </span>
                      </div>
                      {section.subtitle && (
                        <p className="text-xs text-neutral-600 font-medium mb-2">
                          {section.subtitle}
                        </p>
                      )}
                      <p className="text-xs text-neutral-500 font-medium">
                        Order: {section.sortOrder}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={section.isActive}
                        onCheckedChange={(checked) =>
                          toggleSection.mutate({
                            id: section.id,
                            isActive: checked,
                          })
                        }
                        disabled={toggleSection.isPending}
                        className="data-[state=checked]:bg-[#0a0a0a]"
                      />
                      <span className="text-xs font-medium text-neutral-600 w-12">
                        {section.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(section)}
                      className="h-8 w-8 p-0 rounded-[8px]"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(section.id)}
                      className="h-8 w-8 p-0 rounded-[8px] text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={deleteSection.isPending}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <HomepageSectionFormModal
            section={editingSection}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingSection(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
