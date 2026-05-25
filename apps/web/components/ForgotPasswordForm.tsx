"use client";

import { Sparkles } from "lucide-react";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { useForgotPassword } from "~/hooks/api/auth/auth.hook";
import { Loader2 } from "lucide-react";
import { PasswordResetLinkInputType } from "@repo/services/user/model"


function ForgotPasswordForm({ className, ...props }: React.ComponentProps<"form">) {
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<PasswordResetLinkInputType>();
    const { forgotPasswordAsync, error: forgotPasswordError, isPending } = useForgotPassword();
    const router = useRouter();

    const onSubmit = async (data: { email: string }) => {
        setError(null);
        try {
            await forgotPasswordAsync(data);
            router.push("/forgot-password-success");
        } catch (error) {
            setError(forgotPasswordError?.message || "Failed to send password reset link");
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
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
                        <p className="text-sm text-muted-foreground/80">
                            Enter your email to reset your password
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
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                            {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
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
                                    Sending...
                                </>
                            ) : (
                                "Send Password Reset Link"
                            )}
                        </Button>
                    </div>
                </FieldGroup>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
