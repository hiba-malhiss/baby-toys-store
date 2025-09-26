import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axiosConfig';
import { HomePageContentDto, UpdateHomePageContentRequest } from './types/homePage';

const HOME_PAGE_QUERY_KEY = 'homePageContent';

export const useHomePageContent = () => {
  return useQuery<HomePageContentDto>({
    queryKey: [HOME_PAGE_QUERY_KEY],
    queryFn: async () => {
      const { data } = await api.get('/api/homepage');
      return data?.data;
    },
  });
};

export const useUpdateHomePageContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateHomePageContentRequest) => {
      const { data: response } = await api.put('/api/admin/homepage', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HOME_PAGE_QUERY_KEY] });
    },
  });
};

export const useUploadGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await api.post<{ data: { url: string } }>(
        '/api/admin/homepage/gallery-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return data.data.url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HOME_PAGE_QUERY_KEY] });
    },
  });
};

export const useDeleteGalleryImage = () => {
  return useMutation({
    mutationFn: async (imageUrl: string) => {
      await api.delete('/api/admin/homepage/gallery-image', {
        params: { fileUrl: imageUrl },
      });
    },
  });
};
