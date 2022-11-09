import Button from "../../../components/Button/Button";
import Label from "../../../components/Label/Label";
import Subtitle from "../../../components/Subtitle/Subtitle";
import Title from "../../../components/Title/Title";

import styles from "./styles.module.css";

export default function ResetPassword() {
  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Title text="Recuperar acesso" />
        <Subtitle text="Altere sua senha de acesso" />
      </div>
      <form>
        <div className={styles.row}>
          <Label text="Crie uma nova senha" />
          <input className={styles.input} type="password" />

          <span className={styles.passwordInstruction}>
            Crie uma senha com no mínimo 8 caracteres.
          </span>
        </div>
        <div className={styles.row}>
          <Label text="Confirme a sua nova senha" />
          <input className={styles.input} type="password" />
        </div>
      </form>
      <div className={styles.btnContainer}>
        <Button>Alterar senha</Button>
      </div>
    </div>
  );
}
