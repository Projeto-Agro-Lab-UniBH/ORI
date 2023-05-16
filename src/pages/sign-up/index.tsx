import Image from "next/image";
import Link from "next/link"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { ProfileServices } from "../../services/CreateUserService";

const signUpFormSchema = z.object({
  username: z.string().nonempty('Nome completo é obrigatório'),
  email: z.string().nonempty('O e-mail é obrigatório').email('Formato de e-mail inválido'),
  password: z.string()
    .nonempty('A senha é obrigatória')
    .min(6, 'A senha deve conter no mínimo 6 caracteres.')
    .regex(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm, 
      'A senha deve conter 1 caractere maíusculo, 1 minúsculo, 1 número, 1 caractere especial'
    ) 
})

type signUpFormData = z.infer<typeof signUpFormSchema>

export default function SignUp() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm<signUpFormData>({
    resolver: zodResolver(signUpFormSchema)
  });

  async function send({ username, email, password }: signUpFormData) {
    return await ProfileServices.createUser({ username, email, password })
  }

  return (
    <div className="w-[456px] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <div className="w-full flex flex-col gap-6">
        <div className="ml-auto mr-auto text-center flex flex-col gap-4">
          <div className="w-full flex justify-center">
            <Image
              src="/orifox.svg"
              width={64}
              height={64}
              alt="Orifox-Icon"
            />
          </div>
          <div className="w-full flex items-center justify-center gap-1">
            <p className="text-brand-standard-black text-2xl font-extralight">Possui já possui conta?</p>
            <Link href="/sign-in" className="text-2xl text-sky-600 no-underline font-extralight">
              Faça o login
            </Link>
          </div>
        </div>
        <form onSubmit={handleSubmit(send)}>
          <div className="w-full flex flex-col mb-8 gap-4">
            <div className="w-full flex flex-col">
              <label htmlFor="username" className="w-full mb-3 text-sm font-normal text-brand-standard-black">Nome completo</label>
              <input
                type="text"
                className="w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white focus:outline-none"
                placeholder="Digite o seu nome completo"
                {...register('username')}
              />
              {errors.username && <span className="w-full mt-1 flex items-center font-normal text-sm text-red-500">{errors.username.message}</span>}
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="email" className="w-full mb-3 text-sm font-normal text-brand-standard-black">E-mail</label>
              <input
                type="email"
                className="w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white focus:outline-none"
                placeholder="Digite o seu email"
                {...register('email')}
              />
              {errors.email && <span className="w-full mt-1 flex items-center font-normal text-sm text-red-500">{errors.email.message}</span>}
            </div>
            <div className="w-full flex flex-col">
              <label htmlFor="password" className="w-full mb-3 text-sm font-normal text-brand-standard-black">Crie uma senha</label>
              <input
                type="password"
                className="w-full h-10 rounded border border-solid border-gray-200 py-3 px-3 font-normal text-sm text-brand-standard-black bg-white focus:outline-none"
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
              Confirmar cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}