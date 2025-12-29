import { apiClient } from "@/lib/api-client";
import { ApiResponse, PaginatedResponse } from "@/types";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  authorId?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  isPublished?: boolean;
}

export const blogService = {
  /**
   * Get all blog posts
   */
  getPosts: async (
    filters: BlogFilters = {}
  ): Promise<PaginatedResponse<BlogPost>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<BlogPost>>>(
      "/blog",
      { params: filters }
    );
    return response.data.data!;
  },

  /**
   * Get blog post by slug
   */
  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await apiClient.get<ApiResponse<BlogPost>>(`/blog/${slug}`);
    return response.data.data!;
  },

  /**
   * Get related blog posts
   */
  getRelatedPosts: async (
    postId: string,
    limit: number = 3
  ): Promise<BlogPost[]> => {
    const response = await apiClient.get<ApiResponse<BlogPost[]>>(
      `/blog/${postId}/related`,
      { params: { limit } }
    );
    return response.data.data!;
  },

  /**
   * Get all blog categories
   */
  getCategories: async (): Promise<BlogCategory[]> => {
    const response = await apiClient.get<ApiResponse<BlogCategory[]>>(
      "/blog/categories"
    );
    return response.data.data!;
  },
};

