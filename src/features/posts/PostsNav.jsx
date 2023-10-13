import Link from "next/link";
import styles from "./posts.module.scss";

export default function PostsNav({ currentId, limit, sinceIds, nextId }) {
  const limitParam = limit ? "&limit=" + limit : "";
  const pageLink = (sinceId) => `/?since_id=${sinceId}${limitParam}`;

  const reduceToPageLinks = () =>
    sinceIds.reduce(
      (pageLinks, sinceId, idx) => [
        ...pageLinks,
        <Link
          className={sinceId === currentId ? styles.currentPage : null}
          key={`posts_page_${sinceId}`}
          href={pageLink(sinceId)}
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
        <Link href={pageLink(nextId)}>&#x00bb;</Link>
      )}
    </nav>
  );
}
