"use client"

import { useToggle2FA } from "~/hooks/api/auth/auth.hook";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { Spinner } from "~/components/ui/spinner";
import { Label } from "~/components/ui/label";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "~/app/slice/config";
import { login } from "~/app/slice/userSlice";

function Profile() {
    const user = useSelector((state: RootState) => state.user.user);
    const accessToken = useSelector((state: RootState) => state.user.accessToken);
    const { toggle2FAAsync, isPending, error: toggle2FAError } = useToggle2FA();
    const dispatch = useDispatch();

    if (!user) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <Spinner className="size-8 text-primary" />
            </div>
        );
    }

    const handleToggle2FA = async () => {
        try {
            await toggle2FAAsync({});
            
            // Optimistically update the Redux state to reflect the new 2FA status
            dispatch(login({
                accessToken: accessToken,
                loading: false,
                user: {
                    ...user,
                    is2FAEnabled: !user.is2FAEnabled
                }
            }));
            
            toast.success(user.is2FAEnabled ? "2FA disabled successfully" : "2FA enabled successfully");
        } catch (e) {
            console.error("toggle2FAError", toggle2FAError);
            toast.error("Failed to update 2FA settings");
        }
    };

    const initials = user.fullName?.substring(0, 2).toUpperCase() || "US";

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-4xl font-extrabold mb-8 tracking-tight text-foreground/90">Account Settings</h1>

            <Card className="mb-8 backdrop-blur-2xl bg-card/40 border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] dark:bg-black/40">
                {/* Decorative gradients */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

                <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-8 border-b border-border/50 relative z-10 pt-10 px-8">
                    <div className="relative group">
                        <Avatar className="size-32 border-4 border-background/50 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                            <AvatarImage src={user.profileImageUrl || ""} alt={user.fullName} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-linear-to-br from-primary/20 to-primary/40 text-primary font-bold shadow-inner">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        {user.provider === "google" && (
                            <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1.5 shadow-xl border">
                                <svg className="size-6" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-3 text-center sm:text-left flex-1 w-full sm:mt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <CardTitle className="text-3xl font-bold tracking-tight text-foreground">{user.fullName}</CardTitle>
                            {user.emailVerified ? (
                                <Badge className="w-fit self-center sm:self-start bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20 px-3 py-1 shadow-sm transition-colors">
                                    <span className="flex items-center gap-1.5">
                                        <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Verified Account
                                    </span>
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="w-fit self-center sm:self-start bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 border-rose-500/20 px-3 py-1 shadow-sm transition-colors">
                                    <span className="flex items-center gap-1.5">
                                        <div className="size-1.5 rounded-full bg-rose-500" />
                                        Unverified
                                    </span>
                                </Badge>
                            )}
                        </div>
                        <CardDescription className="text-base text-foreground/70 font-medium bg-foreground/5 w-fit px-3 py-1.5 rounded-md self-center sm:self-start">
                            {user.email}
                        </CardDescription>
                    </div>
                </CardHeader>
                
                <CardContent className="pt-8 pb-10 px-8 relative z-10">
                    <div className="grid gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-border/40 bg-background/30 backdrop-blur-sm hover:bg-background/50 hover:border-border/80 transition-all duration-300 shadow-sm group">
                            <div className="space-y-1.5 mb-5 sm:mb-0">
                                <Label className="text-lg font-semibold tracking-tight text-foreground">Authentication Provider</Label>
                                <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors">
                                    The method you currently use to sign in to your account.
                                </p>
                            </div>
                            <Badge variant="outline" className="px-5 py-1.5 text-sm font-medium capitalize bg-background shadow-sm border-border/60 text-foreground/80">
                                {user.provider || "Local"}
                            </Badge>
                        </div>

                        {user.provider === "local" && user.role === "user" && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-border/40 bg-background/30 backdrop-blur-sm hover:bg-background/50 hover:border-border/80 transition-all duration-300 shadow-sm group">
                                <div className="space-y-1.5 mb-5 sm:mb-0 pr-6 max-w-xl">
                                    <Label className="text-lg font-semibold tracking-tight text-foreground">Two-Factor Authentication (2FA)</Label>
                                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
                                        Add an extra layer of security to your account. When enabled, you'll be required to provide a unique code in addition to your password during sign in.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0 bg-background/80 backdrop-blur-md px-5 py-3 rounded-full border border-border/50 shadow-inner">
                                    {isPending ? (
                                        <Spinner className="size-4 text-primary" />
                                    ) : (
                                        <div className={`size-2 rounded-full ${user.is2FAEnabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-muted-foreground'}`} />
                                    )}
                                    <span className="text-sm font-semibold w-8">
                                        {user.is2FAEnabled ? "ON" : "OFF"}
                                    </span>
                                    <Switch
                                        checked={user.is2FAEnabled}
                                        onCheckedChange={handleToggle2FA}
                                        disabled={isPending}
                                        className="data-[state=checked]:bg-emerald-500 scale-110 shadow-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;
