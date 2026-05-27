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
import { RegisterWithEmailAndPasswordInputType } from "@repo/services/user/model"
import { useRegister } from "~/hooks/api/auth/auth.hook"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterWithEmailAndPasswordInputType & { confirmPassword?: string }>();
  const { registerWithEmailAndPasswordAsync, error: registerError, isPending } = useRegister();
  const router = useRouter();
  
  const password = watch("password");

  async function onSubmit(data: RegisterWithEmailAndPasswordInputType & { confirmPassword?: string }) {
    setError(null);

    try {
      await registerWithEmailAndPasswordAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      });
      // Assuming successful registration triggers verification email
      router.push("/login?registered=true");
    } catch (e: any) {
      setError(e.message || registerError?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/40", className)}>
      <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-chart-2/30 blur-2xl"></div>
      
      <form className="relative z-10 flex flex-col gap-6" {...props} onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup className="gap-5">
          <div className="flex flex-col items-center gap-2 text-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1 ring-1 ring-primary/20">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground/80">
              Enter your details to get started
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <Field className="space-y-2 flex-1">
                <FieldLabel htmlFor="firstName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">First Name</FieldLabel>
                <Input 
                  id="firstName" 
                  type="text" 
                  placeholder="John" 
                  className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                  {...register("firstName", { required: "First name is required" })}
                />
                {errors.firstName && <p className="text-xs font-medium text-red-500">{errors.firstName.message}</p>}
              </Field>
              <Field className="space-y-2 flex-1">
                <FieldLabel htmlFor="lastName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Name</FieldLabel>
                <Input 
                  id="lastName" 
                  type="text" 
                  placeholder="Doe" 
                  className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                  {...register("lastName")}
                />
                {errors.lastName && <p className="text-xs font-medium text-red-500">{errors.lastName.message}</p>}
              </Field>
            </div>
            
            <Field className="space-y-2">
              <FieldLabel htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</FieldLabel>
              <Input 
                id="email" 
                type="email" 
                placeholder="hello@example.com" 
                className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
            </Field>
            
            <Field className="space-y-2">
              <FieldLabel htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</FieldLabel>
              <PasswordInput 
                id="password" 
                className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                {...register("password", {
                  required: "Password is required",
                  minLength: {value: 6, message: "Password must be at least 6 characters long"},
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
              />
              {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
            </Field>

            <Field className="space-y-2">
              <FieldLabel htmlFor="confirm-password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Confirm Password</FieldLabel>
              <PasswordInput 
                id="confirm-password" 
                className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: value => !password || value === password || "Passwords do not match"
                })}
              />
              {errors.confirmPassword && <p className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>}
            </Field>
          </div>

          {error && <p className="text-xs font-medium text-red-500 text-center">{error}</p>}

          <Field>
            <Button type="submit" disabled={isPending} className="h-11 w-full text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 cursor-pointer">
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </Field>
          
          <FieldSeparator className="my-1">
            <span className="bg-transparent px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Or continue with</span>
          </FieldSeparator>
          
          <Field className="flex justify-center">
            <GoogleButton />
          </Field>
          
          <FieldDescription className="text-center text-sm font-medium mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline underline-offset-4 transition-all">
              Sign in
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  )
}
