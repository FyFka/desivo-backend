export interface IAuthBody {
  username: string;
  password: string;
}

export interface ISignupBody extends IAuthBody {
  name: string;
  secondName: string;
}

export interface ITokenableUser {
  id: string;
  roles: string[];
}
