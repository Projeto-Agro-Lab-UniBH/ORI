import Link from "next/link";
import Image from "next/image";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";

const signFormSchema = z.object({
  email: z.string().email("Formato de e-mail inválido").nonempty("O e-mail da sua conta é obrigatório"),
  password: z.string().nonempty("A senha da sua conta é obrigatória"),
});

type signInFormData = z.infer<typeof signFormSchema>;

export default function SignIn() {
  const { signIn } = useAuthContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signInFormData>({
    resolver: zodResolver(signFormSchema),
  });

  const onSubmit = async ({ email, password }: signInFormData) => {
    await signIn({
      email,
      password,
    });
  };

  return (
    <div className="w-[416px] absolute top-40 left-1/2 -translate-x-1/2 max-[448px]:w-[368px] max-[400px]:w-[360px]">
      <div className="w-full flex flex-col gap-4">
        <div className="ml-auto mr-auto text-center flex flex-col gap-4">
          <div className="w-full flex justify-center">
            <Image src="/orifox.svg" width={64} height={64} alt="Orifox-Icon" />
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col mb-8 gap-4">
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col gap-3">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full block p-2.5 font-normal text-sm text-slate-900 bg-white rounded-lg border ${
                    errors.email
                    ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  }`}
                  placeholder="Digite o email da sua conta"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="font-normal text-xs text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className={`w-full block p-2.5 font-normal text-sm text-slate-900 bg-white rounded-lg border ${
                    errors.password
                      ? "border-red-300 hover:border-red-400 focus:outline-none placeholder:text-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-slate-300 hover:border-slate-400 focus:outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                  }`}
                  placeholder="Digite a sua senha"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="font-normal text-xs text-red-400">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="w-full h-10 flex justify-center items-center text-base font-medium text-white bg-blue-500 hover:bg-blue-600 border-none rounded-lg cursor-pointer"

            >
              Entrar
            </button>
          </div>
          {/* <span className="w-full h-8 mt-6 flex gap-[6px] justify-center text-sm font-normal text-gray-500">
            Esqueceu sua senha de acesso?
            <Link href="/reset-password" className="no-underline text-blue-500">
              Recupere-o
            </Link>
          </span> */}
        </form>
      </div>
    </div>
  );
}
