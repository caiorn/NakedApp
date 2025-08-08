export interface UserLogged {
  id: number;
  name: string;
  status: string;
  login: string;
  email: string;
  payload?: any; 
}