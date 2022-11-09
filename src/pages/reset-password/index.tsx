import Button from "../../components/Button/Button";
import Label from "../../components/Label/Label";
import Subtitle from "../../components/Subtitle/Subtitle";
import Title from "../../components/Title/Title";
import styles from "./styles.module.css";

export default function AccountVerification() {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Title text="Enviar código" />
        <Subtitle text="Para verificar sua conta" />
      </div>
      <form>
        <div className={styles.row}>
          <Label text="Digite seu e-mail" />
          <div className={styles.inputContainer}>
            <input type="email" className={styles.inputEmail} />
            <button className={styles.sendCode}>Enviar</button>
          </div>
          <span className={styles.aux}>
            Digite o e-mail da sua conta para enviarmos o código de verificação.
          </span>
        </div>
        <div className={styles.row}>
          <Label text="Digite o código" />
          <input className={styles.input} type="text" />
          <span className={styles.aux}>
            Digite o código de verificação que enviamos para o seu e-mail.
          </span>
        </div>
      </form>
      <div className={styles.btnContainer}>
        <Button type="submit">Verificar</Button>
      </div>
    </div>
  );
}
