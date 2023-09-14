import PostTile from "./PostTile";
import styles from "@/app/posts.module.scss";

async function getPosts() {
  const result = await fetch("http://localhost:3000/api/posts");

  if (result.ok) {
    const body = await result.json();
    return body instanceof Array ? body : null;
  }

  return null;
}

export default async function Posts() {
  const posts = await getPosts();

  return (
    <div className={styles.posts}>
      {posts?.reduce(
        (acc, post, idx) => [
          ...acc,
          <PostTile
            key={`post_${idx}`}
            author={post.author}
            title={post.title}
          />,
        ],
        []
      )}
    </div>
  );
}
