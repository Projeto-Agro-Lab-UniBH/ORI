import Image from "next/image";
import Link from "next/link";

import { FormProvider, useForm } from "react-hook-form";
import { SignInButton } from "../../components/Button/SignInButton";
import { Label } from "../../components/Label/Label";
import { Subtitle } from "../../components/Subtitle/Subtitle";
import { Title } from "../../components/Title/Title";
import { useAuthContext } from "../../contexts";

type ILoginForm = {
  emailLogin: string;
  passwordLogin: string;
};

export default function Login() {
  const formMethods = useForm<ILoginForm>();
  const { register, handleSubmit } = formMethods;
  const { login } = useAuthContext();

  async function onSubmit(values: ILoginForm) {
    await login(values.emailLogin, values.passwordLogin);
  }

  return (
    <div className="w-[416px] absolute top-40 left-1/2 -translate-x-1/2 max-[448px]:w-[368px] max-[400px]:w-[360px]">
      <div className="w-full flex flex-col gap-6">
        <div className="ml-auto mr-auto text-center flex flex-col gap-4">
          <div className="w-full flex flex-col gap-[6px]">
            <Image
              src="/orifox.svg"
              width="64px"
              height="64px"
              alt="Orifox-Icon"
            />
            <Title text="Login" />
          </div>
          <Subtitle text="Acesse a plataforma" />
        </div>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full flex flex-col gap-4">
              <div className="w-full flex flex-col gap-3">
                <Label htmlFor="email-login" text="E-mail" />
                <input
                  {...register("emailLogin")}
                  type="email"
                  id="email-login"
                  name="emailLogin"
                  className="w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white focus:outline-none"
                  placeholder="Digite o email da sua conta"
                />
              </div>
              <div className="w-full flex flex-col gap-3">
                <Label htmlFor="password-login" text="Senha" />
                <input
                  {...register("passwordLogin")}
                  type="password"
                  id="password-login"
                  name="passwordLogin"
                  className="w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white focus:outline-none"
                  placeholder="Digite a sua senha"
                />
                {/* <span className="mt-2 text-sm font-normal text-gray-500">
                  Esqueceu seu acesso?{" "}
                  <Link href="/reset-password">
                    <a className="no-underline text-sky-600">Recupere-o</a>
                  </Link>
                </span> */}
              </div>
            </div>
          </form>
          <div className="w-full flex justify-center">
            <SignInButton type="submit" onClick={handleSubmit(onSubmit)}>
              Entrar
            </SignInButton>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
