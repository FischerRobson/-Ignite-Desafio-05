import styles from "./header.module.scss";

export function Header() {
  return (
    <div className={styles.headerContainer}>
      <img src="/images/logo.svg" alt="logo" />
    </div>
  )
}
