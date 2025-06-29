import { createApi } from '../services/apiClient';
// login, logout, refreshToken

const authApi = createApi(import.meta.env.VITE_API_URL);

export async function login(dados) {
  const { data } = await authApi.post('auth/login', dados);
  return data;
}