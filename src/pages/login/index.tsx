import Image from "next/image";
import Link from "next/link";
import Button from "../../components/Button/Button";
import Label from "../../components/Label/Label";
import Subtitle from "../../components/Subtitle/Subtitle";
import Title from "../../components/Title/Title";

import styles from "./styles.module.css";

import { FormProvider, useForm } from "react-hook-form";
import { useAuthContext } from "../../contexts";

type ILoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const formMethods = useForm<ILoginForm>();
  const { register, handleSubmit } = formMethods;
  const { login } = useAuthContext();

  async function onSubmit(values: ILoginForm) {
    await login(values.email, values.password);
  }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <Image
          className={styles.iconOrifox}
          src="/orifox.svg"
          width="64px"
          height="64px"
          alt="Orifox-Icon"
        />
        <Title text="Login" />
        <Subtitle text="Acesse a plataforma" />
      </div>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.row}>
            <Label htmlFor="email" text="E-mail" />
            <input
              {...register("email")}
              type="email"
              name="email"
              className={styles.input}
              placeholder="Digite o email da sua conta"
            />
          </div>
          <div className={styles.row}>
            <Label htmlFor="password" text="Senha" />
            <input
              {...register("password")}
              type="password"
              name="password"
              className={styles.input}
              placeholder="Digite a sua senha"
            />

            <span className={styles.forgotPassword}>
              Esqueceu seu acesso?{" "}
              <Link href="/reset-password">
                <a className={styles.resetPasswordLink}>Recupere-o</a>
              </Link>
            </span>
          </div>
        </form>
        <div className={styles.btnContainer}>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Entrar
          </Button>
        </div>
      </FormProvider>
    </div>
  );
}
