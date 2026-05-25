"use client";

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { PasswordInput } from "~/components/eye"
import GoogleButton from "~/components/google-btn"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form";
import { LoginWithEmailAndPasswordInputType } from "@repo/services/user/model"
import { useLogin, useVerify2FACode } from "~/hooks/api/auth/auth.hook"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDispatch } from "react-redux";
import { login } from "~/app/slice/userSlice";
import TwoFAInput from "./twoFAInput";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = useState<string | null>(null);
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginWithEmailAndPasswordInputType>();
  const { loginWithEmailAndPasswordAsync, isPending: isLoggingIn, error: loginError } = useLogin();
  const router = useRouter();

  const dispatch = useDispatch();

  async function onSubmit(data: LoginWithEmailAndPasswordInputType) {
    setError(null);

    try {
      const response = await loginWithEmailAndPasswordAsync(data);

      if (!response.is2FAEnabled) {
        if (response.accessToken) {
          dispatch(login({ accessToken: response.accessToken, loading: false, user: response.user }));
        }
        router.push("/dashboard");
      } else {
        setIs2FARequired(true);
        setUserId(response.user.id);
        setEmail(data.email);
      }

    } catch (error) {
      setError(loginError?.message || "Invalid credentials");
    };
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/40", className)}>
      <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-chart-2/30 blur-2xl"></div>

      {is2FARequired ? (<TwoFAInput userId={userId as string} email={email} setIs2FARequired={setIs2FARequired} />) : (
        <form className="relative z-10 flex flex-col gap-8" {...props} onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2 ring-1 ring-primary/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground/80">
                Enter your credentials to access your account
              </p>
            </div>

            <div className="space-y-4">
              <Field className="space-y-2">
                <FieldLabel htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="hello@example.com"
                  className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                  {...register("email", {
                    required: true,
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
              </Field>

              <Field className="space-y-2">
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline hover:underline-offset-4 transition-all"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                  {...register("password", {
                    required: true,
                    minLength: { value: 6, message: "Password must be at least 6 characters long" }
                  })
                  }
                />
                {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
              </Field>
            </div>

            {error && <p className="text-xs font-medium text-red-500">{error}</p>}

            <Field>
              <Button type="submit" disabled={isLoggingIn} className="h-11 w-full text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 cursor-pointer">
                {isLoggingIn ? "Signing In..." : "Sign In"}
              </Button>
            </Field>

            <FieldSeparator className="my-2">
              <span className="bg-transparent px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Or continue with</span>
            </FieldSeparator>

            <Field className="flex justify-center">
              <GoogleButton />
            </Field>

            <FieldDescription className="text-center text-sm font-medium mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline underline-offset-4 transition-all">
                Create an account
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      )}
    </div>
  )
}
