"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostsList from "@/features/posts/PostsList";

const queryClient = new QueryClient();

export default function Posts({ searchParams }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PostsList sinceId={searchParams?.since_id} limit={searchParams?.limit} />
    </QueryClientProvider>
  );
}
