import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Color, CreateColorRequest, UpdateColorRequest } from './types/color';
import api from './axiosConfig';

const BASE_URL = '/api/colors'; // public read
const ADMIN_BASE_URL = '/api/admin/colors'; // admin write

// ---------- Queries ----------
export const useColors = () =>
  useQuery<Color[]>({
    queryKey: ['colors'],
    queryFn: () => api.get(BASE_URL).then((res) => res.data),
  });

export const useColor = (id: string | number) =>
  useQuery<Color>({
    queryKey: ['colors', id],
    queryFn: () => api.get(`${BASE_URL}/${id}`).then((res) => res.data),
    enabled: !!id,
  });

// ---------- Mutations ----------
export const useCreateColor = () => {
  const queryClient = useQueryClient();
  return useMutation<Color, Error, CreateColorRequest>({
    mutationFn: (data) => api.post(ADMIN_BASE_URL, data).then((res) => res.data), // ✅ admin URL
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
  });
};

export const useUpdateColor = () => {
  const queryClient = useQueryClient();
  return useMutation<Color, Error, { id: string | number; data: UpdateColorRequest }>({
    mutationFn: ({ id, data }) => api.put(`${ADMIN_BASE_URL}/${id}`, data).then((res) => res.data), // ✅ admin URL
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
      queryClient.invalidateQueries({ queryKey: ['colors', id] });
    },
  });
};

export const useDeleteColor = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string | number>({
    mutationFn: (id) => api.delete(`${ADMIN_BASE_URL}/${id}`), // ✅ admin URL
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] });
    },
  });
};
