"use client";

import { useEffect, useState } from "react";
import { useResendVerificationEmail, useVerifyEmail } from "~/hooks/api/auth/auth.hook";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, MailWarning } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import Link from "next/link";

import { Input } from "~/components/ui/input";

function VerifyEmailPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const params = useParams();
  
  const token = params?.id as string;
  
  const { verifyEmailAsync, status, error: verifyError } = useVerifyEmail();
  const { resendVerificationEmailAsync, status: resendStatus, error: resendError, isPending: isResending } = useResendVerificationEmail();
  const router = useRouter();
  
  const [hasAttempted, setHasAttempted] = useState(false);
  const [showResendInput, setShowResendInput] = useState(false);
  const [resendEmail, setResendEmail] = useState("");

  useEffect(() => {
    if (!token || hasAttempted) return;
    
    setHasAttempted(true);

    async function verify() {
      try {
        await verifyEmailAsync({ token: token! });
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 2500);
      } catch (err) {
        // Error is handled by status/verifyError from the hook
      }
    }

    verify();
  }, [token, verifyEmailAsync, router, hasAttempted]);

  const handleResendClick = () => {
    setShowResendInput(true);
  };

  const handleResendSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;
    
    try {
      await resendVerificationEmailAsync({ email: resendEmail });
    } catch (error) {
      // Error is handled by resendStatus/resendError
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background py-10">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-[10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-chart-2/20 blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute inset-0 bg-radial from-transparent to-background/80"></div>
      </div>
      
      {/* Content */}
      <div className="z-10 w-full max-w-[420px] px-4 animate-in fade-in zoom-in-95 duration-700">
        <div className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl dark:bg-black/40",
          "flex flex-col items-center text-center transition-all duration-500"
        )}>
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/30 blur-2xl"></div>
          
          {/* Missing Token State */}
          {!token && (
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2 ring-1 ring-destructive/20">
                <MailWarning className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Invalid Link</h1>
              <p className="text-sm text-muted-foreground">
                No verification token found in the URL. Please check your email for the correct link.
              </p>
              <Button asChild className="mt-4 w-full h-11">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          )}

          {/* Verifying State */}
          {token && status === "pending" && (
            <div className="relative z-10 flex flex-col items-center gap-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2 ring-1 ring-primary/20">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight animate-pulse">Verifying...</h1>
              <p className="text-sm text-muted-foreground">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {/* Success State */}
          {token && status === "success" && (
            <div className="relative z-10 flex flex-col items-center gap-4 py-4 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-2 ring-1 ring-green-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Email Verified!</h1>
              <p className="text-sm text-muted-foreground">
                Your email has been successfully verified. Redirecting you to login...
              </p>
            </div>
          )}

          {/* Error State */}
          {token && status === "error" && (
            <div className="relative z-10 flex flex-col items-center gap-4 py-2 animate-in slide-in-from-bottom-4 duration-500 w-full">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2 ring-1 ring-destructive/20">
                <XCircle className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Verification Failed</h1>
              <p className="text-sm text-muted-foreground text-balance">
                {verifyError?.message || "The verification link is invalid or has expired."}
              </p>
              
              <div className="flex flex-col w-full gap-3 mt-4">
                {resendStatus === "success" ? (
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 text-sm">
                    Verification email sent! Please check your inbox.
                  </div>
                ) : showResendInput ? (
                  <form onSubmit={handleResendSubmit} className="flex flex-col gap-3 w-full animate-in fade-in slide-in-from-top-2 duration-300">
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                      className="h-11 bg-background/50 backdrop-blur-sm"
                    />
                    {resendStatus === "error" && (
                      <p className="text-xs text-destructive text-left">{resendError?.message || "Failed to resend email."}</p>
                    )}
                    <Button type="submit" disabled={isResending} className="w-full h-11 shadow-lg shadow-primary/20 hover:shadow-primary/40">
                      {isResending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Send Verification Link
                    </Button>
                  </form>
                ) : (
                  <Button onClick={handleResendClick} className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40">
                    Resend Verification Email
                  </Button>
                )}

                <Button asChild variant="outline" className="w-full h-11">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// In Next 13+ Client Components, using useSearchParams might trigger a suspense boundary warning if not wrapped.
// We export a wrapped version.
import { Suspense } from "react";

export default function VerifyEmailPageWrapper() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    }>
      <VerifyEmailPage />
    </Suspense>
  );
}
