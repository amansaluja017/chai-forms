"use client";

import { KeyRound } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { PasswordInput } from "~/components/eye";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { useResetPassword } from "~/hooks/api/auth/auth.hook";
import { Loader2 } from "lucide-react";
import { ResetPasswordInputType } from "@repo/services/user/model";

function ResetPasswordForm({ className, ...props }: React.ComponentProps<"form">) {
    const [error, setError] = useState<string | null>(null);
    const params = useParams();
    const token = params?.id as string;
    
    const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetPasswordInputType>();
    const { resetPasswordAsync, error: resetPasswordError, isPending } = useResetPassword();
    const router = useRouter();

    const password = watch("password");

    const onSubmit = async (data: ResetPasswordInputType) => {
        setError(null);
        
        if (!token) {
            setError("Invalid or missing reset token. Please request a new password reset link.");
            return;
        }

        try {
            await resetPasswordAsync({ ...data, token });
            // Redirect to login after successful reset
            router.push("/login?reset=true");
        } catch (error: any) {
            setError(error?.message || resetPasswordError?.message || "Failed to reset password.");
        }
    };

    return (
        <div className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/40", className)}>
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-chart-2/30 blur-2xl"></div>

            <form className="relative z-10 flex flex-col gap-6" {...props} onSubmit={handleSubmit(onSubmit)}>
                <FieldGroup className="gap-5">
                    <div className="flex flex-col items-center gap-2 text-center mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1 ring-1 ring-primary/20">
                            <KeyRound className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Reset Password</h1>
                        <p className="text-sm text-muted-foreground/80">
                            Enter your new password below
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Field className="space-y-2">
                            <FieldLabel htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">New Password</FieldLabel>
                            <PasswordInput
                                id="password"
                                placeholder="Enter new password"
                                className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters long" }
                                })}
                            />
                            {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
                        </Field>

                        <Field className="space-y-2">
                            <FieldLabel htmlFor="confirmPassword" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Confirm Password</FieldLabel>
                            <PasswordInput
                                id="confirmPassword"
                                placeholder="Confirm new password"
                                className="h-11 bg-background/50 backdrop-blur-sm transition-all focus:bg-background/80"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: value => value === password || "Passwords do not match"
                                })}
                            />
                            {errors.confirmPassword && <p className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>}
                        </Field>

                        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

                        <Button
                            type="submit"
                            className="w-full h-11 bg-primary/90 text-white font-semibold hover:bg-primary transition-all duration-200 cursor-pointer"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Resetting...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </div>
                </FieldGroup>
            </form>
        </div>
    );
};

export default ResetPasswordForm;