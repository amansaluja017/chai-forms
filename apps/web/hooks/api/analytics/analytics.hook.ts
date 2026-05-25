import { trpc } from "~/trpc/client";

export const useGetGlobalAnalytics = () => {
    const { data, isLoading, isError, error } = trpc.analytics.getGlobalAnalytics.useQuery();
    return { data, isLoading, isError, error };
};

export const useGetFormAnalytics = (id: string) => {
    const { data, isLoading, isError, error } = trpc.analytics.getFormAnalytics.useQuery({ id });
    return { data, isLoading, isError, error };
};

export const useGetFormChartData = (id: string) => {
    const { data, isLoading, isError, error } = trpc.analytics.getFormChartData.useQuery({ id });
    return { data, isLoading, isError, error };
};

export const useTrackFormView = () => {
    const { mutate: trackView, mutateAsync: trackViewAsync } = trpc.analytics.trackFormView.useMutation();
    return { trackView, trackViewAsync };
};
