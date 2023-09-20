import Link from "next/link";
import styles from "../app/posts.module.scss";

export default function PostsNav({ currentId, limit, sinceIds, nextId }) {
  const limitParam = limit ? "&limit=" + limit : "";

  const reduceToPageLinks = () =>
    sinceIds.reduce(
      (pageLinks, sinceId, idx) => [
        ...pageLinks,
        <Link
          className={sinceId === currentId ? styles.currentPage : null}
          key={`posts_page_${sinceId}`}
          href={`/?since_id=${sinceId}${limitParam}`}
        >
          {idx + 1}
        </Link>,
      ],
      []
    );

  return (
    <nav>
      {reduceToPageLinks()}
      {nextId && (
        <Link href={`/?since_id=${nextId}${limitParam}`}>&#x00bb;</Link>
      )}
    </nav>
  );
}
