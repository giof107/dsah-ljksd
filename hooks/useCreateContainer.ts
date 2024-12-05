import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContainerApi } from '../api/containers';
import { CreateContainerPayload } from '../types';

export function useCreateContainer() {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: CreateContainerPayload) => createContainerApi(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['containers']);
      },
    }
  );

  return {
    createContainer: mutation.mutate,
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
}