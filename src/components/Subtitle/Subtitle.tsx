import styles from "./styles.module.css";

interface SubtitleProps {
  text: string;
}

export default function Subtitle(props: SubtitleProps) {
  return <p className={styles.subtitle}>{props.text}</p>;
}
