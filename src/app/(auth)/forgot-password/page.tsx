"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas";
import { useForgotPassword } from "@/lib/api/hooks/auth";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Wallet, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/molecules/theme-toggle";

export default function ForgotPasswordPage() {
  const forgotMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
          <Wallet className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold">Gastito</h1>
        <p className="text-sm text-muted-foreground">Recuperá tu cuenta</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresá tu correo y te enviaremos un enlace para restablecerla
          </CardDescription>
        </CardHeader>
        <CardContent>
          {forgotMutation.isSuccess ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Si el correo existe, recibirás un mensaje con instrucciones.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...register("email")}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={forgotMutation.isPending || isSubmitting}
              >
                {forgotMutation.isPending || isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar enlace"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>
          <Link href="/login" className="font-medium text-primary hover:underline">
            <ArrowLeft className="mr-1 inline h-3 w-3" />
            Volver al login
          </Link>
        </p>
      </div>
    </div>
  );
}
