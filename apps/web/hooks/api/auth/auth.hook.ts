import { trpc } from "~/trpc/client";


export const useGoogleLogin = () => {
    const {mutate: loginWithGoogleOAuth, mutateAsync: loginWithGoogleOAuthAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.loginWithGoogleOauth.useMutation();

    return {
        loginWithGoogleOAuth,
        loginWithGoogleOAuthAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useLogin = () => {
    const {mutate: loginWithEmailAndPassword, mutateAsync: loginWithEmailAndPasswordAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.loginWithEmailAndPassword.useMutation();

    return {
        loginWithEmailAndPassword,
        loginWithEmailAndPasswordAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useRegister = () => {
    const {mutate: registerWithEmailAndPassword, mutateAsync: registerWithEmailAndPasswordAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.registerWithEmailAndPassword.useMutation();

    return {
        registerWithEmailAndPassword,
        registerWithEmailAndPasswordAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useVerifyEmail = () => {
    const {mutate: verifyEmail, mutateAsync: verifyEmailAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.verifyEmail.useMutation();

    return {
        verifyEmail,
        verifyEmailAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useResendVerificationEmail = () => {
    const {mutate: resendVerificationEmail, mutateAsync: resendVerificationEmailAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.resendVerificationEmail.useMutation();

    return {
        resendVerificationEmail,
        resendVerificationEmailAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useForgotPassword = () => {
    const {mutate: forgotPassword, mutateAsync: forgotPasswordAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.passwordResetLink.useMutation();

    return {
        forgotPassword,
        forgotPasswordAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useResetPassword = () => {
    const {mutate: resetPassword, mutateAsync: resetPasswordAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.resetPassword.useMutation();

    return {
        resetPassword,
        resetPasswordAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useRefreshAccessToken = () => {
    const {mutate: refreshAccessToken, mutateAsync: refreshAccessTokenAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.refreshToken.useMutation();

    return {
        refreshAccessToken,
        refreshAccessTokenAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useGetProfile = () => {
    const {data, isLoading, error, isError} = trpc.auth.profile.useQuery();

    return {
        data,
        isLoading,
        error,
        isError
    }
};

export const useToggle2FA = () => {
    const {mutate: toggle2FA, mutateAsync: toggle2FAAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.toggle2FA.useMutation();

    return {
        toggle2FA,
        toggle2FAAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};


export const useVerify2FACode = () => {
    const {mutate: verify2FACode, mutateAsync: verify2FACodeAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.verify2FACode.useMutation();

    return {
        verify2FACode,
        verify2FACodeAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useLogout = () => {
    const {mutate: logout, mutateAsync: logoutAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.logout.useMutation();

    return {
        logout,
        logoutAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};

export const useResend2FACode = () => {
    const {mutate: resend2FACode, mutateAsync: resend2FACodeAsync, isSuccess, status, error, failureCount, isError, isPending} = trpc.auth.resend2FACode.useMutation();

    return {
        resend2FACode,
        resend2FACodeAsync,
        isSuccess,
        status,
        error,
        failureCount,
        isError,
        isPending
    }
};
