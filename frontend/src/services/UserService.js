import { createApi } from '../services/apiClient';
// getUser, updateUser, deleteUser


const authApi = createApi(import.meta.env.VITE_AUTH_API_URL);

export async function getUser(dados) {
  const { data } = await authApi.post('/user', dados);
  return data;
}