import { useQuery } from "@tanstack/react-query";
import { blogService, BlogPost, BlogCategory, BlogFilters } from "@/services/blog.service";

export function useBlogPosts(filters: BlogFilters = {}) {
  return useQuery({
    queryKey: ["blog-posts", filters],
    queryFn: () => blogService.getPosts(filters),
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => blogService.getPostBySlug(slug),
    enabled: !!slug,
  });
}

export function useRelatedPosts(postId: string, limit: number = 3) {
  return useQuery({
    queryKey: ["related-posts", postId, limit],
    queryFn: () => blogService.getRelatedPosts(postId, limit),
    enabled: !!postId,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog-categories"],
    queryFn: () => blogService.getCategories(),
  });
}

