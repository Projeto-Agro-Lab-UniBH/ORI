import Image from "next/image";
import Link from "next/link";
import { useAuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

const signFormSchema = z.object({
  email: z.string().nonempty('O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string().nonempty('A senha é obrigatória')
})

type signInFormData = z.infer<typeof signFormSchema>

export default function SignIn() {
  const { signIn } = useAuthContext();
  const { 
    register, 
    handleSubmit,
    formState: { errors }
  } = useForm<signInFormData>({
    resolver: zodResolver(signFormSchema)
  });

  async function send({ email, password }: signInFormData) {
    await signIn({ 
      email, 
      password 
    });
  }

  return (
    <div className="w-[416px] absolute top-40 left-1/2 -translate-x-1/2 max-[448px]:w-[368px] max-[400px]:w-[360px]">
      <div className="w-full flex flex-col gap-6">
        <div className="ml-auto mr-auto text-center flex flex-col gap-4">
          <div className="w-full flex flex-col gap-[6px]">
            <Image
              src="/orifox.svg"
              width={64}
              height={64}
              alt="Orifox-Icon"
            />
          </div>
          <div className="w-full flex items-center justify-center gap-1">
            <p className="text-brand-standard-black text-2xl font-extralight">Não tem conta?</p>
            <Link href="/sign-up">
              <a className="text-2xl text-sky-600 no-underline font-extralight">Crie</a>
            </Link>
          </div>
        </div>
        <form onSubmit={handleSubmit(send)}>
          <div className="w-full flex flex-col mb-8 gap-4">
            <div className="w-full flex flex-col">
              <label
                htmlFor="email"
                className="w-full mb-3 text-sm font-normal text-brand-standard-black"
              >
                E-mail
              </label>
              <input
                type="email"
                className="w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white focus:outline-none"
                placeholder="Digite o email da sua conta"
                {...register('email')}
              />
              {errors.email && <span className="w-full mt-1 flex items-center font-normal text-sm text-red-500">{errors.email.message}</span>}
            </div>
            <div className="w-full flex flex-col">
              <label
                htmlFor="password"
                className="w-full mb-3 text-sm font-normal text-brand-standard-black"
              >
                Senha
              </label>
              <input
                type="password"
                className="w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white focus:outline-none"
                placeholder="Digite a sua senha"
                {...register('password')}
              />
              {errors.password && <span className="w-full mt-1 flex items-center font-normal text-sm text-red-500">{errors.password.message}</span>}
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="w-full h-10 bg-brand-standard-black py-2 px-16 text-base font-bold text-white outline-none overflow-hidden rounded hover:bg-white border-solid border-brand-standard-black border hover:text-brand-standard-black cursor-pointer"
            >
              Entrar
            </button>
          </div>
          {/* <span className="w-full h-8 flex justify-center mt-3 text-sm font-normal text-gray-500">
            Esqueceu seu acesso?{" "}
            <Link href="/reset-password">
              <a className="no-underline text-sky-600">Recupere-o</a>
            </Link>
          </span> */}
        </form>
      </div>
    </div>
  );
}