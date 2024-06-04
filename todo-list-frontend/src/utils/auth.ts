export const baseUrl = 'http://localhost:3001';
import { ApiMethod } from './utils';

interface IRequest<T extends object = Record<string, never>> {
  url: string;
  method?: ApiMethod;
  data?: T;
  credentials?: string;
  headers?: string[];
}

const request = <T extends object = Record<string, never>>({
  url,
  method = ApiMethod.post,
  // token,
  data,
}: IRequest<T>) => {
  // console.log(data);
  return fetch (`${baseUrl}${url}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...!!data && {body: JSON.stringify(data)},
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return Promise.reject(response.status);
    });
};

// export const register = (password, email, name) => {
//   return request({
//     url: '/signup',
//     data: { password, email, name }
//   });
// };

export const authorize = (password: string, login: string) => {
  return request<{password: string, login: string}>({
    url: '/signin',
    data: { password, login }
  });
};

export const logout = () => {
  return request({
    url: '/signout',
    method: ApiMethod.delete,
  });
};

export const checkToken = () => {
  return request({
    url: '/users/me',
    method: ApiMethod.get,
  });
};
