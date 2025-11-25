export type Usuario=  {
  id?: number;
  name: string;
  emailPrincipal: string;
  emailList?: string[];
  password: string;
  role?: 'user' | 'admin' | 'visit';
  secretWord: string;
}
