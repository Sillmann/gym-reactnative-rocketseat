import axios, { AxiosInstance } from 'axios';

import { AppError } from '@utils/AppError';

import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '@storage/storageAuthToken';

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AppError) => void;
};

// Endereço IP da máquina que está rodando o backend
const localhost = '192.168.0.110';

// Configurações do axios para a API
const api = axios.create({
  baseURL: `http://${localhost}:3333`,
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = signOut => {
  const interceptTokenManager = api.interceptors.response.use(
    response => response,
    async RequestError => {
      if (RequestError?.response?.status === 401) {
        if (
          RequestError.response.data?.message === 'token.expired' ||
          RequestError.response.data?.message === 'token.invalid'
        ) {
          const { refresh_token } = await storageAuthTokenGet();

          if (!refresh_token) {
            signOut();
            return Promise.reject(RequestError);
          }

          const originalRequestConfig = RequestError.config;

          if (isRefreshing) {
            // Se a requisição já estiver sendo feita, então aguarda a resposta
            return new Promise((resolve, reject) => {
              failedQueue.push({
                // Se a requisição for bem sucedida, então retorna o token
                onSuccess: (token: string) => {
                  originalRequestConfig.headers.Authorization = `Bearer ${token}`;

                  resolve(api(originalRequestConfig));
                },
                // Se a requisição falhar, então retorna o erro
                onFailure: (error: AppError) => {
                  reject(error);
                },
              });
            });
          }

          isRefreshing = true;

          return new Promise(async (resolve, reject) => {
            try {
              const { data } = await api.post('/sessions/refresh-token', {
                refresh_token,
              });

              await storageAuthTokenSave({
                token: data.token,
                refresh_token: data.refresh_token,
              });

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data
                );
              }

              originalRequestConfig.headers.Authorization = `Bearer ${data.token}`;
              api.defaults.headers.Authorization = `Bearer ${data.token}`;

              failedQueue.forEach(request => request.onSuccess(data.token));

              resolve(api(originalRequestConfig));
            } catch (error: any) {
              failedQueue.forEach(request => request.onFailure(error));

              signOut();
              return Promise.reject(RequestError);
            } finally {
              isRefreshing = false;
              failedQueue = [];
            }
          });
        }

        signOut();
      }

      // Verificar se é um erro tratado ou não
      if (RequestError.response && RequestError.response.data) {
        return Promise.reject(new AppError(RequestError.response.data.message));
      } else {
        return Promise.reject(RequestError);
      }
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

// Interceptada todas as requisições que são feitas para o backend

/*
  O que é um token?
  R: Um token é um código que representa um usuário, que é gerado pelo backend
  Tokens são pedaços de dados que carregam apenas informações necessárias para identificar a identidade ou autorização de um 
  usuário para obter acesso a recursos e informações. Ou seja, são artefatos que permitem que os sistemas ou aplicativos executem o processo de autenticação e autorização.
*/

export { api };
