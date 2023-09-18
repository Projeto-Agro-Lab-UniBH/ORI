import Link from "next/link";
import Image from "next/image";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";

const signFormSchema = z.object({
  email: z.string().nonempty("O e-mail da sua conta é obrigatório").email("Formato de e-mail inválido"),
  password: z.string().nonempty("A senha da sua conta é obrigatória"),
});

type signInFormData = z.infer<typeof signFormSchema>;

export default function SignIn() {
  const { signIn, isLoading } = useAuthContext();
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
                  className="text-sm font-normal text-shark-950"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full h-10 px-3 py-3 text-sm font-normal transition border border-solid ${
                    errors.email
                      ? "border-red-200 bg-white focus:outline-outline focus:ring-1 focus:ring-red-700"
                      : "border-gray-200 bg-white hover:border-[#b3b3b3]"
                  } rounded text-shark-950`}
                  placeholder="Digite o email da sua conta"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs font-normal text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-normal text-shark-950"
                >
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className={`w-full h-10 px-3 py-3 text-sm font-normal transition border border-solid ${
                    errors.password
                      ? "border-red-200 bg-white hover:border-red-500 focus:outline-outline focus:ring-1 focus:ring-red-700"
                      : "border-gray-200 bg-white hover:border-[#b3b3b3]"
                  } rounded text-shark-950`}
                  placeholder="Digite a sua senha"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="text-xs font-normal text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="w-full h-10 flex justify-center items-center text-base font-medium text-neutral-50 bg-shark-950 border border-shark-950 rounded overflow-hidden hover:bg-white border-solid hover:text-shark-950 cursor-pointe"
              disabled={isLoading}
            >
              Entrar
            </button>
          </div>
          {/* <span className="w-full h-8 mt-6 flex gap-[6px] justify-center text-sm font-normal text-gray-500">
              Esqueceu seu acesso?
              <Link href="/reset-password" className="no-underline text-blue-500">
                Recupere-o
              </Link>
            </span> */}
        </form>
      </div>
    </div>
  );
}
