import Link from "next/link";
import styles from "./header.module.scss";

export function Header() {
  return (
    <div className={styles.headerContainer}>
      <Link href="/">
        <img src="/images/logo.svg" alt="logo" />
      </Link>
    </div>
  )
}
