const getAuthToken = () => localStorage.getItem('admin-token');

// This function simulates adding an Authorization header to a request.
// In a real app, this would be part of a fetch/axios interceptor.
const createAuthorizedRequest = (callback: (token: string | null) => any) => {
  const token = getAuthToken();
  // In a real backend, the server would validate the token and return a 401 if invalid.
  // We simulate this by having the mock API functions check for the token's validity.
  return callback(token);
};

// This apiClient acts as a gateway to the mock API, automatically handling the token.
export const apiClient = {
  get: (func: Function, ...args: any[]) => {
    return createAuthorizedRequest((token) => func(token, ...args));
  },
  post: (func: Function, ...args: any[]) => {
    return createAuthorizedRequest((token) => func(token, ...args));
  },
  put: (func: Function, ...args: any[]) => {
    return createAuthorizedRequest((token) => func(token, ...args));
  },
  delete: (func: Function, ...args: any[]) => {
    return createAuthorizedRequest((token) => func(token, ...args));
  },
};
