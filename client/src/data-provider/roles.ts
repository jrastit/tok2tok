import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query-v4';
import type {
  UseMutationResult,
  QueryObserverResult,
  UseQueryOptions,
} from '@tanstack/react-query-v4';
import { QueryKeys, dataService, promptPermissionsSchema } from 'librechat-data-provider';
import type * as t from 'librechat-data-provider';

export const useGetRole = (
  roleName: string,
  config?: UseQueryOptions<t.TRole>,
): QueryObserverResult<t.TRole> => {
  return useQuery<t.TRole>([QueryKeys.roles, roleName], () => dataService.getRole(roleName), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: false,
    ...config,
  });
};

export const useUpdatePromptPermissionsMutation = (
  options?: t.UpdatePromptPermOptions,
): UseMutationResult<t.UpdatePromptPermResponse, t.TError, t.UpdatePromptPermVars, unknown> => {
  const queryClient = useQueryClient();
  const { onMutate, onSuccess, onError } = options ?? {};
  return useMutation(
    (variables) => {
      promptPermissionsSchema.partial().parse(variables.updates);
      return dataService.updatePromptPermissions(variables);
    },
    {
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries([QueryKeys.roles, variables.roleName]);
        if (onSuccess) {
          onSuccess(data, variables, context);
        }
      },
      onError: (...args) => {
        args[0] && console.error('Failed to update prompt permissions:', args[0]);
        if (onError) {
          onError(...args);
        }
      },
      onMutate,
    },
  );
};
