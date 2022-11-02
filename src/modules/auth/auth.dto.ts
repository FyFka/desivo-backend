export interface IAuthDTO {
  username: string;
  password: string;
}

export interface IValidateDTO {
  token: string;
}

export interface ISignupDTO extends IAuthDTO {
  name: string;
  secondName: string;
}
