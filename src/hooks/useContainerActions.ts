import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startContainerApi, stopContainerApi, removeContainerApi } from '../api/containers';

export function useContainerActions() {
  const queryClient = useQueryClient();

  const startContainer = useMutation(
    (containerId: string) => startContainerApi(containerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['containers']);
      },
    }
  );

  const stopContainer = useMutation(
    (containerId: string) => stopContainerApi(containerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['containers']);
      },
    }
  );

  const removeContainer = useMutation(
    (containerId: string) => removeContainerApi(containerId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['containers']);
      },
    }
  );

  return {
    startContainer: startContainer.mutate,
    stopContainer: stopContainer.mutate,
    removeContainer: removeContainer.mutate,
  };
}