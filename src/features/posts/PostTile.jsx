import styles from "./posts.module.scss";

export default function PostTile({ title, author }) {
  return (
    <div className={styles.postTile}>
      <div id={styles.title}>{title}</div>
      <div id={styles.author}>{author}</div>
    </div>
  );
}
