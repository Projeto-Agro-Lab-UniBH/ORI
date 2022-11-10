import Image from "next/image";
import Link from "next/link";

import { FormProvider, useForm } from "react-hook-form";
import { useAuthContext } from "../../contexts";

import { Button } from "../../components";
import { Label, Subtitle, Title } from "../../components/Form";

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
    <div className="w-[416px] absolute top-40 left-1/2 -translate-x-1/2 max-[448px]:w-[368px] max-[400px]:w-[360px]">
      <div className="ml-auto mr-auto text-center">
        <Image
          className="mb-6"
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
          <div className="flex flex-col mb-4">
            <Label htmlFor="email" text="E-mail" />
            <input
              {...register("email")}
              type="email"
              name="email"
              className="w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white focus:outline-none"
              placeholder="Digite o email da sua conta"
            />
          </div>
          <div className="flex flex-col mb-4">
            <Label htmlFor="password" text="Senha" />
            <input
              {...register("password")}
              type="password"
              name="password"
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
        </form>
        <div className="w-full mt-12 flex justify-center">
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            Entrar
          </Button>
        </div>
      </FormProvider>
    </div>
  );
}
