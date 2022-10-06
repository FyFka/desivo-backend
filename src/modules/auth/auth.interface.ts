export interface IAuthBody {
  username: string;
  password: string;
}

export interface IRegisterBody extends IAuthBody {
  name: string;
  secondName: string;
}
