"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import styles from "./posts.module.scss";
import getPosts from "@/app/api/posts/getPosts";
import PostTile from "./PostTile";
import PostsNav from "./PostsNav";

export default function PostsList({ sinceId, limit }) {
  const postsQueryResult = useQuery({
    queryKey: ["posts", sinceId, limit],
    queryFn: () => getPosts(sinceId, limit),
    keepPreviousData: true,
  });

  const posts = postsQueryResult.data?.posts;
  const currentId = posts?.at(0)?._id;
  const nextId = postsQueryResult.data?.nextId;

  const [sinceIds, setSinceIds] = useState([]);
  const addSinceId = (newId) => { // Only add values that were check on back-end to be a valid ObjectID
    if (newId && !sinceIds.includes(newId)) {
      setSinceIds((oldArray) => [...oldArray, newId].sort());
    }
  };

  if (postsQueryResult.isSuccess) {
    addSinceId(currentId);
    addSinceId(nextId);
  }

  const unrollPostsQuery = () => {
    if (postsQueryResult.isLoading) return "Loading...";
    if (postsQueryResult.isError) return "Unable to get posts";
    if (posts.length <= 0) return "No posts found";

    return posts.reduce(
      (acc, post, idx) => [
        ...acc,
        <PostTile
          key={`post_${idx}`}
          author={post.author}
          title={post.title}
        />,
      ],
      []
    );
  };

  return (
    <div id={styles.container}>
      <div id={styles.posts}>{unrollPostsQuery()}</div>
      {sinceIds.length > 0 && (
        <PostsNav
          currentId={currentId}
          limit={limit}
          sinceIds={sinceIds}
          nextId={nextId}
        />
      )}
    </div>
  );
}
