import { LabelHTMLAttributes } from "react";
import styles from "./styles.module.css";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  text: string;
}

export default function Label(props: LabelProps) {
  return (
    <label {...props} className={styles.label}>
      {props.text}
    </label>
  );
}
