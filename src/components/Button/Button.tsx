import styles from "./styles.module.css";

type Props = {
  type?: "button" | "submit" | "reset";
  onClick?: VoidFunction;
  children: React.ReactNode;
};

export default function Button({ type = "button", onClick, children }: Props) {
  return (
    <button type={type} onClick={onClick} className={styles.button}>
      {children}
    </button>
  );
}
