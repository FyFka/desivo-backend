export interface ISubscribeDTO {
  projectId: string;
}

export interface IUnsubscribeDTO {
  projectId: string;
}

export interface IMessageDTO {
  message: string;
  projectId: string;
}

export interface IPaginationDTO {
  projectId: string;
  skip: number;
}
