import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signFormSchema = z.object({
  email: z
    .string()
    .nonempty("O e-mail da sua conta é obrigatório")
    .email("Formato de e-mail inválido"),
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

  const send = async ({ email, password }: signInFormData) => {
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
        <form onSubmit={handleSubmit(send)}>
          <div className="w-full flex flex-col mb-8 gap-4">
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col gap-3">
                <label
                  htmlFor="email"
                  className="w-full text-sm font-normal text-brand-standard-black"
                >
                  E-mail
                </label>
                <input
                  type="email"
                  className={
                    errors.email
                      ? "w-full h-10 text-sm text-brand-standard-black font-normal px-3 py-3 border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                      : "w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white hover:border-[#b3b3b3]"
                  }
                  placeholder="Digite o email da sua conta"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <span className="text-xs font-normal text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <div className="w-full flex flex-col gap-3">
                <label
                  htmlFor="password"
                  className="w-full text-sm font-normal text-brand-standard-black"
                >
                  Senha
                </label>
                <input
                  type="password"
                  className={
                    errors.password
                      ? "w-full h-10 px-3 py-3 text-sm text-brand-standard-black font-normal border border-red-200 rounded bg-white hover:boder hover:border-red-500"
                      : "w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white hover:border-[#b3b3b3]"
                  }
                  placeholder="Digite a sua senha"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <span className="text-xs font-normal text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="w-full h-10 text-base font-medium text-neutral-50 border border-brand-standard-black rounded bg-brand-standard-black overflow-hidden hover:bg-white border-solid hover:text-brand-standard-black cursor-pointer"
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
