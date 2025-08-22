export interface IRegisterBody {
  username: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string; // or Date if you parse it
}

export interface IToken {
  id: number;
  username: string;
}
