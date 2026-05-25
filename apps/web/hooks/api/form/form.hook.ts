import { trpc } from "~/trpc/client";

export const useGetForms = () => {
    const { data, isLoading, isError, error, refetch } = trpc.form.getForms.useQuery();

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};

export const useGetFormById = (id: string) => {
    const { data, isLoading, isError, error, refetch } = trpc.form.getFormById.useQuery({ id }, {
        enabled: !!id,
    });

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};

export const useCreateForm = () => {
    const { mutate: createForm, mutateAsync: createFormAsync, isPending, isError, error } = trpc.form.createForm.useMutation();

    return {
        createForm,
        createFormAsync,
        isPending,
        isError,
        error
    };
};

export const useDeleteForm = () => {
    const { mutate: deleteForm, mutateAsync: deleteFormAsync, isPending, isError, error } = trpc.form.deleteForm.useMutation();

    return {
        deleteForm,
        deleteFormAsync,
        isPending,
        isError,
        error
    };
};

export const useGetFormWorkspace = (id: string) => {
    const { data, isLoading, isError, error, refetch } = trpc.form.getFormWorkspace.useQuery({ id }, {
        enabled: !!id,
    });

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};

export const useSaveFormFields = () => {
    const { mutate: saveFields, mutateAsync: saveFieldsAsync, isPending, isError, error } = trpc.form.saveFormFields.useMutation();

    return {
        saveFields,
        saveFieldsAsync,
        isPending,
        isError,
        error
    };
};

export const useUpdateFormStatus = () => {
    const { mutate: updateStatus, mutateAsync: updateStatusAsync, isPending, isError, error } = trpc.form.updateFormStatus.useMutation();

    return {
        updateStatus,
        updateStatusAsync,
        isPending,
        isError,
        error
    };
};
export const useCreateFormField = () => {
    const { mutateAsync: createFieldAsync, isPending } = trpc.form.createFormField.useMutation();
    return { createFieldAsync, isPending };
};

export const useUpdateFormField = () => {
    const { mutate: updateField, mutateAsync: updateFieldAsync, isPending, isError, error } = trpc.form.updateFormField.useMutation();
    return { updateField, updateFieldAsync, isPending, isError, error };
};

export const useDeleteFormField = () => {
    const { mutateAsync: deleteFieldAsync, isPending } = trpc.form.deleteFormField.useMutation();
    return { deleteFieldAsync, isPending };
};

export const useReorderFormFields = () => {
    const { mutateAsync: reorderFieldsAsync, isPending } = trpc.form.reorderFormFields.useMutation();
    return { reorderFieldsAsync, isPending };
};

export const useGetPublicFormWorkspace = (id: string) => {
    const { data, isLoading, isError, error, refetch } = trpc.form.getPublicFormWorkspace.useQuery({ id }, {
        enabled: !!id,
        retry: false, // Don't retry if not published/found
    });

    return {
        data,
        isLoading,
        isError,
        error,
        refetch
    };
};

export const useSubmitFormResponse = () => {
    const { mutate: submitResponse, mutateAsync: submitResponseAsync, isPending } = trpc.form.submitForm.useMutation();
    return { submitResponse, submitResponseAsync, isPending };
};

export const useGetFormResponses = (id: string) => {
    const { data, isLoading, refetch, isError, error } = trpc.form.getFormResponses.useQuery({ id });
    return { data, isLoading, refetch, isError, error };
};

export const useGetPublicForms = () => {
    const { data, isLoading, refetch, isError, error } = trpc.form.getPublicForms.useQuery();
    return { data, isLoading, refetch, isError, error };
};
