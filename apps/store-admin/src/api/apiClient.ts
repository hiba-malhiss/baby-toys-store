const getAuthToken = () => localStorage.getItem('admin-token');

export const apiClient = {
  get: (func: Function, payload: any) => {
    const token = getAuthToken();
    return func(payload, token);
  },
  post: (func: Function, payload: any) => {
    const token = getAuthToken();
    return func(payload, token);
  },
  put: (func: Function, payload: any) => {
    const token = getAuthToken();
    return func(payload, token);
  },
  delete: (func: Function, payload: any) => {
    const token = getAuthToken();
    return func(payload, token);
  },
};
