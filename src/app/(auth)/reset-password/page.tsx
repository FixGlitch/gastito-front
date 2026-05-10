"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas";
import { useResetPassword } from "@/lib/api/hooks/auth";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card";
import { Wallet, Loader2, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const resetMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetMutation.mutate(data);
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
        <p className="text-sm text-muted-foreground">Nueva contraseña</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Restablecer contraseña</CardTitle>
          <CardDescription>
            Ingresá tu nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetMutation.isSuccess ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                {resetMutation.data?.message || "Contraseña actualizada correctamente"}
              </p>
              <a href="/login">
                <Button variant="outline" className="w-full">
                  Ir al login
                </Button>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("token")} />

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...register("newPassword")}
                  error={errors.newPassword?.message}
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={resetMutation.isPending || isSubmitting}
              >
                {resetMutation.isPending || isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Restablecer contraseña"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
