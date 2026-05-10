"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/schemas";
import { useLogin, useAuthUser, useAuthIsAuthenticated } from "@/lib/api/hooks/auth";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Wallet, Loader2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const user = useAuthUser();
  const isAuthenticated = useAuthIsAuthenticated();
  const router = useRouter();

  // If already authenticated, redirect based on role
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin/users");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
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
        <p className="text-sm text-muted-foreground">Tu finanzas simples</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Iniciar sesión</CardTitle>
          <CardDescription>
            Ingresá tu correo y contraseña para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
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

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loginMutation.isPending || isSubmitting}
            >
              {loginMutation.isPending || isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              ¿No tenés cuenta?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Crear cuenta
              </Link>
            </p>
            <p className="mt-2">
              <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
