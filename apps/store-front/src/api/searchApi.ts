import api from './axiosConfig';

export type SuggestItem = {
  id: number;
  name: string;
};

export async function suggest(
  q: string,
  limit = 10
): Promise<{ query: string; items: SuggestItem[] }> {
  const { data } = await api.get('/api/search/suggest', { params: { q, limit } });
  return data;
}
