import styles from "./styles.module.css";

interface TitleProps {
  text: string;
}

export default function Title(props: TitleProps) {
  return <h2 className={styles.title}>{props.text}</h2>;
}
