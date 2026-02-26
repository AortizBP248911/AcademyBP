import { Metadata } from "next"
import Image from "next/image"
import LoginForm from "@/components/login-form"

export const metadata: Metadata = {
  title: "Iniciar Sesión - BP Academy",
  description: "Ingresa a tu cuenta",
}

export default function LoginPage() {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900">
            <Image 
                src="/BP_Academy.webp" 
                alt="Fondo BP Academy" 
                fill 
                className="object-cover opacity-50"
                priority
            />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="flex items-center gap-2">
            <Image src="/BPAcademy.ico" alt="BP Academy" width={32} height={32} className="object-contain" />
            <span className="text-xl font-bold tracking-tight">BP Academy</span>
          </div>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Domina tu ERP y transforma la forma en que trabajas&rdquo;
            </p>
            <footer className="text-sm">Equipo BP Academy</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 h-full flex items-center justify-center bg-zinc-950">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Inicia sesión en tu cuenta
            </h1>
            <p className="text-sm text-gray-600">
              Ingresa tu correo electrónico abajo para acceder
            </p>
          </div>
          <LoginForm className="dark" />
        </div>
      </div>
    </div>
  )
}
