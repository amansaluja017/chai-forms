"use client"

import { useGetProfile, useToggle2FA, useLogout } from "~/hooks/api/auth/auth.hook";
import { trpc } from "~/trpc/client";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "~/app/slice/userSlice";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Switch } from "~/components/ui/switch";
import { Spinner } from "~/components/ui/spinner";
import { Label } from "~/components/ui/label";

function Profile() {
    const { data, isLoading, error, isError } = useGetProfile();
    const { toggle2FAAsync, isPending, error: toggle2FAError, isError: toggle2FAIsError } = useToggle2FA();
    const { logoutAsync, isPending: isLoggingOut } = useLogout();
    const utils = trpc.useUtils();
    const dispatch = useDispatch();
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
                <Spinner className="size-8 text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-red-500 font-medium">
                Error: {error?.message || "Something went wrong"}
            </div>
        );
    }

    const handleToggle2FA = async () => {
        try {
            await toggle2FAAsync({});
            toast.success(data?.is2FAEnabled ? "2FA disabled successfully" : "2FA enabled successfully");
            utils.auth.profile.invalidate();
        } catch (e) {
            console.log("toggle2FAError", toggle2FAError);
            toast.error("Failed to update 2FA settings");
        }
    };

    const handleLogout = async () => {
        try {
            await logoutAsync({});
            dispatch(logout());
            router.push("/login");
            toast.success("Logged out successfully");
        } catch (e) {
            toast.error("Failed to log out");
        }
    };

    const initials = data?.fullName?.substring(0, 2).toUpperCase() || "US";

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 tracking-tight">Account Settings</h1>

            <Card className="mb-6 backdrop-blur-xl bg-card/50 border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-border/50">
                    <Avatar className="size-24 border-4 border-background shadow-xl">
                        <AvatarImage src={data?.profileImageUrl || ""} alt={data?.fullName} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                        <CardTitle className="text-3xl font-bold tracking-tight">{data?.fullName}</CardTitle>
                        <CardDescription className="text-base flex flex-wrap items-center gap-3">
                            <span className="text-foreground/80 font-medium">{data?.email}</span>
                            {data?.emailVerified ? (
                                <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-transparent">
                                    Verified
                                </Badge>
                            ) : (
                                <Badge variant="destructive" className="bg-rose-500/15 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 border-transparent">
                                    Unverified
                                </Badge>
                            )}
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    <div className="grid gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-border/50 bg-background/40 hover:bg-background/60 transition-colors">
                            <div className="space-y-1 mb-4 sm:mb-0">
                                <Label className="text-base font-semibold">Authentication Provider</Label>
                                <p className="text-sm text-muted-foreground">
                                    The provider used to sign in to your account.
                                </p>
                            </div>
                            <Badge variant="outline" className="px-4 py-1 text-sm capitalize bg-background shadow-sm">
                                {data?.provider || "Local"}
                            </Badge>
                        </div>

                        {data?.provider === "local" && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border border-border/50 bg-background/40 hover:bg-background/60 transition-colors">
                                <div className="space-y-1 mb-4 sm:mb-0 pr-4">
                                    <Label className="text-base font-semibold">Two-Factor Authentication (2FA)</Label>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Add an extra layer of security to your account. When enabled, you'll be required to provide a code in addition to your password.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 bg-background px-4 py-2 rounded-full border shadow-sm">
                                    {isPending && <Spinner className="size-4 text-primary" />}
                                    <span className="text-sm font-medium">
                                        {data?.is2FAEnabled ? "On" : "Off"}
                                    </span>
                                    <Switch
                                        checked={data?.is2FAEnabled}
                                        onCheckedChange={handleToggle2FA}
                                        disabled={isPending}
                                        className="data-[state=checked]:bg-emerald-500"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-destructive/20 shadow-lg bg-destructive/5 backdrop-blur-xl">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-destructive flex items-center gap-2">
                        <LogOut className="size-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Log out of your account. You will need to sign in again to access your profile.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full sm:w-auto font-medium"
                    >
                        {isLoggingOut ? (
                            <><Spinner className="size-4 mr-2" /> Logging out...</>
                        ) : (
                            "Log Out"
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;
